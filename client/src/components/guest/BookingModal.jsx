import React, { useState } from 'react';
import { X, Calendar, Users, CreditCard, QrCode, Building, CheckCircle2, ArrowRight, ArrowLeft, Copy, Check, AlertCircle, ShieldCheck } from 'lucide-react';
import { api, formatVND, formatDate } from '../../services/api';

export default function BookingModal({ room, initialParams, onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1: Dates & Calc, 2: Guest Info, 3: Payment, 4: Confirmed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  const [formData, setFormData] = useState({
    check_in_date: initialParams?.checkIn || new Date().toISOString().split('T')[0],
    check_out_date: initialParams?.checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0],
    num_guests: initialParams?.capacity || 2,
    guest_name: '',
    guest_phone: '',
    guest_email: '',
    id_card: '',
    special_requests: '',
    payment_method: 'vietqr' // 'vietqr', 'hotel_pay', 'credit_card'
  });

  // Tính số đêm lưu trú
  const calculateNights = () => {
    if (!formData.check_in_date || !formData.check_out_date) return 1;
    const start = new Date(formData.check_in_date);
    const end = new Date(formData.check_out_date);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const nights = calculateNights();
  const totalPrice = (room?.price_per_night || 0) * nights;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  // Tiến hành submit đặt phòng đến API
  const handleSubmitBooking = async () => {
    if (!formData.guest_name.trim() || !formData.guest_phone.trim()) {
      setError('Vui lòng điền đầy đủ Họ tên và Số điện thoại liên hệ');
      setStep(2);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        room_id: room.id,
        guest_name: formData.guest_name,
        guest_email: formData.guest_email,
        guest_phone: formData.guest_phone,
        id_card: formData.id_card,
        check_in_date: formData.check_in_date,
        check_out_date: formData.check_out_date,
        num_guests: Number(formData.num_guests),
        payment_method: formData.payment_method,
        special_requests: formData.special_requests
      };

      const res = await api.createBooking(payload);
      setBookingResult(res.data);
      setStep(4); // Màn hình thành công
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Lỗi đặt phòng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Header Modal */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-amber-400">
              {step === 4 ? 'Xác Nhận Đặt Phòng Thành Công' : 'Đặt Phòng Trực Tuyến'}
            </h3>
            <p className="text-xs text-slate-400">
              {room?.name} — Phòng {room?.room_number}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper (Only in steps 1, 2, 3) */}
        {step < 4 && (
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs sm:text-sm font-semibold">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-amber-600' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-200 text-slate-600'}`}>1</span>
              <span>Lịch & Giá</span>
            </div>
            <div className="h-0.5 flex-1 mx-3 bg-slate-200">
              <div className={`h-full bg-amber-500 transition-all duration-300 ${step === 2 ? 'w-1/2' : step === 3 ? 'w-full' : 'w-0'}`} />
            </div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-amber-600' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-200 text-slate-600'}`}>2</span>
              <span>Thông Tin Khách</span>
            </div>
            <div className="h-0.5 flex-1 mx-3 bg-slate-200">
              <div className={`h-full bg-amber-500 transition-all duration-300 ${step === 3 ? 'w-full' : 'w-0'}`} />
            </div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-amber-600' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-200 text-slate-600'}`}>3</span>
              <span>Thanh Toán</span>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs sm:text-sm text-rose-700 font-medium animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Step Content */}
        <div className="p-6 overflow-y-auto max-h-[65vh]">
          
          {/* STEP 1: DATES & TOTAL CALCULATION */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex items-center gap-3">
                <img
                  src={room?.image_url}
                  alt={room?.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">{room?.name}</h4>
                  <p className="text-xs text-slate-600">Sức chứa tối đa {room?.capacity} khách • {room?.view}</p>
                  <p className="text-xs font-bold text-amber-700 mt-0.5">{formatVND(room?.price_per_night)} / đêm</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Ngày nhận phòng (Check-in)
                  </label>
                  <input
                    type="date"
                    value={formData.check_in_date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleInputChange('check_in_date', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Ngày trả phòng (Check-out)
                  </label>
                  <input
                    type="date"
                    value={formData.check_out_date}
                    min={formData.check_in_date || new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleInputChange('check_out_date', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Số lượng người lưu trú
                </label>
                <select
                  value={formData.num_guests}
                  onChange={(e) => handleInputChange('num_guests', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {Array.from({ length: room?.capacity || 2 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n} Người lớn</option>
                  ))}
                </select>
              </div>

              {/* Price Calculation Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Thời gian lưu trú:</span>
                  <span className="font-bold text-slate-900">{nights} đêm</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Đơn giá theo đêm:</span>
                  <span>{formatVND(room?.price_per_night)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Buffet sáng 5 sao:</span>
                  <span className="text-emerald-600 font-semibold">Miễn phí</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-base font-bold text-slate-900">
                  <span>Tổng cộng tạm tính:</span>
                  <span className="text-xl font-black text-amber-600">{formatVND(totalPrice)}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: GUEST INFORMATION */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Họ và tên khách hàng *
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={formData.guest_name}
                  onChange={(e) => handleInputChange('guest_name', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Số điện thoại liên hệ *
                  </label>
                  <input
                    type="tel"
                    placeholder="Ví dụ: 0912345678"
                    value={formData.guest_phone}
                    onChange={(e) => handleInputChange('guest_phone', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Địa chỉ Email
                  </label>
                  <input
                    type="email"
                    placeholder="Ví dụ: an.nguyen@gmail.com"
                    value={formData.guest_email}
                    onChange={(e) => handleInputChange('guest_email', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Số CCCD / Hộ chiếu (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="Giúp làm thủ tục Check-in nhanh tại quầy"
                  value={formData.id_card}
                  onChange={(e) => handleInputChange('id_card', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Yêu cầu đặc biệt
                </label>
                <textarea
                  rows="2"
                  placeholder="Ví dụ: Cần phòng tầng cao yên tĩnh, chuẩn bị giường tân hôn..."
                  value={formData.special_requests}
                  onChange={(e) => handleInputChange('special_requests', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Chọn phương thức thanh toán
              </h4>

              {/* VietQR Instant Transfer */}
              <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${formData.payment_method === 'vietqr' ? 'border-amber-500 bg-amber-50/50 shadow-sm' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input
                  type="radio"
                  name="payment_method"
                  value="vietqr"
                  checked={formData.payment_method === 'vietqr'}
                  onChange={(e) => handleInputChange('payment_method', e.target.value)}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-amber-600" />
                    <span className="font-bold text-slate-900 text-sm">Chuyển khoản VietQR tức thời (Khuyên dùng)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Quét mã QR qua ứng dụng ngân hàng hoặc ví MoMo/ZaloPay. Tự động xác nhận nhanh.
                  </p>
                </div>
              </label>

              {/* Pay at Hotel */}
              <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${formData.payment_method === 'hotel_pay' ? 'border-amber-500 bg-amber-50/50 shadow-sm' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input
                  type="radio"
                  name="payment_method"
                  value="hotel_pay"
                  checked={formData.payment_method === 'hotel_pay'}
                  onChange={(e) => handleInputChange('payment_method', e.target.value)}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-slate-900 text-sm">Thanh toán tại quầy khi nhận phòng</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Giữ phòng cho bạn đến 18:00 ngày nhận phòng. Thanh toán tiền mặt hoặc quẹt thẻ tại lễ tân.
                  </p>
                </div>
              </label>

              {/* Credit Card */}
              <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${formData.payment_method === 'credit_card' ? 'border-amber-500 bg-amber-50/50 shadow-sm' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input
                  type="radio"
                  name="payment_method"
                  value="credit_card"
                  checked={formData.payment_method === 'credit_card'}
                  onChange={(e) => handleInputChange('payment_method', e.target.value)}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-slate-900 text-sm">Thẻ Quốc Tế (Visa / Mastercard / JCB)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Thanh toán bảo mật chuẩn SSL 256-bit qua cổng trực tuyến.
                  </p>
                </div>
              </label>

              {/* Final Summary */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Tổng thanh toán cho {nights} đêm:</div>
                  <div className="text-xl font-bold text-amber-400">{formatVND(totalPrice)}</div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Bảo mật 100%</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESSFUL CONFIRMATION WITH VIETQR */}
          {step === 4 && bookingResult && (
            <div className="text-center space-y-6 py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-slate-900">
                  Đặt Phòng Thành Công!
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Cảm ơn Quý khách <strong className="text-slate-900">{formData.guest_name}</strong>. Hệ thống đã ghi nhận lịch lưu trú.
                </p>
              </div>

              {/* Booking Code Highlight Card */}
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-dashed border-amber-300 flex items-center justify-between max-w-md mx-auto">
                <div className="text-left">
                  <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Mã đặt phòng của bạn</div>
                  <div className="text-2xl font-black text-amber-900 font-mono">{bookingResult.booking_code}</div>
                </div>
                <button
                  onClick={() => handleCopy(bookingResult.booking_code)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors shadow-xs"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>

              {/* VietQR Display (If payment_method === 'vietqr') */}
              {formData.payment_method === 'vietqr' && (
                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <QrCode className="w-5 h-5 text-amber-600" />
                    <span className="font-bold text-sm text-slate-900">Quét mã VietQR để hoàn tất thanh toán</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-36 h-36 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm shrink-0 flex items-center justify-center">
                      <img
                        src={bookingResult.vietqr_url}
                        alt="VietQR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-xs space-y-1.5 text-slate-600">
                      <div>Ngân hàng: <strong className="text-slate-900">MB Bank (Quân Đội)</strong></div>
                      <div>Số TK: <strong className="text-slate-900 font-mono">0988888888</strong></div>
                      <div>Chủ TK: <strong className="text-slate-900">HOTEL LUXURY RESORT</strong></div>
                      <div>Số tiền: <strong className="text-amber-700 font-bold">{formatVND(bookingResult.total_price)}</strong></div>
                      <div>Nội dung: <strong className="text-blue-700 font-mono">DAT PHONG {bookingResult.booking_code}</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Stay Summary */}
              <div className="text-xs text-slate-500 space-y-1">
                <p>Nhận phòng: <strong>{formatDate(formData.check_in_date)} (từ 14:00)</strong></p>
                <p>Trả phòng: <strong>{formatDate(formData.check_out_date)} (trước 12:00)</strong></p>
                <p>Quý khách có thể dùng Mã đặt phòng để tra cứu thông tin bất cứ lúc nào.</p>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step === 1 && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md"
              >
                <span>Tiếp tục: Thông tin khách</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại</span>
              </button>
              <button
                onClick={() => {
                  if (!formData.guest_name.trim() || !formData.guest_phone.trim()) {
                    setError('Vui lòng nhập đầy đủ Họ tên và Số điện thoại');
                    return;
                  }
                  setStep(3);
                }}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md"
              >
                <span>Tiếp tục: Phương thức thanh toán</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <button
                onClick={() => setStep(2)}
                disabled={loading}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100 disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại</span>
              </button>
              <button
                onClick={handleSubmitBooking}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 disabled:opacity-50"
              >
                {loading ? 'Đang xử lý...' : 'Xác Nhận Đặt Phòng'}
              </button>
            </>
          )}

          {step === 4 && (
            <div className="w-full flex justify-center">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg"
              >
                Hoàn tất & Đóng hộp thoại
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
