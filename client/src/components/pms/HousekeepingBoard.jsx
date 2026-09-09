import React, { useState } from 'react';
import { Sparkles, CheckCircle, AlertTriangle, Wrench, Bed, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

export default function HousekeepingBoard({ rooms, onRoomUpdated }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusChange = async (roomId, newStatus) => {
    setUpdatingId(roomId);
    try {
      await api.updateRoomStatus(roomId, newStatus);
      if (onRoomUpdated) onRoomUpdated();
    } catch (err) {
      alert(err.message || 'Lỗi cập nhật trạng thái phòng');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRooms = filterStatus === 'all'
    ? rooms
    : rooms.filter(r => r.status === filterStatus);

  const getStatusCardStyle = (status) => {
    switch (status) {
      case 'available':
        return {
          badge: 'Sẵn sàng đón khách (Clean)',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          borderColor: 'border-emerald-200 hover:border-emerald-400',
          dot: 'bg-emerald-500'
        };
      case 'occupied':
        return {
          badge: 'Đang có khách lưu trú',
          badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
          borderColor: 'border-rose-200 hover:border-rose-400',
          dot: 'bg-rose-500'
        };
      case 'dirty':
        return {
          badge: 'Cần dọn dẹp (Dirty)',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
          borderColor: 'border-amber-200 hover:border-amber-400',
          dot: 'bg-amber-500'
        };
      case 'maintenance':
        return {
          badge: 'Đang bảo trì / Sửa chữa',
          badgeColor: 'bg-slate-200 text-slate-800 border-slate-400',
          borderColor: 'border-slate-300 hover:border-slate-500',
          dot: 'bg-slate-500'
        };
      default:
        return {
          badge: status,
          badgeColor: 'bg-slate-100 text-slate-700',
          borderColor: 'border-slate-200',
          dot: 'bg-slate-400'
        };
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="font-serif text-xl font-bold text-slate-900">Quản Lý Buồng Phòng (Housekeeping Board)</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cập nhật trạng thái vệ sinh phòng theo thời gian thực để lễ tân xếp phòng chính xác.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-100 p-1 rounded-2xl">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'available', label: 'Sẵn sàng' },
            { id: 'occupied', label: 'Đang ở' },
            { id: 'dirty', label: 'Cần dọn' },
            { id: 'maintenance', label: 'Bảo trì' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                filterStatus === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Room Status Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRooms.map((room) => {
          const style = getStatusCardStyle(room.status);
          const isUpdating = updatingId === room.id;

          return (
            <div
              key={room.id}
              className={`p-4 rounded-2xl border ${style.borderColor} bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-lg font-black text-slate-900">
                    Phòng {room.room_number}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-600">
                    Tầng {room.floor}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-700 truncate">{room.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5 truncate">{room.bed_type}</div>

                <div className="mt-3 flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${style.badgeColor}`}>
                    {style.badge}
                  </span>
                </div>
              </div>

              {/* Action Buttons for Housekeeping Staff */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                {room.status === 'dirty' && (
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange(room.id, 'available')}
                    className="flex-1 py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Đã dọn sạch</span>
                  </button>
                )}

                {room.status === 'available' && (
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange(room.id, 'dirty')}
                    className="flex-1 py-1.5 px-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-colors"
                  >
                    Yêu cầu dọn
                  </button>
                )}

                {room.status !== 'maintenance' ? (
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange(room.id, 'maintenance')}
                    className="py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
                    title="Chuyển sang bảo trì"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange(room.id, 'available')}
                    className="flex-1 py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Hoàn tất bảo trì
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
