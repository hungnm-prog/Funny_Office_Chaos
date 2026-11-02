import React from 'react';
import type { Seat } from '../../types/game';
import { SKY_LOUNGE_SEATS } from '../../constants/officeLayout';
import { Sparkles, Wine, Waves, Telescope, Music } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SkyLoungeZoneProps {
  onSeatClick: (seat: Seat) => void;
  occupiedSeats: Record<string, string>;
  onTriggerEvent: (title: string, message: string) => void;
}

export const SkyLoungeZone: React.FC<SkyLoungeZoneProps> = React.memo(({
  onSeatClick,
  occupiedSeats,
  onTriggerEvent,
}) => {
  const handleOrderCocktail = () => {
    const drinks = [
      'Cosmic Blue Starlight 🍸',
      'Galaxy Mojito Bạc Hà 🍹',
      'Sunset Cloud Martini 🍷',
      'Neon Aurora Champagne 🥂',
    ];
    const drink = drinks[Math.floor(Math.random() * drinks.length)];
    onTriggerEvent('🍸 Thưởng Thức Cocktail Không Gian', `Bạn vừa nhận một ly ${drink} hảo hạng tại Sky Bar Tầng 99!`);
    try {
      confetti({ particleCount: 35, spread: 60, origin: { x: 0.35, y: 0.4 } });
    } catch {}
  };

  const handleStargaze = () => {
    const stars = [
      'Chòm Sao Đại Hùng Tinh 🌌',
      'Thiên Hà Tiên Nữ Andromeda ✨',
      'Sao Hỏa Đỏ Rực Rỡ 🪐',
      'Vệt Sao Băng May Mắn Vừa Bay Qua 🌠',
    ];
    const star = stars[Math.floor(Math.random() * stars.length)];
    onTriggerEvent('🔭 Ngắm Kính Thiên Văn Vũ Trụ', `Qua ống kính viễn vọng, bạn quan sát thấy ${star}! Tuyệt đẹp!`);
    try {
      confetti({ particleCount: 40, spread: 70, origin: { x: 0.5, y: 0.25 } });
    } catch {}
  };

  const handlePlayMusic = () => {
    onTriggerEvent('🎶 Đêm Nhạc Acoustic Hoàng Hôn', `Tiếng đàn piano và guitar du dương ngân vang giữa bầu trời đêm lãng mạn! 🎹🎸`);
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* ========================================================= */}
      {/* 1. SKYLINE COCKTAIL BAR (TOP-LEFT SECTION) */}
      {/* ========================================================= */}
      <div
        className="absolute rounded-3xl border-4 border-cyan-500/60 shadow-2xl overflow-hidden pointer-events-auto"
        style={{
          left: 380,
          top: 320,
          width: 540,
          height: 280,
          background: 'linear-gradient(135deg, rgba(8, 47, 73, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8), 0 0 40px rgba(6, 182, 212, 0.25)',
        }}
      >
        {/* Bar Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-cyan-700/60 bg-cyan-950/80">
          <div className="flex items-center gap-2.5">
            <Wine className="w-5 h-5 text-cyan-300" />
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                🍸 QUẦY BAR COCKTAIL VŨ TRỤ
              </h3>
              <p className="text-[10px] text-cyan-300">Pha chế thượng hạng trên tầng mây</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOrderCocktail}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-black shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Gọi Cocktail
          </button>
        </div>

        {/* Illuminated Neon Bar Counter */}
        <div className="relative mx-6 mt-4 h-24 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border-2 border-cyan-400/50 flex items-center justify-around px-6 shadow-inner">
          <span className="text-2xl filter drop-shadow">🍾</span>
          <span className="text-2xl filter drop-shadow">🍸</span>
          <span className="text-2xl filter drop-shadow">🍹</span>
          <span className="text-2xl filter drop-shadow">🍷</span>
          <span className="text-2xl filter drop-shadow">🥂</span>
          <div className="absolute -bottom-1 inset-x-8 h-1 bg-cyan-400 blur-sm" />
        </div>

        {/* 4 Cocktail Bar Stools */}
        <div className="flex justify-around px-8 mt-4">
          {SKY_LOUNGE_SEATS.slice(0, 4).map((seat) => {
            const isOcc = !!occupiedSeats[seat.id];
            const occName = occupiedSeats[seat.id];

            return (
              <button
                key={seat.id}
                type="button"
                onClick={() => onSeatClick(seat)}
                title={isOcc ? `Đang ngồi uống: ${occName}` : `${seat.label} - Nhấp để ngồi uống nước`}
                className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer shadow-xl ${
                  isOcc
                    ? 'bg-cyan-500 text-slate-950 font-black border-2 border-white scale-105'
                    : 'bg-slate-900/90 hover:bg-cyan-600 text-cyan-200 hover:text-white border-2 border-cyan-500/50 hover:scale-110 active:scale-95'
                }`}
              >
                <span className="text-sm">🍸</span>
                <span className="text-[8px] font-bold mt-0.5">{seat.label.slice(-1)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. INFINITY CLOUD POOL (TOP-RIGHT SECTION) */}
      {/* ========================================================= */}
      <div
        className="absolute rounded-3xl border-4 border-sky-500/60 shadow-2xl overflow-hidden pointer-events-auto"
        style={{
          left: 1540,
          top: 300,
          width: 700,
          height: 320,
          background: 'linear-gradient(135deg, rgba(12, 74, 110, 0.95) 0%, rgba(3, 105, 161, 0.9) 100%)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8), 0 0 50px rgba(14, 165, 233, 0.3)',
        }}
      >
        {/* Pool Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-sky-400/50 bg-sky-950/80">
          <div className="flex items-center gap-2.5">
            <Waves className="w-5 h-5 text-sky-300" />
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                🏊 HỒ BƠI VÔ CỰC TRÊN MÂY (INFINITY SKY POOL)
              </h3>
              <p className="text-[10px] text-sky-200">Kính cường lực trong suốt ngắm trọn toàn cảnh</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-sky-200 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/40">
            Nước Ấm 32°C
          </span>
        </div>

        {/* Luminous Pool Basin */}
        <div className="relative mx-6 mt-4 h-36 rounded-2xl bg-gradient-to-b from-sky-400 via-cyan-500 to-blue-700 shadow-inner overflow-hidden border-2 border-white/40 flex items-center justify-center">
          <div className="absolute inset-0 bg-radial from-white/30 via-transparent to-transparent animate-pulse" />
          <span className="text-4xl filter drop-shadow animate-bounce">🛟</span>
          <span className="absolute bottom-3 left-6 text-2xl filter drop-shadow">🌴</span>
          <span className="absolute top-3 right-6 text-2xl filter drop-shadow">🍹</span>
        </div>

        {/* 4 Poolside Sun Loungers */}
        <div className="flex justify-around px-10 mt-3">
          {SKY_LOUNGE_SEATS.slice(4, 8).map((seat) => {
            const isOcc = !!occupiedSeats[seat.id];
            const occName = occupiedSeats[seat.id];

            return (
              <button
                key={seat.id}
                type="button"
                onClick={() => onSeatClick(seat)}
                title={isOcc ? `Đang tắm nắng: ${occName}` : `${seat.label} - Nhấp để ngồi tắm nắng`}
                className={`w-12 h-11 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer shadow-xl ${
                  isOcc
                    ? 'bg-amber-400 text-slate-950 font-black border-2 border-white scale-105'
                    : 'bg-sky-950/90 hover:bg-sky-500 text-sky-200 hover:text-white border-2 border-sky-400/60 hover:scale-110 active:scale-95'
                }`}
              >
                <span className="text-base">🛋️</span>
                <span className="text-[8px] font-bold">{seat.label.slice(-1)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. STARGAZING OBSERVATORY TELESCOPES */}
      {/* ========================================================= */}
      <div
        className="absolute rounded-3xl border-4 border-indigo-500/60 shadow-2xl overflow-hidden pointer-events-auto p-4 flex flex-col items-center justify-between"
        style={{
          left: 1100,
          top: 150,
          width: 220,
          height: 150,
          background: 'linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 30px rgba(99, 102, 241, 0.3)',
        }}
      >
        <div className="flex items-center gap-1.5 text-xs font-black text-indigo-300 font-mono">
          <Telescope className="w-4 h-4 text-indigo-400" />
          <span>KÍNH THIÊN VĂN</span>
        </div>

        <button
          type="button"
          onClick={handleStargaze}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-amber-300" />
          Soi Sao Trời
        </button>

        {/* Telescope Seat */}
        {SKY_LOUNGE_SEATS.slice(8, 9).map((seat) => {
          const isOcc = !!occupiedSeats[seat.id];
          return (
            <button
              key={seat.id}
              type="button"
              onClick={() => onSeatClick(seat)}
              className={`w-full py-1 rounded-xl text-[10px] font-bold ${
                isOcc ? 'bg-amber-400 text-slate-900' : 'bg-slate-800 text-indigo-200 hover:bg-indigo-600 hover:text-white'
              }`}
            >
              {isOcc ? 'Đang ngắm sao' : 'Ngồi Vào Kính'}
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 4. SUNSET ACOUSTIC MUSIC LOUNGE (BOTTOM SECTION) */}
      {/* ========================================================= */}
      <div
        className="absolute rounded-3xl border-4 border-rose-500/60 shadow-2xl overflow-hidden pointer-events-auto"
        style={{
          left: 450,
          top: 1050,
          width: 580,
          height: 320,
          background: 'linear-gradient(135deg, rgba(76, 5, 25, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8), 0 0 45px rgba(244, 63, 94, 0.25)',
        }}
      >
        <div className="flex items-center justify-between px-6 py-3 border-b border-rose-700/60 bg-rose-950/80">
          <div className="flex items-center gap-2.5">
            <Music className="w-5 h-5 text-rose-300" />
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                🎸 SÂN KHẤU ACOUSTIC HOÀNG HÔN
              </h3>
              <p className="text-[10px] text-rose-300">Đêm nhạc lãng mạn ngắm hoàng hôn</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePlayMusic}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white text-xs font-black shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Bật Nhạc 🎶
          </button>
        </div>

        {/* Acoustic Stage */}
        <div className="relative mx-6 mt-4 h-32 rounded-2xl bg-gradient-to-r from-amber-950 via-rose-950 to-amber-950 border-2 border-rose-500/40 p-4 flex items-center justify-around shadow-inner">
          <span className="text-4xl filter drop-shadow">🎹</span>
          <span className="text-4xl filter drop-shadow animate-pulse">🎸</span>
          <span className="text-4xl filter drop-shadow">🎷</span>
          <span className="text-3xl filter drop-shadow">🕯️</span>
        </div>

        {/* 2 Acoustic Sofas */}
        <div className="flex justify-around px-12 mt-3">
          {SKY_LOUNGE_SEATS.slice(10, 12).map((seat) => {
            const isOcc = !!occupiedSeats[seat.id];
            return (
              <button
                key={seat.id}
                type="button"
                onClick={() => onSeatClick(seat)}
                className={`px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold transition-all ${
                  isOcc ? 'bg-amber-400 text-slate-900 shadow-lg' : 'bg-slate-900/90 text-rose-200 border border-rose-600 hover:bg-rose-600 hover:text-white'
                }`}
              >
                <span>🛋️</span>
                <span>{seat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. SECOND ACOUSTIC SOFA LOUNGE (BOTTOM RIGHT) */}
      <div
        className="absolute rounded-3xl border-4 border-amber-500/60 shadow-2xl overflow-hidden pointer-events-auto p-4 flex flex-col justify-between"
        style={{
          left: 1650,
          top: 1080,
          width: 520,
          height: 280,
          background: 'linear-gradient(135deg, rgba(69, 26, 3, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8), 0 0 45px rgba(245, 158, 11, 0.25)',
        }}
      >
        <div className="flex items-center gap-2 border-b border-amber-700/60 pb-2">
          <span className="text-2xl">🔥</span>
          <div>
            <h4 className="text-xs font-black text-amber-200 uppercase font-mono">BẾP LỬA HOÀNG HÔN & RƯỢU VANG</h4>
            <span className="text-[10px] text-amber-400">Ấm cúng giữa trời đêm ngàn sao</span>
          </div>
        </div>

        <div className="flex justify-center my-2">
          <span className="text-4xl animate-bounce">🔥 🍢 🍷</span>
        </div>

        <div className="flex justify-around">
          {SKY_LOUNGE_SEATS.slice(12, 14).map((seat) => {
            const isOcc = !!occupiedSeats[seat.id];
            return (
              <button
                key={seat.id}
                type="button"
                onClick={() => onSeatClick(seat)}
                className={`px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold transition-all ${
                  isOcc ? 'bg-amber-400 text-slate-900 shadow-lg' : 'bg-slate-900/90 text-amber-200 border border-amber-600 hover:bg-amber-600 hover:text-white'
                }`}
              >
                <span>🛋️</span>
                <span>{seat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

SkyLoungeZone.displayName = 'SkyLoungeZone';

