import React from 'react';
import { Users, Bed, Maximize2, Waves, Sparkles, Check, ArrowRight } from 'lucide-react';
import { formatVND } from '../../services/api';

export default function RoomCard({ room, onSelectRoom, onBookRoom }) {
  // Badge theo hạng phòng
  const getTypeBadge = (type) => {
    switch (type) {
      case 'penthouse':
        return { label: '👑 Imperial Penthouse', color: 'bg-purple-900/90 text-purple-200 border-purple-700' };
      case 'suite':
        return { label: '✨ Executive Suite', color: 'bg-blue-900/90 text-blue-200 border-blue-700' };
      case 'deluxe':
        return { label: '🌟 Deluxe Ocean View', color: 'bg-amber-900/90 text-amber-200 border-amber-700' };
      default:
        return { label: '🌿 Premier Room', color: 'bg-emerald-900/90 text-emerald-200 border-emerald-700' };
    }
  };

  const badge = getTypeBadge(room.type);

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col hover:-translate-y-1">
      
      {/* Photo Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={room.image_url}
          alt={room.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        
        {/* Floating Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-sm ${badge.color}`}>
            {badge.label}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md border border-white/20">
            Phòng {room.room_number} (Tầng {room.floor})
          </span>
        </div>

        {/* Floating Bottom Info */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            <Waves className="w-3.5 h-3.5 text-cyan-300" />
            <span className="font-medium truncate">{room.view}</span>
          </div>
          <span className="bg-emerald-500/90 text-slate-950 font-bold px-2.5 py-1 rounded-full shadow-sm">
            Bao buffet sáng
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
            {room.name}
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {room.description}
          </p>

          {/* Quick Specifications */}
          <div className="mt-4 grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-slate-700 text-xs font-medium">
            <div className="flex items-center gap-1.5" title="Sức chứa tối đa">
              <Users className="w-4 h-4 text-amber-500" />
              <span>{room.capacity} Khách</span>
            </div>
            <div className="flex items-center gap-1.5" title="Diện tích phòng">
              <Maximize2 className="w-4 h-4 text-amber-500" />
              <span>{room.size_sqm} m²</span>
            </div>
            <div className="flex items-center gap-1.5 truncate" title="Loại giường">
              <Bed className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="truncate">{room.bed_type}</span>
            </div>
          </div>

          {/* Highlight Amenities Pills */}
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {(room.amenities || []).slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60 text-[11px] font-medium text-slate-600"
              >
                <Check className="w-3 h-3 text-emerald-500" />
                <span>{amenity}</span>
              </span>
            ))}
            {(room.amenities || []).length > 3 && (
              <span className="px-2 py-1 rounded-lg bg-amber-50 text-[11px] font-semibold text-amber-700">
                +{(room.amenities.length - 3)} tiện ích khác
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Giá mỗi đêm</div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {formatVND(room.price_per_night)}
              </span>
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold">Đã gồm thuế & phí</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectRoom(room)}
              className="px-3 sm:px-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
            >
              Chi tiết
            </button>
            <button
              onClick={() => onBookRoom(room)}
              className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Đặt ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
