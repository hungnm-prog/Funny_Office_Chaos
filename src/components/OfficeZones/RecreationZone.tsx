import React, { useState } from 'react';
import type { Seat } from '../../types/game';
import { RECREATION_AREAS } from '../../constants/officeLayout';
import { Play, Pause, Volume2, VolumeX, Sparkles, Gamepad2, Trophy, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RecreationZoneProps {
  onSeatClick: (seat: Seat) => void;
  occupiedSeats: Record<string, string>;
  onTriggerEvent: (title: string, message: string) => void;
}

export const RecreationZone: React.FC<RecreationZoneProps> = ({
  onSeatClick,
  occupiedSeats,
  onTriggerEvent,
}) => {
  const [cinemaPlaying, setCinemaPlaying] = useState(true);
  const [cinemaMuted, setCinemaMuted] = useState(true);
  const [fishCount, setFishCount] = useState(3);

  const fishingArea = RECREATION_AREAS.find((a) => a.type === 'fishing')!;
  const cinemaArea = RECREATION_AREAS.find((a) => a.type === 'cinema')!;
  const cardsArea = RECREATION_AREAS.find((a) => a.type === 'cards')!;
  const gamingArea = RECREATION_AREAS.find((a) => a.type === 'gaming')!;

  const handleCatchFish = () => {
    const fishTypes = [
      'Cá Chép Vàng Kohaku 🐟',
      'Cá Koi Showa Đỏ Đen 🎏',
      'Cá Koi Ogon Ánh Vàng ✨',
      'Cá Rồng Huyết Long 🐲',
    ];
    const caught = fishTypes[Math.floor(Math.random() * fishTypes.length)];
    setFishCount((c) => c + 1);
    onTriggerEvent('🎣 Câu Cá Thành Công!', `Tuyệt vời! Bạn đã câu được ${caught} tại Hồ Cá Koi Zen!`);
    try {
      confetti({ particleCount: 45, spread: 65, origin: { x: 0.62, y: 0.28 } });
    } catch {}
  };

  const handleDealCards = () => {
    const hands = [
      'Sảnh Rồng 10 lá 🐉 (Thắng Trắng!)',
      'Tứ Quý Át ♠️♥️♦️♣️',
      'Cù Lũ Vua & Đầm 👑',
      'Ba Đôi Thông Chặt Heo ⚡',
    ];
    const hand = hands[Math.floor(Math.random() * hands.length)];
    onTriggerEvent('🃏 Chia Bài Tiến Lên / Poker', `Lên bài cực đẹp: ${hand}! Thắng chắc ván này rồi!`);
    try {
      confetti({ particleCount: 30, spread: 50, origin: { x: 0.62, y: 0.75 } });
    } catch {}
  };

  const handlePlayArcade = (gameName: string) => {
    onTriggerEvent('🎮 Chiến Game Arcade', `Đang combo x99 tại máy ${gameName}! Đạt kỷ lục Highscore mới! 🔥`);
  };

  return (
    <>
      {/* ========================================================= */}
      {/* 1. KHU CÂU CÁ HỒ KOI ZEN (bounds: x: 1300, y: 180, w: 520, h: 660) */}
      {/* ========================================================= */}
      <div
        className="absolute tile-floor-stone rounded-3xl border-4 border-cyan-800/80 shadow-2xl overflow-hidden select-none"
        style={{
          left: fishingArea.x,
          top: fishingArea.y,
          width: fishingArea.width,
          height: fishingArea.height,
        }}
      >
        {/* 2D Zen Garden North Wall with Bamboo Trim */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#082f49] to-[#0c4a6e] border-b-4 border-[#0369a1] flex items-center justify-between px-6 z-10 shadow-md">
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-lg bg-sky-950 border-2 border-cyan-400/70 shadow-lg flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-black tracking-wider text-white uppercase font-mono">
                🎏 HỒ CÁ KOI ZEN • 4 BẾN CÂU
              </span>
            </div>
            <span className="text-xs text-cyan-200 hidden sm:inline">Thư thái tâm trí</span>
          </div>

          <button
            type="button"
            onClick={handleCatchFish}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-black shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border border-cyan-300/40"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Giật Cần ({fishCount} 🐟)
          </button>
        </div>

        {/* Stone Masonry Border around the Pond */}
        <div className="absolute top-22 inset-x-5 bottom-5 rounded-[36px] bg-[#1e293b] border-4 border-[#475569] shadow-2xl p-3 overflow-hidden">
          {/* Deep Crystal Water Pool */}
          <div className="relative w-full h-full rounded-[28px] overflow-hidden shadow-inner border-2 border-cyan-600/40 bg-gradient-to-b from-[#083344] via-[#0e7490] to-[#155e75]">
            {/* Animated Water Caustics & Sunbeams */}
            <div className="absolute inset-0 bg-radial from-cyan-300/15 via-transparent to-transparent animate-pulse pointer-events-none" />

            {/* Natural Pond Rocks & Flora */}
            <span className="absolute top-6 left-8 text-2xl filter drop-shadow">🪨</span>
            <span className="absolute bottom-10 left-12 text-3xl filter drop-shadow">🪨</span>
            <span className="absolute bottom-6 right-8 text-2xl filter drop-shadow">🌿</span>
            <span className="absolute top-20 right-6 text-xl filter drop-shadow">🌿</span>

            {/* Water Lilies / Lotus Flowers */}
            <span className="absolute top-12 left-28 text-3xl filter drop-shadow animate-pulse" title="Hoa Sen Hồng">🪷</span>
            <span className="absolute bottom-16 right-20 text-3xl filter drop-shadow" title="Hoa Sen Trắng">🪷</span>
            <span className="absolute top-36 left-16 text-2xl filter drop-shadow">🪷</span>

            {/* Swimming Koi Fish (Animated) */}
            <div className="absolute top-16 left-36 text-3xl fish-swim-1 pointer-events-none drop-shadow-md">
              🎏
            </div>
            <div className="absolute bottom-20 right-32 text-3xl fish-swim-2 pointer-events-none drop-shadow-md">
              🐟
            </div>
            <div className="absolute top-48 right-16 text-2xl fish-swim-1 pointer-events-none drop-shadow-md opacity-85">
              🐠
            </div>
            <div className="absolute bottom-36 left-48 text-2xl fish-swim-2 pointer-events-none drop-shadow-md opacity-90">
              🎏
            </div>

            {/* 2D L-SHAPED RUSTIC WOODEN FISHING DOCK / PIER */}
            {/* Horizontal Dock Segment (Top Pier across seats 1, 2, 3) */}
            <div
              className="absolute top-24 left-10 w-[380px] h-20 rounded-xl border-4 border-[#78350f] shadow-2xl flex items-center justify-around pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, #b45309 0%, #92400e 50%, #78350f 100%)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.6)',
              }}
            >
              {/* Wood Plank Lines */}
              <div className="absolute inset-0 flex justify-between px-4 opacity-30 pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="w-0.5 h-full bg-black" />
                ))}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-200/90 font-mono">
                CẦU GỖ CÂU CÁ ZEN
              </span>
            </div>

            {/* Vertical Dock Extension (Right Pier towards seat 4) */}
            <div
              className="absolute top-24 right-10 w-24 h-56 rounded-xl border-4 border-[#78350f] shadow-2xl flex flex-col items-center justify-around pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, #b45309 0%, #92400e 50%, #78350f 100%)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.6)',
              }}
            >
              <div className="absolute inset-0 flex flex-col justify-between py-4 opacity-30 pointer-events-none">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-0.5 w-full bg-black" />
                ))}
              </div>
            </div>

            {/* Fishing Dock Props: Tackle Box, Lifebuoy */}
            <div className="absolute top-26 left-12 text-lg pointer-events-none" title="Hộp Dụng Cụ Câu">
              🧰
            </div>
            <div className="absolute top-26 right-14 text-xl pointer-events-none" title="Phao Cứu Sinh">
              🛟
            </div>

            {/* 4 INTERACTIVE FISHING SEATS ON THE PIER */}
            {fishingArea.seats?.map((seat, idx) => {
              const isOcc = !!occupiedSeats[seat.id];
              const occName = occupiedSeats[seat.id];
              // Relative coordinate within fishing zone
              const localX = seat.x - fishingArea.x - 24;
              const localY = seat.y - fishingArea.y - 24;

              return (
                <div
                  key={seat.id}
                  className="absolute"
                  style={{ left: localX, top: localY }}
                >
                  <button
                    type="button"
                    onClick={() => onSeatClick(seat)}
                    title={
                      isOcc
                        ? `Đang ngồi câu: ${occName}`
                        : `${seat.label} - Bấm để ngồi thả cần câu cá`
                    }
                    className={`relative w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer group shadow-xl ${
                      isOcc
                        ? 'bg-cyan-950 border-2 border-cyan-400 scale-105'
                        : 'bg-amber-950 hover:bg-cyan-600 border-2 border-amber-700 hover:border-cyan-300 hover:scale-110 active:scale-95'
                    }`}
                  >
                    {/* Fishing Stool Icon */}
                    <span className="text-base group-hover:scale-110 transition-transform">🎣</span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full absolute -top-1 -right-1 border border-slate-900 ${
                        isOcc ? 'bg-amber-400 animate-pulse' : 'bg-cyan-400'
                      }`}
                    />

                    {/* Stool Number */}
                    <span className="text-[8px] font-black text-amber-200 mt-0.5">
                      #{idx + 1}
                    </span>

                    {/* Hover Tooltip */}
                    <span className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-cyan-300 text-[9px] font-bold px-2 py-0.5 rounded border border-cyan-500 whitespace-nowrap pointer-events-none z-30 shadow-xl">
                      {isOcc ? occName : seat.label}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. KHU RẠP PHIM (CINEMA & THEATER) (bounds: x: 1910, y: 180, w: 570, h: 660) */}
      {/* ========================================================= */}
      <div
        className="absolute tile-floor-cinema rounded-3xl border-4 border-purple-800/80 shadow-2xl overflow-hidden select-none"
        style={{
          left: cinemaArea.x,
          top: cinemaArea.y,
          width: cinemaArea.width,
          height: cinemaArea.height,
        }}
      >
        {/* 2D Cinema North Wall with Brass Sconces & Controls */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#2e1065] to-[#3b0764] border-b-4 border-[#581c87] flex items-center justify-between px-6 z-10 shadow-md">
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-lg bg-purple-950 border-2 border-purple-500/70 shadow-lg flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-xs font-black tracking-wider text-white uppercase font-mono">
                🎬 RẠP PHIM CÔNG SỞ 4K • 8 GHẾ SOFA
              </span>
            </div>
            <span className="text-xs text-purple-200 hidden sm:inline">Dolby Atmos</span>
          </div>

          {/* Player controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCinemaPlaying(!cinemaPlaying)}
              className="p-1.5 rounded-xl bg-purple-900/90 hover:bg-purple-800 text-purple-200 border border-purple-600 text-xs transition-all cursor-pointer shadow"
              title={cinemaPlaying ? 'Tạm Dừng Chiếu Phim' : 'Tiếp Tục Chiếu Phim'}
            >
              {cinemaPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              type="button"
              onClick={() => setCinemaMuted(!cinemaMuted)}
              className="p-1.5 rounded-xl bg-purple-900/90 hover:bg-purple-800 text-purple-200 border border-purple-600 text-xs transition-all cursor-pointer shadow"
              title={cinemaMuted ? 'Bật Âm Thanh' : 'Tắt Âm Thanh'}
            >
              {cinemaMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </div>

        {/* 2D GIANT 16:9 CINEMA CURVED SCREEN (Mounted on North Wall) */}
        <div className="absolute top-20 inset-x-8 h-44 rounded-2xl bg-black border-4 border-slate-900 cinema-glow overflow-hidden shadow-2xl flex flex-col justify-between p-3">
          {/* Side Velvet Curtains */}
          <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-red-900 via-rose-950 to-transparent border-r-2 border-red-800/60 pointer-events-none z-10" />
          <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-red-900 via-rose-950 to-transparent border-l-2 border-red-800/60 pointer-events-none z-10" />

          {cinemaPlaying ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-indigo-950 via-purple-950 to-rose-950 animate-pulse text-center">
              <span className="text-3xl mb-1 animate-bounce">🍿 🎥 ⭐</span>
              <span className="text-xs font-black tracking-widest text-amber-300 uppercase">
                Now Showing: Bí Mật Công Sở 2026
              </span>
              <span className="text-[10px] text-purple-200 mt-1 font-mono">
                Âm Thanh Vòm 7.1 • Phim Chiếu Rạp Bom Tấn
              </span>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
              <span className="text-3xl mb-1">📽️</span>
              <span className="text-xs font-semibold">Màn hình đang tạm nghỉ</span>
            </div>
          )}

          {/* Recording / Playing indicator */}
          <div className="absolute top-2 inset-x-10 flex justify-between pointer-events-none z-10">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        </div>

        {/* Ambient Projector Light Cast on the Floor */}
        <div className="absolute top-64 inset-x-14 h-24 bg-gradient-to-b from-purple-500/15 via-rose-500/5 to-transparent pointer-events-none blur-xl" />

        {/* Vintage Popcorn Machine Cart in Corner */}
        <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-slate-900/90 border border-purple-500/40 px-3 py-1.5 rounded-xl shadow-lg pointer-events-none">
          <span className="text-2xl filter drop-shadow">🍿</span>
          <div>
            <span className="text-[10px] font-bold text-amber-300 block">Quầy Bỏng Ngô</span>
            <span className="text-[8px] text-purple-300">Bơ Thơm Nóng Hổi</span>
          </div>
        </div>

        {/* Cinema Drink Dispenser Station */}
        <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-slate-900/90 border border-purple-500/40 px-3 py-1.5 rounded-xl shadow-lg pointer-events-none">
          <span className="text-2xl filter drop-shadow">🥤</span>
          <div>
            <span className="text-[10px] font-bold text-rose-300 block">Cây Nước Ngọt</span>
            <span className="text-[8px] text-purple-300">Coca & Soda Lạnh</span>
          </div>
        </div>

        {/* 8 LUXURY THEATER SEATS (ROW 1 & ROW 2) */}
        {cinemaArea.seats?.map((seat) => {
          const isOcc = !!occupiedSeats[seat.id];
          const occName = occupiedSeats[seat.id];
          const localX = seat.x - cinemaArea.x - 26;
          const localY = seat.y - cinemaArea.y - 26;

          return (
            <div
              key={seat.id}
              className="absolute"
              style={{ left: localX, top: localY }}
            >
              <button
                type="button"
                onClick={() => onSeatClick(seat)}
                title={
                  isOcc
                    ? `Đang ngồi xem phim: ${occName}`
                    : `${seat.label} - Bấm để ngồi xem phim`
                }
                className={`relative w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer group shadow-2xl ${
                  isOcc
                    ? 'bg-purple-950 border-2 border-purple-400 scale-105'
                    : 'bg-rose-950/90 hover:bg-purple-700 border-2 border-rose-800 hover:border-purple-300 hover:scale-110 active:scale-95'
                }`}
              >
                {/* Cinema Seat Icon */}
                <span className="text-lg group-hover:scale-110 transition-transform">💺</span>
                <span
                  className={`w-2.5 h-2.5 rounded-full absolute -top-1 -right-1 border border-slate-900 ${
                    isOcc ? 'bg-amber-400 animate-pulse' : 'bg-purple-400'
                  }`}
                />

                {/* Seat Label */}
                <span className="text-[8px] font-bold text-rose-200 mt-0.5">
                  {seat.label.replace('Sofa Vip ', 'VIP ')}
                </span>

                {/* Drink Cup on Armrest */}
                <span className="text-[8px] absolute bottom-1 right-1 opacity-70">🥤</span>

                {/* Hover Tooltip */}
                <span className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-purple-300 text-[9px] font-bold px-2 py-0.5 rounded border border-purple-500 whitespace-nowrap pointer-events-none z-30 shadow-xl">
                  {isOcc ? occName : seat.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 3. SÒNG BÀI POKER & TIẾN LÊN (bounds: x: 1300, y: 950, w: 520, h: 680) */}
      {/* ========================================================= */}
      <div
        className="absolute tile-floor-poker rounded-3xl border-4 border-amber-800/80 shadow-2xl overflow-hidden select-none"
        style={{
          left: cardsArea.x,
          top: cardsArea.y,
          width: cardsArea.width,
          height: cardsArea.height,
        }}
      >
        {/* 2D North Wall with Mahogany Wood Trim & Trophy */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#451a03] to-[#78350f] border-b-4 border-[#92400e] flex items-center justify-between px-6 z-10 shadow-md">
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-lg bg-amber-950 border-2 border-amber-500/70 shadow-lg flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-black tracking-wider text-white uppercase font-mono">
                🃏 SÒNG BÀI POKER & TIẾN LÊN • 2 BÀN (8 CHỖ)
              </span>
            </div>
            <Trophy className="w-4 h-4 text-amber-300 hidden sm:inline" />
          </div>

          <button
            type="button"
            onClick={handleDealCards}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 text-xs font-black shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-300/60"
          >
            <Coins className="w-3.5 h-3.5" />
            Chia Bài Lấy Hên 🎴
          </button>
        </div>

        {/* 2 DELUXE OVAL POKER TABLES (TABLE A & TABLE B) */}
        {/* TABLE A (Centered around 1470, 1170 -> rel: x: 170, y: 220) */}
        <div
          className="absolute rounded-[50px] border-8 border-[#78350f] shadow-2xl flex flex-col items-center justify-center p-3 pointer-events-none"
          style={{
            left: 70,
            top: 155,
            width: 200,
            height: 130,
            background: 'radial-gradient(ellipse at center, #047857 0%, #064e3b 80%, #022c22 100%)',
            boxShadow: '0 15px 30px rgba(0,0,0,0.7)',
          }}
        >
          {/* Table Center Logo & Cards */}
          <span className="text-lg animate-pulse">♠️ ♥️ ♣️ ♦️</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs">🪙</span>
            <span className="text-[9px] font-black text-amber-300 uppercase tracking-widest font-mono">
              BÀN POKER VIP
            </span>
            <span className="text-xs">🪙</span>
          </div>
        </div>

        {/* TABLE B (Centered around 1680, 1440 -> rel: x: 380, y: 490) */}
        <div
          className="absolute rounded-[50px] border-8 border-[#78350f] shadow-2xl flex flex-col items-center justify-center p-3 pointer-events-none"
          style={{
            left: 280,
            top: 425,
            width: 200,
            height: 130,
            background: 'radial-gradient(ellipse at center, #0f766e 0%, #115e59 80%, #134e4a 100%)',
            boxShadow: '0 15px 30px rgba(0,0,0,0.7)',
          }}
        >
          <span className="text-lg animate-pulse">🎴 🃏 🎲</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs">🪙</span>
            <span className="text-[9px] font-black text-teal-300 uppercase tracking-widest font-mono">
              TIẾN LÊN MIỀN NAM
            </span>
            <span className="text-xs">🪙</span>
          </div>
        </div>

        {/* 8 CARD GAME CHAIRS AROUND THE TWO TABLES */}
        {cardsArea.seats?.map((seat) => {
          const isOcc = !!occupiedSeats[seat.id];
          const occName = occupiedSeats[seat.id];
          const localX = seat.x - cardsArea.x - 22;
          const localY = seat.y - cardsArea.y - 22;

          return (
            <div
              key={seat.id}
              className="absolute"
              style={{ left: localX, top: localY }}
            >
              <button
                type="button"
                onClick={() => onSeatClick(seat)}
                title={
                  isOcc
                    ? `Đang ngồi chơi: ${occName}`
                    : `${seat.label} - Bấm để ngồi chơi bài`
                }
                className={`relative w-11 h-11 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer group shadow-xl ${
                  isOcc
                    ? 'bg-amber-950 border-2 border-amber-400 scale-105'
                    : 'bg-emerald-950/90 hover:bg-amber-600 border-2 border-emerald-700 hover:border-amber-300 hover:scale-110 active:scale-95'
                }`}
              >
                <span className="text-base group-hover:scale-110 transition-transform">🪑</span>
                <span
                  className={`w-2 h-2 rounded-full absolute -top-1 -right-1 border border-slate-900 ${
                    isOcc ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                  }`}
                />

                {/* Hover Tooltip */}
                <span className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded border border-amber-500 whitespace-nowrap pointer-events-none z-30 shadow-xl">
                  {isOcc ? occName : seat.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 4. PHÒNG GAME ARCADE & PS5 (bounds: x: 1910, y: 950, w: 570, h: 680) */}
      {/* ========================================================= */}
      <div
        className="absolute tile-floor-arcade rounded-3xl border-4 border-pink-800/80 shadow-2xl overflow-hidden select-none"
        style={{
          left: gamingArea.x,
          top: gamingArea.y,
          width: gamingArea.width,
          height: gamingArea.height,
        }}
      >
        {/* 2D North Wall with Synthwave RGB Glow */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#500724] to-[#831843] border-b-4 border-[#9d174d] flex items-center justify-between px-6 z-10 shadow-md">
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-lg bg-pink-950 border-2 border-pink-500/70 shadow-lg flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-pulse" />
              <span className="text-xs font-black tracking-wider text-white uppercase font-mono">
                🎮 PHÒNG ARCADE & PS5 • 6 CHỖ
              </span>
            </div>
            <span className="text-xs text-pink-300 hidden sm:inline">120 FPS High Refresh</span>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-pink-500/20 text-pink-200 font-black border border-pink-400/40 animate-pulse">
            RGB SYNTHWAVE ON
          </span>
        </div>

        {/* 3 STANDING 2D ARCADE CABINETS (TOP SECTION) */}
        {[
          {
            name: 'Street Fighter V',
            color: '#ef4444',
            seatId: 'game-1',
            icon: '🥊',
            x: 1990,
            y: 1140,
          },
          {
            name: 'Pac-Man 3D',
            color: '#eab308',
            seatId: 'game-2',
            icon: '🟡',
            x: 2090,
            y: 1140,
          },
          {
            name: 'F1 Racing Pro',
            color: '#06b6d4',
            seatId: 'game-3',
            icon: '🏎️',
            x: 2210,
            y: 1140,
          },
        ].map((cab) => {
          const isOcc = !!occupiedSeats[cab.seatId];
          const occName = occupiedSeats[cab.seatId];
          const localX = cab.x - gamingArea.x - 30;
          const localY = cab.y - gamingArea.y - 120;
          const seat = gamingArea.seats?.find((s) => s.id === cab.seatId);

          return (
            <div
              key={cab.name}
              className="absolute flex flex-col items-center"
              style={{ left: localX, top: localY }}
            >
              {/* 2D Standing Arcade Cabinet Body */}
              <div
                onClick={() => handlePlayArcade(cab.name)}
                className="w-20 h-28 rounded-t-2xl rounded-b-lg border-2 border-slate-700 bg-slate-900 p-1.5 flex flex-col justify-between shadow-2xl cursor-pointer hover:border-pink-400 transition-all group"
              >
                {/* Illuminated Marquee Sign */}
                <div
                  className="w-full py-0.5 rounded text-center font-black text-[8px] text-slate-950 uppercase shadow"
                  style={{ backgroundColor: cab.color }}
                >
                  {cab.name}
                </div>

                {/* CRT Screen with Scanlines */}
                <div className="w-full h-11 rounded bg-black border border-slate-700 flex items-center justify-center relative overflow-hidden">
                  <span className="text-xl group-hover:scale-125 transition-transform">{cab.icon}</span>
                  <span className="absolute bottom-0.5 right-1 text-[6px] text-pink-400 font-mono">
                    INSERT COIN
                  </span>
                </div>

                {/* Control Panel: Joystick & Buttons */}
                <div className="flex items-center justify-between px-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 shadow-sm" />
                  <div className="flex gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-sm" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm" />
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-sm" />
                  </div>
                </div>
              </div>

              {/* Bar Stool for Player to Sit at this Arcade Cabinet */}
              {seat && (
                <button
                  type="button"
                  onClick={() => onSeatClick(seat)}
                  title={isOcc ? `Đang chơi: ${occName}` : `${seat.label} - Bấm để ngồi chơi`}
                  className={`mt-2 relative w-10 h-10 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer group shadow-xl ${
                    isOcc
                      ? 'bg-pink-600 border-2 border-white scale-105'
                      : 'bg-slate-900 hover:bg-pink-600 border-2 border-pink-500/60 hover:scale-110 active:scale-95'
                  }`}
                >
                  <Gamepad2 className="w-4 h-4 text-pink-200" />
                  <span
                    className={`w-2 h-2 rounded-full absolute -top-0.5 -right-0.5 border border-slate-900 ${
                      isOcc ? 'bg-amber-400 animate-pulse' : 'bg-pink-400'
                    }`}
                  />
                  {/* Tooltip */}
                  <span className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-pink-300 text-[9px] font-bold px-2 py-0.5 rounded border border-pink-500 whitespace-nowrap pointer-events-none z-30 shadow-xl">
                    {isOcc ? occName : 'Ngồi Chơi'}
                  </span>
                </button>
              )}
            </div>
          );
        })}

        {/* DANCE DANCE REVOLUTION (DDR) NEON STAGE MAT (Middle Section) */}
        <div className="absolute top-64 inset-x-12 h-14 rounded-2xl bg-slate-950/90 border-2 border-cyan-500/50 flex items-center justify-around px-6 pointer-events-none shadow-xl">
          <span className="text-xl animate-bounce">⬅️</span>
          <span className="text-xl animate-pulse">⬇️</span>
          <span className="text-xs font-black text-cyan-300 font-mono tracking-widest">DDR STAGE</span>
          <span className="text-xl animate-pulse">⬆️</span>
          <span className="text-xl animate-bounce">➡️</span>
        </div>

        {/* 2D PLAYSTATION 5 CONSOLE & 75" OLED GAMING LOUNGE (BOTTOM SECTION) */}
        {/* Wall TV with PS5 Console */}
        <div className="absolute bottom-28 inset-x-16 h-20 rounded-2xl bg-black border-4 border-slate-800 flex items-center justify-between px-6 pointer-events-none shadow-2xl">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📺</span>
            <div>
              <span className="text-xs font-black text-white block">75" 4K OLED Gaming Display</span>
              <span className="text-[10px] text-pink-400 font-mono">PlayStation 5 Pro • Gran Turismo 7</span>
            </div>
          </div>
          {/* PS5 Console Prop with Blue LED */}
          <div className="w-6 h-12 bg-white rounded-t-lg rounded-b border-2 border-blue-500 shadow flex items-center justify-center">
            <div className="w-1 h-8 bg-blue-500 animate-pulse" />
          </div>
        </div>

        {/* PS5 SOFA SEATS & VR BEANBAG */}
        {gamingArea.seats?.slice(3, 6).map((seat) => {
          const isOcc = !!occupiedSeats[seat.id];
          const occName = occupiedSeats[seat.id];
          const localX = seat.x - gamingArea.x - 24;
          const localY = seat.y - gamingArea.y - 24;

          return (
            <div
              key={seat.id}
              className="absolute"
              style={{ left: localX, top: localY }}
            >
              <button
                type="button"
                onClick={() => onSeatClick(seat)}
                title={
                  isOcc
                    ? `Đang ngồi chơi game: ${occName}`
                    : `${seat.label} - Bấm để ngồi chơi console PS5`
                }
                className={`relative w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer group shadow-2xl ${
                  isOcc
                    ? 'bg-pink-950 border-2 border-pink-400 scale-105'
                    : 'bg-slate-900/90 hover:bg-pink-600 border-2 border-pink-700 hover:border-pink-300 hover:scale-110 active:scale-95'
                }`}
              >
                <span className="text-lg group-hover:scale-110 transition-transform">
                  {seat.id === 'game-6' ? '🥽' : '🛋️'}
                </span>
                <span
                  className={`w-2.5 h-2.5 rounded-full absolute -top-1 -right-1 border border-slate-900 ${
                    isOcc ? 'bg-amber-400 animate-pulse' : 'bg-pink-400'
                  }`}
                />

                {/* Tooltip */}
                <span className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-pink-300 text-[9px] font-bold px-2 py-0.5 rounded border border-pink-500 whitespace-nowrap pointer-events-none z-30 shadow-xl">
                  {isOcc ? occName : seat.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};
