# 🏨 Lumière Grand Resort & Spa — Hotel Booking & Room Management System (PMS)

> **Đồ án cuối kỳ môn học:** ICT3.005 Web Application Development  
> **Trường:** Đại học Khoa học và Công nghệ Hà Nội (USTH)  

Hệ thống Đặt phòng Khách sạn 5 sao cao cấp & Quản trị Lễ tân (PMS - Property Management System) xây dựng theo kiến trúc Fullstack hiện đại, tinh gọn và hiệu năng cao.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide Icons, Google Fonts (*Playfair Display & Plus Jakarta Sans*).
- **Backend:** Node.js, Express.js, Morgan logger, CORS.
- **Database:** SQLite (*Better-SQLite3* - siêu nhẹ, không cần cài đặt SQL Server phức tạp).
- **Tooling:** Concurrently, Autocannon (*Stress test*).

---

## 📋 Yêu Cầu Hệ Thống

- Đã cài đặt **Node.js** (Khuyên dùng phiên bản >= 18.x hoặc 20.x).
- Đã cài đặt **npm** (đi kèm khi cài Node.js) hoặc `yarn` / `pnpm`.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### 1. Cài đặt thư viện phụ thuộc (Dependencies)
Mở terminal tại thư mục gốc của dự án và chạy:
```bash
npm install
```
*(Hệ thống sẽ tự động cài đặt cả thư viện ở thư mục gốc và thư mục `client` qua script `postinstall`).*

---

### 2. Lệnh Chạy Dự Án

#### 🌟 Cách 1: Chạy đồng thời cả Server & Client (Khuyên dùng)
Chỉ cần 1 lệnh duy nhất để khởi động toàn bộ hệ thống:
```bash
npm run dev
```
- **Frontend (Giao diện người dùng & Lễ tân):** Truy cập tại [http://localhost:3000](http://localhost:3000)
- **Backend (API Service):** Chạy tại [http://localhost:5000](http://localhost:5000)

---

#### ⚙️ Cách 2: Chạy riêng từng phần (Mở 2 cửa sổ Terminal)
Nếu muốn theo dõi log chi tiết của từng phần:

- **Terminal 1 (Backend Server):**
  ```bash
  npm run server
  ```
- **Terminal 2 (Frontend Client):**
  ```bash
  npm run client
  ```

---

#### 📦 Cách 3: Build và chạy chế độ Production
Nếu muốn đóng gói mã nguồn và để Express Server phục vụ toàn bộ website:
```bash
npm run build
npm start
```
Sau đó truy cập toàn bộ ứng dụng tại [http://localhost:5000](http://localhost:5000).

---

#### ⚡ Kiểm thử tải và hiệu năng API (Stress Test)
*(Lưu ý: Hãy đảm bảo Server đang chạy ở một terminal khác bằng lệnh `npm run dev` hoặc `npm run server` trước khi test).*
```bash
npm run test:stress
```

---

## 📂 Cấu Trúc Thư Mục

```text
Web_Final/
├── client/                     # Frontend React (Vite + TailwindCSS)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Các component giao diện
│   │   │   ├── guest/          # HeroSection, FilterBar, RoomCard, BookingModal...
│   │   │   ├── pms/            # Quản trị lễ tân, Timeline, Sơ đồ phòng, FolioModal...
│   │   │   └── Navbar, Footer  # Điều hướng & Chân trang
│   │   ├── pages/              # GuestPortal, PMSAdmin
│   │   ├── services/           # Kết nối API
│   │   └── index.css           # Cấu hình TailwindCSS v4 & Design System
│   └── package.json
├── server/                     # Backend Express & SQLite
│   ├── database/               # File dữ liệu SQLite (.db)
│   ├── routes/                 # API routes (rooms, bookings, services, stats)
│   ├── db.js                   # Khởi tạo bảng & nạp dữ liệu mẫu
│   └── index.js                # Entry point của server Express
├── scripts/                    # Script stress test hiệu năng
├── package.json                # Quản lý script toàn dự án
└── README.md                   # Hướng dẫn chạy và tài liệu dự án
```

---

## ✨ Tính Năng Nổi Bật

1. **Khách đặt phòng trực tuyến (Guest Portal):**
   - Tìm kiếm phòng theo ngày nhận/trả phòng, số lượng khách, hạng phòng.
   - Lọc theo danh mục phòng (*Deluxe Suite, Executive Suite, Imperial Penthouse, ...*).
   - Xem chi tiết phòng, tiện ích, ảnh thực tế và đặt phòng trực tiếp.
   - Tra cứu tình trạng đơn đặt phòng theo mã đặt hoặc số điện thoại.

2. **Hệ thống Quản trị Lễ tân (PMS - Property Management System):**
   - **Dashboard:** Thống kê doanh thu, tỷ lệ lấp đầy phòng, công suất theo thời gian thực.
   - **Sơ đồ Timeline trực quan:** Quản lý lịch đặt phòng theo trục thời gian 14 ngày.
   - **Sơ đồ phòng (Room Rack):** Quản lý trạng thái từng phòng (*Trống, Có khách, Đang dọn dẹp, Bảo trì*).
   - **Check-in / Check-out:** Quy trình nhận/trả phòng nhanh chóng.
   - **Dịch vụ & Folio:** Thêm dịch vụ ẩm thực/spa/giặt là và in hóa đơn thanh toán chi tiết.
