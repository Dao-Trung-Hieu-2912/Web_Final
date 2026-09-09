const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Khởi tạo Database
require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/services', require('./routes/services'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'Hotel Booking & Room Management System API',
    timestamp: new Date().toISOString()
  });
});

// Phục vụ giao diện React Frontend (Production Build) trên cùng 1 domain/port
const clientDist = path.join(__dirname, '../client/dist');
const fs = require('fs');
app.use(express.static(clientDist));
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    const indexFile = path.join(clientDist, 'index.html');
    if (fs.existsSync(indexFile)) {
      return res.sendFile(indexFile);
    }
  }
  next();
});

// Start Server
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` Hotel Management Backend Server Running!`);
  console.log(` API Base URL: http://localhost:${PORT}/api`);
  console.log(` Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=================================================`);
});
