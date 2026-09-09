const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'hotel.db');
const db = new Database(dbPath);

// Enable Foreign Keys and WAL mode for high performance & concurrency
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    floor INTEGER NOT NULL,
    price_per_night INTEGER NOT NULL,
    capacity INTEGER NOT NULL,
    size_sqm INTEGER NOT NULL,
    bed_type TEXT NOT NULL,
    view TEXT NOT NULL,
    amenities TEXT NOT NULL, -- JSON array
    status TEXT NOT NULL DEFAULT 'available', -- 'available', 'occupied', 'dirty', 'maintenance'
    image_url TEXT NOT NULL,
    description TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_code TEXT UNIQUE NOT NULL,
    room_id INTEGER NOT NULL,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    id_card TEXT,
    check_in_date TEXT NOT NULL,
    check_out_date TEXT NOT NULL,
    num_guests INTEGER NOT NULL,
    total_price INTEGER NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'hotel_pay', -- 'hotel_pay', 'vietqr', 'credit_card'
    payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
    status TEXT NOT NULL DEFAULT 'confirmed', -- 'confirmed', 'checked_in', 'checked_out', 'cancelled'
    special_requests TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE RESTRICT
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'minibar', 'laundry', 'fnb', 'transport'
    price INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS booking_services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT
  );
