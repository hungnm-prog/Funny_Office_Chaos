import React, { useState } from 'react';
import type { Character, CharacterAppearance } from '../types/game';
import { CharacterAvatar } from './CharacterAvatar';
import { Sparkles, Dice5, User, Check, Palette, Eye, Shirt } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CharacterCreatorProps {
  initialCharacter?: Character | null;
  onSave: (character: Character) => void;
  isEditing?: boolean;
  onCancel?: () => void;
}

const HAIR_COLORS = [
  { name: 'Đen Tuyền', color: '#0f172a' },
  { name: 'Nâu Trầm', color: '#451a03' },
  { name: 'Nâu Hạt Dẻ', color: '#78350f' },
  { name: 'Vàng Khói', color: '#ca8a04' },
  { name: 'Bạch Kim', color: '#e2e8f0' },
  { name: 'Đỏ Cherry', color: '#e11d48' },
  { name: 'Hồng Pastel', color: '#f43f5e' },
  { name: 'Tím Khói', color: '#9333ea' },
  { name: 'Xanh Navy', color: '#1e40af' },
  { name: 'Xanh Mint', color: '#059669' },
];

const SKIN_COLORS = [
  { name: 'Trắng Sáng', color: '#fff1f2' },
  { name: 'Trắng Hồng', color: '#ffedd5' },
  { name: 'Tự Nhiên', color: '#fed7aa' },
  { name: 'Ấm Áp', color: '#fde047' },
  { name: 'Nâu Rám Nắng', color: '#d97706' },
  { name: 'Nâu Đồng', color: '#92400e' },
];

const OUTFIT_COLORS = [
  { name: 'Xanh Navy', color: '#1e3a8a' },
  { name: 'Xanh Coban', color: '#2563eb' },
  { name: 'Xanh Lục', color: '#059669' },
  { name: 'Đỏ Rượu', color: '#b91c1c' },
  { name: 'Cam Năng Động', color: '#ea580c' },
  { name: 'Tím Thơ Mộng', color: '#7c3aed' },
  { name: 'Hồng Cá Tính', color: '#db2777' },
  { name: 'Xám Ghi', color: '#475569' },
  { name: 'Đen Sang Trọng', color: '#0f172a' },
  { name: 'Vàng Hoàng Cung', color: '#d97706' },
];

const EYE_COLORS = [
  { name: 'Nâu Đen', color: '#0f172a' },
  { name: 'Nâu Hổ Phách', color: '#78350f' },
  { name: 'Xanh Sapphire', color: '#1d4ed8' },
  { name: 'Xanh Ngọc Lục Bảo', color: '#047857' },
  { name: 'Tím Amethyst', color: '#7e22ce' },
  { name: 'Đỏ Ruby', color: '#be123c' },
];

const HAIR_STYLES = [
  { id: 'short', label: 'Tóc Ngắn Nam Tính' },
  { id: 'ponytail', label: 'Tóc Đuôi Ngựa' },
  { id: 'bob', label: 'Tóc Bob Cá Tính' },
  { id: 'long', label: 'Tóc Dài Thướt Tha' },
  { id: 'curly', label: 'Tóc Xoăn Bồng Bềnh' },
  { id: 'spiky', label: 'Tóc Vuốt Nhọn' },
] as const;

const OUTFIT_STYLES = [
  { id: 'suit', label: 'Vest Công Sở' },
  { id: 'shirt', label: 'Sơ Mi Thanh Lịch' },
  { id: 'casual', label: 'Áo Phông Năng Động' },
  { id: 'hoodie', label: 'Hoodie Trẻ Trung' },
  { id: 'dress', label: 'Váy Công Sở' },
] as const;

const ACCESSORIES = [
  { id: 'none', label: 'Không Có' },
  { id: 'glasses', label: 'Kính Mắt Trí Thức' },
  { id: 'headphones', label: 'Tai Nghe Chống Ồn' },
  { id: 'badge', label: 'Thẻ Nhân Viên' },
] as const;

const SAMPLE_NAMES = [
  'Tuấn Kiệt', 'Hương Giang', 'Minh Đăng', 'Khánh Linh', 'Quang Huy',
  'Ngọc Ánh', 'Việt Hoàng', 'Phương Thảo', 'Thế Anh', 'Thanh Trúc'
];

