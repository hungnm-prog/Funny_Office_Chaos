import React from 'react';
import { WORK_DESKS } from '../../constants/officeLayout';
import type { Seat } from '../../types/game';
import { Laptop, Coffee } from 'lucide-react';

interface WorkZoneProps {
  onSeatClick: (seat: Seat) => void;
  occupiedSeats: Record<string, string>; // seatId -> characterName
}

export const WorkZone: React.FC<WorkZoneProps> = ({ onSeatClick, occupiedSeats }) => {
  return (
    <div
      className="absolute tile-floor-wood rounded-3xl border-4 border-slate-700/80 shadow-2xl overflow-hidden select-none"
      style={{
        left: 80,
        top: 150,
        width: 1120,
        height: 780,
      }}
    >
      {/* 2D NORTH OFFICE WALL WITH BASEBOARD & DECORATIONS */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#111827] to-[#1f2937] border-b-4 border-[#374151] flex items-center justify-between px-6 z-10 shadow-md">
        {/* Wall Signs & Milestone Certificates */}
        <div className="flex items-center gap-4">
          {/* 2D Room Plaque */}
          <div className="px-3.5 py-1.5 rounded-lg bg-slate-900 border-2 border-blue-500/60 shadow-lg flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-black tracking-wider text-white uppercase font-mono">
              💻 KHU LÀM VIỆC TRỰC TUYẾN • 20 CHỖ NGỒI
            </span>
          </div>

          {/* Wall Clock */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-600 text-[11px] text-slate-300 font-mono">
            <span>🕒</span>
            <span>Sprint 42 • Online</span>
          </div>

          {/* Framed Wall Certificates */}
          <div className="hidden md:flex items-center gap-2">
            <div className="w-6 h-7 bg-amber-100/90 border border-amber-600 rounded-sm shadow-sm flex items-center justify-center text-[8px] font-bold text-amber-900">
              ISO
            </div>
            <div className="w-6 h-7 bg-blue-100/90 border border-blue-600 rounded-sm shadow-sm flex items-center justify-center text-[8px] font-bold text-blue-900">
              99%
            </div>
          </div>
        </div>

        {/* Live Seat Occupancy Meter */}
        <div className="flex items-center gap-2 bg-slate-950/90 px-3.5 py-1.5 rounded-xl border border-blue-500/40 text-xs">
          <span className="text-slate-400 font-medium">Bàn đang làm việc:</span>
          <span className="font-mono font-black text-emerald-400">
            {Object.keys(occupiedSeats).filter((k) => k.startsWith('desk-')).length} / 20
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
      </div>

      {/* WALL WHITEBOARD & ARCHITECTURE DIAGRAM (Top Left on the floor) */}
      <div className="absolute top-20 left-6 w-52 h-14 bg-slate-900/95 rounded-xl border-2 border-slate-600 p-2 shadow-lg flex flex-col justify-between z-0 pointer-events-none">
        <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 border-b border-slate-700/80 pb-0.5">
          <span>📋 SPRINT KANBAN</span>
          <span className="text-emerald-400">12 / 12 DONE</span>
        </div>
        <div className="flex gap-1.5 items-center">
          <span className="w-4 h-3 bg-amber-400/90 rounded-[2px] shadow-sm" title="Sticky Note 1" />
          <span className="w-4 h-3 bg-pink-400/90 rounded-[2px] shadow-sm" title="Sticky Note 2" />
          <span className="w-4 h-3 bg-sky-400/90 rounded-[2px] shadow-sm" title="Sticky Note 3" />
          <span className="w-4 h-3 bg-emerald-400/90 rounded-[2px] shadow-sm" title="Sticky Note 4" />
          <span className="text-[8px] text-slate-400 font-mono ml-auto">🚀 Ready v2.5</span>
        </div>
      </div>

      {/* WATER COOLER STATION (Top Right) */}
      <div className="absolute top-20 right-6 flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-xl shadow z-0 pointer-events-none">
        <div className="w-5 h-8 bg-sky-950 border border-sky-500/50 rounded-t-full flex flex-col items-center justify-between p-0.5">
          <div className="w-3 h-4 bg-sky-400/80 rounded-t-full animate-pulse" />
          <div className="flex gap-0.5">
            <span className="w-1 h-1 bg-red-500 rounded-full" />
            <span className="w-1 h-1 bg-blue-500 rounded-full" />
          </div>
        </div>
        <div>
          <span className="text-[10px] font-bold text-sky-200 block">Cây Nước Lọc</span>
          <span className="text-[8px] text-slate-400">Khoáng Tự Nhiên</span>
        </div>
      </div>

      {/* 2D POTTED MONSTERA PLANTS IN CORNERS */}
      <div className="absolute bottom-4 left-4 text-3xl pointer-events-none game-prop-shadow">
        🪴
      </div>
      <div className="absolute bottom-4 right-4 text-3xl pointer-events-none game-prop-shadow">
        🪴
      </div>

      {/* 20 GAME WORK DESKS (4 ROWS x 5 COLS) */}
      {WORK_DESKS.map((desk) => {
        const isOccupied = !!occupiedSeats[desk.seat.id];
        const occupantName = occupiedSeats[desk.seat.id];
        const isFacingDown = desk.seat.direction === 'down';

        return (
          <div
            key={desk.id}
            className="absolute transition-transform hover:scale-[1.03]"
            style={{
              left: desk.x - 80,
              top: desk.y - 150,
              width: 156,
              height: 104,
            }}
          >
            {/* 2D OAK COMPUTER DESK WITH SHADOW & REALISTIC TEXTURE */}
            <div
              className="relative w-full h-16 rounded-xl border-2 border-[#475569] shadow-xl flex flex-col justify-between p-2 game-prop-shadow"
              style={{
                background: 'linear-gradient(180deg, #334155 0%, #1e293b 60%, #0f172a 100%)',
              }}
            >
              {/* Desk Bevel Highlight Line */}
              <div className="absolute top-0 left-2 right-2 h-[2px] bg-white/20 rounded-t" />

              {/* DUAL MONITORS / LAPTOP SETUP */}
              <div className="flex items-center justify-center gap-2">
                {/* Main 2D Display Monitor */}
                <div
                  className="w-14 h-8 rounded border-2 border-slate-500 flex flex-col justify-between p-0.5 shadow-md overflow-hidden relative"
                  style={{ backgroundColor: '#030712' }}
                >
                  {/* Window Bar */}
                  <div className="flex items-center justify-between pb-0.5 border-b border-slate-800">
                    <div className="flex gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-red-500" />
                      <span className="w-1 h-1 rounded-full bg-yellow-400" />
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[6px] font-mono text-slate-400 font-bold">
                      {desk.monitorState.toUpperCase()}
                    </span>
                  </div>

                  {/* Monitor Screen Content */}
                  <div className="flex-1 flex flex-col justify-center gap-0.5 px-0.5">
                    {desk.monitorState === 'code' && (
                      <div className="space-y-0.5">
                        <div className="h-1 bg-blue-400/80 rounded-sm w-3/4 animate-pulse" />
                        <div className="h-1 bg-emerald-400/80 rounded-sm w-full" />
                        <div className="h-1 bg-amber-400/80 rounded-sm w-1/2" />
                      </div>
                    )}
                    {desk.monitorState === 'chart' && (
                      <div className="flex items-end justify-between h-4 px-1 gap-0.5">
                        <div className="w-1.5 h-2 bg-emerald-400 rounded-t-sm" />
                        <div className="w-1.5 h-3.5 bg-blue-400 rounded-t-sm" />
                        <div className="w-1.5 h-2.5 bg-pink-400 rounded-t-sm" />
                        <div className="w-1.5 h-4 bg-emerald-400 rounded-t-sm animate-pulse" />
                      </div>
                    )}
                    {desk.monitorState === 'design' && (
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-3 rounded-sm border border-pink-400/80 bg-pink-950/40 flex items-center justify-center text-[7px] text-pink-300 font-bold">
                          UI/UX
                        </div>
                      </div>
                    )}
                    {desk.monitorState === 'doc' && (
                      <div className="space-y-0.5">
                        <div className="h-1 bg-slate-300 rounded-sm w-full" />
                        <div className="h-1 bg-slate-400 rounded-sm w-4/5" />
                        <div className="h-1 bg-slate-500 rounded-sm w-2/3" />
                      </div>
                    )}
                  </div>

                  {/* Monitor Base Stand */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-slate-600 rounded-t" />
                </div>

                {/* Secondary Screen / Laptop */}
                {desk.hasLaptop ? (
                  <div className="w-9 h-7 rounded bg-slate-900 border border-slate-600 flex flex-col items-center justify-between p-0.5 shadow">
                    <Laptop className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[6px] font-mono text-slate-400">DEV</span>
                  </div>
                ) : (
                  <div
                    className="w-9 h-7 rounded border border-slate-600 flex flex-col justify-between p-0.5 shadow-sm"
                    style={{ backgroundColor: '#090d16' }}
                  >
                    <div
                      className="w-full h-1.5 rounded-sm"
                      style={{ backgroundColor: desk.screenColor }}
                    />
                    <div className="h-1 bg-slate-700 rounded-sm w-3/4" />
                  </div>
                )}
              </div>

              {/* MECHANICAL KEYBOARD, MOUSE & COFFEE PROPS */}
              <div className="flex items-center justify-between px-1.5 mt-0.5">
                {/* Mechanical Keyboard with Backlight */}
                <div className="w-11 h-2.5 bg-slate-950 rounded-sm border border-slate-600 flex items-center justify-around px-0.5 shadow-inner">
                  <span className="w-1 h-1 bg-indigo-400/80 rounded-[1px] animate-pulse" />
                  <span className="w-1 h-1 bg-sky-400/80 rounded-[1px]" />
                  <span className="w-1 h-1 bg-pink-400/80 rounded-[1px]" />
                  <span className="w-1 h-1 bg-emerald-400/80 rounded-[1px]" />
                </div>

                {/* Mouse & Drink / Plant Props */}
                <div className="flex items-center gap-1.5">
                  {/* Steaming Coffee Mug */}
                  {desk.coffee && (
                    <div className="relative group/cup" title="Cà phê nóng hổi">
                      <Coffee className="w-3 h-3 text-amber-400" />
                      {/* Rising Steam Wisp */}
                      <span className="absolute -top-2 left-0.5 text-[8px] animate-steam pointer-events-none text-amber-200">
                        ~
                      </span>
                    </div>
                  )}

                  {/* Potted Mini Plant */}
                  {desk.plant && (
                    <span className="text-[10px] transform hover:scale-125 transition-transform cursor-pointer" title="Sen đá mini">
                      🪴
                    </span>
                  )}

                  {/* Mouse on Mousepad */}
                  <div className="w-2.5 h-3.5 bg-slate-900 rounded border border-slate-600 flex items-start justify-center pt-0.5">
                    <span className="w-1 h-1 bg-blue-400 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Desk Number Badge */}
              <span className="absolute -top-2.5 left-2 px-1.5 py-0.2 bg-slate-900 border border-slate-700 text-[8px] font-mono font-black text-indigo-300 rounded shadow">
                #{String(desk.number).padStart(2, '0')}
              </span>
            </div>

            {/* 2D ERGONOMIC SWIVEL CHAIR WITH WHEELS & SEAT INTERACTION */}
            <button
              type="button"
              onClick={() => onSeatClick(desk.seat)}
              title={
                isOccupied
                  ? `Đang ngồi: ${occupantName}`
                  : `Ghế trống Bàn ${desk.number} - Nhấp để ngồi làm việc`
              }
              className={`absolute left-1/2 -translate-x-1/2 w-11 h-11 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer group ${
                isFacingDown ? 'top-16' : '-top-8'
              } ${
                isOccupied
                  ? 'bg-indigo-950 border-2 border-indigo-500 shadow-lg'
                  : 'bg-slate-800/90 hover:bg-indigo-600 border-2 border-slate-600 hover:border-indigo-400 shadow hover:scale-110 active:scale-95'
              }`}
            >
              {/* 5-Caster Base representation */}
              <span className="absolute inset-0 rounded-full border border-dashed border-slate-500/40 pointer-events-none" />

              {/* Chair Backrest & Cushion */}
              <span
                className={`w-6 h-5 rounded-lg flex items-center justify-center text-[10px] shadow-sm font-bold transition-colors ${
                  isOccupied
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-700 group-hover:bg-indigo-500 text-slate-300 group-hover:text-white'
                }`}
              >
                💺
              </span>

              {/* Status Indicator Glow */}
              <span
                className={`w-2 h-2 rounded-full absolute -top-1 -right-1 shadow-md border border-slate-900 ${
                  isOccupied ? 'bg-indigo-400 animate-pulse' : 'bg-emerald-400'
                }`}
              />

              {/* Hover Tooltip Label */}
              <span className="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-indigo-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-indigo-500 whitespace-nowrap pointer-events-none z-20 shadow-xl">
                {isOccupied ? occupantName : `Ngồi Bàn #${desk.number}`}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
