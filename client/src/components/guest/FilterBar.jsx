import React from 'react';
import { SlidersHorizontal, Sparkles, X } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'Tất cả hạng phòng' },
  { id: 'deluxe', label: 'Deluxe Suite' },
  { id: 'suite', label: 'Executive Suite' },
  { id: 'penthouse', label: 'Imperial Penthouse' },
  { id: 'superior', label: 'Premier Superior' },
  { id: 'standard', label: 'Classic Studio' }
];

export default function FilterBar({ filters, setFilters, totalRooms, onReset }) {
  const isFiltered = filters.type !== 'all' || filters.capacity !== '' || filters.sort !== 'default';

  return (
    <div className="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilters(prev => ({ ...prev, type: cat.id }))}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  filters.type === cat.id
                    ? 'bg-slate-900 text-amber-400 shadow-md shadow-slate-900/10'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Right Controls: Sort & Reset */}
          <div className="flex items-center justify-between md:justify-end gap-3">
            <span className="text-xs sm:text-sm font-medium text-slate-500">
              Tìm thấy <strong className="text-slate-900">{totalRooms}</strong> phòng phù hợp
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm">
              <span className="text-slate-400 hidden sm:inline">Sắp xếp:</span>
              <select
                value={filters.sort || 'default'}
                onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                className="bg-slate-100 border border-slate-200 text-slate-800 text-xs sm:text-sm font-medium rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="default">Phổ biến nhất</option>
                <option value="price_asc">Giá: Thấp đến Cao</option>
                <option value="price_desc">Giá: Cao đến Thấp</option>
                <option value="size_desc">Diện tích phòng lớn nhất</option>
              </select>
            </div>

            {/* Reset Filters */}
            {isFiltered && (
              <button
                onClick={onReset}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Xóa lọc</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
