import React, { useState, useEffect } from 'react';
import { api, formatDate } from '../../services/api';
import { Calendar, ChevronLeft, ChevronRight, User, Phone, CheckCircle, Clock } from 'lucide-react';

export default function InteractiveTimeline({ onSelectBooking }) {
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const daysCount = 14;

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      const res = await api.getTimeline(startDate, daysCount);
      setTimelineData(res.data || []);
    } catch (err) {
      console.error('Lỗi tải timeline:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, [startDate]);

  // Sinh mảng danh sách các ngày
  const generateDates = () => {
    const dates = [];
    const curr = new Date(startDate);
    for (let i = 0; i < daysCount; i++) {
      const d = new Date(curr);
      d.setDate(curr.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const dates = generateDates();
  const today = new Date().toISOString().split('T')[0];

  const handlePrev = () => {
    const d = new Date(startDate);
    d.setDate(d.getDate() - 7);
    setStartDate(d.toISOString().split('T')[0]);
  };

  const handleNext = () => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + 7);
    setStartDate(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setStartDate(new Date().toISOString().split('T')[0]);
  };

  // Helper tính toán vị trí khối booking trên trục ngày
  const getBookingStyle = (booking) => {
    const bStart = new Date(booking.check_in_date);
    const bEnd = new Date(booking.check_out_date);
    const tStart = new Date(startDate);

    const startDiffDays = Math.round((bStart - tStart) / (1000 * 60 * 60 * 24));
    const durationDays = Math.round((bEnd - bStart) / (1000 * 60 * 60 * 24));

    const left = Math.max(0, startDiffDays);
    const span = Math.min(daysCount - left, durationDays - Math.max(0, -startDiffDays));

    return { left, span };
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header Controls */}
      <div className="p-4 sm:p-6 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-lg sm:text-xl font-bold">Lịch Ma Trận Buồng Phòng (Tape Chart)</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Xem lịch đặt phòng trực quan theo ngày x số phòng. Kéo dài 14 ngày từ {formatDate(startDate)}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-semibold hover:bg-slate-700 text-amber-400 border border-slate-700"
          >
            Hôm nay
          </button>
          <div className="flex items-center bg-slate-800 rounded-xl border border-slate-700 p-1">
            <button
              onClick={handlePrev}
              className="p-1 rounded-lg hover:bg-slate-700 text-slate-300"
              title="7 ngày trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-1 rounded-lg hover:bg-slate-700 text-slate-300"
              title="7 ngày sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend Badges */}
      <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-4 text-xs">
        <span className="text-slate-500 font-medium">Chú thích trạng thái:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500 shadow-xs" />
          <span className="text-slate-700 font-medium">Đang lưu trú (Checked-in)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 shadow-xs" />
          <span className="text-slate-700 font-medium">Đã xác nhận (Confirmed)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300" />
          <span className="text-slate-700 font-medium">Phòng trống</span>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[950px]">
          
          {/* Header row with dates */}
          <div className="grid grid-cols-[180px_repeat(14,1fr)] bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-700">
            <div className="p-3 border-r border-slate-200 flex items-center justify-between">
              <span>Phòng / Hạng</span>
              <span className="text-[10px] text-slate-400 uppercase">Tầng</span>
            </div>
            {dates.map((dStr) => {
              const d = new Date(dStr);
              const dayName = d.toLocaleDateString('vi-VN', { weekday: 'short' });
              const dayNum = d.getDate();
              const isToday = dStr === today;

              return (
                <div
                  key={dStr}
                  className={`p-2 text-center border-r border-slate-200 ${
                    isToday ? 'bg-amber-100 text-amber-900 border-amber-300 font-black' : ''
                  }`}
                >
                  <div className="text-[10px] uppercase font-semibold text-slate-500">{dayName}</div>
                  <div className="text-sm font-bold">{dayNum}</div>
                </div>
              );
            })}
          </div>

          {/* Room rows */}
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm">Đang tải dữ liệu ma trận buồng phòng...</div>
          ) : (
            timelineData.map((room) => (
              <div
                key={room.id}
                className="grid grid-cols-[180px_repeat(14,1fr)] border-b border-slate-100 hover:bg-slate-50/50 transition-colors relative"
              >
                {/* Room Info Cell */}
                <div className="p-3 border-r border-slate-200 bg-white font-medium text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">P.{room.room_number}</span>
                    <span className="text-[11px] text-slate-500 block truncate max-w-[110px]">{room.name}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                    T{room.floor}
                  </span>
                </div>

                {/* 14 Day Cells */}
                {dates.map((dStr) => {
                  const isToday = dStr === today;
                  return (
                    <div
                      key={dStr}
                      className={`border-r border-slate-100 h-14 relative ${
                        isToday ? 'bg-amber-50/30' : ''
                      }`}
                    />
                  );
                })}

                {/* Overlay Booking Bars */}
                {(room.bookings || []).map((booking) => {
                  const { left, span } = getBookingStyle(booking);
                  if (span <= 0) return null;

                  // Tính vị trí CSS theo percentage hoặc grid
                  const isCheckedIn = booking.status === 'checked_in';

                  return (
                    <div
                      key={booking.id}
                      onClick={() => onSelectBooking(booking)}
                      style={{
                        left: `calc(180px + (100% - 180px) * ${left / daysCount})`,
                        width: `calc((100% - 180px) * ${span / daysCount} - 4px)`
                      }}
                      className={`absolute top-2 bottom-2 z-10 rounded-xl px-2.5 flex items-center justify-between text-xs text-white font-medium cursor-pointer shadow-md transition-transform hover:scale-[1.01] overflow-hidden ${
                        isCheckedIn
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/20'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-amber-500/20'
                      }`}
                      title={`Khách: ${booking.guest_name} | SĐT: ${booking.guest_phone} (${formatDate(booking.check_in_date)} - ${formatDate(booking.check_out_date)})`}
                    >
                      <div className="truncate flex items-center gap-1">
                        <User className="w-3.5 h-3.5 shrink-0 opacity-80" />
                        <span className="truncate">{booking.guest_name}</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/20 shrink-0 hidden sm:inline">
                        {isCheckedIn ? 'Đang ở' : 'Đã xác nhận'}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))
          )}

        </div>
      </div>

    </div>
  );
}
