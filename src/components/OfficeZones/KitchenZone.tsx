import React from 'react';
import { DINING_TABLES } from '../../constants/officeLayout';
import type { Seat } from '../../types/game';
import { Utensils, Coffee, Refrigerator, Zap } from 'lucide-react';

interface KitchenZoneProps {
  onSeatClick: (seat: Seat) => void;
  occupiedSeats: Record<string, string>;
}

export const KitchenZone: React.FC<KitchenZoneProps> = ({ onSeatClick, occupiedSeats }) => {
  return (
    <div
      className="absolute rounded-3xl p-6 border-2 border-emerald-700/50 shadow-2xl overflow-hidden"
      style={{
        left: 80,
        top: 980,
        width: 1120,
        height: 680,
        background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
      }}
    >
      {/* Zone Title & Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-emerald-800/80 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              Khu Bếp & Căn Tin Công Sở
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                3 Bàn Ăn Lớn • Mỗi Bàn 8 Chỗ Ngồi (24 Chỗ)
              </span>
            </h3>
            <p className="text-xs text-emerald-200/70">
              Không gian ăn trưa, uống trà sữa, thưởng thức cà phê và giao lưu đồng nghiệp
            </p>
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center gap-2 bg-emerald-950/80 px-4 py-2 rounded-xl border border-emerald-700 text-xs">
          <span className="text-emerald-300">Đang ăn uống:</span>
          <span className="font-bold text-amber-400 font-mono">
            {Object.keys(occupiedSeats).filter((k) => k.startsWith('dining-')).length} / 24
          </span>
        </div>
      </div>

      {/* Kitchen Counter / Bar on the top */}
      <div className="w-full h-16 rounded-2xl bg-gradient-to-r from-emerald-900/90 via-slate-900 to-emerald-900/90 border border-emerald-700/60 p-3 flex items-center justify-between mb-8 shadow-lg">
        <div className="flex items-center gap-6">
          {/* Espresso Machine */}
          <div className="flex items-center gap-2 bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-700/50">
            <Coffee className="w-5 h-5 text-amber-400 animate-bounce" />
            <div>
              <span className="text-xs font-bold text-emerald-200 block">Máy Pha Cà Phê Ý</span>
              <span className="text-[10px] text-emerald-400">Sẵn sàng phục vụ ☕</span>
            </div>
          </div>

          {/* Smart Refrigerator */}
          <div className="flex items-center gap-2 bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-700/50">
            <Refrigerator className="w-5 h-5 text-cyan-400" />
            <div>
              <span className="text-xs font-bold text-emerald-200 block">Tủ Lạnh Đồ Uống</span>
              <span className="text-[10px] text-cyan-300">Trà sữa, nước ngọt, kem 🍦</span>
            </div>
          </div>

          {/* Microwave */}
          <div className="flex items-center gap-2 bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-700/50">
            <Zap className="w-5 h-5 text-amber-300" />
            <div>
              <span className="text-xs font-bold text-emerald-200 block">Lò Vi Sóng Nóng Hổi</span>
              <span className="text-[10px] text-amber-400">Hâm đồ ăn trưa 🍲</span>
            </div>
          </div>
        </div>

        <div className="text-xs font-semibold text-emerald-300 bg-emerald-900/60 px-3 py-1.5 rounded-lg border border-emerald-700">
          🥗 Bánh ngọt, hoa quả & snack miễn phí
        </div>
      </div>

      {/* 3 Large Dining Tables - each has 8 seats */}
      <div className="grid grid-cols-3 gap-6 pt-4">
        {DINING_TABLES.map((table) => {
          const topSeats = table.seats.slice(0, 4);
          const bottomSeats = table.seats.slice(4, 8);

          return (
            <div
              key={table.id}
              className="flex flex-col items-center p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 relative"
            >
              <div className="text-xs font-bold text-emerald-300 mb-2 flex items-center gap-2">
                <span>Bàn Ăn 0{table.tableNumber}</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-700">
                  8 Ghế
                </span>
              </div>

              {/* 4 Top Seats */}
              <div className="flex justify-between w-full px-4 mb-2">
                {topSeats.map((seat) => {
                  const isOcc = !!occupiedSeats[seat.id];
                  const occName = occupiedSeats[seat.id];
                  return (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() => onSeatClick(seat)}
                      className={`w-9 h-9 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer group ${
                        isOcc
                          ? 'bg-amber-600 border-2 border-amber-300 shadow-md'
                          : 'bg-emerald-800 hover:bg-emerald-600 border border-emerald-500 hover:scale-110 shadow'
                      }`}
                      title={isOcc ? `Đang ngồi: ${occName}` : `${seat.label} - Bấm để ngồi ăn`}
                    >
                      <span className="w-5 h-2 rounded-t-full bg-emerald-950/50 mb-0.5" />
                      <span className="text-[9px] font-bold text-white">
                        {seat.label.split('Ghế ')[1]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Wooden Dining Table Surface */}
              <div className="w-full h-24 rounded-2xl bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 border-4 border-amber-900 shadow-xl flex items-center justify-around px-4 relative">
                <span className="text-xl drop-shadow" title="Cơm Văn Phòng">
                  🍱
                </span>
                <span className="text-xl drop-shadow" title="Trà Sữa Trân Châu">
                  🧋
                </span>
                <span className="text-xl drop-shadow" title="Dĩa Hoa Quả">
                  🍉
                </span>
                <span className="text-xl drop-shadow" title="Bánh Ngọt">
                  🍰
                </span>
                <span className="text-xl drop-shadow" title="Trà Nóng">
                  🍵
                </span>

                <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-amber-900/30" />
              </div>

              {/* 4 Bottom Seats */}
              <div className="flex justify-between w-full px-4 mt-2">
                {bottomSeats.map((seat) => {
                  const isOcc = !!occupiedSeats[seat.id];
                  const occName = occupiedSeats[seat.id];
                  return (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() => onSeatClick(seat)}
                      className={`w-9 h-9 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer group ${
                        isOcc
                          ? 'bg-amber-600 border-2 border-amber-300 shadow-md'
                          : 'bg-emerald-800 hover:bg-emerald-600 border border-emerald-500 hover:scale-110 shadow'
                      }`}
                      title={isOcc ? `Đang ngồi: ${occName}` : `${seat.label} - Bấm để ngồi ăn`}
                    >
                      <span className="text-[9px] font-bold text-white mb-0.5">
                        {seat.label.split('Ghế ')[1]}
                      </span>
                      <span className="w-5 h-2 rounded-b-full bg-emerald-950/50" />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
