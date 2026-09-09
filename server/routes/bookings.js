const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper sinh mã booking độc nhất dạng BK-2026-XXXX
function generateBookingCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'BK-2026-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// GET /api/bookings - Lấy danh sách booking (Hỗ trợ lọc theo trạng thái)
router.get('/', (req, res) => {
  try {
    const { status, search } = req.query;
    let query = `
      SELECT b.*, r.room_number, r.name as room_name, r.type as room_type, r.price_per_night
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'all') {
      query += ' AND b.status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (b.booking_code LIKE ? OR b.guest_name LIKE ? OR b.guest_phone LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY b.id DESC';

    const bookings = db.prepare(query).all(...params);
    res.json({ success: true, total: bookings.length, data: bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách đặt phòng' });
  }
});

// GET /api/bookings/lookup - Tra cứu đơn đặt phòng cho khách (Mã đặt phòng + Số điện thoại)
router.get('/lookup', (req, res) => {
  try {
    const { bookingCode, phone } = req.query;
    if (!bookingCode || !phone) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp Mã đặt phòng và Số điện thoại' });
    }

    const booking = db.prepare(`
      SELECT b.*, r.room_number, r.name as room_name, r.type as room_type, r.image_url, r.bed_type, r.view
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      WHERE UPPER(b.booking_code) = UPPER(?) AND b.guest_phone = ?
    `).get(bookingCode.trim(), phone.trim());

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin đặt phòng khớp với mã hoặc số điện thoại này!' });
    }

    // Lấy các dịch vụ đi kèm nếu có
    const services = db.prepare(`
      SELECT bs.*, s.name as service_name, s.category
      FROM booking_services bs
      JOIN services s ON bs.service_id = s.id
      WHERE bs.booking_id = ?
    `).all(booking.id);

    res.json({
      success: true,
      data: {
        ...booking,
        services
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tra cứu đơn đặt phòng' });
  }
});

// POST /api/bookings - Tạo đặt phòng mới với ACID TRANSACTION (Chống Double-Booking / Concurrency Safe)
router.post('/', (req, res) => {
  const {
    room_id,
    guest_name,
    guest_email,
    guest_phone,
    id_card,
    check_in_date,
    check_out_date,
    num_guests,
    payment_method,
    special_requests
  } = req.body;

  if (!room_id || !guest_name || !guest_phone || !check_in_date || !check_out_date) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin đặt phòng bắt buộc' });
  }

  // Kiểm tra ngày hợp lệ
  const checkIn = new Date(check_in_date);
  const checkOut = new Date(check_out_date);
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

  if (nights <= 0 || isNaN(nights)) {
    return res.status(400).json({ success: false, message: 'Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 đêm' });
  }

  // Thực hiện giao dịch an toàn (Atomic Transaction)
  const createBookingTx = db.transaction(() => {
    // 1. Khóa và kiểm tra thông tin phòng
    const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(room_id);
    if (!room) {
      throw new Error('ROOM_NOT_FOUND');
    }

    // 2. Kiểm tra xung đột lịch (Double Booking Check)
    const conflictBooking = db.prepare(`
      SELECT id, booking_code, check_in_date, check_out_date FROM bookings
      WHERE room_id = ?
        AND status IN ('confirmed', 'checked_in')
        AND NOT (check_out_date <= ? OR check_in_date >= ?)
      LIMIT 1
    `).get(room_id, check_in_date, check_out_date);

    if (conflictBooking) {
      throw new Error('ROOM_ALREADY_BOOKED');
    }

    // 3. Tính tiền
    const totalPrice = room.price_per_night * nights;
    const bookingCode = generateBookingCode();

    // 4. Lưu đơn đặt phòng
    const insertBooking = db.prepare(`
      INSERT INTO bookings (
        booking_code, room_id, guest_name, guest_email, guest_phone,
        id_card, check_in_date, check_out_date, num_guests,
        total_price, payment_method, payment_status, status, special_requests
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, 'confirmed', ?
      )
    `);

    const result = insertBooking.run(
      bookingCode,
      room_id,
      guest_name,
      guest_email || '',
      guest_phone,
      id_card || '',
      check_in_date,
      check_out_date,
      num_guests || 2,
      totalPrice,
      payment_method || 'hotel_pay',
      payment_method === 'vietqr' ? 'pending' : 'pending',
      special_requests || ''
    );

    return {
      bookingId: result.lastInsertRowid,
      bookingCode,
      totalPrice,
      nights,
      room
    };
  });

  try {
    const bookingResult = createBookingTx();

    // Tạo link/payload VietQR động chuyên nghiệp (Mô phỏng ngân hàng thật)
    // Cú pháp VietQR chuẩn: https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-<TEMPLATE>.png?amount=<AMOUNT>&addInfo=<INFO>
    const qrInfo = `DAT PHONG ${bookingResult.bookingCode}`;
    const qrUrl = `https://img.vietqr.io/image/MB-0988888888-compact.png?amount=${bookingResult.totalPrice}&addInfo=${encodeURIComponent(qrInfo)}&accountName=HOTEL%20LUXURY%20RESORT`;

    res.status(201).json({
      success: true,
      message: 'Đặt phòng thành công!',
      data: {
        id: bookingResult.bookingId,
        booking_code: bookingResult.bookingCode,
        room: bookingResult.room,
        check_in_date,
        check_out_date,
        nights: bookingResult.nights,
        total_price: bookingResult.totalPrice,
        payment_method,
        vietqr_url: qrUrl
      }
    });
  } catch (error) {
    if (error.message === 'ROOM_ALREADY_BOOKED') {
      return res.status(409).json({
        success: false,
        message: 'Rất tiếc! Phòng này vừa có khách đặt trong khoảng thời gian đã chọn. Vui lòng chọn ngày khác hoặc phòng khác.'
      });
    }
    if (error.message === 'ROOM_NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Phòng không tồn tại' });
    }
    console.error('Booking Transaction Error:', error);
    res.status(500).json({ success: false, message: 'Lỗi hệ thống khi xử lý đặt phòng' });
  }
});

