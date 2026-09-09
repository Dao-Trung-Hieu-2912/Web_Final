import React, { useState } from 'react';
import { Search, Coffee, Receipt, CheckCircle, Clock, XCircle, ArrowRight, UserCheck } from 'lucide-react';
import { api, formatVND, formatDate } from '../../services/api';
import AddServiceModal from './AddServiceModal';
import FolioModal from './FolioModal';

export default function BookingsManager({ bookings, onBookingUpdated }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBookingForService, setActiveBookingForService] = useState(null);
  const [activeBookingForFolio, setActiveBookingForFolio] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const handleCheckIn = async (bookingId) => {
    setLoadingId(bookingId);
    try {
      await api.updateBookingStatus(bookingId, 'checked_in');
      if (onBookingUpdated) onBookingUpdated();
    } catch (err) {
      alert(err.message || 'Lỗi khi check-in');
    } finally {
      setLoadingId(null);
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchSearch =
      !searchQuery.trim() ||
      b.booking_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.guest_phone.includes(searchQuery);
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Chờ nhận phòng</span>
          </span>
        );
      case 'checked_in':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <UserCheck className="w-3 h-3 text-blue-600" />
            <span>Đang lưu trú</span>
          </span>
        );
      case 'checked_out':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span>Đã trả phòng</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>Đã hủy</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      
      {/* Header & Search Bar */}
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-slate-900">Quản Lý Đơn Đặt Phòng (Bookings)</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi danh sách khách lưu trú, làm thủ tục Check-in, phụ thu Minibar và Check-out.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Tìm theo Mã đơn, Tên, Số ĐT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'all', label: 'Tất cả đơn' },
          { id: 'confirmed', label: 'Chờ nhận phòng' },
          { id: 'checked_in', label: 'Đang ở' },
          { id: 'checked_out', label: 'Đã trả phòng' },
          { id: 'cancelled', label: 'Đã hủy' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterStatus === tab.id
                ? 'bg-slate-900 text-amber-400 shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-100/80 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-6">Mã Đơn / Khách Hàng</th>
              <th className="py-3.5 px-4">Phòng</th>
              <th className="py-3.5 px-4">Kỳ Lưu Trú</th>
              <th className="py-3.5 px-4">Tổng Tiền</th>
              <th className="py-3.5 px-4">Trạng Thái</th>
              <th className="py-3.5 px-6 text-right">Thao Tác Lễ Tân</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-400 text-sm">
                  Không tìm thấy đơn đặt phòng nào phù hợp.
                </td>
              </tr>
            ) : (
              filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  
                  {/* Booking Code & Guest Info */}
                  <td className="py-4 px-6">
                    <span className="font-mono font-bold text-slate-900 block">{b.booking_code}</span>
                    <strong className="text-slate-800 block text-xs mt-0.5">{b.guest_name}</strong>
                    <span className="text-slate-400 text-[11px]">{b.guest_phone}</span>
                  </td>

                  {/* Room */}
                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-900 block">P.{b.room_number}</span>
                    <span className="text-slate-500 text-xs truncate max-w-[140px] block">{b.room_name}</span>
                  </td>

                  {/* Dates */}
                  <td className="py-4 px-4 text-xs text-slate-600">
                    <div>{formatDate(b.check_in_date)} (14:00)</div>
                    <div className="text-slate-400">đến {formatDate(b.check_out_date)} (12:00)</div>
                  </td>

                  {/* Total Price */}
                  <td className="py-4 px-4">
                    <span className="font-bold text-amber-700">{formatVND(b.total_price)}</span>
                    <span className={`block text-[10px] font-semibold ${b.payment_status === 'paid' ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {b.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4">
                    {getStatusBadge(b.status)}
                  </td>

                  {/* Receptionist Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      
                      {/* Check-in Button (if confirmed) */}
                      {b.status === 'confirmed' && (
                        <button
                          disabled={loadingId === b.id}
                          onClick={() => handleCheckIn(b.id)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                        >
                          🛎️ Check-in
                        </button>
                      )}

                      {/* Add Minibar Service (if checked_in) */}
                      {b.status === 'checked_in' && (
                        <button
                          onClick={() => setActiveBookingForService(b)}
                          className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                          title="Thêm minibar"
                        >
                          <Coffee className="w-3.5 h-3.5 text-amber-700" />
                          <span>+ Minibar</span>
                        </button>
                      )}

                      {/* Check-out & Folio */}
                      {b.status === 'checked_in' && (
                        <button
                          onClick={() => setActiveBookingForFolio(b.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                        >
                          Check-out & Folio
                        </button>
                      )}

                      {/* View Folio (if checked_out) */}
                      {b.status === 'checked_out' && (
                        <button
                          onClick={() => setActiveBookingForFolio(b.id)}
                          className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-medium transition-colors flex items-center gap-1"
                        >
                          <Receipt className="w-3.5 h-3.5 text-slate-500" />
                          <span>Hóa đơn</span>
                        </button>
                      )}

                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {activeBookingForService && (
        <AddServiceModal
          booking={activeBookingForService}
          onClose={() => setActiveBookingForService(null)}
          onSuccess={() => {
            if (onBookingUpdated) onBookingUpdated();
          }}
        />
      )}

      {activeBookingForFolio && (
        <FolioModal
          bookingId={activeBookingForFolio}
          onClose={() => setActiveBookingForFolio(null)}
          onCheckOutComplete={() => {
            setActiveBookingForFolio(null);
            if (onBookingUpdated) onBookingUpdated();
          }}
        />
      )}

    </div>
  );
}
