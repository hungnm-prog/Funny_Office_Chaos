import React, { useState, useRef, useEffect } from 'react';
import type { ToastItem } from '../types/game';
import { ChevronDown, ChevronUp, ArrowRight, User } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  onToggleExpand: (id: string) => void;
}

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
  onToggleExpand: (id: string) => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onDismiss, onToggleExpand }) => {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSwipedAway, setIsSwipedAway] = useState(false);
  const startXRef = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const { message, isExpanded, isLong, createdAt } = toast;

  // Auto-hide countdown for short messages only!
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    // If message is long or expanded, DO NOT auto-hide after 10s!
    if (isLong || isExpanded) {
      return;
    }

    const interval = setInterval(() => {
      const elapsed = (Date.now() - createdAt) / 1000;
      const remaining = Math.max(0, 10 - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onDismiss(toast.id);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [createdAt, isLong, isExpanded, onDismiss, toast.id]);

  // Swipe / Drag to the right handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    if (deltaX > 0) {
      setDragOffset(deltaX);
      if (deltaX > 140) {
        triggerSwipeDismiss();
      }
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset < 140) {
      setDragOffset(0);
    }
  };

  // Touch support for swipe to the right
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startXRef.current;
    if (deltaX > 0) {
      setDragOffset(deltaX);
      if (deltaX > 140) {
        triggerSwipeDismiss();
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragOffset < 140) {
      setDragOffset(0);
    }
  };

  const triggerSwipeDismiss = () => {
    setIsDragging(false);
    setIsSwipedAway(true);
    setDragOffset(400); // Fly off to right
    setTimeout(() => {
      onDismiss(toast.id);
    }, 250);
  };

  // Format content with highlighted mentions
  const renderFormattedContent = (text: string) => {
    const parts = text.split(/(@\S+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return (
          <span
            key={i}
            className="font-bold text-indigo-300 bg-indigo-950/80 px-1 py-0.5 rounded border border-indigo-700/60"
          >
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const isEligibleForSwipe = isLong || isExpanded;

  return (
    <div
      ref={cardRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateX(${dragOffset}px)`,
        opacity: isSwipedAway ? 0 : Math.max(0.2, 1 - dragOffset / 300),
        transition: isDragging ? 'none' : 'transform 0.25s ease-out, opacity 0.25s ease-out',
      }}
      className={`relative w-80 md:w-96 rounded-2xl bg-slate-900/95 backdrop-blur-md border shadow-2xl p-3.5 select-none transition-shadow ${
        isEligibleForSwipe
          ? 'border-indigo-500/70 shadow-indigo-500/10 cursor-grab active:cursor-grabbing'
          : 'border-slate-700/80'
      }`}
    >
      {/* 10s Countdown Progress Bar (Short messages only) */}
      {!isEligibleForSwipe && (
        <div className="absolute top-0 inset-x-0 h-1 bg-slate-800 rounded-t-2xl overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-200"
            style={{ width: `${(timeLeft / 10) * 100}%` }}
          />
        </div>
      )}

      {/* Header Info */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {/* Avatar Icon */}
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow"
            style={{ backgroundColor: message.senderAppearance.outfitColor || '#4f46e5' }}
          >
            <User className="w-4 h-4" />
          </div>

          <div>
            <div className="text-xs font-black text-white flex items-center gap-1.5">
              <span>{message.senderName}</span>
              <span className="text-[10px] text-slate-400 font-normal">({message.senderRole})</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">{message.timestamp}</span>
          </div>
        </div>

        {/* Action icons / Dropdown button */}
        <div className="flex items-center gap-1">
          {isLong && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(toast.id);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/60 text-[11px] font-bold transition-colors cursor-pointer"
              title={isExpanded ? 'Thu gọn' : 'Bấm để xem nội dung đầy đủ'}
            >
              <span>{isExpanded ? 'Thu Gọn' : 'Đầy Đủ'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}

          {!isLong && (
            <span className="text-[10px] text-slate-500 font-mono">
              {Math.ceil(timeLeft)}s
            </span>
          )}
        </div>
      </div>

      {/* Message Content */}
      <div className="text-xs text-slate-200 leading-relaxed">
        {isLong && !isExpanded ? (
          <div>
            <p className="line-clamp-2">{renderFormattedContent(message.content)}</p>
            <button
              type="button"
              onClick={() => onToggleExpand(toast.id)}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold mt-1 inline-flex items-center gap-1 cursor-pointer"
            >
              Xem thêm... <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="whitespace-pre-wrap">{renderFormattedContent(message.content)}</p>
          </div>
        )}
      </div>

      {/* Swipe to dismiss hint for long messages */}
      {isEligibleForSwipe && (
        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
          <span className="text-amber-400/90 font-medium flex items-center gap-1">
            <ArrowRight className="w-3 h-3 animate-pulse" />
            Lướt sang phải để ẩn thông báo
          </span>
          <button
            type="button"
            onClick={triggerSwipeDismiss}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700 text-[10px] font-semibold transition-colors"
          >
            Lướt ngay ➔
          </button>
        </div>
      )}
    </div>
  );
};

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
  onToggleExpand,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-3 pointer-events-auto max-h-[85vh] overflow-y-auto pr-1">
      {toasts.map((toast) => (
        <ToastCard
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
          onToggleExpand={onToggleExpand}
        />
      ))}
    </div>
  );
};
