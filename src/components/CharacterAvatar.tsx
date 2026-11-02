import React from 'react';
import type { CharacterAppearance } from '../types/game';

interface CharacterAvatarProps {
  appearance: CharacterAppearance;
  direction?: 'left' | 'right' | 'up' | 'down';
  isMoving?: boolean;
  isSitting?: boolean;
  currentAction?: string;
  size?: number;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  appearance,
  direction = 'down',
  isMoving = false,
  isSitting = false,
  currentAction,
  size = 56,
}) => {
  const {
    gender = 'male',
    hairColor = '#0f172a',
    hairStyle = 'sidepart7_3',
    skinColor = '#fed7aa',
    outfitColor = '#2563eb',
    outfitStyle = 'casual',
    eyeColor = '#0f172a',
    accessory = 'none',
  } = appearance;

  const isFacingLeft = direction === 'left';
  const isFacingUp = direction === 'up';
  const isFemale = gender === 'female';

  // Normalize legacy style keys to the new exact requested male hairstyles
  const getNormalizedMaleStyle = (style: string) => {
    switch (style) {
      case 'undercut':
        return 'undercut';
      case 'layer':
      case 'curly':
      case 'male_layer':
        return 'layer';
      case 'short_quiff':
      case 'male_quiff':
        return 'short_quiff';
      case 'buzz_cut':
        return 'buzz_cut';
      case 'sidepart7_3':
      case 'male_sidepart':
      case 'short':
      default:
        return 'sidepart7_3';
    }
  };

  const currentStyleKey = !isFemale ? getNormalizedMaleStyle(hairStyle) : hairStyle;

  // 1. LAYER 1: BACK HAIR (behind head & torso, completely encloses skull)
  const renderBackHair = () => {
    if (!isFemale) {
      switch (currentStyleKey) {
        case 'buzz_cut':
          return (
            <g fill={hairColor}>
              <ellipse cx="32" cy="24" rx="14.8" ry="14.2" />
            </g>
          );
        case 'undercut':
          return (
            <g fill={hairColor}>
              <ellipse cx="32" cy="23.5" rx="15.5" ry="14.5" />
            </g>
          );
        case 'layer':
          return (
            <g fill={hairColor}>
              <ellipse cx="32" cy="23" rx="16.8" ry="15.8" />
            </g>
          );
        case 'short_quiff':
        case 'sidepart7_3':
        default:
          return (
            <g fill={hairColor}>
              <ellipse cx="32" cy="23" rx="16.5" ry="15" />
            </g>
          );
      }
    }

    // Female styles back base
    switch (currentStyleKey) {
      case 'female_wavy':
        return (
          <g fill={hairColor}>
            <path d="M 14 18 C 11 26 10 38 11 54 C 15 57 20 56 22 50 C 22 42 21 34 22 28 Z" />
            <path d="M 50 18 C 53 26 54 38 53 54 C 49 57 44 56 42 50 C 42 42 43 34 42 28 Z" />
            <path d="M 14 18 Q 32 8 50 18 L 52 32 Q 32 36 12 32 Z" />
          </g>
        );
      case 'female_straight':
      case 'long':
        return (
          <g fill={hairColor}>
            <rect x="13" y="16" width="9" height="38" rx="4" />
            <rect x="42" y="16" width="9" height="38" rx="4" />
            <path d="M 14 18 Q 32 8 50 18 L 51 34 Q 32 38 13 34 Z" />
          </g>
        );
      case 'female_bob':
      case 'bob':
        return (
          <g fill={hairColor}>
            <ellipse cx="32" cy="24" rx="19" ry="17" />
          </g>
        );
      case 'female_ponytail':
      case 'ponytail':
        return (
          <g fill={hairColor}>
            <ellipse cx="32" cy="22" rx="17" ry="15" />
            <path
              d="M 40 14 C 49 8 59 14 57 28 C 55 36 50 42 46 44 C 45 42 49 32 48 24 C 47 18 43 16 40 14 Z"
              className={isMoving ? 'animate-bounce' : ''}
            />
            <circle cx="42" cy="15" r="3.2" fill="#f43f5e" />
          </g>
        );
      case 'female_bun':
        return (
          <g fill={hairColor}>
            <ellipse cx="32" cy="22" rx="17" ry="15" />
            <circle cx="32" cy="8" r="8.5" />
            <circle cx="32" cy="8" r="9.5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <rect x="27" y="13" width="10" height="3" rx="1.5" fill="#f43f5e" />
          </g>
        );
      default:
        return (
          <g fill={hairColor}>
            <ellipse cx="32" cy="22" rx="16.5" ry="15" />
          </g>
        );
    }
  };

  // 2. LAYER 3: FRONT HAIR (Covers crown & forehead but strictly stops at y <= 20 to NOT cover the eyes at y=25.5)
  const renderFrontHair = () => {
    // A. 5 MALE HAIRSTYLES: Strictly stops above the eyes (y <= 20)
    if (!isFemale) {
      switch (currentStyleKey) {
        // STYLE 1: SIDEPART 7/3 (Rẽ ngôi 7/3 lãng tử, mái dấu phẩy trên trán, không che mắt)
        case 'sidepart7_3':
        default:
          return (
            <g fill={hairColor}>
              {/* Full dome enclosing skull from y=5 down to temples */}
              <path d="M 14 24 C 13 12 21 5.5 32 5.5 C 43 5.5 51 12 50 24 C 47 20 44 19 42 22 C 39 16 34 15 30 15 C 25 15 20 18 18 23 C 17 20 15 20 14 24 Z" />
              {/* 7-portion sweeping comma bang (Stops at y=19.5, well above eyes at y=25.5) */}
              <path d="M 27 15 Q 37 13.5 46 17.5 C 47 20 43 20.5 39 20 C 33 19 28 17.5 27 15 Z" />
              {/* 3-portion side combed back */}
              <path d="M 26 15 Q 20 16 16 19.5 C 18 21 22 18.5 26 15 Z" />
              {/* Sideburns on far sides outside the eyes */}
              <rect x="15" y="22" width="3.5" height="7" rx="1.5" />
              <rect x="45.5" y="22" width="3.5" height="7" rx="1.5" />
              {/* Glossy shine */}
              <ellipse cx="34" cy="10" rx="8" ry="1.8" fill="#ffffff" opacity="0.28" />
            </g>
          );

        // STYLE 2: UNDERCUT (Hai bên cạo fade, đỉnh vuốt phồng cao cấp đổ về sau, trán thoáng sáng rõ mắt)
        case 'undercut':
          return (
            <g fill={hairColor}>
              {/* Pompadour top rising to y=4.5, sweeps back */}
              <path d="M 15 22 C 14 11 22 4.5 32 4.5 C 42 4.5 50 11 49 22 C 47 18 44 17 41 19 C 38 14 35 14 32 16 C 29 14 26 14 23 19 C 20 17 17 18 15 22 Z" />
              <path d="M 21 15 Q 32 11 43 15 L 41 18 Q 32 14 23 18 Z" fill="rgba(255,255,255,0.22)" />
              {/* Clean hairline line well above eyebrows */}
              <rect x="21" y="16.5" width="22" height="3" rx="1" fill={hairColor} />
              {/* High fade sideburns outside eyes */}
              <rect x="15.8" y="22" width="2.8" height="6.5" rx="1" opacity="0.85" />
              <rect x="45.4" y="22" width="2.8" height="6.5" rx="1" opacity="0.85" />
              <ellipse cx="32" cy="9" rx="8.5" ry="2" fill="#ffffff" opacity="0.25" />
            </g>
          );

        // STYLE 3: LAYER (Tóc tỉa layer xếp lớp ngang trán, tỉa so le trên chân mày, KHÔNG chạm mắt)
        case 'layer':
          return (
            <g fill={hairColor}>
              {/* Crown dome */}
              <path d="M 13.5 24 C 12.5 12 21 5 32 5 C 43 5 51.5 12 50.5 24 C 48 19 45 18 43 21 C 40 16 36 15 32 18 C 28 15 24 16 21 21 C 19 18 16 19 13.5 24 Z" />
              {/* Layer fringe tips stop strictly at y=20 (5.5px above eye center y=25.5) */}
              <polygon points="17,17 21,20.5 24,17" />
              <polygon points="23,17 27,20.5 30,17" />
              <polygon points="29,17 33,20.8 36,17" />
              <polygon points="35,17 39,20.5 42,17" />
              <polygon points="41,17 44.5,20 47,17" />
              {/* Sideburns */}
              <rect x="15" y="23" width="3.2" height="6.5" rx="1.2" />
              <rect x="45.8" y="23" width="3.2" height="6.5" rx="1.2" />
              <ellipse cx="32" cy="10" rx="9" ry="2.2" fill="#ffffff" opacity="0.25" />
            </g>
          );

        // STYLE 4: SHORT QUIFF (Vuốt dựng phồng hướng lên trời, trán mở sáng ngời, mắt cực rõ)
        case 'short_quiff':
          return (
            <g fill={hairColor}>
              {/* Upward brush sweep rising to y=3.8 */}
              <path d="M 14.5 23 C 13.5 13 21 3.8 32 3.8 C 41 3.8 48 9 49.5 23 C 47 19 44 18 42 20 C 39 14 35 12 32 12 C 29 12 25 14 22 20 C 20 18 17 19 14.5 23 Z" />
              <polygon points="28,13 32,7 36,13" />
              <path d="M 25 14 Q 32 7.5 39 14 L 37 16 Q 32 10 27 16 Z" fill="rgba(255,255,255,0.22)" />
              <rect x="15.5" y="22" width="3" height="6.5" rx="1.2" />
              <rect x="45.5" y="22" width="3" height="6.5" rx="1.2" />
              <ellipse cx="32" cy="9.5" rx="7.5" ry="1.8" fill="#ffffff" opacity="0.25" />
            </g>
          );

        // STYLE 5: BUZZ CUT (Đầu đinh cua ôm sát sọ, chân tóc vuông vắn ở y=17.5, mắt sáng 100%)
        case 'buzz_cut':
          return (
            <g fill={hairColor}>
              <path d="M 16.5 24 C 16 15 22 9.5 32 9.5 C 42 9.5 48 15 47.5 24 L 46 24 C 45 19 44 17.5 41 17.5 L 23 17.5 C 20 17.5 19 19 18 24 Z" />
              {/* Front hairline strictly at y=17.5 */}
              <rect x="20.5" y="16.5" width="23" height="3" rx="1" />
              <polygon points="17.5,21 21,17 21,22" />
              <polygon points="46.5,21 43,17 43,22" />
              <rect x="16.5" y="23" width="2.8" height="5.5" rx="0.8" opacity="0.9" />
              <rect x="44.7" y="23" width="2.8" height="5.5" rx="0.8" opacity="0.9" />
              <ellipse cx="32" cy="13" rx="8.5" ry="1.8" fill="#ffffff" opacity="0.18" />
            </g>
          );
      }
    }

    // B. FEMALE HAIRSTYLES: Bangs strictly stop at y <= 20.5, sides stay outside x in [21, 43]
    switch (currentStyleKey) {
      case 'female_wavy':
        return (
          <g fill={hairColor}>
            <path d="M 13 23 C 13 12 21 6 32 6 C 43 6 51 12 51 23 C 47 19 44 19 43 22 C 41 17 37 16 32 19 C 27 16 23 17 21 22 C 20 19 17 19 13 23 Z" />
            {/* Soft airy bangs ending safely above eyes at y=19.5 */}
            <rect x="27" y="16" width="2" height="3.5" rx="1" opacity="0.8" />
            <rect x="31" y="16" width="2" height="4" rx="1" opacity="0.8" />
            <rect x="35" y="16" width="2" height="3.5" rx="1" opacity="0.8" />
            {/* Wavy locks on the sides outside the eye frame */}
            <path d="M 14 22 C 13 32 16 40 14 48 C 17 48 19 40 19 32 C 19 25 17 22 14 22 Z" />
            <path d="M 50 22 C 51 32 48 40 50 48 C 47 48 45 40 45 32 C 45 25 47 22 50 22 Z" />
            <ellipse cx="32" cy="10" rx="9" ry="2" fill="#ffffff" opacity="0.3" />
          </g>
        );
      case 'female_straight':
      case 'long':
        return (
          <g fill={hairColor}>
            <path d="M 14 23 C 13 12 21 6 32 6 C 43 6 51 12 50 23 C 48 19 44 19 43 22 C 40 18 24 18 21 22 C 20 19 16 19 14 23 Z" />
            {/* Straight fringe strictly stops at y=20 */}
            <path d="M 21 16 Q 32 18 43 16 L 43 19.5 Q 32 21 21 19.5 Z" />
            {/* Outer cheek strands */}
            <rect x="14" y="22" width="4.5" height="24" rx="2" />
            <rect x="45.5" y="22" width="4.5" height="24" rx="2" />
            <ellipse cx="32" cy="10" rx="10" ry="2" fill="#ffffff" opacity="0.3" />
          </g>
        );
      case 'female_bob':
      case 'bob':
        return (
          <g fill={hairColor}>
            <path d="M 13 24 C 12 12 21 6 32 6 C 43 6 52 12 51 24 C 51 35 48 41 44 41 C 42 34 45 25 43 21 C 38 17 26 17 21 21 C 19 25 22 34 20 41 C 16 41 13 35 13 24 Z" />
            <path d="M 22 17 Q 28 20 35 18 Q 28 19 22 17 Z" />
            <ellipse cx="32" cy="10" rx="9" ry="2" fill="#ffffff" opacity="0.25" />
          </g>
        );
      case 'female_ponytail':
      case 'ponytail':
        return (
          <g fill={hairColor}>
            <path d="M 14 23 C 13 13 21 7 32 7 C 43 7 51 13 50 23 C 47 19 44 19 43 22 C 41 18 37 17 32 20 C 27 17 23 18 21 22 C 20 19 17 19 14 23 Z" />
            <rect x="15" y="22" width="3" height="8" rx="1.5" />
            <rect x="46" y="22" width="3" height="8" rx="1.5" />
            <ellipse cx="32" cy="11" rx="8" ry="2" fill="#ffffff" opacity="0.25" />
          </g>
        );
      case 'female_bun':
        return (
          <g fill={hairColor}>
            <path d="M 14 23 C 13 13 21 7 32 7 C 43 7 51 13 50 23 C 47 19 43 19 42 22 C 40 18 24 18 22 22 C 21 19 17 19 14 23 Z" />
            <path d="M 16 24 Q 14 31 17 36" stroke={hairColor} strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M 48 24 Q 50 31 47 36" stroke={hairColor} strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <ellipse cx="32" cy="11" rx="8" ry="2" fill="#ffffff" opacity="0.25" />
          </g>
        );
      case 'female_pixie':
        return (
          <g fill={hairColor}>
            <path d="M 14 23 C 13 12 21 6 32 6 C 43 6 51 12 50 23 C 48 19 44 19 43 22 C 40 16 28 16 20 20 C 19 21 16 19 14 23 Z" />
            <polygon points="20,17 34,20 36,17" />
            <rect x="15.5" y="22" width="3" height="6" rx="1" />
            <rect x="45.5" y="22" width="3" height="6" rx="1" />
            <ellipse cx="32" cy="10" rx="8" ry="2" fill="#ffffff" opacity="0.25" />
          </g>
        );
      default:
        return (
          <g fill={hairColor}>
            <path d="M 14 23 C 13 13 21 7 32 7 C 43 7 51 13 50 23 C 47 19 44 19 43 22 C 41 18 23 18 21 22 C 20 19 17 19 14 23 Z" />
            <rect x="15" y="22" width="3.5" height="7" rx="1.5" />
            <rect x="45.5" y="22" width="3.5" height="7" rx="1.5" />
          </g>
        );
    }
  };

  // 3. LAYER 4: ACCESSORIES (Head-covering accessories engineered to strictly stop ABOVE the eyes at y <= 19.5)
  const renderAccessory = () => {
    switch (accessory) {
      // MŨ LƯỠI TRAI (Snapback / Baseball Cap): Covers the head dome, visor sits at y=17 to y=19.5, leaving eyes completely clear!
      case 'cap':
        return (
          <g>
            {/* Cap Dome enclosing the entire crown from y=4 to y=18 */}
            <path
              d="M 13 20 C 12 10 20 3.5 32 3.5 C 44 3.5 52 10 51 20 Z"
              fill={outfitColor}
              stroke="#0f172a"
              strokeWidth="0.8"
            />
            {/* Top Button */}
            <circle cx="32" cy="3.5" r="1.8" fill="#f8fafc" />
            <path d="M 32 3.5 L 32 18" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
            {/* Curved Visor / Brim: Sits gracefully from y=16.5 to y=19.5, well above eyes at y=25.5 */}
            <path
              d="M 12 18.5 C 12 17.5 20 15.5 32 15.5 C 44 15.5 52 17.5 52 18.5 C 53.5 19.5 47 20.8 32 20.8 C 17 20.8 10.5 19.5 12 18.5 Z"
              fill="#0f172a"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.6"
            />
            {/* Cap Logo */}
            <circle cx="32" cy="11" r="2.2" fill="#f8fafc" />
            <rect x="31" y="10" width="2" height="2" fill="#3b82f6" />
          </g>
        );

      // MŨ LEN BEANIE: Folded cuff stops safely at y=19.5
      case 'beanie':
        return (
          <g>
            <path
              d="M 13 18 C 11 7 20 2 32 2 C 44 2 53 7 51 18 Z"
              fill={outfitColor}
            />
            <circle cx="32" cy="1.8" r="3" fill="#f8fafc" />
            {/* Cuff across upper forehead (y=15.5 to y=19.5) */}
            <rect
              x="12"
              y="15.5"
              width="40"
              height="4.5"
              rx="2.2"
              fill="#1e293b"
              stroke={outfitColor}
              strokeWidth="0.8"
            />
            <line x1="20" y1="15.5" x2="20" y2="20" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
            <line x1="26" y1="15.5" x2="26" y2="20" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
            <line x1="32" y1="15.5" x2="32" y2="20" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
            <line x1="38" y1="15.5" x2="38" y2="20" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
            <line x1="44" y1="15.5" x2="44" y2="20" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
          </g>
        );

      // TAI NGHE CHỤP TAI GAMING (Studio Headset): Thick band over crown, ear cups wrap ears, eyes 100% open
      case 'headphones':
        return (
          <g>
            <path
              d="M 13 25 C 13 11 20 4 32 4 C 44 4 51 11 51 25"
              stroke="#0f172a"
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 15 23 C 15 12 21 6 32 6 C 43 6 49 12 49 23"
              stroke={outfitColor}
              strokeWidth="2"
              fill="none"
            />
            {/* Left Ear Cushion (Outside face at x=11.5 - 17) */}
            <rect x="11.5" y="20.5" width="5.5" height="11" rx="2.5" fill="#0f172a" stroke={outfitColor} strokeWidth="1" />
            <circle cx="14.2" cy="26" r="1.5" fill="#38bdf8" />
            {/* Right Ear Cushion (Outside face at x=47 - 52.5) */}
            <rect x="47" y="20.5" width="5.5" height="11" rx="2.5" fill="#0f172a" stroke={outfitColor} strokeWidth="1" />
            <circle cx="49.8" cy="26" r="1.5" fill="#38bdf8" />
          </g>
        );

      // BĂNG ĐÔ THỂ THAO: Wraps upper forehead from y=15.5 to y=19
      case 'headband':
        return (
          <g>
            <path
              d="M 13 19.5 Q 32 21.5 51 19.5 L 51 16 Q 32 18 13 16 Z"
              fill="#ef4444"
              stroke="#991b1b"
              strokeWidth="0.8"
            />
            <path d="M 13 17.8 Q 32 19.8 51 17.8" stroke="#ffffff" strokeWidth="1.2" fill="none" />
          </g>
        );

      // KÍNH MẮT TRÍ THỨC: Thin crisp frames with ultra-transparent lenses so eyes shine 100% through
      case 'glasses':
        return (
          <g stroke="#0f172a" strokeWidth="1.3" fill="none">
            <rect x="23" y="22.5" width="7.5" height="6.5" rx="2" fill="rgba(255,255,255,0.08)" />
            <rect x="33.5" y="22.5" width="7.5" height="6.5" rx="2" fill="rgba(255,255,255,0.08)" />
            <line x1="30.5" y1="25" x2="33.5" y2="25" />
            {/* Glasses temple arms going back */}
            <line x1="23" y1="24.5" x2="18" y2="24" />
            <line x1="41" y1="24.5" x2="46" y2="24" />
          </g>
        );

      // THẺ NHÂN VIÊN
      case 'badge':
        return (
          <g>
            <path d="M 30 38 L 32 45 L 34 38" stroke="#3b82f6" strokeWidth="1" fill="none" />
            <rect x="30" y="44" width="4" height="5" rx="0.5" fill="#f8fafc" stroke="#64748b" strokeWidth="0.5" />
            <rect x="31" y="45" width="2" height="1" fill="#3b82f6" />
          </g>
        );

      case 'none':
      default:
        return null;
    }
  };

  // EYES & SMILE (Located at y=25.5, radiant, completely unblocked)
  const renderEyes = () => {
    if (isFacingUp) return null;

    const leftEyeX = isFacingLeft ? 24 : 26.5;
    const rightEyeX = isFacingLeft ? 33.5 : 37.5;
    const eyeY = 25.5;

    return (
      <g>
        {/* Left Eye Sclera & Iris */}
        <circle cx={leftEyeX} cy={eyeY} r="3.2" fill="#ffffff" />
        <circle cx={leftEyeX} cy={eyeY} r="2.1" fill={eyeColor} />
        {/* Eye Sparkle Highlights */}
        <circle cx={leftEyeX - 0.7} cy={eyeY - 0.7} r="1" fill="#ffffff" />
        {isFemale && <circle cx={leftEyeX + 0.8} cy={eyeY + 0.8} r="0.6" fill="#ffffff" />}

        {/* Right Eye Sclera & Iris */}
        <circle cx={rightEyeX} cy={eyeY} r="3.2" fill="#ffffff" />
        <circle cx={rightEyeX} cy={eyeY} r="2.1" fill={eyeColor} />
        {/* Eye Sparkle Highlights */}
        <circle cx={rightEyeX - 0.7} cy={eyeY - 0.7} r="1" fill="#ffffff" />
        {isFemale && <circle cx={rightEyeX + 0.8} cy={eyeY + 0.8} r="0.6" fill="#ffffff" />}

        {/* Female Delicate Eyelashes */}
        {isFemale && (
          <g stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round">
            <path d={`M ${leftEyeX - 2.5} ${eyeY - 2.2} Q ${leftEyeX} ${eyeY - 3.5} ${leftEyeX + 2.5} ${eyeY - 2.2}`} fill="none" />
            <line x1={leftEyeX + 2.2} y1={eyeY - 2.2} x2={leftEyeX + 3.8} y2={eyeY - 3.8} />
            <path d={`M ${rightEyeX - 2.5} ${eyeY - 2.2} Q ${rightEyeX} ${eyeY - 3.5} ${rightEyeX + 2.5} ${eyeY - 2.2}`} fill="none" />
            <line x1={rightEyeX + 2.2} y1={eyeY - 2.2} x2={rightEyeX + 3.8} y2={eyeY - 3.8} />
          </g>
        )}

        {/* Male Crisp Confident Eyebrows at y=21 - 21.5 */}
        {!isFemale && (
          <g stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round">
            <line x1={leftEyeX - 2.5} y1={eyeY - 4.2} x2={leftEyeX + 2.5} y2={eyeY - 3.8} />
            <line x1={rightEyeX - 2.5} y1={eyeY - 3.8} x2={rightEyeX + 2.5} y2={eyeY - 4.2} />
          </g>
        )}

        {/* Cheerful Blush */}
        <ellipse cx={leftEyeX - 1} cy={eyeY + 4} rx={isFemale ? 3.2 : 2.2} ry="1.5" fill="#f43f5e" opacity={isFemale ? 0.45 : 0.3} />
        <ellipse cx={rightEyeX + 1} cy={eyeY + 4} rx={isFemale ? 3.2 : 2.2} ry="1.5" fill="#f43f5e" opacity={isFemale ? 0.45 : 0.3} />

        {/* Cheerful Smile */}
        <path
          d={isFacingLeft ? 'M 26 32 Q 28 34.5 31 32' : 'M 30 32 Q 32 34.5 34 32'}
          stroke={isFemale ? '#e11d48' : '#991b1b'}
          strokeWidth={isFemale ? '1.5' : '1.3'}
          strokeLinecap="round"
          fill="none"
        />
      </g>
    );
  };

  // OUTFIT
  const renderOutfit = () => {
    switch (outfitStyle) {
      case 'suit':
        return (
          <g>
            <path d={isFemale ? 'M 22 38 L 42 38 L 44 52 L 20 52 Z' : 'M 20 38 L 44 38 L 46 52 L 18 52 Z'} fill={outfitColor} />
            <polygon points="32,45 28,38 36,38" fill="#ffffff" />
            <polygon points="32,40 33,48 32,50 31,48" fill="#dc2626" />
          </g>
        );
      case 'dress':
        return (
          <g>
            <path d="M 23 38 L 41 38 L 48 54 L 16 54 Z" fill={outfitColor} />
            <rect x="23" y="44" width="18" height="2.5" fill="#facc15" />
            <rect x="30.5" y="43.5" width="3" height="3.5" fill="#ca8a04" rx="0.5" />
            <path d="M 27 38 Q 32 41 37 38" stroke="#ffffff" strokeWidth="1.2" fill="none" />
          </g>
        );
      case 'hoodie':
        return (
          <g>
            <path d="M 20 38 L 44 38 L 45 53 L 19 53 Z" fill={outfitColor} rx="3" />
            <rect x="25" y="46" width="14" height="6" rx="2" fill="rgba(0,0,0,0.15)" />
            <line x1="29" y1="40" x2="29" y2="44" stroke="#ffffff" strokeWidth="1" />
            <line x1="35" y1="40" x2="35" y2="44" stroke="#ffffff" strokeWidth="1" />
          </g>
        );
      case 'shirt':
        return (
          <g>
            <path d="M 21 38 L 43 38 L 44 52 L 20 52 Z" fill={outfitColor} />
            <circle cx="32" cy="41" r="0.8" fill="#ffffff" />
            <circle cx="32" cy="45" r="0.8" fill="#ffffff" />
            <circle cx="32" cy="49" r="0.8" fill="#ffffff" />
          </g>
        );
      case 'casual':
      default:
        return (
          <g>
            <path d="M 21 38 L 43 38 L 44 52 L 20 52 Z" fill={outfitColor} />
            <path d="M 28 38 Q 32 42 36 38" stroke="#ffffff" strokeWidth="1.2" fill="none" />
          </g>
        );
    }
  };

  return (
    <div
      className={`relative inline-block select-none transition-transform duration-150 ${
        isMoving ? 'animate-bounce' : ''
      }`}
      style={{
        width: size,
        height: size,
        transform: isFacingLeft ? 'scaleX(-1)' : 'none',
      }}
    >
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        className="drop-shadow-lg overflow-visible"
      >
        {/* Floor Shadow */}
        <ellipse cx="32" cy="60" rx="14" ry="4" fill="rgba(0,0,0,0.35)" />

        {/* LAYER 1: BACK HAIR (Encloses skull from behind) */}
        {renderBackHair()}

        {/* Legs / Feet */}
        {!isSitting ? (
          <g>
            <rect x="25" y="51" width="5" height="8" rx="2" fill="#1e293b" />
            <rect x="34" y="51" width="5" height="8" rx="2" fill="#1e293b" />
            <rect x="24" y="57" width="7" height="3" rx="1" fill="#0f172a" />
            <rect x="33" y="57" width="7" height="3" rx="1" fill="#0f172a" />
          </g>
        ) : (
          <g>
            <rect x="23" y="49" width="18" height="6" rx="2" fill="#1e293b" />
            <rect x="22" y="53" width="6" height="4" rx="1" fill="#0f172a" />
            <rect x="36" y="53" width="6" height="4" rx="1" fill="#0f172a" />
          </g>
        )}

        {/* Arms */}
        <g fill={outfitColor}>
          <rect x="17" y="39" width="4.5" height="11" rx="2" />
          <rect x="42.5" y="39" width="4.5" height="11" rx="2" />
          <circle cx="19.2" cy="51" r="2.2" fill={skinColor} />
          <circle cx="44.8" cy="51" r="2.2" fill={skinColor} />
        </g>

        {/* Torso */}
        {renderOutfit()}

        {/* Neck */}
        <rect x="29" y="34" width="6" height="5" fill={skinColor} />

        {/* LAYER 2: HEAD & EARS */}
        <circle cx="32" cy="25" r="14" fill={skinColor} />
        <circle cx="18" cy="26" r="2.5" fill={skinColor} />
        <circle cx="46" cy="26" r="2.5" fill={skinColor} />

        {/* LAYER 3: FRONT HAIR (Covers skull crown & forehead, stops above the eyes) */}
        {renderFrontHair()}

        {/* LAYER 4: ACCESSORIES (Headwear, Caps, Beanies that cover head but stop above eyes) */}
        {renderAccessory()}

        {/* LAYER 5: EYES & FACIAL EXPRESSIONS (Guaranteed 100% UNBLOCKED & RADIANT) */}
        {renderEyes()}

        {/* Action Props */}
        {currentAction === 'fishing' && (
          <g>
            <line x1="45" y1="46" x2="68" y2="20" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="68" y1="20" x2="72" y2="58" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="72" cy="58" r="3" fill="#ef4444" />
          </g>
        )}

        {currentAction === 'gaming' && (
          <g>
            <rect x="27" y="47" width="10" height="6" rx="2" fill="#0f172a" stroke="#8b5cf6" strokeWidth="0.8" />
            <circle cx="29.5" cy="50" r="1" fill="#ec4899" />
            <circle cx="34.5" cy="50" r="1" fill="#06b6d4" />
          </g>
        )}

        {currentAction === 'eating' && (
          <g>
            <rect x="42" y="46" width="6" height="7" rx="1" fill="#e2e8f0" stroke="#b91c1c" strokeWidth="0.8" />
            <path d="M 47 48 C 50 48 50 51 47 52" stroke="#b91c1c" strokeWidth="1" fill="none" />
          </g>
        )}
      </svg>
    </div>
  );
};
