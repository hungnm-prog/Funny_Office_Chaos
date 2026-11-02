import React, { useState } from 'react';
import type { Character, CharacterAppearance, Gender } from '../types/game';
import { CharacterAvatar } from './CharacterAvatar';
import { Sparkles, Dice5, User, Check, Palette, Eye, Shirt, HardHat } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CharacterCreatorProps {
  initialCharacter?: Character | null;
  onSave: (character: Character) => void;
  isEditing?: boolean;
  onCancel?: () => void;
}

const HAIR_COLORS = [
  { name: 'Đen Tuyền', color: '#0f172a' },
  { name: 'Nâu Hạt Dẻ', color: '#78350f' },
  { name: 'Nâu Trầm', color: '#451a03' },
  { name: 'Nâu Trà Sữa', color: '#a16207' },
  { name: 'Vàng Khói', color: '#ca8a04' },
  { name: 'Bạch Kim', color: '#e2e8f0' },
  { name: 'Đỏ Cherry', color: '#e11d48' },
  { name: 'Hồng Pastel', color: '#f43f5e' },
  { name: 'Tím Khói', color: '#9333ea' },
  { name: 'Xanh Navy', color: '#1e40af' },
  { name: 'Xanh Rêu Mint', color: '#059669' },
];

const SKIN_COLORS = [
  { name: 'Trắng Sáng', color: '#fff1f2' },
  { name: 'Trắng Hồng', color: '#ffedd5' },
  { name: 'Tự Nhiên', color: '#fed7aa' },
  { name: 'Ấm Áp', color: '#fde047' },
  { name: 'Nâu Rám Nắng', color: '#d97706' },
  { name: 'Nâu Đồng Khỏe Khoắn', color: '#92400e' },
];

const OUTFIT_COLORS = [
  { name: 'Xanh Navy', color: '#1e3a8a' },
  { name: 'Xanh Coban', color: '#2563eb' },
  { name: 'Xanh Lục Emerald', color: '#059669' },
  { name: 'Đỏ Rượu Vang', color: '#b91c1c' },
  { name: 'Cam Năng Động', color: '#ea580c' },
  { name: 'Tím Mộng Mơ', color: '#7c3aed' },
  { name: 'Hồng Nữ Tính', color: '#db2777' },
  { name: 'Xám Ghi Thanh Lịch', color: '#475569' },
  { name: 'Đen Sang Trọng', color: '#0f172a' },
  { name: 'Vàng Hoàng Cung', color: '#d97706' },
];

const EYE_COLORS = [
  { name: 'Nâu Đen Tự Nhiên', color: '#0f172a' },
  { name: 'Nâu Hổ Phách', color: '#78350f' },
  { name: 'Xanh Sapphire', color: '#1d4ed8' },
  { name: 'Xanh Ngọc Lục Bảo', color: '#047857' },
  { name: 'Tím Amethyst', color: '#7e22ce' },
  { name: 'Đỏ Ruby Quý Phái', color: '#be123c' },
];

// CHÍNH XÁC 5 KIỂU TÓC NAM THEO YÊU CẦU: Sidepart 7/3, Undercut, Layer, Short Quiff, Buzz Cut
const MALE_HAIR_STYLES = [
  { id: 'sidepart7_3', label: 'Sidepart 7/3', desc: 'Rẽ ngôi 7/3 lãng tử, mái dấu phẩy bồng bềnh ôm trọn đỉnh đầu' },
  { id: 'undercut', label: 'Undercut', desc: 'Hai bên cạo fade gọn gàng, đỉnh đầu vuốt phồng textured hiện đại' },
  { id: 'layer', label: 'Layer', desc: 'Tóc tỉa layer bồng bềnh phủ kín trán chuẩn soái ca Hàn Quốc' },
  { id: 'short_quiff', label: 'Short Quiff', desc: 'Vuốt dựng phồng cao cấp, viền sắc nét, trẻ trung năng động' },
  { id: 'buzz_cut', label: 'Buzz Cut', desc: 'Đầu đinh cua ôm sát viền sọ, đường chân tóc vuông vắn sắc nét' },
];

