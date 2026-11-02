import React from 'react';
import type { DimensionId, Character } from '../types/game';
import { DIMENSIONS } from '../constants/officeLayout';
import { Orbit } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DimensionNavHUDProps {
  currentDimension: DimensionId;
  onSelectDimension: (dimId: DimensionId) => void;
  allCharacters: Character[];
}

export const DimensionNavHUD: React.FC<DimensionNavHUDProps> = React.memo(({
  currentDimension,
  onSelectDimension,
  allCharacters,
}) => {
  const handleWarp = (dimId: DimensionId) => {
    if (dimId === currentDimension) return;
    try {
      confetti({ particleCount: 45, spread: 65, origin: { x: 0.5, y: 0.1 } });
    } catch {}
    onSelectDimension(dimId);
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-auto select-none">
      <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-xl border-2 border-indigo-500/50 rounded-2xl p-1.5 shadow-2xl">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-400/40 text-indigo-200 text-xs font-black font-mono">
          <Orbit className="w-4 h-4 text-cyan-300 animate-spin" />
          <span className="hidden md:inline">ĐA CHIỀU:</span>
        </div>

        {DIMENSIONS.map((dim) => {
          const isActive = dim.id === currentDimension;
          // Count players currently in this dimension
          const countInDim = allCharacters.filter(
            (c) => (c.dimensionId || 'office') === dim.id
          ).length;

          return (
            <button
              key={dim.id}
              type="button"
              onClick={() => handleWarp(dim.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg scale-105 border border-indigo-300'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 hover:scale-105 active:scale-95'
              }`}
              title={`${dim.name} • ${dim.tagline}`}
            >
              <span className="text-sm">{dim.icon}</span>
              <span className="hidden sm:inline">{dim.name}</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                {countInDim}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

DimensionNavHUD.displayName = 'DimensionNavHUD';

