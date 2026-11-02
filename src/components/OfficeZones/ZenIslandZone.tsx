import React from 'react';
import type { Seat } from '../../types/game';
import { ZEN_ISLAND_SEATS } from '../../constants/officeLayout';
import { Sparkles, Flower2, Coffee, Waves } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ZenIslandZoneProps {
  onSeatClick: (seat: Seat) => void;
  occupiedSeats: Record<string, string>;
  onTriggerEvent: (title: string, message: string) => void;
}

export const ZenIslandZone: React.FC<ZenIslandZoneProps> = ({
  onSeatClick,
  occupiedSeats,
  onTriggerEvent,
}) => {
  const handleDrinkTea = () => {
    onTriggerEvent(
      '🍵 Thưởng Thức Trà Đạo Matcha',
      'Một chén trà xanh Matcha Uji thơm ngát xua tan mọi mỏi mệt công sở, tâm hồn tĩnh lặng như mặt hồ! ✨'
    );
    try {
      confetti({ particleCount: 40, spread: 60, origin: { x: 0.35, y: 0.5 } });
    } catch {}
  };

  const handleMeditate = () => {
    onTriggerEvent(
      '🧘 Thiền Định Tĩnh Tâm Vườn Đá',
      'Tiếng chuông xoay Tây Tạng ngân vang... Bạn bước vào trạng thái thiền định thanh tịnh, tái tạo 100% năng lượng! 🌸'
    );
    try {
      confetti({ particleCount: 45, spread: 70, origin: { x: 0.5, y: 0.55 } });
    } catch {}
  };

  const handleOnsen = () => {
    onTriggerEvent(
      '🌊 Ngâm Suối Nước Nóng Onsen',
      'Làn nước khoáng nóng thiên nhiên 40°C bốc khói mờ ảo làm thư giãn toàn bộ gân cốt và tinh thần! ♨️'
    );
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* ========================================================= */}
      {/* 1. MOONLIGHT TEA PAVILION (TRÀ THẤT VỌNG NGUYỆT - LEFT) */}
      {/* ========================================================= */}
      <div
        className="absolute rounded-3xl border-4 border-amber-600/70 shadow-2xl overflow-hidden pointer-events-auto p-5 flex flex-col justify-between"
        style={{
          left: 380,
          top: 480,
          width: 440,
          height: 680,
          background: 'linear-gradient(180deg, rgba(69, 26, 3, 0.95) 0%, rgba(20, 20, 20, 0.98) 100%)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.8), 0 0 45px rgba(217, 119, 6, 0.25)',
        }}
      >
        <div className="flex items-center justify-between border-b border-amber-700/60 pb-3">
          <div className="flex items-center gap-2.5">
            <Coffee className="w-5 h-5 text-amber-300" />
            <div>
              <h4 className="text-xs font-black text-white uppercase font-mono">
                🍵 TRÀ THẤT VỌNG NGUYỆT
              </h4>
              <span className="text-[10px] text-amber-300">Nghệ thuật trà đạo & bánh wagashi truyền thống</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDrinkTea}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 text-xs font-black shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Pha Trà 🍵
          </button>
        </div>

        {/* Tatami Mat Floor & Tea Service Set */}
        <div className="my-3 h-72 rounded-2xl bg-amber-950/50 border-2 border-amber-700/50 p-4 flex flex-col items-center justify-around shadow-inner">
          <span className="text-4xl filter drop-shadow">🍵 🍡 🫖</span>
          <span className="text-[11px] font-mono font-bold text-amber-200">
            TRÀ ĐẠO MATCHA & BÁNH HOA ANH ĐÀO
          </span>
          <span className="text-3xl filter drop-shadow">🌸 🎋 🏮</span>
        </div>

        {/* 4 Tatami Cushions */}
        <div className="grid grid-cols-2 gap-3">
          {ZEN_ISLAND_SEATS.slice(0, 4).map((seat) => {
            const isOcc = !!occupiedSeats[seat.id];
            const occName = occupiedSeats[seat.id];

            return (
              <button
                key={seat.id}
                type="button"
                onClick={() => onSeatClick(seat)}
                title={isOcc ? `Đang thưởng trà: ${occName}` : `${seat.label} - Nhấp để ngồi uống trà`}
                className={`py-3 rounded-2xl flex flex-col items-center justify-center text-xs font-bold transition-all ${
                  isOcc
                    ? 'bg-amber-500 text-slate-950 font-black border-2 border-white scale-105 shadow-xl'
                    : 'bg-slate-900/90 hover:bg-amber-600 text-amber-200 hover:text-white border-2 border-amber-600/60 hover:scale-105 active:scale-95'
                }`}
              >
                <span className="text-lg">🍵</span>
                <span className="text-[9px] font-mono mt-1">{seat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. ZEN ROCK GARDEN & GIANT SAKURA TREE (CENTER OF ISLAND) */}
      {/* ========================================================= */}
      <div
        className="absolute rounded-[50px] border-4 border-emerald-600/70 shadow-2xl overflow-hidden pointer-events-auto p-6 flex flex-col items-center justify-between"
        style={{
          left: 950,
          top: 550,
          width: 540,
          height: 640,
          background: 'linear-gradient(180deg, rgba(6, 78, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.9), 0 0 50px rgba(16, 185, 129, 0.25)',
        }}
      >
        <div className="flex items-center justify-between w-full border-b border-emerald-700/60 pb-3">
          <div className="flex items-center gap-2">
            <Flower2 className="w-5 h-5 text-pink-400" />
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                🌸 VƯỜN ĐÁ THIỀN & CÂY ANH ĐÀO
              </h3>
              <p className="text-[10px] text-emerald-300">Tĩnh tại tâm hồn giữa ngàn cánh hoa đào rơi</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleMeditate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Tọa Thiền 🧘
          </button>
        </div>

        {/* Ancient Sakura Tree Centerpiece & Zen Sand Garden */}
        <div className="relative w-full h-80 rounded-3xl bg-slate-900/80 border-2 border-emerald-500/40 p-4 flex flex-col items-center justify-center overflow-hidden shadow-inner">
          <span className="text-6xl filter drop-shadow animate-pulse">🌸</span>
          <span className="text-xs font-mono font-bold text-pink-300 mt-2">
            CÂY ANH ĐÀO BỒNG LAI CỔ THỤ
          </span>
          <div className="flex gap-4 text-2xl mt-3 filter drop-shadow">
            <span>🪨</span>
            <span>🎋</span>
            <span>🎐</span>
            <span>🪷</span>
            <span>🪨</span>
          </div>
        </div>

        {/* 4 Meditation Rock Mats */}
        <div className="grid grid-cols-4 gap-2.5 w-full">
          {ZEN_ISLAND_SEATS.slice(4, 8).map((seat) => {
            const isOcc = !!occupiedSeats[seat.id];
            const occName = occupiedSeats[seat.id];

            return (
              <button
                key={seat.id}
                type="button"
                onClick={() => onSeatClick(seat)}
                title={isOcc ? `Đang thiền: ${occName}` : `${seat.label} - Nhấp để ngồi thiền`}
                className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center text-xs font-bold transition-all ${
                  isOcc
                    ? 'bg-emerald-500 text-slate-950 font-black border-2 border-white scale-105 shadow-xl'
                    : 'bg-slate-900/90 hover:bg-emerald-600 text-emerald-200 hover:text-white border-2 border-emerald-600/60 hover:scale-105 active:scale-95'
                }`}
              >
                <span className="text-base">🧘</span>
                <span className="text-[8px] font-mono mt-0.5">{seat.label.split(' - ')[0].slice(-5)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. ONSEN NATURAL HOT SPRINGS (SUỐI NƯỚC NÓNG - RIGHT) */}
      {/* ========================================================= */}
      <div
        className="absolute rounded-3xl border-4 border-cyan-500/70 shadow-2xl overflow-hidden pointer-events-auto p-5 flex flex-col justify-between"
        style={{
          left: 1600,
          top: 480,
          width: 580,
          height: 720,
          background: 'linear-gradient(180deg, rgba(8, 47, 73, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.8), 0 0 50px rgba(6, 182, 212, 0.3)',
        }}
      >
        <div className="flex items-center justify-between border-b border-cyan-700/60 pb-3">
          <div className="flex items-center gap-2.5">
            <Waves className="w-5 h-5 text-cyan-300" />
            <div>
              <h4 className="text-xs font-black text-white uppercase font-mono">
                ♨️ SUỐI KHOÁNG NÓNG ONSEN
              </h4>
              <span className="text-[10px] text-cyan-300">Khoáng nóng tự nhiên phục hồi thể lực</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOnsen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-black shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Ngâm Suối ♨️
          </button>
        </div>

        {/* Steaming Thermal Mineral Basin */}
        <div className="relative my-3 h-80 rounded-2xl bg-gradient-to-b from-cyan-900 via-teal-900 to-cyan-950 border-2 border-cyan-400/50 p-4 flex flex-col items-center justify-center shadow-inner overflow-hidden">
          <div className="absolute inset-0 bg-radial from-cyan-400/20 via-transparent to-transparent animate-pulse" />
          <span className="text-5xl filter drop-shadow animate-bounce">♨️</span>
          <span className="text-xs font-mono font-bold text-cyan-200 mt-2">
            KHOÁNG NƯỚC NÓNG 40°C • BỐC KHÓI TỰ NHIÊN
          </span>
          <div className="flex gap-4 text-2xl mt-4">
            <span className="animate-steam">♨️</span>
            <span className="animate-steam">♨️</span>
            <span className="animate-steam">♨️</span>
          </div>
        </div>

        {/* 4 Onsen Seats */}
        <div className="grid grid-cols-2 gap-3">
          {ZEN_ISLAND_SEATS.slice(8, 12).map((seat) => {
            const isOcc = !!occupiedSeats[seat.id];
            const occName = occupiedSeats[seat.id];

            return (
              <button
                key={seat.id}
                type="button"
                onClick={() => onSeatClick(seat)}
                title={isOcc ? `Đang ngâm suối Onsen: ${occName}` : `${seat.label} - Nhấp để ngồi ngâm suối`}
                className={`py-3 rounded-2xl flex flex-col items-center justify-center text-xs font-bold transition-all ${
                  isOcc
                    ? 'bg-cyan-500 text-slate-950 font-black border-2 border-white scale-105 shadow-xl'
                    : 'bg-slate-900/90 hover:bg-cyan-600 text-cyan-200 hover:text-white border-2 border-cyan-500/50 hover:scale-105 active:scale-95'
                }`}
              >
                <span className="text-lg">♨️</span>
                <span className="text-[9px] font-mono mt-1">{seat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
