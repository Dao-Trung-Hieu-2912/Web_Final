import React, { useState, useEffect } from 'react';
import { X, Printer, CheckCircle, Hotel, Receipt, AlertCircle } from 'lucide-react';
import { api, formatVND, formatDate } from '../../services/api';

export default function FolioModal({ bookingId, onClose, onCheckOutComplete }) {
  const [folio, setFolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const fetchFolio = async () => {
    setLoading(true);
    try {
      const res = await api.getBookingFolio(bookingId);
      setFolio(res.data);
    } catch (err) {
      setError(err.message || 'Lỗi tải hóa đơn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) fetchFolio();
  }, [bookingId]);

  const handleCompleteCheckOut = async () => {
    setProcessing(true);
    try {
      await api.updateBookingStatus(bookingId, 'checked_out');
      if (onCheckOutComplete) onCheckOutComplete();
      onClose();
    } catch (err) {
      alert(err.message || 'Lỗi khi làm thủ tục check-out');
    } finally {
      setProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!bookingId) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-lg font-bold">Hóa Đơn Lưu Trú & Dịch Vụ (Folio)</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Đang xuất dữ liệu hóa đơn...</div>
        ) : error ? (
          <div className="p-6 text-center text-rose-600 text-sm">{error}</div>
        ) : folio ? (
          <div className="p-6 sm:p-8 space-y-6 text-slate-800" id="print-area">
            
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Hotel className="w-6 h-6 text-amber-600" />
                  <span className="font-serif text-2xl font-bold text-slate-900">LUMIÈRE</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Grand Resort & Spa 5-Star Luxury</p>
                <p className="text-xs text-slate-400">Bãi Dài, Phú Quốc, Kiên Giang, Việt Nam</p>
                <p className="text-xs text-slate-400">Hotline: 1900 8888 • info@lumiere-resort.com</p>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Phiếu Hóa Đơn</div>
                <div className="text-lg font-black font-mono text-slate-900">FOLIO-{folio.booking.booking_code}</div>
                <div className="text-xs text-slate-500 mt-1">
                  Ngày xuất: {formatDate(new Date().toISOString())}
                </div>
              </div>
            </div>

            {/* Guest Details Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 text-xs border border-slate-100">
              <div>
                <span className="text-slate-400 block">Khách hàng:</span>
                <strong className="text-sm text-slate-900">{folio.booking.guest_name}</strong>
                <span className="block text-slate-500">{folio.booking.guest_phone}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">Phòng lưu trú:</span>
                <strong className="text-sm text-slate-900">{folio.booking.room_name} (P.{folio.booking.room_number})</strong>
                <span className="block text-slate-500">
                  {formatDate(folio.booking.check_in_date)} — {formatDate(folio.booking.check_out_date)}
                </span>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-2.5">Khoản mục</th>
                    <th className="py-2.5 text-center">Số lượng</th>
                    <th className="py-2.5 text-right">Đơn giá</th>
                    <th className="py-2.5 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Room Charge */}
                  <tr>
                    <td className="py-3 font-medium text-slate-900">
                      Tiền phòng ({folio.booking.room_name})
                    </td>
                    <td className="py-3 text-center text-slate-600">Theo kỳ ở</td>
                    <td className="py-3 text-right text-slate-600">{formatVND(folio.booking.price_per_night)}</td>
                    <td className="py-3 text-right font-bold text-slate-900">{formatVND(folio.room_charge)}</td>
                  </tr>

                  {/* Services / Minibar */}
                  {folio.services.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2.5 text-slate-700">
                        {item.service_name} ({item.category})
                      </td>
                      <td className="py-2.5 text-center text-slate-600">x{item.quantity}</td>
                      <td className="py-2.5 text-right text-slate-600">{formatVND(item.unit_price)}</td>
                      <td className="py-2.5 text-right font-semibold text-slate-900">
                        {formatVND(item.quantity * item.unit_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Grand Total Box */}
            <div className="pt-4 border-t-2 border-slate-200 flex flex-col items-end space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between w-64 text-slate-600">
                <span>Tiền phòng:</span>
                <span>{formatVND(folio.room_charge)}</span>
              </div>
              <div className="flex justify-between w-64 text-slate-600">
                <span>Phụ thu Minibar & Dịch vụ:</span>
                <span>{formatVND(folio.services_charge)}</span>
              </div>
              <div className="flex justify-between w-64 text-slate-600">
                <span>Thuế GTGT (VAT 8%):</span>
                <span className="text-emerald-600 font-semibold">Đã bao gồm</span>
              </div>
              <div className="flex justify-between w-64 pt-2 border-t border-slate-200 text-base font-bold text-slate-900">
                <span>TỔNG THANH TOÁN:</span>
                <span className="text-xl font-black text-amber-600">{formatVND(folio.grand_total)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between no-print">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>In Hóa Đơn</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold text-xs"
                >
                  Đóng
                </button>
                {folio.booking.status === 'checked_in' && (
                  <button
                    disabled={processing}
                    onClick={handleCompleteCheckOut}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{processing ? 'Đang xử lý...' : 'Xác nhận Check-out'}</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
}
