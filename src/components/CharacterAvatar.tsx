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
    hairColor = '#1e293b',
    hairStyle = 'male_sidepart',
    skinColor = '#fed7aa',
    outfitColor = '#2563eb',
    outfitStyle = 'casual',
    eyeColor = '#0f172a',
    accessory = 'none',
  } = appearance;

  const isFacingLeft = direction === 'left';
  const isFacingUp = direction === 'up';
  const isFemale = gender === 'female';

  // BACK HAIR: Rendered behind head so skull is fully enclosed
  const renderBackHair = () => {
    switch (hairStyle) {
      // Female long styles
      case 'female_wavy':
        return (
          <g fill={hairColor}>
            {/* Full back mass behind shoulders */}
            <path d="M 14 18 C 11 26 10 38 11 54 C 15 57 20 56 22 50 C 22 42 21 34 22 28 Z" />
            <path d="M 50 18 C 53 26 54 38 53 54 C 49 57 44 56 42 50 C 42 42 43 34 42 28 Z" />
            <path d="M 14 18 Q 32 8 50 18 L 52 32 Q 32 36 12 32 Z" />
          </g>
        );
      case 'female_straight':
      case 'long':
        return (
          <g fill={hairColor}>
            <rect x="13" y="16" width="10" height="38" rx="4" />
            <rect x="41" y="16" width="10" height="38" rx="4" />
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
            {/* Full background base */}
            <ellipse cx="32" cy="22" rx="17" ry="15" />
            {/* High Bouncy Ponytail swinging to the side */}
            <path
              d="M 40 14 C 49 8 59 14 57 28 C 55 36 50 42 46 44 C 45 42 49 32 48 24 C 47 18 43 16 40 14 Z"
              className={isMoving ? 'animate-bounce' : ''}
            />
            {/* Scrunchie / Ribbon */}
            <circle cx="42" cy="15" r="3.2" fill="#f43f5e" />
          </g>
        );
      case 'female_bun':
        return (
          <g fill={hairColor}>
            <ellipse cx="32" cy="22" rx="17" ry="15" />
            {/* Big Chic Top Bun */}
            <circle cx="32" cy="8" r="8.5" />
            <circle cx="32" cy="8" r="9.5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            {/* Bun Ribbon */}
            <rect x="27" y="13" width="10" height="3" rx="1.5" fill="#f43f5e" />
          </g>
        );
      // Male styles back coverage
      case 'male_sidepart':
      case 'male_layer':
      case 'male_quiff':
      case 'curly':
      case 'short':
      default:
        return (
          <g fill={hairColor}>
            {/* Encloses back of head completely so no bare neck/skull shows */}
            <ellipse cx="32" cy="22" rx="16.5" ry="15" />
          </g>
        );
    }
  };

  // FRONT HAIR: Covers crown, temples, forehead and adds gorgeous styling
  const renderFrontHair = () => {
    switch (hairStyle) {
      // 1. MALE: Side Part Hàn Quốc (7/3 Rẽ Ngôi Lãng Tử)
      case 'male_sidepart':
      case 'short':
        return (
          <g fill={hairColor}>
            {/* Full dome covering the skull from y=7 */}
            <path d="M 14 26 C 13 14 20 7 32 7 C 44 7 51 14 50 26 C 47 22 45 22 44 26 C 43 21 37 17 32 17 C 26 17 21 20 20 26 C 19 22 17 22 14 26 Z" />
            {/* Stylized sweeping bangs (Mái rẽ ngôi 7/3 dấu phẩy) */}
            <path d="M 20 18 Q 28 17 32 23 Q 26 23 20 20 Z" fill={hairColor} />
            <path d="M 33 18 Q 44 19 46 25 Q 40 23 33 20 Z" fill={hairColor} />
            {/* Sideburns */}
            <rect x="15" y="24" width="3.5" height="7" rx="1.5" />
            <rect x="45.5" y="24" width="3.5" height="7" rx="1.5" />
            {/* Hair shine */}
            <ellipse cx="30" cy="11" rx="8" ry="1.8" fill="#ffffff" opacity="0.25" />
          </g>
        );

      // 2. MALE: Layer Hàn Quốc (Two-block dày bồng bềnh phủ trán)
      case 'male_layer':
        return (
          <g fill={hairColor}>
            {/* Full crown */}
            <path d="M 14 26 C 13 13 21 6 32 6 C 43 6 51 13 50 26 C 48 20 44 19 42 25 C 39 19 35 18 32 24 C 29 18 25 19 22 25 C 20 19 16 20 14 26 Z" />
            {/* Feathered fringe strands over forehead */}
            <polygon points="18,22 22,27 24,22" />
            <polygon points="25,22 29,28 32,22" />
            <polygon points="32,22 36,28 39,22" />
            <polygon points="40,22 43,26 46,22" />
            {/* Sideburns */}
            <rect x="15.5" y="24" width="3" height="7" rx="1" />
            <rect x="45.5" y="24" width="3" height="7" rx="1" />
            <ellipse cx="32" cy="10" rx="9" ry="2" fill="#ffffff" opacity="0.25" />
          </g>
        );

      // 3. MALE: Quiff Lãng Tử (Vuốt phồng cao cấp)
      case 'male_quiff':
        return (
          <g fill={hairColor}>
            {/* High sweeping quiff top */}
            <path d="M 15 26 C 13 14 20 5 30 5 C 38 5 45 8 50 17 C 49 22 46 26 45 27 C 44 21 38 18 32 18 C 24 18 19 21 17 26 Z" />
            <path d="M 24 14 Q 34 8 44 13 Q 36 17 24 14 Z" fill="rgba(255,255,255,0.2)" />
            {/* Clean fade sides */}
            <rect x="16" y="22" width="3" height="7" rx="1.2" />
            <rect x="45" y="22" width="3" height="7" rx="1.2" />
          </g>
        );

      // 4. MALE: Spiky Cá Tính
      case 'male_spiky':
      case 'spiky':
        return (
          <g fill={hairColor}>
            {/* Dense crown with spiky tips */}
            <polygon points="14,24 18,10 22,18 27,6 32,16 37,5 42,16 46,9 50,24" />
            <path d="M 15 24 Q 32 14 49 24 Q 42 19 32 19 Q 22 19 15 24 Z" />
            <rect x="16" y="23" width="3" height="6" rx="1" />
            <rect x="45" y="23" width="3" height="6" rx="1" />
          </g>
        );

      // 5. FEMALE: Tóc Dài Uốn Lượn Sóng (Glamour Wavy)
      case 'female_wavy':
        return (
          <g fill={hairColor}>
            {/* Full crown covering top */}
            <path d="M 13 25 C 13 12 21 6 32 6 C 43 6 51 12 51 25 C 47 21 44 21 43 25 C 41 20 37 19 32 23 C 27 19 23 20 21 25 C 20 21 17 21 13 25 Z" />
            {/* Airy see-through bangs */}
            <rect x="27" y="19" width="2" height="4" rx="1" opacity="0.8" />
            <rect x="31" y="19" width="2" height="4.5" rx="1" opacity="0.8" />
            <rect x="35" y="19" width="2" height="4" rx="1" opacity="0.8" />
            {/* Lush wavy strands framing cheekbones */}
            <path d="M 14 24 C 13 32 16 40 14 48 C 17 48 19 40 19 32 C 19 26 17 24 14 24 Z" />
            <path d="M 50 24 C 51 32 48 40 50 48 C 47 48 45 40 45 32 C 45 26 47 24 50 24 Z" />
            {/* Glossy sheen */}
            <ellipse cx="32" cy="10" rx="9" ry="2" fill="#ffffff" opacity="0.3" />
          </g>
        );

      // 6. FEMALE: Tóc Suôn Mượt (Hime / Long Straight)
      case 'female_straight':
      case 'long':
        return (
          <g fill={hairColor}>
            <path d="M 14 25 C 13 12 21 6 32 6 C 43 6 51 12 50 25 C 48 21 44 21 43 25 C 40 21 24 21 21 25 C 20 21 16 21 14 25 Z" />
            {/* Straight neat fringe */}
            <path d="M 21 20 Q 32 23 43 20 L 43 24 Q 32 26 21 24 Z" />
            {/* Sleek straight face-framing cuts */}
            <rect x="14" y="24" width="4.5" height="24" rx="2" />
            <rect x="45.5" y="24" width="4.5" height="24" rx="2" />
            <ellipse cx="32" cy="10" rx="10" ry="2" fill="#ffffff" opacity="0.3" />
          </g>
        );

      // 7. FEMALE: Tóc Bob Cúp (Chic Lob)
      case 'female_bob':
      case 'bob':
        return (
          <g fill={hairColor}>
            {/* Voluminous bob crown */}
            <path d="M 13 26 C 12 12 21 6 32 6 C 43 6 52 12 51 26 C 51 35 48 41 44 41 C 42 34 45 26 43 23 C 38 19 26 19 21 23 C 19 26 22 34 20 41 C 16 41 13 35 13 26 Z" />
            {/* Cute side bangs */}
            <path d="M 22 20 Q 28 24 35 21 Q 28 22 22 20 Z" />
            <ellipse cx="32" cy="10" rx="9" ry="2" fill="#ffffff" opacity="0.25" />
          </g>
        );

      // 8. FEMALE: Ponytail front
      case 'female_ponytail':
      case 'ponytail':
        return (
          <g fill={hairColor}>
            <path d="M 14 25 C 13 13 21 7 32 7 C 43 7 51 13 50 25 C 47 21 44 21 43 25 C 41 20 37 19 32 23 C 27 19 23 20 21 25 C 20 21 17 21 14 25 Z" />
            <rect x="15" y="24" width="3" height="9" rx="1.5" />
            <rect x="46" y="24" width="3" height="9" rx="1.5" />
            <ellipse cx="32" cy="11" rx="8" ry="2" fill="#ffffff" opacity="0.25" />
          </g>
        );

      // 9. FEMALE: Bun front
      case 'female_bun':
        return (
          <g fill={hairColor}>
            <path d="M 14 25 C 13 13 21 7 32 7 C 43 7 51 13 50 25 C 47 21 43 21 42 25 C 40 21 24 21 22 25 C 21 21 17 21 14 25 Z" />
            {/* Loose feminine tendrils */}
            <path d="M 16 26 Q 14 33 17 38" stroke={hairColor} strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M 48 26 Q 50 33 47 38" stroke={hairColor} strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <ellipse cx="32" cy="11" rx="8" ry="2" fill="#ffffff" opacity="0.25" />
          </g>
        );

      // 10. FEMALE: Pixie Sành Điệu
      case 'female_pixie':
        return (
          <g fill={hairColor}>
            <path d="M 14 25 C 13 12 21 6 32 6 C 43 6 51 12 50 25 C 48 21 44 21 43 25 C 40 18 28 18 20 23 C 19 24 16 21 14 25 Z" />
            <polygon points="20,21 34,26 36,21" />
            <rect x="15.5" y="23" width="3" height="6" rx="1" />
            <rect x="45.5" y="23" width="3" height="6" rx="1" />
            <ellipse cx="32" cy="10" rx="8" ry="2" fill="#ffffff" opacity="0.25" />
          </g>
        );

      default:
        return (
          <g fill={hairColor}>
            <path d="M 14 25 C 13 13 21 7 32 7 C 43 7 51 13 50 25 C 47 21 44 21 43 25 C 41 20 23 20 21 25 C 20 21 17 21 14 25 Z" />
            <rect x="15" y="24" width="3.5" height="7" rx="1.5" />
            <rect x="45.5" y="24" width="3.5" height="7" rx="1.5" />
          </g>
        );
    }
  };

  // EYES & FACIAL EXPRESSIONS
  const renderEyes = () => {
    if (isFacingUp) return null;

    const leftEyeX = isFacingLeft ? 24 : 26.5;
    const rightEyeX = isFacingLeft ? 33.5 : 37.5;
    const eyeY = 25.5;

    return (
      <g>
        {/* Left Eye */}
        <circle cx={leftEyeX} cy={eyeY} r="3" fill="#ffffff" />
        <circle cx={leftEyeX} cy={eyeY} r="2" fill={eyeColor} />
        <circle cx={leftEyeX - 0.7} cy={eyeY - 0.7} r="0.9" fill="#ffffff" />
        {isFemale && <circle cx={leftEyeX + 0.8} cy={eyeY + 0.8} r="0.5" fill="#ffffff" />}

        {/* Right Eye */}
        <circle cx={rightEyeX} cy={eyeY} r="3" fill="#ffffff" />
        <circle cx={rightEyeX} cy={eyeY} r="2" fill={eyeColor} />
        <circle cx={rightEyeX - 0.7} cy={eyeY - 0.7} r="0.9" fill="#ffffff" />
        {isFemale && <circle cx={rightEyeX + 0.8} cy={eyeY + 0.8} r="0.5" fill="#ffffff" />}

        {/* Eyelashes for Female */}
        {isFemale && (
          <g stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round">
            <path d={`M ${leftEyeX - 2.5} ${eyeY - 2.2} Q ${leftEyeX} ${eyeY - 3.5} ${leftEyeX + 2.5} ${eyeY - 2.2}`} fill="none" />
            <line x1={leftEyeX + 2.2} y1={eyeY - 2.2} x2={leftEyeX + 3.8} y2={eyeY - 3.8} />
            <path d={`M ${rightEyeX - 2.5} ${eyeY - 2.2} Q ${rightEyeX} ${eyeY - 3.5} ${rightEyeX + 2.5} ${eyeY - 2.2}`} fill="none" />
            <line x1={rightEyeX + 2.2} y1={eyeY - 2.2} x2={rightEyeX + 3.8} y2={eyeY - 3.8} />
          </g>
        )}

        {/* Eyebrows for Male */}
        {!isFemale && (
          <g stroke="#0f172a" strokeWidth="1.3" strokeLinecap="round">
            <line x1={leftEyeX - 2.5} y1={eyeY - 4.5} x2={leftEyeX + 2.5} y2={eyeY - 4} />
            <line x1={rightEyeX - 2.5} y1={eyeY - 4} x2={rightEyeX + 2.5} y2={eyeY - 4.5} />
          </g>
        )}

        {/* Cheerful Blush */}
        <ellipse cx={leftEyeX - 1} cy={eyeY + 3.8} rx={isFemale ? 3.2 : 2.2} ry="1.5" fill="#f43f5e" opacity={isFemale ? 0.45 : 0.3} />
        <ellipse cx={rightEyeX + 1} cy={eyeY + 3.8} rx={isFemale ? 3.2 : 2.2} ry="1.5" fill="#f43f5e" opacity={isFemale ? 0.45 : 0.3} />

        {/* Sweet Smile */}
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

  // ACCESSORIES
  const renderAccessory = () => {
    switch (accessory) {
      case 'glasses':
        return (
          <g stroke="#0f172a" strokeWidth="1.4" fill="none">
            <rect x="23" y="22.5" width="7.5" height="6" rx="2" fill="rgba(255,255,255,0.4)" />
            <rect x="33.5" y="22.5" width="7.5" height="6" rx="2" fill="rgba(255,255,255,0.4)" />
            <line x1="30.5" y1="25" x2="33.5" y2="25" />
          </g>
        );
      case 'headphones':
        return (
          <g>
            <path d="M 15 25 A 17 17 0 0 1 49 25" stroke="#334155" strokeWidth="2.8" fill="none" />
            <rect x="13" y="22" width="4.5" height="9" rx="2" fill="#0284c7" />
            <rect x="46.5" y="22" width="4.5" height="9" rx="2" fill="#0284c7" />
          </g>
        );
      case 'badge':
        return (
          <g>
            <path d="M 30 38 L 32 45 L 34 38" stroke="#3b82f6" strokeWidth="1" fill="none" />
            <rect x="30" y="44" width="4" height="5" rx="0.5" fill="#f8fafc" stroke="#64748b" strokeWidth="0.5" />
            <rect x="31" y="45" width="2" height="1" fill="#3b82f6" />
          </g>
        );
      default:
        return null;
    }
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
            {/* Elegant A-line Dress */}
            <path d="M 23 38 L 41 38 L 48 54 L 16 54 Z" fill={outfitColor} />
            {/* Belt & Gold Buckle */}
            <rect x="23" y="44" width="18" height="2.5" fill="#facc15" />
            <rect x="30.5" y="43.5" width="3" height="3.5" fill="#ca8a04" rx="0.5" />
            {/* Collar lace */}
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
        {/* Shadow */}
        <ellipse cx="32" cy="60" rx="14" ry="4" fill="rgba(0,0,0,0.35)" />

        {/* 1. LAYER 1: BACK HAIR (behind head & torso) */}
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

        {/* 2. LAYER 2: HEAD & EARS */}
        <circle cx="32" cy="25" r="14" fill={skinColor} />
        <circle cx="18" cy="26" r="2.5" fill={skinColor} />
        <circle cx="46" cy="26" r="2.5" fill={skinColor} />

        {/* Eyes & Mouth */}
        {renderEyes()}

        {/* 3. LAYER 3: FRONT HAIR (Covers crown, forehead, temples) */}
        {renderFrontHair()}

        {/* Accessory on top */}
        {renderAccessory()}

        {/* Action props */}
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
