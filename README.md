# 🏨 Lumière Grand Resort & Spa — Hotel Booking & Room Management System (PMS)

> **Đồ án cuối kỳ môn học:** ICT3.005 Web Application Development  
> **Trường:** Đại học Khoa học và Công nghệ Hà Nội (USTH)  

Hệ thống Đặt phòng Khách sạn 5 sao cao cấp & Quản trị Lễ tân xây dựng theo kiến trúc Fullstack hiện đại, tinh gọn và hiệu năng cao.

---
## 👥 Thành viên thực hiện

| STT | Mã sinh viên | Họ và tên |
| :---: | :---: | :--- |
| 1 | 23BA14120 | Đặng Việt Hoàng  |
| 2 | 23BA14121 | Nguyễn Đăng Hoàng |
| 3 | 23BA14107 | Đào Trung Hiếu |
| 4 | 23BA14059 | Nguyễn Minh Đức |
| 5 | 2410761 | Nguyễn Tú Oanh |
| 6 | 23BA14278 | Nguyễn Quang Thuần |

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

---

## 👥 Phân công công việc (Team Members & Task Assignment)

Bảng phân công chi tiết vai trò, trách nhiệm và các mô-đun/tập tin do 6 thành viên trong nhóm đảm nhận:

| STT | Mã sinh viên | Họ và tên | Vai trò (Role) | Mô-đun & File đảm nhận | Nhiệm vụ chính & Đóng góp |
| :-: | :---: | :--- | :--- | :--- | :--- |
| 1 | 23BA14120 | **Đặng Việt Hoàng** *(Leader)* | Trưởng nhóm / Kiến trúc hệ thống | `server/index.js`, `server/routes/rooms.js`, `server/routes/bookings.js`, `package.json`, `.gitignore` | Lập kế hoạch dự án, phân chia công việc, thiết kế kiến trúc Fullstack, khởi tạo Express server và định tuyến API cốt lõi (Rooms & Bookings), cấu hình deployment. |
| 2 | 23BA14107 | **Đào Trung Hiếu** | Kỹ sư Fullstack (Core PMS & Booking) | `client/src/pages/PMSAdmin.jsx`, `client/src/components/pms/InteractiveTimeline.jsx`, `client/src/components/pms/BookingsManager.jsx`, `client/src/components/pms/FolioModal.jsx`, `client/src/services/api.js` | Phát triển toàn bộ phân hệ Quản trị Lễ tân (PMS), sơ đồ Timeline 14 ngày trực quan, quy trình Check-in / Check-out, quản lý thanh toán Folio và kết nối dữ liệu API thời gian thực. |
| 3 | 23BA14121 | **Nguyễn Đăng Hoàng** | Kỹ sư Giao diện (Frontend UI/UX) | `client/src/pages/GuestPortal.jsx`, `client/src/components/guest/HeroSection.jsx`, `client/src/components/guest/FilterBar.jsx`, `client/src/components/guest/RoomCard.jsx`, `client/src/components/guest/BookingModal.jsx`, `client/src/components/guest/RoomDetailModal.jsx` | Xây dựng toàn bộ giao diện Cổng đặt phòng cho khách (Guest Portal), bộ lọc tìm kiếm theo ngày và hạng phòng, modal đặt phòng trực tuyến và tra cứu tình trạng đơn đặt. |
| 4 | 23BA14059 | **Nguyễn Minh Đức** | Kỹ sư Dữ liệu (Database & Modeling) | `server/db.js`, `server/database/hotel.db`, `server/routes/stats.js`, `server/routes/services.js` | Thiết kế cơ sở dữ liệu SQLite quan hệ (Better-SQLite3), lập trình logic tạo bảng và nạp dữ liệu mẫu (Seeding data), xây dựng API thống kê doanh thu và quản lý dịch vụ bổ sung. |
| 5 | 2410761 | **Nguyễn Tú Oanh** | Kỹ sư Đảm bảo chất lượng & Hiệu năng (QA & Testing) | `scripts/stress-test.js`, `client/src/components/BenchmarkPanel.jsx` | Viết kịch bản kiểm thử tải áp lực cao (Stress Test bằng Autocannon), xây dựng BenchmarkPanel trực quan hóa thời gian phản hồi API và tối ưu hiệu năng phục vụ đồng thời nhiều kết nối. |
| 6 | 23BA14278 | **Nguyễn Quang Thuần** | Kỹ sư Giao diện chung & Tài liệu kỹ thuật | `client/src/index.css`, `client/src/components/Navbar.jsx`, `client/src/components/Footer.jsx`, `README.md`, `client/vite.config.js` | Thiết lập Design System với Tailwind CSS v4, font chữ thương hiệu Playfair Display & Plus Jakarta Sans, layout Navbar/Footer dùng chung, và biên soạn tài liệu hướng dẫn triển khai `README.md`. |
