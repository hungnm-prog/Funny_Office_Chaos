import React from 'react';
import type { Character } from '../types/game';
import { LogOut, MapPin, ShieldCheck, Check } from 'lucide-react';

interface ExitModalProps {
  userCharacter: Character;
  onConfirmExit: () => void;
  onCancel: () => void;
}

export const ExitModal: React.FC<ExitModalProps> = ({
  userCharacter,
  onConfirmExit,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <LogOut className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">Thoát Khỏi Công Sở</h3>
            <p className="text-xs text-slate-400">Lưu trữ vị trí và chuyển trạng thái ngoại tuyến</p>
          </div>
        </div>

        {/* Saved Info Card */}
        <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-3 text-sm">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400" />
              Tọa độ vị trí lưu lại:
            </span>
            <span className="font-mono font-bold text-white bg-slate-800 px-2.5 py-1 rounded-lg">
              X: {Math.round(userCharacter.position.x)}, Y: {Math.round(userCharacter.position.y)}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Trạng thái khi thoát:
            </span>
            <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              Ngoại tuyến (Offline)
            </span>
          </div>

          <p className="text-xs text-slate-400 pt-2 border-t border-slate-800">
            ✅ Khi bạn quay lại website trong các lần tiếp theo, nhân vật của bạn sẽ xuất hiện chính xác tại vị trí này mà không bị reset.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
          >
            Ở Lại Tiếp Tục
          </button>
          <button
            type="button"
            onClick={onConfirmExit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
          >
            <Check className="w-4 h-4" />
            Lưu & Thoát Ra
          </button>
        </div>
      </div>
    </div>
  );
};
