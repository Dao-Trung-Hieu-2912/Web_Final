import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar, Sparkles, BookOpen, TrendingUp, Users, Bed, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { api, formatVND } from '../services/api';
import InteractiveTimeline from '../components/pms/InteractiveTimeline';
import HousekeepingBoard from '../components/pms/HousekeepingBoard';
import BookingsManager from '../components/pms/BookingsManager';
import FolioModal from '../components/pms/FolioModal';

export default function PMSAdmin() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'timeline', 'housekeeping', 'bookings'
  const [stats, setStats] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingForFolio, setSelectedBookingForFolio] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, roomsRes, bookingsRes] = await Promise.all([
        api.getDashboardStats(),
        api.getRooms(),
        api.getBookings()
      ]);
      setStats(statsRes.data);
      setRooms(roomsRes.data || []);
      setBookings(bookingsRes.data || []);
    } catch (err) {
      console.error('Lỗi tải dữ liệu PMS:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* Top Banner / Breadcrumb */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase tracking-widest mb-1">
              <span>Hệ Thống Quản Trị Khách Sạn (Property Management System)</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold">Bảng Quản Trị Lễ Tân & Buồng Phòng</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Làm mới dữ liệu</span>
            </button>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Máy chủ SQLite Live</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="max-w-7xl mx-auto mt-6 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'dashboard', label: 'Tổng Quan (KPIs)', icon: LayoutDashboard },
            { id: 'timeline', label: 'Lịch Ma Trận Buồng Phòng', icon: Calendar },
            { id: 'housekeeping', label: 'Quản Lý Buồng Phòng', icon: Sparkles },
            { id: 'bookings', label: 'Danh Sách Đặt Phòng', icon: BookOpen }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Card 1: Occupancy Rate */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tỷ Lệ Lấp Đầy Phòng</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">{stats.occupancyRate}%</span>
                  <span className="text-xs text-slate-500">công suất phòng</span>
                </div>
                <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${stats.occupancyRate}%` }}
                  />
                </div>
              </div>

              {/* Card 2: Available Rooms */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phòng Sẵn Sàng (Clean)</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-600">{stats.availableRooms}</span>
                  <span className="text-xs text-slate-500">/ {stats.totalRooms} tổng số phòng</span>
                </div>
                <p className="mt-3 text-[11px] text-slate-400">Đã vệ sinh sạch sẽ, sẵn sàng đón khách mới</p>
              </div>

              {/* Card 3: Guests Occupied & Dirty */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Khách Đang Ở / Cần Dọn</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Bed className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-3">
                  <div>
                    <span className="text-2xl font-black text-rose-600">{stats.occupiedRooms}</span>
                    <span className="text-[11px] text-slate-500 block">Đang ở</span>
                  </div>
                  <div className="border-l border-slate-200 pl-3">
                    <span className="text-2xl font-black text-amber-600">{stats.dirtyRooms}</span>
                    <span className="text-[11px] text-slate-500 block">Cần dọn</span>
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-slate-400">{stats.maintenanceRooms} phòng đang bảo trì kỹ thuật</p>
              </div>

              {/* Card 4: Revenue */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Doanh Thu Ghi Nhận</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-black text-slate-900">{formatVND(stats.revenue.total)}</span>
                </div>
                <div className="mt-3 flex justify-between text-[11px] text-slate-500">
                  <span>Phụ thu Minibar:</span>
                  <strong>{formatVND(stats.revenue.services)}</strong>
                </div>
              </div>

            </div>

            {/* Quick Timeline Preview */}
            <InteractiveTimeline
              onSelectBooking={(b) => setSelectedBookingForFolio(b.id)}
            />

            {/* Housekeeping Quick View */}
            <HousekeepingBoard
              rooms={rooms}
              onRoomUpdated={fetchData}
            />
          </div>
        )}

        {/* TAB 2: TIMELINE TAPE CHART */}
        {activeTab === 'timeline' && (
          <InteractiveTimeline
            onSelectBooking={(b) => setSelectedBookingForFolio(b.id)}
          />
        )}

        {/* TAB 3: HOUSEKEEPING BOARD */}
        {activeTab === 'housekeeping' && (
          <HousekeepingBoard
            rooms={rooms}
            onRoomUpdated={fetchData}
          />
        )}

        {/* TAB 4: BOOKINGS MANAGER */}
        {activeTab === 'bookings' && (
          <BookingsManager
            bookings={bookings}
            onBookingUpdated={fetchData}
          />
        )}

      </main>

      {/* Folio Modal if opened from timeline */}
      {selectedBookingForFolio && (
        <FolioModal
          bookingId={selectedBookingForFolio}
          onClose={() => setSelectedBookingForFolio(null)}
          onCheckOutComplete={() => {
            setSelectedBookingForFolio(null);
            fetchData();
          }}
        />
      )}

    </div>
  );
}
