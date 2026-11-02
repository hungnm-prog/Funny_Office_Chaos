import React, { useState } from 'react';
import type { Seat } from '../../types/game';
import { RECREATION_AREAS } from '../../constants/officeLayout';
import { Play, Tv, Gamepad2, Sparkles, Volume2, VolumeX } from 'lucide-react';
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
    const fishTypes = ['Cá Chép Vàng 🐟', 'Cá Koi Đỏ Trắng 🎏', 'Cá Bảy Màu Lấp Lánh ✨', 'Cá Rồng Hoàng Gia 🐲'];
    const caught = fishTypes[Math.floor(Math.random() * fishTypes.length)];
    setFishCount((c) => c + 1);
    onTriggerEvent('🎣 Câu Cá Thành Công!', `Bạn đã câu được ${caught} tại Hồ Cá Koi công sở!`);
    try {
      confetti({ particleCount: 40, spread: 60, origin: { x: 0.65, y: 0.3 } });
    } catch {}
  };

  const handleDealCards = () => {
    const hands = ['Sảnh Rồng 10 lá 🐉', 'Tứ Quý Át ♠️♥️♦️♣️', 'Cù Lũ Vua 👑', 'Ba Đôi Thông Chặt Heo ⚡'];
    const hand = hands[Math.floor(Math.random() * hands.length)];
    onTriggerEvent('🃏 Chia Bài Tiến Lên / Poker', `Lên bài cực đẹp: ${hand}! Thắng ván này rồi!`);
  };

  const handlePlayArcade = (gameName: string) => {
    onTriggerEvent('🎮 Bắt Đầu Chơi Game', `Đang chiến cực hăng tại máy ${gameName}! Combo x99! 🔥`);
  };

  return (
    <>
      {/* 1. KHU CÂU CÁ (Fishing Pond) */}
      <div
        className="absolute rounded-3xl p-5 border-2 border-cyan-500/50 shadow-2xl overflow-hidden"
        style={{
          left: fishingArea.x,
          top: fishingArea.y,
          width: fishingArea.width,
          height: fishingArea.height,
          background: 'linear-gradient(145deg, #083344 0%, #0f172a 100%)',
        }}
      >
        {/* Title */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-800/80 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎣</span>
            <div>
              <h4 className="text-base font-black text-white">Khu Câu Cá Hồ Koi Zen</h4>
              <p className="text-[11px] text-cyan-300/80">Hồ nước phong thủy, thư giãn tâm trí</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCatchFish}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md hover:scale-105 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Giật Cần ({fishCount} 🐟)
          </button>
        </div>

        {/* The Animated Pond */}
        <div className="relative w-full h-[520px] rounded-2xl bg-gradient-to-b from-cyan-900 via-sky-800 to-teal-950 border-4 border-cyan-700/60 shadow-inner overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-radial from-cyan-400/10 via-transparent to-transparent animate-pulse" />

          {/* Lily pads & rocks */}
          <span className="absolute top-10 left-12 text-2xl filter drop-shadow">🪷</span>
          <span className="absolute bottom-16 right-16 text-2xl filter drop-shadow">🪷</span>
          <span className="absolute top-28 right-24 text-xl filter drop-shadow">🌿</span>
          <span className="absolute bottom-28 left-20 text-2xl filter drop-shadow">🪨</span>

          {/* Animated Koi Fish swimming */}
          <div className="absolute top-20 left-28 text-3xl fish-swim-1 pointer-events-none">
            🎏
          </div>
          <div className="absolute bottom-24 right-32 text-3xl fish-swim-2 pointer-events-none">
            🐟
          </div>
          <div className="absolute top-44 right-16 text-2xl fish-swim-1 pointer-events-none opacity-80">
            🐠
          </div>

          {/* Wooden Fishing Pier / Bridge */}
          <div className="absolute top-0 inset-x-12 h-28 bg-gradient-to-b from-amber-950 to-amber-900 border-b-4 border-amber-800 shadow-xl flex items-center justify-around px-6">
            <span className="text-xs font-bold text-amber-200 uppercase tracking-widest">
              Bến Câu Cá Công Sở
            </span>
          </div>

          {/* Fishing Seats on Pier */}
          <div className="absolute top-14 inset-x-16 flex justify-around">
            {fishingArea.seats?.map((seat) => {
              const isOcc = !!occupiedSeats[seat.id];
              const occName = occupiedSeats[seat.id];
              return (
                <button
                  key={seat.id}
                  type="button"
                  onClick={() => onSeatClick(seat)}
                  className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isOcc
                      ? 'bg-cyan-500 border-2 border-white shadow-lg'
                      : 'bg-amber-900/90 hover:bg-cyan-600 border border-amber-600 hover:border-cyan-300 hover:scale-110 shadow'
                  }`}
                  title={isOcc ? `Đang ngồi câu: ${occName}` : `${seat.label} - Bấm để ngồi câu cá`}
                >
                  <span className="text-lg">🎣</span>
                  <span className="text-[9px] font-bold text-white">
                    {seat.label.replace('Bến câu ', '#')}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="absolute bottom-4 inset-x-8 bg-cyan-950/80 backdrop-blur-sm border border-cyan-700/50 rounded-xl py-2 px-3 text-center text-xs text-cyan-200">
            Nhấp ghế trên cầu gỗ để nhân vật thả cần câu xuống hồ cá Koi
          </div>
        </div>
      </div>

      {/* 2. KHU XEM PHIM (Cinema & Theater) */}
      <div
        className="absolute rounded-3xl p-5 border-2 border-purple-500/50 shadow-2xl overflow-hidden"
        style={{
          left: cinemaArea.x,
          top: cinemaArea.y,
          width: cinemaArea.width,
          height: cinemaArea.height,
          background: 'linear-gradient(145deg, #2e1065 0%, #09090b 100%)',
        }}
      >
        {/* Title & Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-800/80 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎬</span>
            <div>
              <h4 className="text-base font-black text-white">Rạp Phim Công Sở 4K</h4>
              <p className="text-[11px] text-purple-300/80">Màn chiếu khổng lồ & sofa rạp cao cấp</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCinemaPlaying(!cinemaPlaying)}
              className="p-1.5 rounded-lg bg-purple-900/80 hover:bg-purple-800 text-purple-300 border border-purple-700 text-xs transition-all"
              title={cinemaPlaying ? 'Tạm Dừng Chiếu' : 'Phát Phim'}
            >
              <Play className={`w-4 h-4 ${cinemaPlaying ? 'text-emerald-400' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => setCinemaMuted(!cinemaMuted)}
              className="p-1.5 rounded-lg bg-purple-900/80 hover:bg-purple-800 text-purple-300 border border-purple-700 text-xs transition-all"
              title={cinemaMuted ? 'Bật Âm Thanh' : 'Tắt Âm Thanh'}
            >
              {cinemaMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </div>

        {/* Giant Cinema Screen */}
        <div className="relative w-full h-44 rounded-2xl bg-black border-4 border-slate-800 cinema-glow overflow-hidden mb-6 flex flex-col justify-between p-3">
          {cinemaPlaying ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-indigo-950 via-purple-900 to-pink-900 animate-pulse text-center">
              <span className="text-3xl mb-1 animate-bounce">🍿 🎥 ⭐</span>
              <span className="text-xs font-black tracking-widest text-amber-300 uppercase">
                Now Showing: Bí Mật Công Sở 2026
              </span>
              <span className="text-[10px] text-purple-200 mt-1 font-mono">
                Âm thanh vòm Dolby Atmos • 4K HDR 60fps
              </span>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
              <Tv className="w-8 h-8 mb-1" />
              <span className="text-xs font-semibold">Màn hình đang tạm nghỉ</span>
            </div>
          )}

          <div className="absolute top-1 inset-x-8 flex justify-between pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
        </div>

        {/* Cinema Seats */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-purple-300 px-3">
            <span>Hàng Ghế VIP 01 (Mặt trước)</span>
            <span className="text-[10px] text-purple-400">🍿 Bỏng ngô & Nước ngọt miễn phí</span>
          </div>
          <div className="grid grid-cols-4 gap-3 px-2">
            {cinemaArea.seats?.slice(0, 4).map((seat) => {
              const isOcc = !!occupiedSeats[seat.id];
              const occName = occupiedSeats[seat.id];
              return (
                <button
                  key={seat.id}
                  type="button"
                  onClick={() => onSeatClick(seat)}
                  className={`h-14 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer border ${
                    isOcc
                      ? 'bg-purple-600 border-white shadow-lg'
                      : 'bg-rose-950/80 hover:bg-purple-700 border-rose-800 hover:scale-105 shadow'
                  }`}
                  title={isOcc ? `Đang ngồi: ${occName}` : `${seat.label} - Bấm để ngồi xem phim`}
                >
                  <span className="text-base">💺</span>
                  <span className="text-[9px] font-bold text-white">{seat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-purple-300 px-3 pt-2">
            <span>Hàng Ghế VIP 02 (Mặt sau)</span>
          </div>
          <div className="grid grid-cols-4 gap-3 px-2">
            {cinemaArea.seats?.slice(4, 8).map((seat) => {
              const isOcc = !!occupiedSeats[seat.id];
              const occName = occupiedSeats[seat.id];
              return (
                <button
                  key={seat.id}
                  type="button"
                  onClick={() => onSeatClick(seat)}
                  className={`h-14 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer border ${
                    isOcc
                      ? 'bg-purple-600 border-white shadow-lg'
                      : 'bg-rose-950/80 hover:bg-purple-700 border-rose-800 hover:scale-105 shadow'
                  }`}
                  title={isOcc ? `Đang ngồi: ${occName}` : `${seat.label} - Bấm để ngồi xem phim`}
                >
                  <span className="text-base">💺</span>
                  <span className="text-[9px] font-bold text-white">{seat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. KHU ĐÁNH BÀI (Card Games & Board Games Lounge) */}
      <div
        className="absolute rounded-3xl p-5 border-2 border-amber-500/50 shadow-2xl overflow-hidden"
        style={{
          left: cardsArea.x,
          top: cardsArea.y,
          width: cardsArea.width,
          height: cardsArea.height,
          background: 'linear-gradient(145deg, #451a03 0%, #172554 100%)',
        }}
      >
        {/* Title */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-800/80 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🃏</span>
            <div>
              <h4 className="text-base font-black text-white">Sòng Bài Poker & Tiến Lên</h4>
              <p className="text-[11px] text-amber-300/80">Bàn nhung xanh cao cấp, giải trí giờ nghỉ</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDealCards}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md hover:scale-105 transition-all cursor-pointer"
          >
            Chia Bài Lấy Hên 🎴
          </button>
        </div>

        {/* 2 Green Felt Poker Tables */}
        <div className="space-y-6 pt-2">
          {/* Table A */}
          <div className="relative rounded-2xl bg-amber-950/50 border border-amber-800/50 p-4 flex flex-col items-center">
            <span className="text-xs font-bold text-amber-300 mb-2">Bàn Poker & Tiến Lên 01 (Vip)</span>
            
            <div className="w-56 h-32 rounded-[50px] bg-gradient-to-b from-emerald-700 to-emerald-900 border-8 border-amber-900 shadow-2xl flex items-center justify-center relative">
              <span className="text-2xl animate-pulse">♠️ ♥️ ♣️ ♦️</span>
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                <span className="text-xs">🪙</span>
                <span className="text-xs">🪙</span>
              </div>
            </div>

            <div className="w-full flex justify-around mt-3">
              {cardsArea.seats?.slice(0, 4).map((seat) => {
                const isOcc = !!occupiedSeats[seat.id];
                const occName = occupiedSeats[seat.id];
                return (
                  <button
                    key={seat.id}
                    type="button"
                    onClick={() => onSeatClick(seat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isOcc
                        ? 'bg-amber-500 text-slate-900 shadow-lg'
                        : 'bg-emerald-950/90 text-emerald-200 border border-emerald-700 hover:bg-emerald-600 hover:text-white'
                    }`}
                    title={isOcc ? `Đang ngồi: ${occName}` : `${seat.label} - Bấm để ngồi chơi`}
                  >
                    🪑 {seat.label.split(' - ')[1]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table B */}
          <div className="relative rounded-2xl bg-amber-950/50 border border-amber-800/50 p-4 flex flex-col items-center">
            <span className="text-xs font-bold text-amber-300 mb-2">Bàn Bài Tây 02 (Giải Trí)</span>
            
            <div className="w-56 h-32 rounded-[50px] bg-gradient-to-b from-teal-700 to-teal-900 border-8 border-amber-950 shadow-2xl flex items-center justify-center relative">
              <span className="text-2xl animate-pulse">🎴 🃏 🎲</span>
            </div>

            <div className="w-full flex justify-around mt-3">
              {cardsArea.seats?.slice(4, 8).map((seat) => {
                const isOcc = !!occupiedSeats[seat.id];
                const occName = occupiedSeats[seat.id];
                return (
                  <button
                    key={seat.id}
                    type="button"
                    onClick={() => onSeatClick(seat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isOcc
                        ? 'bg-amber-500 text-slate-900 shadow-lg'
                        : 'bg-teal-950/90 text-teal-200 border border-teal-700 hover:bg-teal-600 hover:text-white'
                    }`}
                    title={isOcc ? `Đang ngồi: ${occName}` : `${seat.label} - Bấm để ngồi chơi`}
                  >
                    🪑 {seat.label.split(' - ')[1]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4. KHU CHƠI GAME (Arcade & Gaming Arena) */}
      <div
        className="absolute rounded-3xl p-5 border-2 border-pink-500/50 shadow-2xl overflow-hidden"
        style={{
          left: gamingArea.x,
          top: gamingArea.y,
          width: gamingArea.width,
          height: gamingArea.height,
          background: 'linear-gradient(145deg, #500724 0%, #030712 100%)',
        }}
      >
        {/* Title */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-800/80 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <div>
              <h4 className="text-base font-black text-white">Phòng Game Arcade & PS5</h4>
              <p className="text-[11px] text-pink-300/80">Máy thùng retro neon & Gaming console</p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30 animate-pulse">
            RGB Gaming On
          </span>
        </div>

        {/* 3 Retro Arcade Cabinets */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { name: 'Street Fighter V', color: '#ef4444', seatId: 'game-1' },
            { name: 'Pac-Man 3D', color: '#eab308', seatId: 'game-2' },
            { name: 'F1 Racing Pro', color: '#06b6d4', seatId: 'game-3' },
          ].map((cab) => {
            const isOcc = !!occupiedSeats[cab.seatId];
            return (
              <div
                key={cab.name}
                onClick={() => handlePlayArcade(cab.name)}
                className="rounded-2xl p-3 border-2 border-slate-700 bg-slate-900 hover:border-pink-500 transition-all cursor-pointer group flex flex-col items-center shadow-lg"
              >
                <div
                  className="w-full py-1 rounded-lg text-center font-black text-[10px] text-slate-950 uppercase mb-2 shadow"
                  style={{ backgroundColor: cab.color }}
                >
                  {cab.name}
                </div>
                <div className="w-full h-16 rounded-lg bg-black border border-slate-700 flex items-center justify-center p-1 relative overflow-hidden">
                  <Gamepad2 className="w-8 h-8 text-pink-500 group-hover:scale-125 transition-transform" />
                  <span className="absolute bottom-1 right-1 text-[8px] text-pink-400 font-mono">
                    INSERT COIN
                  </span>
                </div>
                <div className="flex items-center justify-between w-full mt-2 px-1">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="w-2 h-2 rounded-full bg-yellow-400" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const s = gamingArea.seats?.find((x) => x.id === cab.seatId);
                    if (s) onSeatClick(s);
                  }}
                  className={`mt-2 w-full py-1 rounded-lg text-[10px] font-bold ${
                    isOcc ? 'bg-pink-600 text-white' : 'bg-slate-800 text-pink-300 hover:bg-pink-600 hover:text-white'
                  }`}
                >
                  {isOcc ? 'Đang chơi' : 'Vào Chơi'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Console Couch & 4K OLED Gaming Station */}
        <div className="rounded-2xl bg-pink-950/40 border border-pink-800/40 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-pink-200">Khu Sofa PlayStation 5 & Kính VR</span>
            <span className="text-[10px] text-pink-400">🎮 Tay cầm DualSense Rung Haptic</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {gamingArea.seats?.slice(3, 6).map((seat) => {
              const isOcc = !!occupiedSeats[seat.id];
              const occName = occupiedSeats[seat.id];
              return (
                <button
                  key={seat.id}
                  type="button"
                  onClick={() => onSeatClick(seat)}
                  className={`py-3 px-2 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer border ${
                    isOcc
                      ? 'bg-pink-600 border-white shadow-lg'
                      : 'bg-slate-900/90 hover:bg-pink-700/80 border-slate-700 hover:scale-105 shadow'
                  }`}
                  title={isOcc ? `Đang ngồi: ${occName}` : `${seat.label} - Bấm để ngồi chơi`}
                >
                  <span className="text-lg">🛋️</span>
                  <span className="text-[10px] font-bold text-white mt-1">{seat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
