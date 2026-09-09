import React, { useState, useEffect } from 'react';
import HeroSection from '../components/guest/HeroSection';
import FilterBar from '../components/guest/FilterBar';
import RoomCard from '../components/guest/RoomCard';
import RoomDetailModal from '../components/guest/RoomDetailModal';
import BookingModal from '../components/guest/BookingModal';
import { api } from '../services/api';
import { Sparkles, Utensils, Waves, Star, Heart, Award, ShieldCheck, Compass } from 'lucide-react';

export default function GuestPortal() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoomForDetail, setSelectedRoomForDetail] = useState(null);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);

  // Search & Filter State
  const [searchParams, setSearchParams] = useState({
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    capacity: '',
    type: 'all',
    sort: 'default'
  });

  // Fetch Rooms from API
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await api.getRooms({
        checkIn: searchParams.checkIn,
        checkOut: searchParams.checkOut,
        capacity: searchParams.capacity,
        type: searchParams.type
      });

      let sorted = [...(res.data || [])];
      if (searchParams.sort === 'price_asc') {
        sorted.sort((a, b) => a.price_per_night - b.price_per_night);
      } else if (searchParams.sort === 'price_desc') {
        sorted.sort((a, b) => b.price_per_night - a.price_per_night);
      } else if (searchParams.sort === 'size_desc') {
        sorted.sort((a, b) => b.size_sqm - a.size_sqm);
      }

      setRooms(sorted);
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [searchParams.type, searchParams.sort, searchParams.capacity]);

  const handleSearch = () => {
    fetchRooms();
    // Scroll to rooms section smoothly
    const element = document.getElementById('rooms-catalog');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSearchParams({
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      capacity: '',
      type: 'all',
      sort: 'default'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1. Hero & Floating Search Bar */}
      <HeroSection
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        onSearch={handleSearch}
      />

      {/* 2. Filter Bar */}
      <FilterBar
        filters={searchParams}
        setFilters={setSearchParams}
        totalRooms={rooms.length}
        onReset={handleResetFilters}
      />

      {/* 3. Rooms Catalog */}
      <section id="rooms-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Danh Mục Phòng Nghỉ</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Không Gian Thượng Lưu Cho Kỳ Nghỉ Hoàn Hảo
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            Mỗi căn phòng tại Lumière được thiết kế mang phong cách kiến trúc mở, tận dụng tối đa ánh sáng tự nhiên và luồng sinh khí từ biển cả.
          </p>
        </div>

        {/* Loading Skeleton or Rooms Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-3xl overflow-hidden border border-slate-200 animate-pulse h-96 flex flex-col justify-between p-6">
                <div className="bg-slate-200 aspect-[16/10] rounded-2xl w-full" />
                <div className="space-y-3 mt-4">
                  <div className="bg-slate-200 h-6 w-3/4 rounded-md" />
                  <div className="bg-slate-200 h-4 w-1/2 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto my-8">
            <Compass className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-slate-800">Không tìm thấy phòng phù hợp</h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">
              Rất tiếc, các phòng trong tiêu chí này đã kín lịch vào khoảng thời gian bạn chọn.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
            >
              Xem tất cả phòng có sẵn
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onSelectRoom={(r) => setSelectedRoomForDetail(r)}
                onBookRoom={(r) => setSelectedRoomForBooking(r)}
              />
            ))}
          </div>
        )}

      </section>

      {/* 4. Luxury Hotel Experiences Section */}
      <section className="bg-slate-900 text-white py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Đặc Quyền Nghỉ Dưỡng</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-2">Dịch Vụ & Tiện Ích Đẳng Cấp 5 Sao</h2>
            <p className="text-sm text-slate-400 mt-3">Hòa mình vào thiên đường nghỉ dưỡng biệt lập với các tiện ích chuẩn quốc tế</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/60 hover:border-amber-500/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
                <Waves className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">Hồ Bơi Vô Cực Trên Cao</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Tầm nhìn 360 độ nối liền chân trời biển. Phục vụ cocktail nhiệt đới và âm nhạc chill-out hoàng hôn mỗi ngày.
              </p>
            </div>

            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/60 hover:border-amber-500/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">Ẩm Thực Chuẩn Michelin</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Nhà hàng hải sản tươi sống và hầm rượu vang chọn lọc, mang tới trải nghiệm mỹ vị khó quên bên tiếng sóng vỗ.
              </p>
            </div>

            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/60 hover:border-amber-500/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">Anantara Spa Trị Liệu</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Liệu trình phục hồi năng lượng cổ truyền kết hợp thảo mộc thiên nhiên, mang lại sự thư thái sâu lắng cho tâm hồn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      {selectedRoomForDetail && (
        <RoomDetailModal
          room={selectedRoomForDetail}
          onClose={() => setSelectedRoomForDetail(null)}
          onBookRoom={(room) => {
            setSelectedRoomForDetail(null);
            setSelectedRoomForBooking(room);
          }}
        />
      )}

      {selectedRoomForBooking && (
        <BookingModal
          room={selectedRoomForBooking}
          initialParams={searchParams}
          onClose={() => setSelectedRoomForBooking(null)}
          onSuccess={() => {
            fetchRooms(); // Refresh rooms list
          }}
        />
      )}
    </div>
  );
}
