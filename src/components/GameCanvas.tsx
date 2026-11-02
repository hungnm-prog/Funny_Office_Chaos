import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Character, Seat } from '../types/game';
import { MAP_WIDTH, MAP_HEIGHT } from '../constants/officeLayout';
import { WorkZone } from './OfficeZones/WorkZone';
import { KitchenZone } from './OfficeZones/KitchenZone';
import { RecreationZone } from './OfficeZones/RecreationZone';
import { CharacterAvatar } from './CharacterAvatar';
import { ZoomIn, ZoomOut, RotateCcw, MousePointerClick } from 'lucide-react';

interface GameCanvasProps {
  userCharacter: Character;
  allCharacters: Character[];
  onMoveUser: (targetX: number, targetY: number) => void;
  onSeatUser: (seat: Seat) => void;
  onTriggerEvent: (title: string, message: string) => void;
  focusCoord?: { x: number; y: number } | null;
  onClearFocus: () => void;
}

interface ClickRipple {
  id: number;
  x: number;
  y: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  userCharacter,
  allCharacters,
  onMoveUser,
  onSeatUser,
  onTriggerEvent,
  focusCoord,
  onClearFocus,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom & Pan State
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: -150, y: -80 });
  const [isPanning, setIsPanning] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const [ripples, setRipples] = useState<ClickRipple[]>([]);

  // Smoothly center on character on initial mount or when requested
  useEffect(() => {
    if (focusCoord && containerRef.current) {
      const containerW = containerRef.current.clientWidth;
      const containerH = containerRef.current.clientHeight;

      const newPanX = containerW / 2 - focusCoord.x * zoom;
      const newPanY = containerH / 2 - focusCoord.y * zoom;

      setPan({ x: newPanX, y: newPanY });
      onClearFocus();
    }
  }, [focusCoord, zoom, onClearFocus]);

  // Center on player on first load
  useEffect(() => {
    if (containerRef.current) {
      const containerW = containerRef.current.clientWidth;
      const containerH = containerRef.current.clientHeight;
      setPan({
        x: containerW / 2 - userCharacter.position.x * zoom,
        y: containerH / 2 - userCharacter.position.y * zoom,
      });
    }
  }, []);

  // Zoom handlers
  const handleZoom = useCallback((delta: number, clientX?: number, clientY?: number) => {
    setZoom((prevZoom) => {
      const newZoom = Math.min(2.0, Math.max(0.45, prevZoom + delta));

      if (containerRef.current) {
        const cx = clientX ?? containerRef.current.clientWidth / 2;
        const cy = clientY ?? containerRef.current.clientHeight / 2;
        const scaleChange = newZoom / prevZoom;

        setPan((prevPan) => ({
          x: cx - (cx - prevPan.x) * scaleChange,
          y: cy - (cy - prevPan.y) * scaleChange,
        }));
      }

      return newZoom;
    });
  }, []);

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    handleZoom(delta, e.clientX, e.clientY);
  };

  // Mouse Pan & Click to Move
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || e.button === 2) {
      setIsPanning(true);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        panX: pan.x,
        panY: pan.y,
      };
      return;
    }

    if (e.button === 0) {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('input') || target.closest('.no-click-move')) {
        return;
      }

      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        panX: pan.x,
        panY: pan.y,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPan({
        x: dragStartRef.current.panX + dx,
        y: dragStartRef.current.panY + dy,
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (e.button === 0) {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('input') || target.closest('.no-click-move')) {
        return;
      }

      const dist = Math.hypot(e.clientX - dragStartRef.current.x, e.clientY - dragStartRef.current.y);
      if (dist < 8 && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const worldX = (e.clientX - rect.left - pan.x) / zoom;
        const worldY = (e.clientY - rect.top - pan.y) / zoom;

        const boundedX = Math.max(120, Math.min(MAP_WIDTH - 120, worldX));
        const boundedY = Math.max(160, Math.min(MAP_HEIGHT - 120, worldY));

        const newRipple: ClickRipple = {
          id: Date.now() + Math.random(),
          x: boundedX,
          y: boundedY,
        };
        setRipples((prev) => [...prev, newRipple]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 600);

        onMoveUser(boundedX, boundedY);
      }
    }
  };

  const occupiedSeats: Record<string, string> = {};
  allCharacters.forEach((char) => {
    if (char.isSitting && char.sittingSeatId) {
      occupiedSeats[char.sittingSeatId] = char.name;
    }
  });

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={(e) => e.preventDefault()}
      className="relative w-full h-full overflow-hidden bg-[#090d16] cursor-default select-none"
    >
      {/* FLOATING ZOOM CONTROLS */}
      <div className="fixed bottom-24 left-6 z-40 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-2xl rounded-2xl p-1.5 no-click-move">
        <button
          type="button"
          onClick={() => handleZoom(0.15)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white transition-all active:scale-95 shadow"
          title="Phóng to (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <span className="px-2 font-mono font-bold text-xs text-indigo-300 min-w-[50px] text-center">
          {Math.round(zoom * 100)}%
        </span>

        <button
          type="button"
          onClick={() => handleZoom(-0.15)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white transition-all active:scale-95 shadow"
          title="Thu nhỏ (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-slate-700 mx-0.5" />

        <button
          type="button"
          onClick={() => {
            setZoom(0.85);
            if (containerRef.current) {
              setPan({
                x: containerRef.current.clientWidth / 2 - userCharacter.position.x * 0.85,
                y: containerRef.current.clientHeight / 2 - userCharacter.position.y * 0.85,
              });
            }
          }}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all active:scale-95"
          title="Đặt lại góc nhìn 100%"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* CLICK TO MOVE HINT */}
      <div className="fixed top-20 left-6 z-30 pointer-events-none hidden md:flex items-center gap-2 bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-400">
        <MousePointerClick className="w-3.5 h-3.5 text-indigo-400" />
        <span>Nhấp chuột vào sàn để di chuyển • Cuộn chuột để phóng to/thu nhỏ</span>
      </div>

      {/* TRANSFORM CONTAINER FOR THE ENTIRE OFFICE WORLD */}
      <div
        className="absolute origin-top-left transition-transform duration-75 ease-out will-change-transform"
        style={{
          width: MAP_WIDTH,
          height: MAP_HEIGHT,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        {/* OFFICE FLOOR */}
        <div
          className="absolute inset-0 rounded-[48px] shadow-2xl border-8 border-slate-800 overflow-hidden"
          style={{
            background: `
              radial-gradient(circle at 50% 50%, #1a2234 0%, #0d121f 100%)
            `,
          }}
        >
          {/* Subtle Tile Grid Flooring */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Office Hallway Walkways */}
          <div className="absolute top-0 bottom-0 left-[1200px] w-16 bg-slate-800/40 border-x border-slate-700/40 pointer-events-none" />
          <div className="absolute left-0 right-0 top-[900px] h-16 bg-slate-800/40 border-y border-slate-700/40 pointer-events-none" />

          {/* Office Welcome Reception Lobby */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700 px-8 py-3 rounded-2xl shadow-xl flex items-center gap-4">
            <span className="text-3xl">🏢</span>
            <div>
              <h2 className="text-lg font-black tracking-wider text-white">
                CÔNG SỞ TRỰC TUYẾN 4.0
              </h2>
              <p className="text-[11px] text-indigo-300">
                20 Chỗ Làm Việc • Căn Tin 3 Bàn (24 Ghế) • Hồ Cá Koi • Rạp Phim • Sòng Bài • Gaming Arcade
              </p>
            </div>
          </div>

          {/* ZONE 1: WORK ZONE (20 Desks) */}
          <WorkZone onSeatClick={onSeatUser} occupiedSeats={occupiedSeats} />

          {/* ZONE 2: KITCHEN & CANTEEN ZONE (3 Tables x 8 Seats = 24 Seats) */}
          <KitchenZone onSeatClick={onSeatUser} occupiedSeats={occupiedSeats} />

          {/* ZONE 3: RECREATION ZONE (Fishing, Cards, Cinema, Gaming) */}
          <RecreationZone
            onSeatClick={onSeatUser}
            occupiedSeats={occupiedSeats}
            onTriggerEvent={onTriggerEvent}
          />

          {/* CLICK RIPPLE BEACONS */}
          {ripples.map((rip) => (
            <div
              key={rip.id}
              className="click-ripple"
              style={{ left: rip.x, top: rip.y }}
            />
          ))}

          {/* CHARACTERS RENDERING (PLAYER + ALL COLLEAGUES) */}
          {allCharacters.map((char) => {
            const isUser = char.id === userCharacter.id;

            return (
              <div
                key={char.id}
                className="absolute transition-all duration-100 ease-linear pointer-events-none"
                style={{
                  left: char.position.x,
                  top: char.position.y,
                  transform: 'translate(-50%, -75%)',
                  zIndex: Math.floor(char.position.y),
                }}
              >
                {/* 1. PERSISTENT CHAT BUBBLE ALWAYS VISIBLE ABOVE CHARACTER'S HEAD */}
                <div className="relative mb-2 flex flex-col items-center">
                  <div className="max-w-[220px] rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700 text-slate-100 px-3 py-1.5 shadow-2xl flex flex-col items-center text-center">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          char.status === 'online'
                            ? 'bg-emerald-400'
                            : char.status === 'busy'
                            ? 'bg-amber-400'
                            : 'bg-slate-400'
                        }`}
                      />
                      <span className="text-[10px] font-black text-indigo-300">
                        {isUser ? `${char.name} (Tôi)` : char.name}
                      </span>
                    </div>

                    <p className="text-[11px] leading-snug font-medium text-white break-words">
                      {char.lastMessage.split(/(@\S+)/g).map((part, idx) =>
                        part.startsWith('@') ? (
                          <span
                            key={idx}
                            className="font-bold text-amber-300 bg-amber-950/80 px-1 py-0.2 rounded border border-amber-600/40"
                          >
                            {part}
                          </span>
                        ) : (
                          part
                        )
                      )}
                    </p>

                    <span className="text-[8px] text-slate-500 font-mono mt-0.5">
                      {char.lastMessageTime}
                    </span>
                  </div>

                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] border-t-slate-700 -mt-[1px]" />
                </div>

                {/* 2. CHARACTER AVATAR */}
                <div className="relative flex flex-col items-center">
                  {char.isSitting && (
                    <span className="absolute -top-3 px-1.5 py-0.2 rounded-full bg-indigo-900/90 border border-indigo-500 text-[9px] font-bold text-indigo-200 shadow z-30">
                      Đang ngồi
                    </span>
                  )}

                  <CharacterAvatar
                    appearance={char.appearance}
                    direction={char.direction}
                    isMoving={char.isMoving}
                    isSitting={char.isSitting}
                    currentAction={char.currentAction}
                    size={58}
                  />

                  <div
                    className={`mt-1 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide flex items-center gap-1 shadow-md border ${
                      isUser
                        ? 'bg-indigo-600 border-indigo-300 text-white'
                        : 'bg-slate-900/90 border-slate-700 text-slate-200'
                    }`}
                  >
                    <span>{char.name}</span>
                    <span className="text-[8px] opacity-75 font-normal">
                      • {char.role.split(' ')[0]}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
