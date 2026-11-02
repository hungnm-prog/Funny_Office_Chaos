import React, { useState } from 'react';
import { OFFICE_ZONES, MAP_WIDTH, MAP_HEIGHT } from '../constants/officeLayout';
import type { Character } from '../types/game';
import { Map, ChevronDown, ChevronUp, Crosshair } from 'lucide-react';

interface MinimapProps {
  characters: Character[];
  userCharacter: Character;
  onFocusLocation: (x: number, y: number) => void;
  viewportCenter: { x: number; y: number };
}

export const Minimap: React.FC<MinimapProps> = React.memo(({
  characters,
  userCharacter,
  onFocusLocation,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  // Scaled dimensions for the minimap preview
  const miniWidth = 240;
  const miniHeight = (miniWidth / MAP_WIDTH) * MAP_HEIGHT;

  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end">
      {/* Minimap Card */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 w-64">
        {/* Header Bar */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between px-3 py-2 bg-slate-800/80 cursor-pointer hover:bg-slate-700/80 transition-colors select-none"
        >
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-white tracking-wide">
              Bản Đồ Công Sở (Minimap)
            </span>
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-white transition-colors"
          >
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Collapsible Content */}
        {isOpen && (
          <div className="p-3 space-y-3">
            {/* 2D Mini Visual Canvas */}
            <div
              className="relative rounded-xl border border-slate-700 bg-slate-950 overflow-hidden shadow-inner mx-auto cursor-crosshair"
              style={{ width: miniWidth, height: miniHeight }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;
                const worldX = (clickX / miniWidth) * MAP_WIDTH;
                const worldY = (clickY / miniHeight) * MAP_HEIGHT;
                onFocusLocation(worldX, worldY);
              }}
              title="Nhấp vào bất kỳ đâu trên bản đồ để di chuyển góc nhìn"
            >
              {/* Zone Rectangles on Minimap */}
              {OFFICE_ZONES.map((zone) => {
                const left = (zone.bounds.x / MAP_WIDTH) * miniWidth;
                const top = (zone.bounds.y / MAP_HEIGHT) * miniHeight;
                const width = (zone.bounds.width / MAP_WIDTH) * miniWidth;
                const height = (zone.bounds.height / MAP_HEIGHT) * miniHeight;

                return (
                  <div
                    key={zone.id}
                    className="absolute rounded border opacity-40 hover:opacity-90 transition-opacity"
                    style={{
                      left,
                      top,
                      width,
                      height,
                      backgroundColor: `${zone.color}25`,
                      borderColor: zone.color,
                    }}
                    title={zone.name}
                  >
                    <span className="absolute top-0.5 left-0.5 text-[8px] font-black text-white px-0.5 rounded bg-slate-900/80">
                      {zone.icon}
                    </span>
                  </div>
                );
              })}

              {/* Characters Dots */}
              {characters.map((char) => {
                const cx = (char.position.x / MAP_WIDTH) * miniWidth;
                const cy = (char.position.y / MAP_HEIGHT) * miniHeight;
                const isMe = char.id === userCharacter.id;

                return (
                  <div
                    key={char.id}
                    className={`absolute rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${
                      isMe
                        ? 'w-3 h-3 bg-indigo-400 border-2 border-white shadow-lg shadow-indigo-500/80 z-20 animate-pulse'
                        : 'w-2 h-2 bg-emerald-400 border border-slate-900 z-10'
                    }`}
                    style={{ left: cx, top: cy }}
                    title={`${char.name} (${char.role})`}
                  />
                );
              })}
            </div>

            {/* Quick Travel Zone Buttons */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Chuyển Nhanh Không Gian:
              </span>
              <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto pr-0.5">
                {OFFICE_ZONES.map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => onFocusLocation(zone.focusPoint.x, zone.focusPoint.y)}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-left transition-all border border-slate-700/60 group"
                  >
                    <span className="text-xs group-hover:scale-125 transition-transform">
                      {zone.icon}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-200 truncate">
                      {zone.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Center on Me Button */}
            <button
              type="button"
              onClick={() => onFocusLocation(userCharacter.position.x, userCharacter.position.y)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/50 text-xs font-bold transition-all"
            >
              <Crosshair className="w-3.5 h-3.5 text-indigo-400" />
              Định Vị Nhân Vật Của Tôi
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

Minimap.displayName = 'Minimap';
