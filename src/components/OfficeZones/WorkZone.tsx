import React from 'react';
import { WORK_DESKS } from '../../constants/officeLayout';
import type { Seat } from '../../types/game';
import { Monitor, Laptop, Coffee } from 'lucide-react';

interface WorkZoneProps {
  onSeatClick: (seat: Seat) => void;
  occupiedSeats: Record<string, string>; // seatId -> characterName
}

export const WorkZone: React.FC<WorkZoneProps> = ({ onSeatClick, occupiedSeats }) => {
  return (
    <div
      className="absolute rounded-3xl p-6 border-2 border-slate-700/60 shadow-2xl overflow-hidden"
      style={{
        left: 80,
        top: 150,
        width: 1120,
        height: 780,
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      }}
    >
      {/* Zone Title & Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-700/80 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Monitor className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              Khu Làm Việc Trực Tuyến
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                20 Chỗ Ngồi & Màn Hình Kép
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Nhấp vào ghế trống để ngồi làm việc, gõ phím và tham gia trao đổi công việc
            </p>
          </div>
        </div>

        {/* Status Counter */}
        <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-700 text-xs">
          <span className="text-slate-400">Đã ngồi:</span>
          <span className="font-bold text-emerald-400 font-mono">
            {Object.keys(occupiedSeats).filter((k) => k.startsWith('desk-')).length} / 20
          </span>
        </div>
      </div>

      {/* Grid Floor Pattern */}
      <div
        className="absolute inset-x-6 bottom-6 top-24 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(#64748b 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* 20 Desks */}
      {WORK_DESKS.map((desk) => {
        const isOccupied = !!occupiedSeats[desk.seat.id];
        const occupantName = occupiedSeats[desk.seat.id];

        return (
          <div
            key={desk.id}
            className="absolute transition-transform hover:scale-[1.02]"
            style={{
              left: desk.x - 80,
              top: desk.y - 150,
              width: 150,
              height: 100,
            }}
          >
            {/* The Computer Desk Surface */}
            <div className="relative w-full h-16 rounded-xl bg-gradient-to-b from-slate-700 to-slate-800 border-2 border-slate-600 shadow-lg flex flex-col justify-between p-2">
              {/* Monitors Setup */}
              <div className="flex items-center justify-center gap-2">
                {/* Main Screen */}
                <div
                  className="w-12 h-7 rounded border border-slate-500 flex flex-col justify-between p-0.5 shadow-sm overflow-hidden"
                  style={{ backgroundColor: '#090d16' }}
                >
                  <div className="flex gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-red-400" />
                    <span className="w-1 h-1 rounded-full bg-yellow-400" />
                    <span className="w-1 h-1 rounded-full bg-green-400" />
                  </div>
                  <div
                    className="h-2.5 rounded-sm animate-pulse opacity-80"
                    style={{ backgroundColor: desk.screenColor }}
                  />
                </div>

                {/* Second Monitor or Laptop */}
                {desk.hasLaptop ? (
                  <div className="w-8 h-6 rounded bg-slate-900 border border-slate-600 flex items-center justify-center">
                    <Laptop className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ) : (
                  <div
                    className="w-8 h-6 rounded border border-slate-600 flex items-center justify-center p-0.5"
                    style={{ backgroundColor: '#090d16' }}
                  >
                    <div
                      className="w-full h-1.5 rounded-sm"
                      style={{ backgroundColor: desk.screenColor }}
                    />
                  </div>
                )}
              </div>

              {/* Keyboard, Mouse & Accessories */}
              <div className="flex items-center justify-between px-1">
                <div className="w-10 h-2 bg-slate-900 rounded-sm border border-slate-600" />
                <div className="flex items-center gap-1.5">
                  {desk.coffee && (
                    <span title="Tách Cà Phê">
                      <Coffee className="w-3 h-3 text-amber-500 animate-pulse" />
                    </span>
                  )}
                  {desk.plant && (
                    <span className="text-[10px]" title="Chậu Cây Xanh">
                      🌱
                    </span>
                  )}
                  <span className="w-1.5 h-2 bg-slate-900 rounded-sm" />
                </div>
              </div>

              {/* Desk Number Label */}
              <span className="absolute -top-3 left-2 px-1.5 py-0.2 bg-slate-900 border border-slate-700 text-[9px] font-mono font-bold text-slate-300 rounded shadow">
                #{String(desk.number).padStart(2, '0')}
              </span>
            </div>

            {/* Ergonomic Office Chair */}
            <button
              type="button"
              onClick={() => onSeatClick(desk.seat)}
              className={`absolute left-1/2 -translate-x-1/2 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer group ${
                desk.seat.direction === 'up' ? 'top-16' : '-top-9'
              } ${
                isOccupied
                  ? 'w-10 h-10 bg-slate-800/80 border-2 border-emerald-500/70 shadow-emerald-500/20'
                  : 'w-9 h-9 bg-slate-800 hover:bg-indigo-600 border-2 border-slate-500 hover:border-indigo-400 shadow-md hover:scale-110'
              }`}
              title={
                isOccupied
                  ? `Đang ngồi: ${occupantName}`
                  : `Ghế trống Bàn ${desk.number} - Bấm để ngồi vào`
              }
            >
              <span
                className={`w-7 h-2.5 rounded-full mb-0.5 ${
                  isOccupied
                    ? 'bg-emerald-500'
                    : 'bg-slate-600 group-hover:bg-indigo-300'
                }`}
              />
              <span
                className={`w-6 h-4 rounded-full ${
                  isOccupied
                    ? 'bg-emerald-700'
                    : 'bg-slate-700 group-hover:bg-indigo-500'
                }`}
              />

              {!isOccupied && (
                <span className="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-indigo-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-indigo-500 whitespace-nowrap pointer-events-none z-10">
                  Ngồi vào
                </span>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};