// PATCH /api/bookings/:id/status - Check-in, Check-out, Hủy đơn
router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['confirmed', 'checked_in', 'checked_out', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
    }

    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn đặt phòng' });
    }

    // Cập nhật trạng thái booking
    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, req.params.id);

    // Tự động đồng bộ trạng thái phòng tương ứng (Nghiệp vụ khách sạn thực tế)
    if (status === 'checked_in') {
      db.prepare('UPDATE rooms SET status = ? WHERE id = ?').run('occupied', booking.room_id);
    } else if (status === 'checked_out') {
      // Khi khách trả phòng, phòng tự động chuyển thành 'dirty' (Cần dọn dẹp)
      db.prepare('UPDATE rooms SET status = ? WHERE id = ?').run('dirty', booking.room_id);
      db.prepare('UPDATE bookings SET payment_status = ? WHERE id = ?').run('paid', req.params.id);
    } else if (status === 'cancelled') {
      // Nếu phòng đang để occupied bởi đơn này, trả lại available
      db.prepare('UPDATE rooms SET status = ? WHERE id = ? AND status = ?').run('available', booking.room_id, 'occupied');
    }

    res.json({
      success: true,
      message: `Đã cập nhật trạng thái đơn sang [${status}]`,
      data: { id: booking.id, new_status: status }
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ success: false, message: 'Lỗi cập nhật đơn' });
  }
});

// GET /api/bookings/:id/folio - Chi tiết hóa đơn thanh toán đầy đủ (Tiền phòng + Tiền dịch vụ)
router.get('/:id/folio', (req, res) => {
  try {
    const booking = db.prepare(`
      SELECT b.*, r.room_number, r.name as room_name, r.price_per_night
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      WHERE b.id = ?
    `).get(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn đặt phòng' });
    }

    const services = db.prepare(`
      SELECT bs.*, s.name as service_name, s.category
      FROM booking_services bs
      JOIN services s ON bs.service_id = s.id
      WHERE bs.booking_id = ?
    `).all(req.params.id);

    const serviceTotal = services.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const grandTotal = booking.total_price + serviceTotal;

    res.json({
      success: true,
      data: {
        booking,
        services,
        room_charge: booking.total_price,
        services_charge: serviceTotal,
        grand_total: grandTotal
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tạo hóa đơn' });
  }
});

// POST /api/bookings/:id/services - Thêm dịch vụ minibar / phụ thu vào đơn
router.post('/:id/services', (req, res) => {
  try {
    const { service_id, quantity } = req.body;
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(service_id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Dịch vụ không tồn tại' });
    }

    const qty = Number(quantity) || 1;
    const insert = db.prepare(`
      INSERT INTO booking_services (booking_id, service_id, quantity, unit_price)
      VALUES (?, ?, ?, ?)
    `);

    insert.run(req.params.id, service_id, qty, service.price);

    res.status(201).json({
      success: true,
      message: `Đã thêm dịch vụ "${service.name}" x${qty} vào đơn thành công!`
    });
  } catch (error) {
    console.error('Error adding service:', error);
    res.status(500).json({ success: false, message: 'Lỗi thêm dịch vụ' });
  }
});

module.exports = router;
