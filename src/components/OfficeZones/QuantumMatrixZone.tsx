import React from 'react';
import type { Seat } from '../../types/game';
import { QUANTUM_MATRIX_SEATS } from '../../constants/officeLayout';
import { Zap, Cpu, Terminal, Orbit } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuantumMatrixZoneProps {
  onSeatClick: (seat: Seat) => void;
  occupiedSeats: Record<string, string>;
  onTriggerEvent: (title: string, message: string) => void;
}

export const QuantumMatrixZone: React.FC<QuantumMatrixZoneProps> = ({
  onSeatClick,
  occupiedSeats,
  onTriggerEvent,
}) => {
  const handleOverclockAI = () => {
    onTriggerEvent(
      '🧬 Ép Xung Lõi Lượng Tử AI',
      'Công suất AI Core tăng vọt lên 999 TFLOPS! Hệ thống lượng tử đạt trạng thái siêu dẫn hoàn hảo! ⚡'
    );
    try {
      confetti({ particleCount: 50, spread: 80, origin: { x: 0.5, y: 0.5 } });
    } catch {}
  };

  const handleHackathon = () => {
    onTriggerEvent(
      '💻 Đấu Trường Hackathon Cyberpunk',
      'Vừa bẻ khóa thành công thuật toán SHA-512 lượng tử! Giải nhất Hackathon công nghệ thuộc về bạn! 🏆'
    );
    try {
      confetti({ particleCount: 45, spread: 70, origin: { x: 0.75, y: 0.5 } });
    } catch {}
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* ========================================================= */}
      {/* 1. CENTRAL AI QUANTUM CORE REACTOR (CENTER OF REALM) */}
      {/* ========================================================= */}
      <div
        className="absolute rounded-[60px] border-4 border-fuchsia-500/80 shadow-2xl overflow-hidden pointer-events-auto p-6 flex flex-col items-center justify-between"
        style={{
          left: 920,
          top: 600,
          width: 560,
          height: 540,
          background: 'radial-gradient(circle at center, rgba(112, 26, 117, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.9), 0 0 60px rgba(217, 70, 239, 0.4)',
        }}
      >
        {/* Core Header */}
        <div className="flex items-center justify-between w-full border-b border-fuchsia-700/60 pb-3">
          <div className="flex items-center gap-2">
            <Orbit className="w-5 h-5 text-fuchsia-400 animate-spin" />
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                🧬 LÕI LƯỢNG TỬ AI SIÊU DẪN
              </h3>
              <p className="text-[10px] text-fuchsia-300">Năng lượng plasma vô tận cung cấp cho toàn vũ trụ</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOverclockAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white text-xs font-black shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            Ép Xung AI ⚡
          </button>
        </div>

        {/* The Animated Plasma Core Reactor */}
        <div className="relative w-64 h-64 rounded-full border-4 border-cyan-400/80 flex items-center justify-center shadow-2xl bg-gradient-to-tr from-purple-900 via-fuchsia-600 to-cyan-400 animate-pulse">
          <div className="w-48 h-48 rounded-full border-2 border-white/50 flex items-center justify-center bg-black/40">
            <span className="text-5xl filter drop-shadow animate-spin">⚛️</span>
          </div>
          {/* Reactor Energy Spokes */}
          <div className="absolute inset-0 border-2 border-dashed border-fuchsia-300/40 rounded-full animate-spin" />
        </div>

        {/* 4 Quantum Control Pods Around Central Core */}
        <div className="grid grid-cols-4 gap-3 w-full">
          {QUANTUM_MATRIX_SEATS.slice(0, 4).map((seat) => {
            const isOcc = !!occupiedSeats[seat.id];
            const occName = occupiedSeats[seat.id];

            return (
              <button
                key={seat.id}
                type="button"
                onClick={() => onSeatClick(seat)}
                title={isOcc ? `Đang điều khiển: ${occName}` : `${seat.label} - Nhấp để kết nối não bộ với AI`}
                className={`py-2 px-2 rounded-2xl flex flex-col items-center justify-center text-xs font-bold transition-all ${
                  isOcc
                    ? 'bg-fuchsia-500 text-slate-950 font-black border-2 border-white scale-105 shadow-xl'
                    : 'bg-slate-900/90 hover:bg-fuchsia-600 text-fuchsia-200 hover:text-white border-2 border-fuchsia-600/60 hover:scale-105 active:scale-95'
                }`}
              >
                <span className="text-base">🧬</span>
                <span className="text-[8px] font-mono mt-0.5">{seat.label.split(' - ')[0].slice(-5)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. ZERO-G ANTIGRAVITY FLOATING WORKSTATIONS (LEFT SECTION) */}
      {/* ========================================================= */}
      <div
        className="absolute rounded-3xl border-4 border-cyan-500/70 shadow-2xl overflow-hidden pointer-events-auto p-5 flex flex-col justify-between"
        style={{
          left: 360,
          top: 480,
          width: 440,
          height: 780,
          background: 'linear-gradient(180deg, rgba(8, 47, 73, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.8), 0 0 50px rgba(6, 182, 212, 0.3)',
        }}
      >
        <div className="flex items-center gap-2.5 border-b border-cyan-700/60 pb-3">
          <Cpu className="w-5 h-5 text-cyan-300" />
          <div>
            <h4 className="text-xs font-black text-white uppercase font-mono">
              🌌 KHOANG KHÔNG TRỌNG LỰC ZERO-G
            </h4>
            <span className="text-[10px] text-cyan-300">Lơ lửng giữa không trung làm việc không mỏi mệt</span>
          </div>
        </div>

        {/* Floating Pod Visuals */}
        <div className="flex flex-col items-center justify-around h-96 my-2 bg-slate-950/60 rounded-2xl border border-cyan-500/30 p-4">
          <span className="text-4xl filter drop-shadow animate-bounce">🛸 🌐 🛰️</span>
          <span className="text-xs font-mono text-cyan-300 font-bold tracking-widest uppercase">
            GRAVITY: 0.00 G • LEVITATION ACTIVE
          </span>
          <span className="text-4xl filter drop-shadow animate-pulse">🛸 🌐 🛰️</span>
        </div>

        {/* 4 Zero-G Seats */}
        <div className="grid grid-cols-2 gap-3">
          {QUANTUM_MATRIX_SEATS.slice(4, 8).map((seat) => {
            const isOcc = !!occupiedSeats[seat.id];
            const occName = occupiedSeats[seat.id];

            return (
              <button
                key={seat.id}
                type="button"
                onClick={() => onSeatClick(seat)}
                title={isOcc ? `Đang ngồi: ${occName}` : `${seat.label} - Nhấp để ngồi`}
                className={`py-3 rounded-2xl flex flex-col items-center justify-center text-xs font-bold transition-all ${
                  isOcc
                    ? 'bg-cyan-500 text-slate-950 font-black border-2 border-white scale-105'
                    : 'bg-slate-900/90 hover:bg-cyan-600 text-cyan-200 hover:text-white border-2 border-cyan-500/50 hover:scale-105 active:scale-95'
                }`}
              >
                <span className="text-lg">🛸</span>
                <span className="text-[9px] font-mono mt-1">{seat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. CYBER HACKATHON BATTLE ARENA (RIGHT SECTION) */}
      {/* ========================================================= */}
      <div
        className="absolute rounded-3xl border-4 border-emerald-500/70 shadow-2xl overflow-hidden pointer-events-auto p-5 flex flex-col justify-between"
        style={{
          left: 1600,
          top: 480,
          width: 580,
          height: 780,
          background: 'linear-gradient(180deg, rgba(6, 78, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.8), 0 0 50px rgba(16, 185, 129, 0.3)',
        }}
      >
        <div className="flex items-center justify-between border-b border-emerald-700/60 pb-3">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-emerald-300" />
            <div>
              <h4 className="text-xs font-black text-white uppercase font-mono">
                👾 ĐẤU TRƯỜNG HACKATHON CYBERPUNK
              </h4>
              <span className="text-[10px] text-emerald-300">Thi đấu code tốc độ cao & bảo mật mạng</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleHackathon}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Bẻ Khóa Code 💻
          </button>
        </div>

        {/* Hackathon Matrix Display Terminal */}
        <div className="my-3 h-80 rounded-2xl bg-black/90 border-2 border-emerald-500/50 p-4 font-mono text-emerald-400 text-xs flex flex-col justify-between shadow-inner">
          <div className="flex items-center justify-between border-b border-emerald-800/80 pb-1 text-[10px]">
            <span>ROOT ACCESS: GRANTED</span>
            <span className="animate-ping">🟢 ONLINE</span>
          </div>
          <div className="space-y-1 text-[11px] opacity-90 overflow-hidden">
            <div>&gt; CONNECTING QUANTUM AI NODE... [OK]</div>
            <div>&gt; DECRYPTING SHA-512 MATRIX KEYS... [OK]</div>
            <div>&gt; NEURAL NETWORK SYNC: 100% COMPLETE</div>
            <div>&gt; HACKATHON STATUS: TOP 1 LEADERBOARD! 🚀</div>
          </div>
          <div className="flex justify-around text-2xl pt-2 border-t border-emerald-800/80">
            <span>💻</span>
            <span>👾</span>
            <span>🕹️</span>
            <span>⚡</span>
          </div>
        </div>

        {/* 4 Cyber Hackathon Terminals */}
        <div className="grid grid-cols-2 gap-3">
          {QUANTUM_MATRIX_SEATS.slice(8, 12).map((seat) => {
            const isOcc = !!occupiedSeats[seat.id];
            const occName = occupiedSeats[seat.id];

            return (
              <button
                key={seat.id}
                type="button"
                onClick={() => onSeatClick(seat)}
                title={isOcc ? `Đang ngồi: ${occName}` : `${seat.label} - Nhấp để ngồi`}
                className={`py-3 rounded-2xl flex flex-col items-center justify-center text-xs font-bold transition-all ${
                  isOcc
                    ? 'bg-emerald-500 text-slate-950 font-black border-2 border-white scale-105'
                    : 'bg-slate-900/90 hover:bg-emerald-600 text-emerald-200 hover:text-white border-2 border-emerald-500/50 hover:scale-105 active:scale-95'
                }`}
              >
                <span className="text-lg">🖥️</span>
                <span className="text-[9px] font-mono mt-1">{seat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
