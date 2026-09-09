import React, { useState } from 'react';
import { X, Search, CheckCircle, Clock, AlertTriangle, Building, Calendar, Users, QrCode } from 'lucide-react';
import { api, formatVND, formatDate } from '../../services/api';

export default function BookingLookupModal({ isOpen, onClose }) {
  const [bookingCode, setBookingCode] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!bookingCode.trim() || !phone.trim()) {
      setError('Vui lòng nhập đầy đủ Mã đặt phòng và Số điện thoại');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await api.lookupBooking(bookingCode, phone);
      setResult(res.data);
    } catch (err) {
      setError(err.message || 'Không tìm thấy thông tin đơn đặt phòng');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">Đã xác nhận (Chờ nhận phòng)</span>;
      case 'checked_in':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">Đang lưu trú</span>;
      case 'checked_out':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Đã trả phòng</span>;
      case 'cancelled':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">Đã hủy</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-lg font-bold">Tra Cứu Đơn Đặt Phòng</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Lookup Form */}
          <form onSubmit={handleLookup} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Mã đặt phòng (Ví dụ: BK-2026-8801)
              </label>
              <input
                type="text"
                placeholder="BK-2026-XXXX"
                value={bookingCode}
                onChange={(e) => setBookingCode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 uppercase font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Số điện thoại khi đặt phòng
              </label>
              <input
                type="tel"
                placeholder="0912345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl shadow-md text-sm transition-all disabled:opacity-50"
            >
              {loading ? 'Đang tìm kiếm...' : 'Tra cứu ngay'}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* Result Card */}
          {result && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-bold">Mã đặt phòng</div>
                  <div className="text-xl font-black font-mono text-slate-900">{result.booking_code}</div>
                </div>
                {getStatusBadge(result.status)}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 block text-[11px]">Khách hàng</span>
                  <strong className="text-slate-800">{result.guest_name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Số điện thoại</span>
                  <strong className="text-slate-800">{result.guest_phone}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Hạng phòng</span>
                  <strong className="text-slate-800">{result.room_name} (P.{result.room_number})</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Tổng tiền phòng</span>
                  <strong className="text-amber-700 font-bold">{formatVND(result.total_price)}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Ngày nhận phòng</span>
                  <strong className="text-slate-800">{formatDate(result.check_in_date)} (từ 14:00)</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Ngày trả phòng</span>
                  <strong className="text-slate-800">{formatDate(result.check_out_date)} (trước 12:00)</strong>
                </div>
              </div>

              {/* Special Requests if any */}
              {result.special_requests && (
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600">
                  <span className="font-bold text-slate-700">Yêu cầu đặc biệt: </span>
                  {result.special_requests}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
