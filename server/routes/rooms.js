const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/rooms - Danh sách phòng kèm bộ lọc thông minh (Ngày, Giá, Loại phòng, Sức chứa)
router.get('/', (req, res) => {
  try {
    const { checkIn, checkOut, type, minPrice, maxPrice, capacity, status } = req.query;

    let query = 'SELECT * FROM rooms WHERE 1=1';
    const params = [];

    if (type && type !== 'all') {
      query += ' AND type = ?';
      params.push(type);
    }

    if (minPrice) {
      query += ' AND price_per_night >= ?';
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      query += ' AND price_per_night <= ?';
      params.push(Number(maxPrice));
    }

    if (capacity) {
      query += ' AND capacity >= ?';
      params.push(Number(capacity));
    }

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    // Nếu người dùng chọn ngày Check-in & Check-out, chỉ lấy những phòng KHÔNG bị trùng lịch
    if (checkIn && checkOut) {
      query += `
        AND id NOT IN (
          SELECT room_id FROM bookings
          WHERE status IN ('confirmed', 'checked_in')
          AND NOT (check_out_date <= ? OR check_in_date >= ?)
        )
      `;
      params.push(checkIn, checkOut);
    }

    query += ' ORDER BY floor ASC, room_number ASC';

    const rooms = db.prepare(query).all(...params);

    // Parse JSON amenities
    const formattedRooms = rooms.map(room => ({
      ...room,
      amenities: JSON.parse(room.amenities || '[]')
    }));

    res.json({
      success: true,
      total: formattedRooms.length,
      data: formattedRooms
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy danh sách phòng' });
  }
});

// GET /api/rooms/:id - Chi tiết 1 phòng
router.get('/:id', (req, res) => {
  try {
    const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phòng' });
    }

    room.amenities = JSON.parse(room.amenities || '[]');
    res.json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

// PATCH /api/rooms/:id/status - Cập nhật trạng thái buồng phòng (Lễ tân / Housekeeping)
router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['available', 'occupied', 'dirty', 'maintenance'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
    }

    const result = db.prepare('UPDATE rooms SET status = ? WHERE id = ?').run(status, req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phòng' });
    }

    const updatedRoom = db.prepare('SELECT * FROM rooms WHERE id = ?').get(req.params.id);
    updatedRoom.amenities = JSON.parse(updatedRoom.amenities || '[]');

    res.json({
      success: true,
      message: `Đã cập nhật trạng thái phòng ${updatedRoom.room_number} sang [${status}]`,
      data: updatedRoom
    });
  } catch (error) {
    console.error('Error updating room status:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật trạng thái phòng' });
  }
});

// POST /api/rooms - Thêm phòng mới (Admin)
router.post('/', (req, res) => {
  try {
    const {
      room_number, name, type, floor, price_per_night,
      capacity, size_sqm, bed_type, view, amenities, image_url, description
    } = req.body;

    if (!room_number || !name || !price_per_night) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
    }

    const insert = db.prepare(`
      INSERT INTO rooms (room_number, name, type, floor, price_per_night, capacity, size_sqm, bed_type, view, amenities, image_url, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      room_number, name, type || 'standard', floor || 1, price_per_night,
      capacity || 2, size_sqm || 30, bed_type || '1 Giường King',
      view || 'Hướng phố', JSON.stringify(amenities || []),
      image_url || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      description || 'Phòng nghỉ tiện nghi hiện đại.'
    );

    const newRoom = db.prepare('SELECT * FROM rooms WHERE id = ?').get(result.lastInsertRowid);
    newRoom.amenities = JSON.parse(newRoom.amenities || '[]');

    res.status(201).json({ success: true, message: 'Thêm phòng thành công', data: newRoom });
  } catch (error) {
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ success: false, message: 'Số phòng này đã tồn tại!' });
    }
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi thêm phòng' });
  }
});

module.exports = router;
