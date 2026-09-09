import React, { useState, useEffect } from 'react';
import { X, Plus, Coffee, Check, AlertCircle } from 'lucide-react';
import { api, formatVND } from '../../services/api';

export default function AddServiceModal({ booking, onClose, onSuccess }) {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getServices().then(res => {
      setServices(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedServiceId(res.data[0].id);
      }
    }).catch(err => console.error(err));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!selectedServiceId) return;

    setLoading(true);
    setError('');

    try {
      await api.addServiceToBooking(booking.id, selectedServiceId, Number(quantity));
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Lỗi thêm dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find(s => s.id === Number(selectedServiceId));
  const subtotal = selectedService ? selectedService.price * quantity : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
        
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-lg font-bold">Thêm Minibar & Dịch Vụ</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleAdd} className="p-6 space-y-4">
          <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900">
            Khách: <strong>{booking.guest_name}</strong> • Phòng <strong>{booking.room_number}</strong>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Chọn đồ uống / Dịch vụ
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {services.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} — {formatVND(s.price)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Số lượng
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl bg-slate-100 font-bold hover:bg-slate-200 text-slate-700"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center py-2 border border-slate-200 rounded-xl font-bold"
              />
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-xl bg-slate-100 font-bold hover:bg-slate-200 text-slate-700"
              >
                +
              </button>
            </div>
          </div>

          {/* Subtotal preview */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sm">
            <span className="text-slate-500">Thành tiền phụ thu:</span>
            <strong className="text-base font-black text-amber-600">{formatVND(subtotal)}</strong>
          </div>

          {error && <div className="text-xs text-rose-600">{error}</div>}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600"
            >
              Đóng
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-md"
            >
              {loading ? 'Đang thêm...' : 'Xác nhận thêm'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
