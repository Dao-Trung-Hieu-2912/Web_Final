import React from 'react';
import { Calendar, Users, Home, Search, ShieldCheck, Coffee, Sparkles } from 'lucide-react';

export default function HeroSection({ searchParams, setSearchParams, onSearch }) {
  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="relative bg-slate-950 text-white overflow-hidden">
      {/* Background Image with Luxury Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2000&q=85"
          alt="Lumière Luxury Resort"
          className="w-full h-full object-cover object-center opacity-35 filter scale-105 transition-transform duration-10000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-900/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-28 md:pt-24 md:pb-36 text-center">
        {/* Top Luxury Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-medium tracking-wide mb-6 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Khu Nghỉ Dưỡng Biển Sang Trọng Bậc Nhất 2026</span>
        </div>

        {/* Luxury Typography */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          Nơi Thượng Lưu Chạm Đến <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
            Bình Yên Tuyệt Tác
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          Trải nghiệm kỳ nghỉ dưỡng thượng hạng tại Lumière Grand Resort & Spa. Khung cảnh đại dương vô cực, dịch vụ quản gia 24/7 và ẩm thực chuẩn Michelin.
        </p>

        {/* Feature Highlights */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Đảm bảo giá tốt nhất</span>
          </div>
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-amber-400" />
            <span>Buffet sáng 5 sao miễn phí</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Miễn phí hủy phòng trước 24h</span>
          </div>
        </div>

        {/* Floating Search Bar (Airbnb & Booking.com style) */}
        <div className="mt-10 max-w-5xl mx-auto bg-white/95 backdrop-blur-xl p-3 sm:p-4 rounded-3xl shadow-2xl border border-white/20 text-slate-900">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Check-in Date */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-amber-50/50 rounded-2xl border border-slate-200/80 transition-colors text-left">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Ngày nhận phòng
                </label>
                <input
                  type="date"
                  value={searchParams.checkIn}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => handleInputChange('checkIn', e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Check-out Date */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-amber-50/50 rounded-2xl border border-slate-200/80 transition-colors text-left">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Ngày trả phòng
                </label>
                <input
                  type="date"
                  value={searchParams.checkOut}
                  min={searchParams.checkIn || new Date().toISOString().split('T')[0]}
                  onChange={(e) => handleInputChange('checkOut', e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Guests count */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-amber-50/50 rounded-2xl border border-slate-200/80 transition-colors text-left">
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Số lượng khách
                </label>
                <select
                  value={searchParams.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="">Tất cả khách</option>
                  <option value="1">1 người lớn</option>
                  <option value="2">2 người lớn</option>
                  <option value="3">3 người (Gia đình nhỏ)</option>
                  <option value="4">4+ người (Gia đình / Nhóm)</option>
                </select>
              </div>
            </div>

            {/* Room category / Submit */}
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-left">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                  <Home className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Hạng phòng
                  </label>
                  <select
                    value={searchParams.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer truncate"
                  >
                    <option value="all">Tất cả hạng</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Executive Suite</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="superior">Superior</option>
                    <option value="standard">Standard</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={onSearch}
                className="h-full px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-2xl shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Search className="w-5 h-5 text-slate-950" />
                <span className="hidden sm:inline font-bold">Tìm phòng</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