`);

// Check if rooms table is empty, then seed data
const roomCount = db.prepare('SELECT COUNT(*) as count FROM rooms').get().count;

if (roomCount === 0) {
  console.log('Seeding initial luxury rooms data...');
  const insertRoom = db.prepare(`
    INSERT INTO rooms (room_number, name, type, floor, price_per_night, capacity, size_sqm, bed_type, view, amenities, status, image_url, description)
    VALUES (@room_number, @name, @type, @floor, @price_per_night, @capacity, @size_sqm, @bed_type, @view, @amenities, @status, @image_url, @description)
  `);

  const initialRooms = [
    {
      room_number: '101',
      name: 'Deluxe Ocean View Suite',
      type: 'deluxe',
      floor: 1,
      price_per_night: 1450000,
      capacity: 2,
      size_sqm: 42,
      bed_type: '1 Giường King Cỡ Lớn',
      view: 'Trực diện biển (Ocean View)',
      amenities: JSON.stringify(['Ban công riêng ngắm hoàng hôn', 'Bồn tắm sục Jacuzzi', 'Smart TV 65" 4K', 'Máy pha cà phê Nespresso', 'Bữa sáng Buffet cao cấp', 'Wifi 6 tốc độ cao', 'Minibar miễn phí']),
      status: 'available',
      image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      description: 'Phòng Deluxe rộng rãi với tầm nhìn vô cực ra bờ biển. Thiết kế nội thất phong cách Địa Trung Hải hòa quyện nét hiện đại sang trọng.'
    },
    {
      room_number: '102',
      name: 'Premier Twin Garden Terrace',
      type: 'superior',
      floor: 1,
      price_per_night: 1150000,
      capacity: 2,
      size_sqm: 38,
      bed_type: '2 Giường Đơn Cao Cấp',
      view: 'Khu vườn nhiệt đới & Hồ bơi',
      amenities: JSON.stringify(['Hiên vườn riêng tư', 'Bồn tắm đứng vách kính', 'Smart TV 55"', 'Bữa sáng Buffet cao cấp', 'Wifi 6 tốc độ cao', 'Trà & Cà phê miễn phí']),
      status: 'occupied',
      image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      description: 'Không gian yên bình mở thẳng ra khuôn viên vườn sinh thái, phù hợp cho kỳ nghỉ thư thái của cặp đôi hoặc bạn bè.'
    },
    {
      room_number: '201',
      name: 'Executive Panorama Suite',
      type: 'suite',
      floor: 2,
      price_per_night: 2250000,
      capacity: 3,
      size_sqm: 65,
      bed_type: '1 Giường Super King + Sofa Bed',
      view: 'Toàn cảnh Vịnh biển & Thành phố',
      amenities: JSON.stringify(['Phòng khách riêng biệt', 'Bồn tắm nhìn ra biển', 'Đặc quyền Executive Lounge', 'Cocktail chiều miễn phí', 'Smart TV 65"', 'Hệ thống âm thanh Marshall']),
      status: 'available',
      image_url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      description: 'Hạng phòng cao cấp với cửa kính panorama chạm trần, phân khu phòng khách và phòng ngủ riêng biệt đẳng cấp 5 sao quốc tế.'
    },
    {
      room_number: '202',
      name: 'Signature Ocean Front Deluxe',
      type: 'deluxe',
      floor: 2,
      price_per_night: 1650000,
      capacity: 2,
      size_sqm: 45,
      bed_type: '1 Giường King Cỡ Lớn',
      view: 'Trực diện biển xanh',
      amenities: JSON.stringify(['Ban công kính hướng biển', 'Bồn tắm nằm thảo dược', 'Smart TV 65"', 'Rượu vang chào mừng', 'Bữa sáng tại phòng']),
      status: 'dirty',
      image_url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      description: 'Căn phòng lãng mạn bậc nhất dành cho tuần trăng mật với ban công kính rộng đón trọn từng làn gió biển tươi mát.'
    },
    {
      room_number: '301',
      name: 'Family Royal Residence',
      type: 'suite',
      floor: 3,
      price_per_night: 2850000,
      capacity: 4,
      size_sqm: 85,
      bed_type: '2 Giường King (2 Phòng Ngủ)',
      view: 'Biển & Hồ bơi vô cực',
      amenities: JSON.stringify(['2 Phòng ngủ riêng biệt', 'Khu vực bếp mini & Bàn ăn', '2 Phòng tắm rộng', 'Máy giặt & Máy sấy tiện dụng', 'Khu vui chơi trẻ em']),
      status: 'available',
      image_url: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
      description: 'Không gian gia đình chuẩn mực với 2 phòng ngủ sang trọng, đầy đủ tiện nghi sinh hoạt cao cấp như tại tư gia.'
    },
    {
      room_number: '302',
      name: 'Classic Cosy Studio',
      type: 'standard',
      floor: 3,
      price_per_night: 890000,
      capacity: 2,
      size_sqm: 28,
      bed_type: '1 Giường Queen',
      view: 'Hướng Phố Nhộn Nhịp',
      amenities: JSON.stringify(['Bàn làm việc thông minh', 'Wifi tốc độ cao', 'Smart TV 50"', 'Điều hòa lọc không khí', 'Bữa sáng gọi món']),
      status: 'maintenance',
      image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
      description: 'Lựa chọn lý tưởng cho các chuyến công tác hoặc khách du lịch năng động tìm kiếm sự ấm cúng, tinh gọn và tiện nghi.'
    },
    {
      room_number: 'PH1',
      name: 'The Grand Imperial Penthouse',
      type: 'penthouse',
      floor: 4,
      price_per_night: 6500000,
      capacity: 6,
      size_sqm: 180,
      bed_type: '3 Giường Master King',
      view: 'Tầm nhìn 360 độ Biển & Chân trời',
      amenities: JSON.stringify(['Hồ bơi vô cực riêng trên mái', 'Quầy bar & Bếp cao cấp', 'Phục vụ quản gia riêng 24/7', 'Đưa đón xe sang Limousine', 'Hầm rượu vang chọn lọc']),
      status: 'available',
      image_url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
      description: 'Đỉnh cao của sự xa hoa và riêng tư tuyệt đối tại tầng cao nhất của khách sạn, sở hữu hồ bơi vô cực riêng ngắm toàn cảnh đại dương.'
    }
  ];

  for (const r of initialRooms) {
    insertRoom.run(r);
  }

  console.log('Seeded rooms successfully.');
}

// Check if services table is empty, seed services
const serviceCount = db.prepare('SELECT COUNT(*) as count FROM services').get().count;
if (serviceCount === 0) {
  const insertService = db.prepare(`INSERT INTO services (name, category, price) VALUES (@name, @category, @price)`);
  const initialServices = [
    { name: 'Nước khoáng cao cấp Fiji (500ml)', category: 'minibar', price: 65000 },
    { name: 'Bia Heineken lon', category: 'minibar', price: 55000 },
    { name: 'Rượu vang đỏ Cabernet Sauvignon 375ml', category: 'minibar', price: 380000 },
    { name: 'Hạt điều rang muối thượng hạng', category: 'minibar', price: 75000 },
    { name: 'Giặt ủi cấp tốc trong 4 giờ', category: 'laundry', price: 120000 },
    { name: 'Gói Spa trị liệu 60 phút', category: 'fnb', price: 550000 },
    { name: 'Đưa đón sân bay 1 chiều xe sang', category: 'transport', price: 450000 }
  ];
  for (const s of initialServices) {
    insertService.run(s);
  }
}

// Seed a demo booking if bookings is empty
const bookingCount = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count;
if (bookingCount === 0) {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const nextThreeDays = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

  // Booking for room 102 (Occupied)
  db.prepare(`
    INSERT INTO bookings (booking_code, room_id, guest_name, guest_email, guest_phone, check_in_date, check_out_date, num_guests, total_price, payment_method, payment_status, status)
    VALUES (?, 2, 'Nguyễn Hoàng Long', 'long.nh@gmail.com', '0912345678', ?, ?, 2, 2300000, 'vietqr', 'paid', 'checked_in')
  `).run('BK-2026-8801', today, tomorrow);

  // Booking for room 201 (Confirmed future)
  db.prepare(`
    INSERT INTO bookings (booking_code, room_id, guest_name, guest_email, guest_phone, check_in_date, check_out_date, num_guests, total_price, payment_method, payment_status, status)
    VALUES (?, 3, 'Trần Minh Anh', 'minhanh.tran@usth.edu.vn', '0987654321', ?, ?, 2, 4500000, 'hotel_pay', 'pending', 'confirmed')
  `).run('BK-2026-9922', tomorrow, nextThreeDays);
}

module.exports = db;