// Kiểu tóc nữ bao phủ kín đầu
const FEMALE_HAIR_STYLES = [
  { id: 'female_wavy', label: 'Tóc Dài Uốn Sóng Nước', desc: 'Bồng bềnh quyến rũ, mái thưa Hàn Quốc ngọt ngào' },
  { id: 'female_straight', label: 'Tóc Dài Suôn Mượt', desc: 'Mái bằng hime, suôn dài óng ả qua vai' },
  { id: 'female_bob', label: 'Tóc Bob Cúp Ngang Vai', desc: 'Uốn cụp ôm lấy gương mặt thanh tú, đáng yêu' },
  { id: 'female_ponytail', label: 'Tóc Đuôi Ngựa Buộc Cao', desc: 'Năng động trẻ trung, lọn tóc bồng bềnh' },
  { id: 'female_bun', label: 'Tóc Búi Củ Tỏi Tiểu Thư', desc: 'Búi cao đính nơ, lọn tóc mai buông lơi tự nhiên' },
  { id: 'female_pixie', label: 'Tóc Tém Pixie Sành Điệu', desc: 'Cá tính thời thượng, mái xéo che trán' },
];

const MALE_OUTFIT_STYLES = [
  { id: 'sport_gym', label: 'Gym / Fitness Pro', category: 'Thể thao', desc: 'Áo thun thể thao ôm sát, lộ cơ bắp' },
  { id: 'sport_jersey', label: 'Bóng Rổ Jersey #07', category: 'Thể thao', desc: 'Áo tank top sát nách năng động, phóng khoáng' },
  { id: 'casual_tee', label: 'Áo Phông Streetwear', category: 'Thoải mái', desc: 'Áo phông oversize trẻ trung đường phố' },
  { id: 'casual_polo', label: 'Áo Polo Năng Động', category: 'Thoải mái', desc: 'Áo polo cổ bẻ thể thao thanh lịch' },
  { id: 'hoodie', label: 'Hoodie Trẻ Trung', category: 'Thoải mái', desc: 'Áo nỉ hoodie có túi kangaroo ấm áp' },
  { id: 'suit', label: 'Vest Nam Lịch Lãm', category: 'Công sở', desc: 'Vest sang trọng kết hợp cà vạt đỏ lịch sự' },
] as const;

const FEMALE_OUTFIT_STYLES = [
  { id: 'female_sport_active', label: 'Gym & Yoga Activewear', category: 'Thể thao', desc: 'Áo crop-top thể thao & quần legging tôn dáng' },
  { id: 'female_sport_tennis', label: 'Set Váy Tennis Sành Điệu', category: 'Thể thao', desc: 'Áo polo phối chân váy xếp ly xòe nhẹ trẻ trung' },
  { id: 'female_fashion_dress', label: 'Váy Runway Dạ Tiệc', category: 'Fashion', desc: 'Đầm dạ tiệc thắt lưng vàng quý phái tôn dáng' },
  { id: 'female_fashion_blazer', label: 'Blazer Parisian', category: 'Fashion', desc: 'Blazer suông cúc vàng phối lụa sành điệu' },
  { id: 'female_fashion_chic', label: 'Chic Peplum & Ngọc Trai', category: 'Fashion', desc: 'Áo peplum thời thượng đính ngọc trai quý phái' },
  { id: 'casual_hoodie', label: 'Hoodie Pastel Xinh Xắn', category: 'Thoải mái', desc: 'Hoodie phom rộng ngọt ngào thoải mái' },
] as const;

// PHỤ KIỆN BAO PHỦ ĐẦU
const ACCESSORIES = [
  { id: 'none', label: 'Không Có Phụ Kiện', desc: 'Hiển thị mái tóc trọn vẹn không che' },
  { id: 'headband', label: 'Băng Rôn Thể Thao (Chuẩn Vòm Đầu)', desc: 'Băng rôn ôm khít tuyệt đối viền sọ theo chu vi đầu (không thừa ngoài, không lọt trong)' },
  { id: 'cap', label: 'Mũ Lưỡi Trai (Bao Phủ Đầu)', desc: 'Mũ lưỡi trai snapback trẻ trung ôm trọn vòm đầu' },
  { id: 'beanie', label: 'Mũ Len Beanie (Bao Phủ Đầu)', desc: 'Mũ len ấm áp kéo phủ trùm kín đầu và trán' },
  { id: 'headphones', label: 'Tai Nghe Gaming (Bao Phủ Đầu)', desc: 'Quai tai nghe đệm lớn vòng ôm trọn vòm đầu' },
  { id: 'glasses', label: 'Kính Mắt Trí Thức', desc: 'Kính mắt gọng vuông phong thái trí thức' },
] as const;

