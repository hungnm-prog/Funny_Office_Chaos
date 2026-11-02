import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Character, Seat } from '../types/game';
import { MAP_WIDTH, MAP_HEIGHT } from '../constants/officeLayout';
import { WorkZone } from './OfficeZones/WorkZone';
import { KitchenZone } from './OfficeZones/KitchenZone';
import { RecreationZone } from './OfficeZones/RecreationZone';
import { CharacterAvatar } from './CharacterAvatar';
import { ZoomIn, ZoomOut, MousePointerClick, Compass } from 'lucide-react';

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
  const isMouseDownRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0, hasMoved: false });
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

  // Keyboard Movement (WASD and Arrow Keys) for real-time 2D game walking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger walking if typing in an input or textarea
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }

      const step = e.shiftKey ? 36 : 22;
      let dx = 0;
      let dy = 0;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          dy = -step;
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          dy = step;
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          dx = -step;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          dx = step;
          break;
        default:
          return;
      }

      e.preventDefault();
      const currentX = userCharacter.position.x;
      const currentY = userCharacter.position.y;
      const nextX = Math.max(120, Math.min(MAP_WIDTH - 120, currentX + dx));
      const nextY = Math.max(160, Math.min(MAP_HEIGHT - 120, currentY + dy));

      onMoveUser(nextX, nextY);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [userCharacter.position.x, userCharacter.position.y, onMoveUser]);

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
  // Nhấn giữ chuột và kéo -> di chuyển bản đồ (Pan & Drag)
  // Nhấp chuột ngắn (< 6px) -> di chuyển nhân vật (Click to Move)
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('.no-click-move')) {
      return;
    }

    isMouseDownRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
      hasMoved: false,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const dist = Math.hypot(dx, dy);

    // Kéo chuột quá 4px sẽ kích hoạt kéo di chuyển góc nhìn bản đồ
    if (dist > 4) {
      if (!dragStartRef.current.hasMoved) {
        dragStartRef.current.hasMoved = true;
        setIsPanning(true);
      }
      setPan({
        x: dragStartRef.current.panX + dx,
        y: dragStartRef.current.panY + dy,
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current) return;
    isMouseDownRef.current = false;

    const wasDragging = dragStartRef.current.hasMoved;
    setIsPanning(false);

    // Nếu không kéo chuột (chỉ click chuột trái) -> Di chuyển nhân vật
    if (!wasDragging && e.button === 0) {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('input') || target.closest('.no-click-move')) {
        return;
      }

      if (containerRef.current) {
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

  const handleMouseLeave = () => {
    if (isMouseDownRef.current) {
      isMouseDownRef.current = false;
      setIsPanning(false);
    }
  };

  // Touch Pan & Tap to Move
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('input') || target.closest('.no-click-move')) {
        return;
      }
      const touch = e.touches[0];
      isMouseDownRef.current = true;
      dragStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        panX: pan.x,
        panY: pan.y,
        hasMoved: false,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMouseDownRef.current || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.x;
    const dy = touch.clientY - dragStartRef.current.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 5) {
      if (!dragStartRef.current.hasMoved) {
        dragStartRef.current.hasMoved = true;
        setIsPanning(true);
      }
      setPan({
        x: dragStartRef.current.panX + dx,
        y: dragStartRef.current.panY + dy,
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isMouseDownRef.current) return;
    isMouseDownRef.current = false;

    const wasDragging = dragStartRef.current.hasMoved;
    setIsPanning(false);

    if (!wasDragging && e.changedTouches.length === 1 && containerRef.current) {
      const touch = e.changedTouches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const worldX = (touch.clientX - rect.left - pan.x) / zoom;
      const worldY = (touch.clientY - rect.top - pan.y) / zoom;

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
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={(e) => e.preventDefault()}
      className={`relative w-full h-full overflow-hidden bg-[#090d16] select-none ${
        isPanning ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* FLOATING ZOOM & VIEW CONTROLS */}
      <div className="fixed bottom-24 left-6 z-40 flex items-center gap-1.5 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 shadow-2xl rounded-2xl p-1.5 no-click-move">
        <button
          type="button"
          onClick={() => handleZoom(0.15)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white transition-all active:scale-95 shadow cursor-pointer"
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
          className="p-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white transition-all active:scale-95 shadow cursor-pointer"
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
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all active:scale-95 cursor-pointer"
          title="Tái định vị nhân vật chính"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* GAME NAVIGATION GUIDE BADGE */}
      <div className="fixed top-20 left-6 z-30 pointer-events-none hidden md:flex items-center gap-2 bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-xl px-3.5 py-1.5 text-xs text-slate-300 shadow-xl">
        <MousePointerClick className="w-4 h-4 text-indigo-400 animate-pulse" />
        <span>
          <strong className="text-white">WASD / Phím Mũi Tên:</strong> Đi lại •{' '}
          <strong className="text-white">Click Chuột:</strong> Di chuyển tới đích •{' '}
          <strong className="text-white">Kéo Chuột:</strong> Di chuyển bản đồ
        </span>
      </div>

      {/* TRANSFORM CONTAINER FOR THE ENTIRE 2D GAME OFFICE WORLD */}
      <div
        className="absolute origin-top-left transition-transform duration-75 ease-out will-change-transform"
        style={{
          width: MAP_WIDTH,
          height: MAP_HEIGHT,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        {/* MASTER 2D BUILDING FLOORPLAN */}
        <div
          className="absolute inset-0 rounded-[48px] shadow-2xl border-8 border-[#1e293b] overflow-hidden"
          style={{
            background: '#0d131f',
          }}
        >
          {/* ========================================================= */}
          {/* 1. OUTER PERIMETER BUILDING WALLS WITH WINDOWS */}
          {/* ========================================================= */}
          {/* North Exterior Wall with 2D Skylight Windows */}
          <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#0f172a] to-[#1e293b] border-b-4 border-[#334155] flex items-center justify-around px-16 shadow-lg z-20 pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="w-40 h-9 rounded-t-lg bg-gradient-to-b from-sky-400/25 via-indigo-500/15 to-transparent border-2 border-sky-400/40 shadow-inner flex items-center justify-around px-2"
              >
                <div className="w-0.5 h-full bg-sky-300/30" />
                <div className="w-0.5 h-full bg-sky-300/30" />
                <div className="w-0.5 h-full bg-sky-300/30" />
              </div>
            ))}
          </div>

          {/* West & East Exterior Brick Walls */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#020617] to-[#0f172a] border-r-4 border-[#334155] z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#020617] to-[#0f172a] border-l-4 border-[#334155] z-20 pointer-events-none" />
          {/* South Exterior Wall */}
          <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[#020617] to-[#0f172a] border-t-4 border-[#334155] z-20 pointer-events-none" />

          {/* ========================================================= */}
          {/* 2. GRAND CENTRAL CORRIDOR (ĐẠI LỘ HÀNH LANG CHÍNH) */}
          {/* ========================================================= */}
          {/* Hallway connects North to South from x=1140 to x=1280 */}
          <div
            className="absolute top-16 bottom-8 tile-floor-marble border-x-4 border-[#334155] shadow-2xl pointer-events-none"
            style={{
              left: 1140,
              width: 140,
            }}
          >
            {/* Grand Royal Red Carpet Runner with Gold Border down the Hallway Center */}
            <div
              className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-16 bg-[#831843] border-x-2 border-[#f59e0b] shadow-lg flex flex-col justify-around items-center"
            >
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="w-10 h-0.5 bg-[#f59e0b]/30" />
              ))}
            </div>

            {/* Potted Ficus Trees along the Hallway */}
            <div className="absolute top-28 left-2 text-2xl filter drop-shadow">🪴</div>
            <div className="absolute top-28 right-2 text-2xl filter drop-shadow">🪴</div>
            <div className="absolute top-[480px] left-2 text-2xl filter drop-shadow">🪴</div>
            <div className="absolute top-[480px] right-2 text-2xl filter drop-shadow">🪴</div>
            <div className="absolute top-[900px] left-2 text-2xl filter drop-shadow">🪴</div>
            <div className="absolute top-[900px] right-2 text-2xl filter drop-shadow">🪴</div>
            <div className="absolute top-[1380px] left-2 text-2xl filter drop-shadow">🪴</div>
            <div className="absolute top-[1380px] right-2 text-2xl filter drop-shadow">🪴</div>

            {/* Hallway Wayfinding Floor Direction Decals */}
            <div className="absolute top-64 left-1/2 -translate-x-1/2 bg-slate-900/90 text-[9px] font-mono font-bold text-amber-300 px-2 py-0.5 rounded border border-amber-500/50 whitespace-nowrap shadow">
              ⬅️ LÀM VIỆC • HỒ KOI ➡️
            </div>
            <div className="absolute top-[820px] left-1/2 -translate-x-1/2 bg-slate-900/90 text-[9px] font-mono font-bold text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/50 whitespace-nowrap shadow">
              ⬅️ CĂN TIN • CASINO ➡️
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. 2D GRAND LOBBY & RECEPTION COUNTER (Top Center) */}
          {/* ========================================================= */}
          <div
            className="absolute top-18 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/70 px-8 py-2.5 rounded-2xl shadow-2xl pointer-events-none"
          >
            {/* Reception Oak Desk with Bell & Laptop */}
            <div className="flex items-center gap-3">
              <span className="text-3xl filter drop-shadow">🏢</span>
              <div>
                <h2 className="text-sm font-black tracking-widest text-white uppercase font-mono">
                  FUNNY OFFICE CHAOS • 2D METAVERSE
                </h2>
                <p className="text-[10px] text-indigo-300 font-medium">
                  20 Bàn Làm Việc • 3 Bàn Căn Tin (24 Ghế) • Hồ Cá Koi • Rạp Phim • Sòng Bài • Phòng Arcade
                </p>
              </div>
            </div>

            <div className="w-[1px] h-8 bg-indigo-500/40" />

            {/* Reception Props */}
            <div className="flex items-center gap-2 text-sm">
              <span title="Chuông Tiếp Tân">🛎️</span>
              <span title="Hoa Chào Mừng">💐</span>
              <span title="Cà Phê Sáng">☕</span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 4. OFFICE ZONES */}
          {/* ========================================================= */}
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

          {/* ========================================================= */}
          {/* 5. CLICK RIPPLE BEACONS */}
          {/* ========================================================= */}
          {ripples.map((rip) => (
            <div
              key={rip.id}
              className="click-ripple"
              style={{ left: rip.x, top: rip.y }}
            />
          ))}

          {/* ========================================================= */}
          {/* 6. CHARACTERS RENDERING (PLAYER + ALL MULTIPLAYER COLLEAGUES) */}
          {/* ========================================================= */}
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

                  {/* Speech Bubble Arrow */}
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] border-t-slate-700 -mt-[1px]" />
                </div>

                {/* 2. 2D CHARACTER AVATAR */}
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

                  {/* Character Nameplate */}
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
