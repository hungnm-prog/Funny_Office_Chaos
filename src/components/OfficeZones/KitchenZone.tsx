import React from 'react';
import { DINING_TABLES } from '../../constants/officeLayout';
import type { Seat } from '../../types/game';
import { Coffee, Refrigerator, Zap } from 'lucide-react';

interface KitchenZoneProps {
  onSeatClick: (seat: Seat) => void;
  occupiedSeats: Record<string, string>;
}

export const KitchenZone: React.FC<KitchenZoneProps> = ({ onSeatClick, occupiedSeats }) => {
  return (
    <div
      className="absolute tile-floor-canteen rounded-3xl border-4 border-emerald-800/80 shadow-2xl overflow-hidden select-none"
      style={{
        left: 80,
        top: 980,
        width: 1120,
        height: 680,
      }}
    >
      {/* 2D NORTH CANTEEN WALL WITH MENU BOARD & CAFE SIGN */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#022c22] to-[#064e3b] border-b-4 border-[#047857] flex items-center justify-between px-6 z-10 shadow-md">
        {/* Room Header Sign */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-lg bg-emerald-950 border-2 border-emerald-500/70 shadow-lg flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black tracking-wider text-white uppercase font-mono">
              🍽️ KHU BẾP & CĂN TIN • 3 BÀN ĂN (24 CHỖ NGỒI)
            </span>
          </div>

          {/* Chalkboard Lunch Specials */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-black/60 border border-emerald-600/60 text-[10px] text-amber-300 font-mono">
            <span>📋 Thực Đơn Hôm Nay:</span>
            <span className="text-white font-bold">Cơm Bento Nhật 🍱 • Ramen Bò 🍜 • Trà Sữa 🧋</span>
          </div>
        </div>

        {/* Canteen Occupancy Counter */}
        <div className="flex items-center gap-2 bg-emerald-950/90 px-3.5 py-1.5 rounded-xl border border-emerald-500/50 text-xs">
          <span className="text-emerald-300 font-medium">Đang dùng bữa:</span>
          <span className="font-mono font-black text-amber-400">
            {Object.keys(occupiedSeats).filter((k) => k.startsWith('dining-')).length} / 24
          </span>
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        </div>
      </div>

      {/* 2D KITCHEN BUFFET COUNTER & APPLIANCES (Top Section y: 72px - 140px) */}
      <div className="absolute top-20 left-6 right-6 h-18 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 rounded-2xl border-2 border-emerald-600/70 p-3 flex items-center justify-between shadow-xl game-prop-shadow z-0">
        <div className="flex items-center gap-5">
          {/* 1. Double Door Smart Refrigerator */}
          <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-cyan-500/50 shadow">
            <div className="relative">
              <Refrigerator className="w-5 h-5 text-cyan-400" />
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full absolute -top-0.5 -right-0.5 animate-ping" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-cyan-200 block">Tủ Lạnh Đồ Uống</span>
              <span className="text-[8px] text-slate-400">Trà xanh, kem, nước ép 🧃</span>
            </div>
          </div>

          {/* 2. Italian Espresso Coffee Machine */}
          <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-amber-500/50 shadow">
            <div className="relative">
              <Coffee className="w-5 h-5 text-amber-400" />
              {/* Animated Steam */}
              <span className="absolute -top-2 left-1 text-[8px] animate-steam pointer-events-none text-amber-200">
                ~
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-200 block">Máy Pha Espresso</span>
              <span className="text-[8px] text-amber-400">Capuchino & Latte ☕</span>
            </div>
          </div>

          {/* 3. Dual Microwave Station */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-emerald-500/50 shadow">
            <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
            <div>
              <span className="text-[10px] font-bold text-emerald-200 block">Lò Vi Sóng Nóng</span>
              <span className="text-[8px] text-slate-400">Hâm đồ ăn trưa 🍲</span>
            </div>
          </div>

          {/* 4. Pastry & Snack Display */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-900/40 border border-emerald-700/60 text-xs text-emerald-200">
            <span>🥐 Bánh sừng bò, bánh su kem & trái cây tươi miễn phí 🍇</span>
          </div>
        </div>

        {/* Free Snack Badge */}
        <div className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-900/80 px-2.5 py-1 rounded-lg border border-emerald-600/60 flex items-center gap-1.5">
          <span>🥗 BUFFET BAR</span>
        </div>
      </div>

      {/* 2D RECYCLING & ORGANIC TRASH BINS (Bottom Left) */}
      <div className="absolute bottom-4 left-6 flex items-center gap-2 pointer-events-none">
        <div className="w-7 h-9 bg-emerald-800 rounded-t-lg border border-emerald-600 flex flex-col items-center justify-center text-[10px] shadow">
          ♻️
        </div>
        <div className="w-7 h-9 bg-blue-800 rounded-t-lg border border-blue-600 flex flex-col items-center justify-center text-[10px] shadow">
          🥫
        </div>
        <div className="w-7 h-9 bg-amber-800 rounded-t-lg border border-amber-600 flex flex-col items-center justify-center text-[10px] shadow">
          🍱
        </div>
      </div>

      {/* 3 LARGE 2D DINING TABLES (EACH TABLE HAS 8 CHAIRS = 24 CHAIRS) */}
      <div className="absolute inset-x-6 top-44 bottom-6 flex justify-around items-center">
        {DINING_TABLES.map((table) => {
          const topSeats = table.seats.slice(0, 4);
          const bottomSeats = table.seats.slice(4, 8);

          return (
            <div
              key={table.id}
              className="relative flex flex-col items-center"
              style={{ width: 280 }}
            >
              {/* TOP ROW: 4 DINING CHAIRS */}
              <div className="flex items-center justify-around w-full mb-1">
                {topSeats.map((seat, i) => {
                  const isOccupied = !!occupiedSeats[seat.id];
                  const occupantName = occupiedSeats[seat.id];

                  return (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() => onSeatClick(seat)}
                      title={
                        isOccupied
                          ? `Đang ngồi: ${occupantName}`
                          : `Ghế trống: ${seat.label} - Nhấp để ngồi ăn`
                      }
                      className={`relative w-11 h-11 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer group shadow ${
                        isOccupied
                          ? 'bg-emerald-950 border-2 border-emerald-500 scale-105'
                          : 'bg-slate-800/90 hover:bg-emerald-600 border-2 border-slate-600 hover:border-emerald-400 hover:scale-110 active:scale-95'
                      }`}
                    >
                      {/* Wooden Chair Back */}
                      <span className="text-xs">🪑</span>
                      <span
                        className={`w-2 h-2 rounded-full absolute -top-1 -right-1 border border-slate-900 ${
                          isOccupied ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                        }`}
                      />
                      {/* Hover Label */}
                      <span className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-500 whitespace-nowrap pointer-events-none z-20 shadow-xl">
                        {isOccupied ? occupantName : `Ghế #${i + 1}`}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* 2D SOLID WOOD FARMHOUSE DINING TABLE WITH FOOD & BEVERAGES */}
              <div
                className="relative w-full h-24 rounded-2xl border-4 border-[#78350f] shadow-2xl flex flex-col justify-between p-2.5 game-prop-shadow"
                style={{
                  background: 'linear-gradient(180deg, #b45309 0%, #92400e 50%, #78350f 100%)',
                }}
              >
                {/* Tabletop Runner Cloth (Khăn trải bàn giữa) */}
                <div className="absolute inset-x-3 top-2 bottom-2 bg-emerald-900/60 border-y border-emerald-500/40 rounded-lg flex items-center justify-between px-3 pointer-events-none">
                  {/* Table Delicacies & Props */}
                  <span className="text-base filter drop-shadow" title="Mì Ramen nóng hổi">🍜</span>
                  <span className="text-base filter drop-shadow" title="Đĩa Sushi tổng hợp">🍣</span>
                  <span className="text-base filter drop-shadow" title="Bánh Sandwich bò">🥪</span>
                  <span className="text-base filter drop-shadow" title="Trà sữa trân châu">🧋</span>
                  <span className="text-base filter drop-shadow" title="Đĩa hoa quả tươi">🍇</span>
                </div>

                {/* Table Number Plate */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-amber-950/90 border border-amber-600/80 text-[10px] font-black text-amber-200 font-mono shadow">
                    BÀN ĂN 0{table.tableNumber}
                  </span>
                  <span className="text-[9px] font-bold text-amber-100/90 font-mono bg-black/40 px-1.5 py-0.2 rounded">
                    8 Chỗ Ngồi
                  </span>
                </div>

                <div className="relative z-10 flex items-center justify-between text-[9px] text-amber-200 font-medium">
                  <span>🍽️ Bữa trưa vui vẻ</span>
                  <span>🍵 Trà xanh nóng</span>
                </div>
              </div>

              {/* BOTTOM ROW: 4 DINING CHAIRS */}
              <div className="flex items-center justify-around w-full mt-1">
                {bottomSeats.map((seat, i) => {
                  const isOccupied = !!occupiedSeats[seat.id];
                  const occupantName = occupiedSeats[seat.id];

                  return (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() => onSeatClick(seat)}
                      title={
                        isOccupied
                          ? `Đang ngồi: ${occupantName}`
                          : `Ghế trống: ${seat.label} - Nhấp để ngồi ăn`
                      }
                      className={`relative w-11 h-11 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer group shadow ${
                        isOccupied
                          ? 'bg-emerald-950 border-2 border-emerald-500 scale-105'
                          : 'bg-slate-800/90 hover:bg-emerald-600 border-2 border-slate-600 hover:border-emerald-400 hover:scale-110 active:scale-95'
                      }`}
                    >
                      <span className="text-xs">🪑</span>
                      <span
                        className={`w-2 h-2 rounded-full absolute -top-1 -right-1 border border-slate-900 ${
                          isOccupied ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                        }`}
                      />
                      <span className="absolute -bottom-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-500 whitespace-nowrap pointer-events-none z-20 shadow-xl">
                        {isOccupied ? occupantName : `Ghế #${i + 5}`}
                      </span>
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
