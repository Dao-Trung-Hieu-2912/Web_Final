import React from 'react';
import { X, Users, Bed, Maximize2, Waves, CheckCircle2, ShieldCheck, Clock, Coffee, Sparkles } from 'lucide-react';
import { formatVND } from '../../services/api';

export default function RoomDetailModal({ room, onClose, onBookRoom }) {
  if (!room) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Room Cover Photo */}
        <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
          <img
            src={room.image_url}
            alt={room.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950 mb-2">
              Phòng {room.room_number} • Tầng {room.floor}
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {room.name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Key Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <div className="text-[11px] text-slate-400">Sức chứa</div>
                <div className="text-sm font-bold text-slate-800">{room.capacity} Người lớn</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Maximize2 className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <div className="text-[11px] text-slate-400">Diện tích</div>
                <div className="text-sm font-bold text-slate-800">{room.size_sqm} m²</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Bed className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <div className="text-[11px] text-slate-400">Loại giường</div>
                <div className="text-sm font-bold text-slate-800 truncate">{room.bed_type}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Waves className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <div className="text-[11px] text-slate-400">Tầm nhìn</div>
                <div className="text-sm font-bold text-slate-800 truncate">{room.view}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
              Mô tả không gian nghỉ dưỡng
            </h4>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {room.description}
            </p>
          </div>

          {/* All Amenities */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
              Trang thiết bị & Tiện nghi cao cấp
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(room.amenities || []).map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50/70 border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-slate-700">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Policies */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2 text-xs sm:text-sm text-slate-700">
            <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Chính sách lưu trú tại Lumière
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Nhận phòng: từ <strong>14:00</strong> | Trả phòng: trước <strong>12:00</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Coffee className="w-4 h-4 text-slate-400" />
                <span>Buffet sáng miễn phí: <strong>06:30 - 10:00</strong></span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
              Giá niêm yết
            </span>
            <span className="text-2xl font-black text-slate-900">
              {formatVND(room.price_per_night)}
            </span>
            <span className="text-xs text-slate-500"> / đêm</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                onClose();
                onBookRoom(room);
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/25"
            >
              Đặt phòng ngay
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
