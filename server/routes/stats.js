const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/stats/dashboard - Thống kê KPI thời gian thực cho Bảng điều khiển Quản trị Khách sạn
router.get('/dashboard', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Thống kê phòng
    const totalRooms = db.prepare('SELECT COUNT(*) as count FROM rooms').get().count;
    const availableRooms = db.prepare("SELECT COUNT(*) as count FROM rooms WHERE status = 'available'").get().count;
    const occupiedRooms = db.prepare("SELECT COUNT(*) as count FROM rooms WHERE status = 'occupied'").get().count;
    const dirtyRooms = db.prepare("SELECT COUNT(*) as count FROM rooms WHERE status = 'dirty'").get().count;
    const maintenanceRooms = db.prepare("SELECT COUNT(*) as count FROM rooms WHERE status = 'maintenance'").get().count;

    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    // Lượt check-in & check-out hôm nay
    const todayCheckIns = db.prepare(`
      SELECT COUNT(*) as count FROM bookings
      WHERE check_in_date = ? AND status IN ('confirmed', 'checked_in')
    `).get(today).count;

    const todayCheckOuts = db.prepare(`
      SELECT COUNT(*) as count FROM bookings
      WHERE check_out_date = ? AND status IN ('checked_in', 'checked_out')
    `).get(today).count;

    // Doanh thu ước tính từ các booking đã xác nhận hoặc đã check-out
    const roomRevenue = db.prepare(`
      SELECT COALESCE(SUM(total_price), 0) as total FROM bookings
      WHERE status IN ('checked_in', 'checked_out') OR payment_status = 'paid'
    `).get().total;

    const serviceRevenue = db.prepare(`
      SELECT COALESCE(SUM(quantity * unit_price), 0) as total FROM booking_services
    `).get().total;

    const grandRevenue = roomRevenue + serviceRevenue;

    // Thống kê theo loại phòng
    const typeDistribution = db.prepare(`
      SELECT type, COUNT(*) as count FROM rooms GROUP BY type
    `).all();

    res.json({
      success: true,
      data: {
        totalRooms,
        availableRooms,
        occupiedRooms,
        dirtyRooms,
        maintenanceRooms,
        occupancyRate,
        todayCheckIns,
        todayCheckOuts,
        revenue: {
          room: roomRevenue,
          services: serviceRevenue,
          total: grandRevenue
        },
        typeDistribution
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Lỗi lấy dữ liệu thống kê' });
  }
});

// GET /api/stats/timeline - Dữ liệu Lịch ma trận phòng x ngày (Interactive Tape Chart)
// Trả về danh sách phòng kèm các khối booking trong vòng 14 ngày tới
router.get('/timeline', (req, res) => {
  try {
    const startDate = req.query.startDate || new Date().toISOString().split('T')[0];
    const daysCount = parseInt(req.query.days) || 14;

    const startObj = new Date(startDate);
    const endObj = new Date(startObj.getTime() + daysCount * 24 * 60 * 60 * 1000);
    const endDate = endObj.toISOString().split('T')[0];

    const rooms = db.prepare('SELECT id, room_number, name, type, floor, status, price_per_night FROM rooms ORDER BY floor ASC, room_number ASC').all();

    const bookings = db.prepare(`
      SELECT id, booking_code, room_id, guest_name, guest_phone, check_in_date, check_out_date, status, total_price
      FROM bookings
      WHERE status IN ('confirmed', 'checked_in')
        AND NOT (check_out_date <= ? OR check_in_date >= ?)
      ORDER BY check_in_date ASC
    `).all(startDate, endDate);

    // Ghép bookings vào từng room
    const timelineData = rooms.map(room => {
      const roomBookings = bookings.filter(b => b.room_id === room.id);
      return {
        ...room,
        bookings: roomBookings
      };
    });

    res.json({
      success: true,
      startDate,
      endDate,
      daysCount,
      data: timelineData
    });
  } catch (error) {
    console.error('Error fetching timeline data:', error);
    res.status(500).json({ success: false, message: 'Lỗi lấy dữ liệu lịch phòng' });
  }
});

module.exports = router;
