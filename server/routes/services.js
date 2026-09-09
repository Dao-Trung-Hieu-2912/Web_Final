const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/services - Danh sách các dịch vụ & minibar của khách sạn
router.get('/', (req, res) => {
  try {
    const services = db.prepare('SELECT * FROM services ORDER BY category ASC, price ASC').all();
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách dịch vụ' });
  }
});

module.exports = router;
