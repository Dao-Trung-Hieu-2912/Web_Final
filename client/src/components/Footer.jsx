import React from 'react';
import { Hotel, MapPin, Phone, Mail, Award, Heart } from 'lucide-react';

export default function Footer({ onOpenPMS }) {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-white">
              <Hotel className="w-6 h-6 text-amber-500" />
              <span className="font-serif text-xl font-bold tracking-wider text-amber-400">LUMIÈRE</span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Grand Resort & Spa</span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Thiên đường nghỉ dưỡng biển chuẩn 5 sao quốc tế. Nơi kết hợp hoàn hảo giữa kiến trúc đương đại tinh tế, dịch vụ chăm sóc khách hàng cá nhân hóa và quản trị phòng thông minh.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-500 font-medium">
              <Award className="w-4 h-4" />
              <span>Thành viên Hiệp hội Khách sạn Hạng sang Châu Á (ALHA)</span>
            </div>
          </div>

          {/* Col 2: Contact */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Thông Tin Liên Hệ</h4>
            <div className="flex items-start gap-2 text-xs">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Bãi Dài, Gành Dầu, Phú Quốc, Kiên Giang, Việt Nam</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Phone className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Hotline 24/7: 1900 8888 • (0297) 388 9999</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Mail className="w-4 h-4 text-amber-500 shrink-0" />
              <span>concierge@lumiere-resort.com</span>
            </div>
          </div>

          {/* Col 3: Academic / Project Info */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Dự Án Học Thuật</h4>
            <p className="text-xs text-slate-400">
              Môn học: <strong>ICT3.005 Web Application Development</strong>
            </p>
            <p className="text-xs text-slate-400">
              Đại học Khoa học và Công nghệ Hà Nội (USTH)
            </p>
            <button
              onClick={onOpenPMS}
              className="mt-2 text-xs text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 block"
            >
              Truy cập Hệ thống Quản trị Lễ tân (PMS) →
            </button>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 Lumière Grand Resort & Spa. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Xây dựng với</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>chuẩn Fullstack tinh gọn cho Đồ án USTH</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
