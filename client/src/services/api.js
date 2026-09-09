// API Service kết nối tới Express Backend (với fallback an toàn)
const BASE_URL = '/api';

export const api = {
  // Lấy danh sách phòng kèm bộ lọc
  async getRooms(filters = {}) {
    const params = new URLSearchParams();
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.capacity) params.append('capacity', filters.capacity);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.checkIn) params.append('checkIn', filters.checkIn);
    if (filters.checkOut) params.append('checkOut', filters.checkOut);

    const res = await fetch(`${BASE_URL}/rooms?${params.toString()}`);
    if (!res.ok) throw new Error('Không thể tải danh sách phòng');
    return res.json();
  },

  // Lấy chi tiết 1 phòng
  async getRoomById(id) {
    const res = await fetch(`${BASE_URL}/rooms/${id}`);
    if (!res.ok) throw new Error('Không tìm thấy phòng');
    return res.json();
  },

  // Cập nhật trạng thái buồng phòng (Lễ tân / Housekeeping)
  async updateRoomStatus(id, status) {
    const res = await fetch(`${BASE_URL}/rooms/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Lỗi cập nhật trạng thái');
    }
    return res.json();
  },

  // Lấy danh sách đơn đặt phòng
  async getBookings(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);

    const res = await fetch(`${BASE_URL}/bookings?${params.toString()}`);
    if (!res.ok) throw new Error('Không thể tải danh sách đặt phòng');
    return res.json();
  },

  // Tạo đơn đặt phòng mới (Có chống Double-Booking)
  async createBooking(bookingData) {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Đặt phòng thất bại');
    }
    return data;
  },

  // Tra cứu đơn đặt phòng
  async lookupBooking(bookingCode, phone) {
    const params = new URLSearchParams({ bookingCode, phone });
    const res = await fetch(`${BASE_URL}/bookings/lookup?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Không tìm thấy đơn đặt phòng');
    }
    return data;
  },

  // Cập nhật trạng thái đơn (Check-in, Check-out, Cancel)
  async updateBookingStatus(id, status) {
    const res = await fetch(`${BASE_URL}/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Lỗi cập nhật đơn');
    return data;
  },

  // Lấy hóa đơn Folio
  async getBookingFolio(id) {
    const res = await fetch(`${BASE_URL}/bookings/${id}/folio`);
    if (!res.ok) throw new Error('Không thể lấy hóa đơn');
    return res.json();
  },

  // Thêm dịch vụ minibar vào đơn
  async addServiceToBooking(bookingId, serviceId, quantity) {
    const res = await fetch(`${BASE_URL}/bookings/${bookingId}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service_id: serviceId, quantity })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Lỗi thêm dịch vụ');
    return data;
  },

  // Lấy danh sách dịch vụ minibar
  async getServices() {
    const res = await fetch(`${BASE_URL}/services`);
    if (!res.ok) throw new Error('Không thể lấy danh sách dịch vụ');
    return res.json();
  },

  // Thống kê Dashboard KPI
  async getDashboardStats() {
    const res = await fetch(`${BASE_URL}/stats/dashboard`);
    if (!res.ok) throw new Error('Không thể tải thống kê');
    return res.json();
  },

  // Lấy dữ liệu Timeline ma trận phòng
  async getTimeline(startDate, days = 14) {
    const params = new URLSearchParams({ days });
    if (startDate) params.append('startDate', startDate);
    const res = await fetch(`${BASE_URL}/stats/timeline?${params.toString()}`);
    if (!res.ok) throw new Error('Không thể tải dữ liệu lịch');
    return res.json();
  }
};

// Format tiền tệ VNĐ
export const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
};

// Format ngày tháng DD/MM/YYYY
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
