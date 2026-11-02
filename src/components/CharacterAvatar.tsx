import React from 'react';
import type { CharacterAppearance } from '../types/game';

interface CharacterAvatarProps {
  appearance: CharacterAppearance;
  direction?: 'left' | 'right' | 'up' | 'down';
  isMoving?: boolean;
  isSitting?: boolean;
  currentAction?: string;
  size?: number; // size in pixels, default 54
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
    hairColor = '#1e293b',
    hairStyle = 'short',
    skinColor = '#fde047',
    outfitColor = '#2563eb',
    outfitStyle = 'casual',
    eyeColor = '#0f172a',
    accessory = 'none',
  } = appearance;

  const isFacingLeft = direction === 'left';
  const isFacingUp = direction === 'up';

  // Hair paths depending on hairstyle
  const renderHair = () => {
    switch (hairStyle) {
      case 'curly':
        return (
          <g fill={hairColor}>
            <circle cx="20" cy="18" r="7" />
            <circle cx="28" cy="14" r="8" />
            <circle cx="36" cy="14" r="8" />
            <circle cx="44" cy="18" r="7" />
            <circle cx="17" cy="25" r="5" />
            <circle cx="47" cy="25" r="5" />
            <path d="M 18 20 Q 32 10 46 20 Q 42 16 32 15 Q 22 16 18 20 Z" />
          </g>
        );
      case 'long':
        return (
          <g fill={hairColor}>
            <path d="M 17 26 C 15 16 20 12 32 12 C 44 12 49 16 47 26 C 49 38 46 48 45 52 C 43 49 43 32 43 25 C 41 20 23 20 21 25 C 21 32 21 49 19 52 C 18 48 15 38 17 26 Z" />
            <path d="M 18 22 Q 32 14 46 22 Q 40 16 32 16 Q 24 16 18 22 Z" />
          </g>
        );
      case 'ponytail':
        return (
          <g fill={hairColor}>
            {/* Main top hair */}
            <path d="M 18 24 C 18 14 24 12 32 12 C 40 12 46 14 46 24 C 44 20 40 16 32 16 C 24 16 20 20 18 24 Z" />
            {/* High Ponytail fluff on the side or back */}
            <path d="M 38 14 C 46 8 54 12 52 24 C 50 30 46 28 44 24 C 44 18 41 16 38 14 Z" />
            {/* Hair tie */}
            <circle cx="41" cy="16" r="3" fill="#f43f5e" />
          </g>
        );
      case 'spiky':
        return (
          <g fill={hairColor}>
            <polygon points="18,22 22,10 26,18 32,7 38,18 42,10 46,22" />
            <path d="M 18 22 Q 32 16 46 22 Q 40 17 32 17 Q 24 17 18 22 Z" />
          </g>
        );
      case 'bob':
        return (
          <g fill={hairColor}>
            <path d="M 16 28 C 16 14 22 12 32 12 C 42 12 48 14 48 28 C 48 36 45 38 44 38 C 42 32 44 22 42 21 C 38 17 26 17 22 21 C 20 22 22 32 20 38 C 19 38 16 36 16 28 Z" />
          </g>
        );
      case 'short':
      default:
        return (
          <g fill={hairColor}>
            <path d="M 18 24 C 18 14 23 12 32 12 C 41 12 46 14 46 24 C 44 19 40 17 32 17 C 24 17 20 19 18 24 Z" />
            <rect x="17" y="20" width="3" height="8" rx="1.5" />
            <rect x="44" y="20" width="3" height="8" rx="1.5" />
          </g>
        );
    }
  };

  // Eyes rendering
  const renderEyes = () => {
    if (isFacingUp) {
      return null;
    }
    return (
      <g>
        {/* Left Eye */}
        <circle cx={isFacingLeft ? 24 : 27} cy="26" r="2.8" fill="#ffffff" />
        <circle cx={isFacingLeft ? 24 : 27} cy="26" r="1.8" fill={eyeColor} />
        <circle cx={isFacingLeft ? 23.5 : 26.5} cy="25.2" r="0.8" fill="#ffffff" />

        {/* Right Eye */}
        <circle cx={isFacingLeft ? 33 : 37} cy="26" r="2.8" fill="#ffffff" />
        <circle cx={isFacingLeft ? 33 : 37} cy="26" r="1.8" fill={eyeColor} />
        <circle cx={isFacingLeft ? 32.5 : 36.5} cy="25.2" r="0.8" fill="#ffffff" />

        {/* Smile / Mouth */}
        <path
          d={isFacingLeft ? 'M 26 31 Q 28 33 31 31' : 'M 30 31 Q 32 33 34 31'}
          stroke="#991b1b"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cheerful Blush */}
        <ellipse cx={isFacingLeft ? 23 : 25} cy="29" rx="2.5" ry="1.2" fill="#f43f5e" opacity="0.4" />
        <ellipse cx={isFacingLeft ? 34 : 39} cy="29" rx="2.5" ry="1.2" fill="#f43f5e" opacity="0.4" />
      </g>
    );
  };

  // Accessories
  const renderAccessory = () => {
    switch (accessory) {
      case 'glasses':
        return (
          <g stroke="#0f172a" strokeWidth="1.4" fill="none">
            <rect x="23" y="23" width="7" height="6" rx="2" fill="rgba(255,255,255,0.4)" />
            <rect x="34" y="23" width="7" height="6" rx="2" fill="rgba(255,255,255,0.4)" />
            <line x1="30" y1="26" x2="34" y2="26" />
          </g>
        );
      case 'headphones':
        return (
          <g>
            <path d="M 16 26 A 16 16 0 0 1 48 26" stroke="#475569" strokeWidth="2.5" fill="none" />
            <rect x="14" y="23" width="4" height="8" rx="2" fill="#0284c7" />
            <rect x="46" y="23" width="4" height="8" rx="2" fill="#0284c7" />
          </g>
        );
      case 'badge':
        return (
          <g>
            {/* Company Lanyard / ID Card */}
            <path d="M 30 38 L 32 45 L 34 38" stroke="#3b82f6" strokeWidth="1" fill="none" />
            <rect x="30" y="44" width="4" height="5" rx="0.5" fill="#f8fafc" stroke="#64748b" strokeWidth="0.5" />
            <rect x="31" y="45" width="2" height="1" fill="#3b82f6" />
          </g>
        );
      default:
        return null;
    }
  };

  // Outfit Details
  const renderOutfit = () => {
    switch (outfitStyle) {
      case 'suit':
        return (
          <g>
            {/* Coat Body */}
            <path d="M 21 38 L 43 38 L 45 52 L 19 52 Z" fill={outfitColor} />
            {/* White Shirt Collar */}
            <polygon points="32,45 28,38 36,38" fill="#ffffff" />
            {/* Red Tie */}
            <polygon points="32,40 33,48 32,50 31,48" fill="#dc2626" />
          </g>
        );
      case 'hoodie':
        return (
          <g>
            <path d="M 20 38 L 44 38 L 45 53 L 19 53 Z" fill={outfitColor} rx="3" />
            {/* Front pocket */}
            <rect x="25" y="46" width="14" height="6" rx="2" fill="rgba(0,0,0,0.15)" />
            {/* Hoodie string */}
            <line x1="29" y1="40" x2="29" y2="44" stroke="#ffffff" strokeWidth="1" />
            <line x1="35" y1="40" x2="35" y2="44" stroke="#ffffff" strokeWidth="1" />
          </g>
        );
      case 'dress':
        return (
          <g>
            <path d="M 24 38 L 40 38 L 47 54 L 17 54 Z" fill={outfitColor} />
            {/* Belt */}
            <rect x="23" y="44" width="18" height="2.5" fill="#facc15" />
          </g>
        );
      case 'shirt':
        return (
          <g>
            <path d="M 21 38 L 43 38 L 44 52 L 20 52 Z" fill={outfitColor} />
            {/* Buttons */}
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
            {/* Collar line */}
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
        className="drop-shadow-md overflow-visible"
      >
        {/* Shadow underneath */}
        <ellipse cx="32" cy="60" rx="14" ry="4" fill="rgba(0,0,0,0.35)" />

        {/* Legs / Feet */}
        {!isSitting ? (
          <g>
            {/* Left Leg */}
            <rect
              x="25"
              y="51"
              width="5"
              height="8"
              rx="2"
              fill="#1e293b"
              className={isMoving ? 'animate-pulse' : ''}
            />
            {/* Right Leg */}
            <rect
              x="34"
              y="51"
              width="5"
              height="8"
              rx="2"
              fill="#1e293b"
              className={isMoving ? 'animate-pulse' : ''}
            />
            {/* Shoes */}
            <rect x="24" y="57" width="7" height="3" rx="1" fill="#0f172a" />
            <rect x="33" y="57" width="7" height="3" rx="1" fill="#0f172a" />
          </g>
        ) : (
          /* Sitting Legs folded */
          <g>
            <rect x="23" y="49" width="18" height="6" rx="2" fill="#1e293b" />
            <rect x="22" y="53" width="6" height="4" rx="1" fill="#0f172a" />
            <rect x="36" y="53" width="6" height="4" rx="1" fill="#0f172a" />
          </g>
        )}

        {/* Arms */}
        <g fill={outfitColor}>
          {/* Left Arm */}
          <rect x="17" y="39" width="4.5" height="11" rx="2" />
          {/* Right Arm */}
          <rect x="42.5" y="39" width="4.5" height="11" rx="2" />
          {/* Hands */}
          <circle cx="19.2" cy="51" r="2.2" fill={skinColor} />
          <circle cx="44.8" cy="51" r="2.2" fill={skinColor} />
        </g>

        {/* Outfit Torso */}
        {renderOutfit()}

        {/* Neck */}
        <rect x="29" y="34" width="6" height="5" fill={skinColor} />

        {/* Head / Face */}
        <circle cx="32" cy="25" r="14" fill={skinColor} />

        {/* Ears */}
        <circle cx="18" cy="26" r="2.5" fill={skinColor} />
        <circle cx="46" cy="26" r="2.5" fill={skinColor} />

        {/* Eyes & Mouth */}
        {renderEyes()}

        {/* Hair */}
        {renderHair()}

        {/* Accessory on top of hair/face */}
        {renderAccessory()}

        {/* Action props (Fishing rod, Laptop hands, Game controller) */}
        {currentAction === 'fishing' && (
          <g>
            {/* Fishing rod */}
            <line x1="45" y1="46" x2="68" y2="20" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="68" y1="20" x2="72" y2="58" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" />
            {/* Bobber float */}
            <circle cx="72" cy="58" r="3" fill="#ef4444" />
          </g>
        )}

        {currentAction === 'gaming' && (
          <g>
            {/* Game Controller */}
            <rect x="27" y="47" width="10" height="6" rx="2" fill="#0f172a" stroke="#8b5cf6" strokeWidth="0.8" />
            <circle cx="29.5" cy="50" r="1" fill="#ec4899" />
            <circle cx="34.5" cy="50" r="1" fill="#06b6d4" />
          </g>
        )}

        {currentAction === 'eating' && (
          <g>
            {/* Coffee Mug or Sandwich */}
            <rect x="42" y="46" width="6" height="7" rx="1" fill="#e2e8f0" stroke="#b91c1c" strokeWidth="0.8" />
            <path d="M 47 48 C 50 48 50 51 47 52" stroke="#b91c1c" strokeWidth="1" fill="none" />
          </g>
        )}
      </svg>
    </div>
  );
};
