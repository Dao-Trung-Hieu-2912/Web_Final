import React from 'react';
import { Hotel, LayoutDashboard, Search, Sparkles, Activity, ShieldCheck } from 'lucide-react';

export default function Navbar({ activePortal, setActivePortal, onOpenLookup, onOpenBenchmark }) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Hotel Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActivePortal('guest')}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 flex items-center justify-center shadow-md shadow-amber-500/20 text-slate-950 font-bold">
              <Hotel className="w-7 h-7 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif tracking-wider text-xl font-bold text-amber-400">LUMIÈRE</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold tracking-wide uppercase">
                  5-Star Luxury
                </span>
              </div>
              <p className="text-xs text-slate-400 tracking-widest uppercase">Grand Resort & Spa — PMS</p>
            </div>
          </div>

          {/* Portal Switcher (Guest Portal vs PMS Receptionist) */}
          <div className="hidden md:flex items-center bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80 shadow-inner">
            <button
              onClick={() => setActivePortal('guest')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                activePortal === 'guest'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold shadow-md shadow-amber-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Khách Đặt Phòng</span>
            </button>

            <button
              onClick={() => setActivePortal('pms')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                activePortal === 'pms'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-md shadow-blue-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Quản Trị Lễ Tân (PMS)</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Tra cứu đơn đặt phòng */}
            <button
              onClick={onOpenLookup}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-medium transition-all"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Tra cứu đơn</span>
            </button>

            {/* Nút Benchmark & Stress Test (USTH Advanced) */}
            <button
              onClick={onOpenBenchmark}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs sm:text-sm font-semibold transition-all"
              title="Đo lường hiệu năng & Kiểm thử tải USTH Advanced"
            >
              <Activity className="w-4 h-4 animate-pulse" />
              <span className="hidden md:inline">USTH Benchmark</span>
            </button>

            {/* Mobile Portal Switch button */}
            <button
              onClick={() => setActivePortal(activePortal === 'guest' ? 'pms' : 'guest')}
              className="md:hidden flex items-center justify-center p-2 rounded-xl bg-slate-800 text-amber-400 border border-slate-700"
            >
              {activePortal === 'guest' ? <LayoutDashboard className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
