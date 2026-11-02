import React from 'react';
import type { DimensionId } from '../types/game';
import { DIMENSIONS } from '../constants/officeLayout';
import { Orbit, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DimensionPortalProps {
  currentDimension: DimensionId;
  onTeleport: (dimId: DimensionId) => void;
}

export const DimensionPortal: React.FC<DimensionPortalProps> = ({
  currentDimension,
  onTeleport,
}) => {
  const currentConfig = DIMENSIONS.find((d) => d.id === currentDimension)!;

  const handlePortalClick = (targetDimId: DimensionId) => {
    if (targetDimId === currentDimension) return;
    try {
      confetti({ particleCount: 50, spread: 80, origin: { x: 0.5, y: 0.25 } });
    } catch {}
    onTeleport(targetDimId);
  };

  return (
    <div
      className="absolute flex flex-col items-center pointer-events-auto select-none"
      style={{
        left: currentConfig.portalPosition.x,
        top: currentConfig.portalPosition.y,
        transform: 'translate(-50%, -50%)',
        zIndex: 25,
      }}
    >
      {/* 3D Spinning Dimension Vortex Wormhole */}
      <div className="relative flex items-center justify-center cursor-pointer group">
        {/* Outer Pulsing Particle Ring */}
        <div className="w-28 h-28 rounded-full border-4 border-dashed border-indigo-400/80 animate-spin shadow-2xl" />

        {/* Inner Counter-Rotating Plasma Vortex */}
        <div
          className="absolute w-20 h-20 rounded-full flex items-center justify-center shadow-inner"
          style={{
            background: 'radial-gradient(circle at center, #ec4899 0%, #8b5cf6 50%, #06b6d4 100%)',
            animation: 'spin 4s linear infinite reverse',
            boxShadow: '0 0 35px rgba(139, 92, 246, 0.75), inset 0 0 15px rgba(255, 255, 255, 0.8)',
          }}
        >
          <Orbit className="w-8 h-8 text-white animate-pulse" />
        </div>

        {/* Portal Core Glyph */}
        <span className="absolute text-xl group-hover:scale-125 transition-transform filter drop-shadow">
          🌌
        </span>
      </div>

      {/* Portal Nameplate & Quick Warp Menu */}
      <div className="mt-3 flex flex-col items-center">
        <div className="px-3.5 py-1 rounded-xl bg-slate-900/95 border-2 border-indigo-500/70 shadow-2xl flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase font-mono tracking-wider">
            CỔNG KHÔNG GIAN ĐA CHIỀU
          </span>
        </div>

        {/* 4 Warp Buttons */}
        <div className="flex items-center gap-1.5 mt-2 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-700 shadow-2xl">
          {DIMENSIONS.map((dim) => {
            const isCurrent = dim.id === currentDimension;

            return (
              <button
                key={dim.id}
                type="button"
                onClick={() => handlePortalClick(dim.id)}
                disabled={isCurrent}
                title={isCurrent ? `Hiện đang ở ${dim.name}` : `Dịch chuyển tức thời đến: ${dim.name}`}
                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
                  isCurrent
                    ? 'bg-indigo-600 text-white font-black shadow-lg scale-105 cursor-default'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white hover:scale-105 active:scale-95 cursor-pointer'
                }`}
              >
                <span>{dim.icon}</span>
                <span className="hidden sm:inline">{dim.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