const MALE_NAMES = [
  'Minh Quân', 'Tuấn Kiệt', 'Hoàng Nam', 'Quốc Bảo', 'Minh Tuấn',
  'Đức Anh', 'Việt Hoàng', 'Quang Huy', 'Thế Anh', 'Thanh Tùng'
];

const FEMALE_NAMES = [
  'Thùy Linh', 'Hương Giang', 'Mai Trang', 'Khánh Linh', 'Hải Yến',
  'Bảo Ngọc', 'Kim Ngân', 'Phương Thảo', 'Thanh Trúc', 'Ngọc Ánh'
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
  const [gender, setGender] = useState<Gender>(initialCharacter?.appearance?.gender || 'male');
  const [name, setName] = useState(
    initialCharacter?.name || (gender === 'male' ? 'Nguyễn Minh Quân' : 'Nguyễn Thùy Linh')
  );
  const [role, setRole] = useState(initialCharacter?.role || 'Fullstack Developer');

  const [appearance, setAppearance] = useState<CharacterAppearance>(
    initialCharacter?.appearance || {
      gender: 'male',
      hairColor: '#0f172a',
      hairStyle: 'sidepart7_3',
      skinColor: '#fed7aa',
      outfitColor: '#2563eb',
      outfitStyle: 'casual_tee',
      eyeColor: '#0f172a',
      accessory: 'none',
    }
  );

  const [activeTab, setActiveTab] = useState<'gender' | 'hair' | 'skin' | 'outfit' | 'eyes' | 'style'>('gender');

  // Switch gender
  const handleGenderChange = (newGender: Gender) => {
    setGender(newGender);
    const newHairStyle = newGender === 'male' ? 'sidepart7_3' : 'female_wavy';
    const newOutfitStyle = newGender === 'male' ? 'casual_tee' : 'female_fashion_dress';
    const newOutfitColor = newGender === 'male' ? '#2563eb' : '#db2777';

    if (
      MALE_NAMES.includes(name) ||
      FEMALE_NAMES.includes(name) ||
      name === 'Nguyễn Minh Quân' ||
      name === 'Nguyễn Thùy Linh'
    ) {
      setName(newGender === 'male' ? 'Nguyễn Minh Quân' : 'Nguyễn Thùy Linh');
    }

    setAppearance((prev) => ({
      ...prev,
      gender: newGender,
      hairStyle: newHairStyle,
      outfitStyle: newOutfitStyle,
      outfitColor: newOutfitColor,
    }));
  };

  const handleRandomize = () => {
    const isMale = gender === 'male';
    const nameList = isMale ? MALE_NAMES : FEMALE_NAMES;
    const hairList = isMale ? MALE_HAIR_STYLES : FEMALE_HAIR_STYLES;
    const outfitList = isMale ? MALE_OUTFIT_STYLES : FEMALE_OUTFIT_STYLES;

    const randomName = nameList[Math.floor(Math.random() * nameList.length)];
    const randomRole = SAMPLE_ROLES[Math.floor(Math.random() * SAMPLE_ROLES.length)];
    const randomHair = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)].color;
    const randomSkin = SKIN_COLORS[Math.floor(Math.random() * SKIN_COLORS.length)].color;
    const randomOutfit = OUTFIT_COLORS[Math.floor(Math.random() * OUTFIT_COLORS.length)].color;
    const randomEye = EYE_COLORS[Math.floor(Math.random() * EYE_COLORS.length)].color;
    const randomHairStyle = hairList[Math.floor(Math.random() * hairList.length)].id;
    const randomOutfitStyle = outfitList[Math.floor(Math.random() * outfitList.length)].id;
    const randomAccessory = ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)].id;

    setName(randomName);
    setRole(randomRole);
    setAppearance({
      gender,
      hairColor: randomHair,
      hairStyle: randomHairStyle,
      skinColor: randomSkin,
      outfitColor: randomOutfit,
      outfitStyle: randomOutfitStyle as any,
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
      gender,
      role: role.trim() || 'Thành Viên Công Sở',
      appearance: {
        ...appearance,
        gender,
      },
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

  const currentHairStyles = gender === 'male' ? MALE_HAIR_STYLES : FEMALE_HAIR_STYLES;
  const currentOutfitStyles = gender === 'male' ? MALE_OUTFIT_STYLES : FEMALE_OUTFIT_STYLES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative px-8 py-5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-500 text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-wide">
                {isEditing ? 'Chỉnh Sửa Nhân Vật' : 'Tạo Hình Nhân Vật Công Sở'}
              </h2>
              <p className="text-xs text-slate-400">
                Lựa chọn giới tính Nam / Nữ, 5 kiểu tóc nam thời thượng và phụ kiện bao phủ đầu
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
              {/* Gender badge indicator */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border mb-2 bg-slate-900/80 shadow">
                <span className={gender === 'male' ? 'text-blue-400' : 'text-pink-400'}>
                  {gender === 'male' ? '♂️ Giới tính: Nam' : '♀️ Giới tính: Nữ'}
                </span>
              </div>

              {/* Avatar Preview Dome */}
              <div className="my-3 flex items-center justify-center p-6 rounded-3xl bg-slate-950/60 border border-slate-800 shadow-2xl relative overflow-hidden group">
                <div
                  className="absolute inset-0 opacity-25 blur-2xl rounded-full transition-all duration-300"
                  style={{ backgroundColor: appearance.outfitColor }}
                />
                <div className="relative transform scale-125 transition-transform duration-300 group-hover:scale-135">
                  <CharacterAvatar appearance={{ ...appearance, gender }} size={110} direction="down" />
                </div>
              </div>

              {/* Name & Role Preview Tag */}
              <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-2.5 shadow-md">
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
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 mb-5">
              {[
                { id: 'gender', label: '1. Giới Tính', icon: User },
                { id: 'hair', label: '2. Tóc & Màu Tóc', icon: Palette },
                { id: 'skin', label: '3. Màu Da', icon: User },
                { id: 'outfit', label: '4. Bộ Đồ', icon: Shirt },
                { id: 'eyes', label: '5. Đôi Mắt', icon: Eye },
                { id: 'style', label: '6. Phụ Kiện', icon: HardHat },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/80'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Panels */}
            <div className="min-h-[270px]">
              {/* TAB 1: GENDER */}
              {activeTab === 'gender' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-2">
                      Chọn Giới Tính Cho Nhân Vật
                    </h4>
                    <p className="text-xs text-slate-400 mb-4">
                      Lựa chọn giới tính để hiển thị danh mục 5 kiểu tóc nam (Sidepart 7/3, Undercut, Layer, Short Quiff, Buzz Cut) hoặc bộ sưu tập tóc nữ bồng bềnh.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Male Option */}
                      <button
                        type="button"
                        onClick={() => handleGenderChange('male')}
                        className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center text-center cursor-pointer ${
                          gender === 'male'
                            ? 'bg-blue-950/60 border-blue-500 shadow-xl shadow-blue-500/20 scale-[1.02]'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <span className="text-4xl mb-2">👨‍💼</span>
                        <div className="text-base font-black text-white flex items-center gap-1.5">
                          <span>Nhân Vật Nam</span>
                          <span className="text-blue-400 text-sm">♂️</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          5 kiểu tóc chuẩn men: Sidepart 7/3, Undercut, Layer, Short Quiff, Buzz Cut
                        </p>
                        {gender === 'male' && (
                          <span className="mt-3 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Đã Chọn Nam
                          </span>
                        )}
                      </button>

                      {/* Female Option */}
                      <button
                        type="button"
                        onClick={() => handleGenderChange('female')}
                        className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center text-center cursor-pointer ${
                          gender === 'female'
                            ? 'bg-pink-950/60 border-pink-500 shadow-xl shadow-pink-500/20 scale-[1.02]'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <span className="text-4xl mb-2">👩‍💼</span>
                        <div className="text-base font-black text-white flex items-center gap-1.5">
                          <span>Nhân Vật Nữ</span>
                          <span className="text-pink-400 text-sm">♀️</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Tóc dài uốn sóng, suôn mượt, bob cúp, lông mi cong, váy duyên dáng
                        </p>
                        {gender === 'female' && (
                          <span className="mt-3 px-3 py-0.5 rounded-full bg-pink-600 text-white text-[11px] font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Đã Chọn Nữ
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: HAIR & HAIR COLOR */}
              {activeTab === 'hair' && (
                <div className="space-y-5">
                  {/* Hair Style Options */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-200 mb-2.5 flex items-center justify-between">
                      <span>
                        {gender === 'male'
                          ? '5 Kiểu Tóc Nam Bao Phủ Đầu Đẹp Chuẩn Men'
                          : 'Bộ Sưu Tập Tóc Nữ Bao Phủ Đầu'}
                      </span>
                      <span className="text-xs text-indigo-400 font-semibold">100% bao phủ kín vòm đầu</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentHairStyles.map((style) => {
                        const isSelected = appearance.hairStyle === style.id;
                        return (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => setAppearance({ ...appearance, hairStyle: style.id })}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-950/90 border-indigo-500 text-white shadow-md'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-white flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                {style.label}
                              </span>
                              {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">{style.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Hair Color Palette */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-200 mb-2 flex items-center justify-between">
                      <span>Màu Sắc Của Tóc</span>
                      <span className="text-xs text-indigo-400 font-mono">
                        {HAIR_COLORS.find((h) => h.color === appearance.hairColor)?.name || 'Tùy chỉnh'}
                      </span>
                    </h4>
                    <div className="grid grid-cols-6 sm:grid-cols-11 gap-2">
                      {HAIR_COLORS.map((item) => (
                        <button
                          key={item.color}
                          type="button"
                          onClick={() => setAppearance({ ...appearance, hairColor: item.color })}
                          className={`relative h-10 rounded-xl transition-all transform hover:scale-110 flex items-center justify-center border-2 ${
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
                </div>
              )}

              {/* TAB 3: SKIN */}
              {activeTab === 'skin' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center justify-between">
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
                    💡 Màu da sẽ đồng bộ tự nhiên trên toàn bộ khuôn mặt, cổ và bàn tay của nhân vật.
                  </p>
                </div>
              )}

              {/* TAB 4: OUTFIT */}
              {activeTab === 'outfit' && (
                <div className="space-y-5">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200 mb-2 flex items-center justify-between">
                      <span>Chọn Màu Sắc Bộ Đồ</span>
                      <span className="text-xs text-indigo-400 font-mono">
                        {OUTFIT_COLORS.find((o) => o.color === appearance.outfitColor)?.name}
                      </span>
                    </h4>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5">
                      {OUTFIT_COLORS.map((item) => (
                        <button
                          key={item.color}
                          type="button"
                          onClick={() => setAppearance({ ...appearance, outfitColor: item.color })}
                          className={`relative h-10 rounded-xl transition-all transform hover:scale-110 flex items-center justify-center border-2 ${
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
                    <h4 className="text-sm font-bold text-slate-200 mb-2.5 flex items-center justify-between">
                      <span>Kiểu Dáng Trang Phục ({gender === 'male' ? 'Từ Thoải Mái Đến Thể Thao' : 'Thể Thao & Fashion Sành Điệu'})</span>
                      <span className="text-xs text-indigo-400 font-medium">Bàn tay luôn hiển thị 100%</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentOutfitStyles.map((style) => {
                        const isSelected = appearance.outfitStyle === style.id;
                        return (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => setAppearance({ ...appearance, outfitStyle: style.id as any })}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-950/90 border-indigo-500 text-white shadow-md'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-white flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                {style.label}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 font-medium border border-slate-700/60">
                                {style.category}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">{style.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: EYES */}
              {activeTab === 'eyes' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center justify-between">
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
                </div>
              )}

              {/* TAB 6: ACCESSORIES (PHỤ KIỆN BAO PHỦ ĐẦU) */}
              {activeTab === 'style' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200 mb-1">
                      Phụ Kiện Bao Phủ Đầu
                    </h4>
                    <p className="text-xs text-slate-400 mb-3">
                      Các phụ kiện mũ lưỡi trai, mũ len, tai nghe chụp đầu sẽ bao phủ trọn vẹn đỉnh đầu nhân vật.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ACCESSORIES.map((acc) => {
                      const isSelected = appearance.accessory === acc.id;
                      return (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => setAppearance({ ...appearance, accessory: acc.id as any })}
                          className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-950/90 border-indigo-500 text-white shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-bold text-xs text-white">{acc.label}</span>
                            {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">{acc.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-800 mt-4">
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