const SAMPLE_ROLES = [
  'Fullstack Developer', 'UI/UX Designer', 'Product Manager', 'Data Analyst',
  'HR Specialist', 'QA Lead', 'Marketing Specialist', 'DevOps Engineer'
];

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({
  initialCharacter,
  onSave,
  isEditing = false,
  onCancel,
}) => {
  const [name, setName] = useState(initialCharacter?.name || 'Nguyễn Minh Quân');
  const [role, setRole] = useState(initialCharacter?.role || 'Fullstack Developer');
  const [appearance, setAppearance] = useState<CharacterAppearance>(
    initialCharacter?.appearance || {
      hairColor: '#0f172a',
      hairStyle: 'short',
      skinColor: '#fed7aa',
      outfitColor: '#2563eb',
      outfitStyle: 'suit',
      eyeColor: '#0f172a',
      accessory: 'glasses',
    }
  );

  const [activeTab, setActiveTab] = useState<'hair' | 'skin' | 'outfit' | 'eyes' | 'style'>('hair');

  const handleRandomize = () => {
    const randomName = SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
    const randomRole = SAMPLE_ROLES[Math.floor(Math.random() * SAMPLE_ROLES.length)];
    const randomHair = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)].color;
    const randomSkin = SKIN_COLORS[Math.floor(Math.random() * SKIN_COLORS.length)].color;
    const randomOutfit = OUTFIT_COLORS[Math.floor(Math.random() * OUTFIT_COLORS.length)].color;
    const randomEye = EYE_COLORS[Math.floor(Math.random() * EYE_COLORS.length)].color;
    const randomHairStyle = HAIR_STYLES[Math.floor(Math.random() * HAIR_STYLES.length)].id;
    const randomOutfitStyle = OUTFIT_STYLES[Math.floor(Math.random() * OUTFIT_STYLES.length)].id;
    const randomAccessory = ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)].id;

    setName(randomName);
    setRole(randomRole);
    setAppearance({
      hairColor: randomHair,
      hairStyle: randomHairStyle,
      skinColor: randomSkin,
      outfitColor: randomOutfit,
      outfitStyle: randomOutfitStyle,
      eyeColor: randomEye,
      accessory: randomAccessory,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    const newChar: Character = {
      id: initialCharacter?.id || 'player-main',
      name: name.trim(),
      role: role.trim() || 'Nhân Viên Mới',
      appearance,
      status: 'online',
      position: initialCharacter?.position || { x: 550, y: 560 },
      direction: 'down',
      isMoving: false,
      isSitting: false,
      lastMessage: initialCharacter?.lastMessage || 'Chào mọi người, tôi mới gia nhập công ty! 👋✨',
      lastMessageTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isUser: true,
    };

    onSave(newChar);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative px-8 py-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-500 text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-wide">
                {isEditing ? 'Chỉnh Sửa Tạo Hình Nhân Vật' : 'Tạo Hình Nhân Vật Công Sở Của Bạn'}
              </h2>
              <p className="text-sm text-slate-400">
                Tự do thiết kế màu tóc, màu da, bộ đồ và đôi mắt mang đậm dấu ấn riêng
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRandomize}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow"
          >
            <Dice5 className="w-4 h-4 text-indigo-400" />
            Ngẫu Nhiên
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Live 2D Avatar Showcase */}
          <div className="md:col-span-4 flex flex-col items-center justify-between p-6 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/80 border border-slate-700/60 shadow-inner">
            <div className="text-center w-full">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Xem Trước Trực Tiếp
              </span>
              <div className="my-6 flex items-center justify-center p-6 rounded-3xl bg-slate-950/60 border border-slate-800 shadow-2xl relative overflow-hidden group">
                <div
                  className="absolute inset-0 opacity-20 blur-2xl rounded-full transition-all duration-300"
                  style={{ backgroundColor: appearance.outfitColor }}
                />
                <div className="relative transform scale-125 transition-transform duration-300 group-hover:scale-135">
                  <CharacterAvatar appearance={appearance} size={110} direction="down" />
                </div>
              </div>

              {/* Name & Role Preview Tag */}
              <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-3 shadow-md">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-white text-base truncate max-w-[180px]">
                    {name || 'Chưa đặt tên'}
                  </span>
                </div>
                <span className="text-xs text-indigo-300 font-medium block mt-0.5">
                  {role || 'Thành viên'}
                </span>
              </div>
            </div>

            {/* Basic Info Inputs */}
            <div className="w-full space-y-3 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Tên Nhân Vật
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên nhân vật..."
                    maxLength={25}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Chức Vụ / Vị Trí
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Ví dụ: Tech Lead, Designer..."
                  maxLength={30}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Customization Controls (Tabs & Colors) */}
          <div className="md:col-span-8 flex flex-col justify-between">
            {/* Customization Category Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 mb-6">
              {[
                { id: 'hair', label: 'Màu & Kiểu Tóc', icon: Palette },
                { id: 'skin', label: 'Màu Da', icon: User },
                { id: 'outfit', label: 'Bộ Đồ & Trang Phục', icon: Shirt },
                { id: 'eyes', label: 'Màu Đôi Mắt', icon: Eye },
                { id: 'style', label: 'Phụ Kiện', icon: Sparkles },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/80'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Panels */}
            <div className="min-h-[260px]">
              {/* TAB 1: HAIR */}
              {activeTab === 'hair' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center justify-between">
                      <span>Chọn Màu Sắc Tóc</span>
                      <span className="text-xs text-indigo-400 font-mono">
                        {HAIR_COLORS.find((h) => h.color === appearance.hairColor)?.name || 'Tùy chỉnh'}
                      </span>
                    </h4>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                      {HAIR_COLORS.map((item) => (
                        <button
                          key={item.color}
                          type="button"
                          onClick={() => setAppearance({ ...appearance, hairColor: item.color })}
                          className={`relative h-11 rounded-xl transition-all transform hover:scale-110 flex items-center justify-center border-2 ${
                            appearance.hairColor === item.color
                              ? 'border-white scale-105 shadow-lg shadow-indigo-500/30'
                              : 'border-transparent'
                          }`}
                          style={{ backgroundColor: item.color }}
                          title={item.name}
                        >
                          {appearance.hairColor === item.color && (
                            <Check className="w-4 h-4 text-white drop-shadow-md" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-300 mb-3">Chọn Kiểu Tóc</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {HAIR_STYLES.map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => setAppearance({ ...appearance, hairStyle: style.id })}
                          className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                            appearance.hairStyle === style.id
                              ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300 shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SKIN */}
              {activeTab === 'skin' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center justify-between">
                      <span>Chọn Màu Sắc Da</span>
                      <span className="text-xs text-indigo-400 font-mono">
                        {SKIN_COLORS.find((s) => s.color === appearance.skinColor)?.name}
                      </span>
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {SKIN_COLORS.map((item) => (
                        <button
                          key={item.color}
                          type="button"
                          onClick={() => setAppearance({ ...appearance, skinColor: item.color })}
                          className={`relative h-14 rounded-2xl transition-all transform hover:scale-105 flex flex-col items-center justify-center border-2 p-2 ${
                            appearance.skinColor === item.color
                              ? 'border-indigo-400 scale-105 shadow-lg'
                              : 'border-slate-800'
                          }`}
                          style={{ backgroundColor: item.color }}
                        >
                          {appearance.skinColor === item.color && (
                            <Check className="w-5 h-5 text-slate-900 drop-shadow-md" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    💡 Màu da sẽ tự động đồng bộ trên toàn bộ khuôn mặt, cổ và bàn tay của nhân vật trong mọi tư thế di chuyển, làm việc và giải trí.
                  </p>
                </div>
              )}

              {/* TAB 3: OUTFIT */}
              {activeTab === 'outfit' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center justify-between">
                      <span>Chọn Màu Sắc Bộ Đồ</span>
                      <span className="text-xs text-indigo-400 font-mono">
                        {OUTFIT_COLORS.find((o) => o.color === appearance.outfitColor)?.name}
                      </span>
                    </h4>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                      {OUTFIT_COLORS.map((item) => (
                        <button
                          key={item.color}
                          type="button"
                          onClick={() => setAppearance({ ...appearance, outfitColor: item.color })}
                          className={`relative h-11 rounded-xl transition-all transform hover:scale-110 flex items-center justify-center border-2 ${
                            appearance.outfitColor === item.color
                              ? 'border-white scale-105 shadow-lg shadow-indigo-500/30'
                              : 'border-transparent'
                          }`}
                          style={{ backgroundColor: item.color }}
                          title={item.name}
                        >
                          {appearance.outfitColor === item.color && (
                            <Check className="w-4 h-4 text-white drop-shadow-md" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-300 mb-3">Kiểu Trang Phục</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {OUTFIT_STYLES.map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => setAppearance({ ...appearance, outfitStyle: style.id })}
                          className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                            appearance.outfitStyle === style.id
                              ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300 shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: EYES */}
              {activeTab === 'eyes' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center justify-between">
                      <span>Chọn Màu Sắc Đôi Mắt</span>
                      <span className="text-xs text-indigo-400 font-mono">
                        {EYE_COLORS.find((e) => e.color === appearance.eyeColor)?.name}
                      </span>
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {EYE_COLORS.map((item) => (
                        <button
                          key={item.color}
                          type="button"
                          onClick={() => setAppearance({ ...appearance, eyeColor: item.color })}
                          className={`relative h-14 rounded-2xl transition-all transform hover:scale-105 flex flex-col items-center justify-center border-2 p-2 ${
                            appearance.eyeColor === item.color
                              ? 'border-indigo-400 scale-105 shadow-lg'
                              : 'border-slate-800'
                          }`}
                          style={{ backgroundColor: item.color }}
                        >
                          {appearance.eyeColor === item.color && (
                            <Check className="w-5 h-5 text-white drop-shadow-md" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    ✨ Màu mắt thể hiện cá tính riêng biệt của nhân vật và sẽ lấp lánh khi nhân vật trò chuyện trong công sở!
                  </p>
                </div>
              )}

              {/* TAB 5: ACCESSORIES */}
              {activeTab === 'style' && (
                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-slate-300 mb-3">Phụ Kiện Đi Kèm</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {ACCESSORIES.map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => setAppearance({ ...appearance, accessory: acc.id })}
                        className={`p-3.5 rounded-xl border text-sm font-semibold transition-all text-left flex items-center justify-between ${
                          appearance.accessory === acc.id
                            ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300 shadow-md'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <span>{acc.label}</span>
                        {appearance.accessory === acc.id && (
                          <Check className="w-4 h-4 text-indigo-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-800 mt-6">
              {isEditing && onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 text-sm font-semibold transition-all"
                >
                  Hủy Bỏ
                </button>
              )}
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-base shadow-xl shadow-indigo-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Check className="w-5 h-5" />
                {isEditing ? 'Lưu Thay Đổi' : 'Bắt Đầu Vào Công Sở 🏢'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
