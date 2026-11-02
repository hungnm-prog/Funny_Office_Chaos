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
    outfitStyle = 'casual_tee',
    eyeColor = '#0f172a',
    accessory = 'none',
  } = appearance;

  const isFacingLeft = direction === 'left';
  const isFacingUp = direction === 'up';
  const isFemale = gender === 'female';
  const hasHat = accessory === 'cap' || accessory === 'beanie';

  // Normalize male hairstyles
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

  // 1. LAYER 1: BACK HAIR
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
            {!hasHat && (
              <>
                <circle cx="32" cy="8" r="8.5" />
                <circle cx="32" cy="8" r="9.5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <rect x="27" y="13" width="10" height="3" rx="1.5" fill="#f43f5e" />
              </>
            )}
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

  // 2. LAYER 3: FRONT HAIR (100% Solid Continuous Paths - ZERO Gaps, ZERO Exposed Skin Holes)
  const renderFrontHair = () => {
    if (!isFemale) {
      switch (currentStyleKey) {
        // STYLE 1: SIDEPART 7/3 (Rẽ ngôi 7/3 lãng tử, mái dấu phẩy bồng bềnh liền khối)
        case 'sidepart7_3':
        default:
          return (
            <g fill={hairColor}>
              <path d="M 13.5 23 C 12.5 11 21 5 32 5 C 43 5 51.5 11 50.5 23 L 46.5 21 C 44 20 40 19.8 36 19 C 31 18 27.5 16 26.5 15 C 25 17 21 18.5 17 20 C 15.5 20.5 14.5 21.5 13.5 23 Z" />
              <path d="M 26.5 15 Q 36 14 44 17.5 C 46 19.5 42 20.4 37 20.2 C 32 19.8 28 18 26.5 15 Z" />
              <rect x="15" y="22" width="3.5" height="7" rx="1.5" />
              <rect x="45.5" y="22" width="3.5" height="7" rx="1.5" />
              <ellipse cx="34" cy="9.5" rx="8" ry="1.8" fill="#ffffff" opacity="0.28" />
            </g>
          );

        // STYLE 2: UNDERCUT (Hai bên fade gọn, đỉnh pompadour vuốt phồng hiện đại)
        case 'undercut':
          return (
            <g fill={hairColor}>
              <path d="M 15 22 C 14 11 22 4.5 32 4.5 C 42 4.5 50 11 49 22 L 44 21 C 42 17.5 40 17 36 17 L 24 17 C 21 17 19 18 17 21 Z" />
              <path d="M 20 17 Q 32 13 44 17 L 42 19 Q 32 15 22 19 Z" fill="rgba(255,255,255,0.22)" />
              <rect x="15.8" y="22" width="2.8" height="6.5" rx="1" opacity="0.85" />
              <rect x="45.4" y="22" width="2.8" height="6.5" rx="1" opacity="0.85" />
              <ellipse cx="32" cy="9" rx="8.5" ry="2" fill="#ffffff" opacity="0.25" />
            </g>
          );

        // STYLE 3: LAYER (Tóc tỉa layer bồng bềnh Hàn Quốc - Liền mạch 1 khối, KHÔNG LỖ HỔNG, KHÔNG RĂNG CƯA THÔ)
        case 'layer':
          return (
            <g fill={hairColor}>
              {/* Vòm tóc và mái layer tỉa so le mềm mại thành 1 path khép kín đồng nhất */}
              <path d="M 13.5 23 C 12.5 11 21 5 32 5 C 43 5 51.5 11 50.5 23 L 46.5 21 C 44 20.4 42.5 20.4 39.5 18.5 C 38 20.6 36 20.6 33 18.6 C 31.5 20.6 29.5 20.6 26.5 18.6 C 25 20.4 23 20.4 20 18.5 C 18 20.4 16.5 20.5 14.5 21 Z" />
              {/* Lớp tóc tỉa so le tạo chiều sâu bồng bềnh */}
              <path d="M 17 19.5 Q 21.5 20.6 25 18.6 Q 29.5 20.8 33 18.6 Q 36.5 20.8 40 18.5 Q 43 20.4 46 19.5" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" fill="none" />
              <rect x="15" y="22" width="3.2" height="6.5" rx="1.2" />
              <rect x="45.8" y="22" width="3.2" height="6.5" rx="1.2" />
              <ellipse cx="32" cy="10" rx="9" ry="2.2" fill="#ffffff" opacity="0.25" />
            </g>
          );

        // STYLE 4: SHORT QUIFF (Vuốt dựng năng động trẻ trung)
        case 'short_quiff':
          return (
            <g fill={hairColor}>
              <path d="M 14.5 23 C 13.5 12 21 4 32 4 C 42 4 49.5 12 49.5 23 L 45 21 C 43 18.5 41 18 38 18 C 35 15 34 11 32 6.5 C 30 11 29 15 26 18 C 23 18 20 19 18 21 Z" />
              <path d="M 26 15 Q 32 8.5 38 15 L 36 17 Q 32 11 28 17 Z" fill="rgba(255,255,255,0.22)" />
              <rect x="15.5" y="22" width="3" height="6.5" rx="1.2" />
              <rect x="45.5" y="22" width="3" height="6.5" rx="1.2" />
              <ellipse cx="32" cy="9.5" rx="7.5" ry="1.8" fill="#ffffff" opacity="0.25" />
            </g>
          );

        // STYLE 5: BUZZ CUT (Đầu đinh cua sắc sảo ôm sát vòm sọ)
        case 'buzz_cut':
          return (
            <g fill={hairColor}>
              <path d="M 16 23 C 15.5 13 22 8.5 32 8.5 C 42 8.5 48.5 13 48 23 L 44 21 C 42 17.5 40 17 36 17 L 24 17 C 21 17 19 18 17 21 Z" />
              <rect x="16" y="23" width="2.8" height="5.5" rx="0.8" opacity="0.9" />
              <rect x="45.2" y="23" width="2.8" height="5.5" rx="0.8" opacity="0.9" />
              <ellipse cx="32" cy="12.5" rx="8.5" ry="1.8" fill="#ffffff" opacity="0.18" />
            </g>
          );
      }
    }

    switch (currentStyleKey) {
      case 'female_wavy':
        return (
          <g fill={hairColor}>
            <path d="M 13 23 C 13 11 21 5.5 32 5.5 C 43 5.5 51 11 51 23 L 47 21 C 44 19 41 18 38 18 C 34 18 33 17 32 17 C 31 17 30 18 26 18 C 23 18 20 19 17 21 Z" />
            <path d="M 27 17.5 Q 28 19 28 20.3" stroke={hairColor} strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 32 17.5 L 32 20.5" stroke={hairColor} strokeWidth="2.0" strokeLinecap="round" />
            <path d="M 37 17.5 Q 36 19 36 20.3" stroke={hairColor} strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 14 22 C 13 32 16 40 14 48 C 17 48 19 40 19 32 C 19 25 17 22 14 22 Z" />
            <path d="M 50 22 C 51 32 48 40 50 48 C 47 48 45 40 45 32 C 45 25 47 22 50 22 Z" />
            <ellipse cx="32" cy="10" rx="9" ry="2" fill="#ffffff" opacity="0.3" />
          </g>
        );
      case 'female_straight':
      case 'long':
        return (
          <g fill={hairColor}>
            <path d="M 13.5 23 C 12.5 11 21 5.5 32 5.5 C 43 5.5 51.5 11 50.5 23 L 46 21 C 42 19.5 37 19.2 32 19.2 C 27 19.2 22 19.5 18 21 Z" />
            <rect x="14" y="22" width="4.5" height="24" rx="2" />
            <rect x="45.5" y="22" width="4.5" height="24" rx="2" />
            <ellipse cx="32" cy="10" rx="10" ry="2" fill="#ffffff" opacity="0.3" />
          </g>
        );
      case 'female_bob':
      case 'bob':
        return (
          <g fill={hairColor}>
            <path d="M 13 24 C 12 11 21 5.5 32 5.5 C 43 5.5 52 11 51 24 C 51 35 48 41 44 41 C 42 34 45 25 43 21 C 39 18.5 35 18 32 18 C 29 18 25 18.5 21 21 C 19 25 22 34 20 41 C 16 41 13 35 13 24 Z" />
            <path d="M 22 17 Q 28 19 35 18 Q 28 18.5 22 17 Z" />
            <ellipse cx="32" cy="10" rx="9" ry="2" fill="#ffffff" opacity="0.25" />
          </g>
        );
      case 'female_ponytail':
      case 'ponytail':
        return (
          <g fill={hairColor}>
            <path d="M 14 23 C 13 12 21 6 32 6 C 43 6 51 12 50 23 L 46 21 C 42 19 38 18 32 18 C 26 18 22 19 18 21 Z" />
            <rect x="15" y="22" width="3" height="8" rx="1.5" />
            <rect x="46" y="22" width="3" height="8" rx="1.5" />
            <ellipse cx="32" cy="11" rx="8" ry="2" fill="#ffffff" opacity="0.25" />
          </g>
        );
      case 'female_bun':
        return (
          <g fill={hairColor}>
            <path d="M 14 23 C 13 12 21 6 32 6 C 43 6 51 12 50 23 L 46 21 C 42 19 38 18 32 18 C 26 18 22 19 18 21 Z" />
            <path d="M 16 24 Q 14 31 17 36" stroke={hairColor} strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M 48 24 Q 50 31 47 36" stroke={hairColor} strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <ellipse cx="32" cy="11" rx="8" ry="2" fill="#ffffff" opacity="0.25" />
          </g>
        );
      case 'female_pixie':
        return (
          <g fill={hairColor}>
            <path d="M 14 23 C 13 12 21 6 32 6 C 43 6 51 12 50 23 L 46 21 C 43 18.5 39 18 34 18 C 28 18 22 19 18 21 Z" />
            <path d="M 21 16 Q 32 17.5 42 17.5 L 40 19.5 Q 32 19 22 18 Z" fill="rgba(255,255,255,0.22)" />
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

  // 3. LAYER 4: ACCESSORIES
  // REQUIREMENT: Băng rôn (Headband) hiển thị CHÍNH XÁC cùng kích cỡ đầu nhân vật, không lộ ra ngoài và không bị lọt vào trong!
  const renderAccessory = () => {
    switch (accessory) {
      // BĂNG RÔN / BĂNG ĐÔ THỂ THAO: Clipped perfectly to circle cx=32 cy=25 r=14
      case 'headband':
        return (
          <g clipPath="url(#head-contour-clip)">
            {/* The headband spans the forehead across y=16.5 to y=20.5, curving naturally */}
            <path
              d="M 16 16.5 Q 32 18.5 48 16.5 L 48 20.8 Q 32 22.8 16 20.8 Z"
              fill="#ef4444"
              stroke="#b91c1c"
              strokeWidth="0.5"
            />
            {/* Sport contrast stripe */}
            <path d="M 16 18.6 Q 32 20.6 48 18.6" stroke="#ffffff" strokeWidth="1.2" fill="none" />
            {/* Center Sport Logo Badge */}
            <rect x="29.5" y="17.2" width="5" height="2.6" rx="0.6" fill="#ffffff" />
            <circle cx="32" cy="18.5" r="0.9" fill="#ef4444" />
          </g>
        );

      // MŨ LƯỠI TRAI (Snapback / Baseball Cap)
      // REQUIREMENT: Kích thước chuẩn xác theo vòm đầu nhân vật, không thừa ra ngoài, không thụt vào trong, không che mắt hay lông mày!
      case 'cap':
        return (
          <g>
            {/* 1. Chóp mũ (Crown): Ôm khít chuẩn xác vòm đầu (x=17.5 đến 46.5, đỉnh tại y=9.2) */}
            <path
              d="M 17.5 19.5 C 17.5 11.5 23 9.2 32 9.2 C 41 9.2 46.5 11.5 46.5 19.5 Q 32 17.8 17.5 19.5 Z"
              fill={outfitColor}
              stroke="#0f172a"
              strokeWidth="0.8"
            />
            {/* 2. Nút tròn đỉnh mũ (Top button) */}
            <circle cx="32" cy="9.2" r="1.4" fill="#f8fafc" stroke="#0f172a" strokeWidth="0.5" />

            {/* 3. Đường chỉ may múi mũ (Crown seams) */}
            <path d="M 32 9.2 L 32 18.2" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
            <path d="M 32 9.2 Q 24.5 12 19 18" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" fill="none" />
            <path d="M 32 9.2 Q 39.5 12 45 18" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" fill="none" />

            {/* 4. Huy hiệu/Logo thêu nổi mặt trước trán */}
            <circle cx="32" cy="14" r="2.2" fill="#ffffff" stroke="#0f172a" strokeWidth="0.4" />
            <polygon points="32,12.3 32.7,13.8 34.2,13.8 33,14.7 33.4,16.1 32,15.2 30.6,16.1 31,14.7 29.8,13.8 31.3,13.8" fill="#3b82f6" />

            {/* 5. Vành lưỡi trai (Visor/Bill): Bắt đầu từ 2 mép thái dương x=17.5 và 46.5, cong vòm thể thao ôm nhẹ phía trước trán */}
            {/* Vành kết thúc tại y=20.2, nằm ngay trên lông mày (y=21.0) và mắt (y=25.5), ôm khít khuôn đầu */}
            <path
              d="M 17.5 18.5 Q 32 17.2 46.5 18.5 C 46.8 19.8 40 20.3 32 20.3 C 24 20.3 17.2 19.8 17.5 18.5 Z"
              fill="#0f172a"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="0.6"
            />
            {/* Đường phản quang bóng sáng trên vành lưỡi trai */}
            <path d="M 21 19.2 Q 32 19.8 43 19.2" stroke="rgba(255,255,255,0.35)" strokeWidth="0.6" fill="none" />
          </g>
        );

      // MŨ LEN BEANIE
      // REQUIREMENT: Ôm trọn vòm đầu tự nhiên, không bị bè ngang ra ngoài không khí, vành gập cong theo trán!
      case 'beanie':
        return (
          <g>
            {/* 1. Thân vòm mũ len: Ôm sát vòm sọ từ x=17.5 đến 46.5, đỉnh mềm mại tại y=8.0 */}
            <path
              d="M 17.5 17.5 C 17 10 22.5 7.8 32 7.8 C 41.5 7.8 47 10 46.5 17.5 Z"
              fill={outfitColor}
              stroke="#0f172a"
              strokeWidth="0.7"
            />

            {/* 2. Quả bông len trên đỉnh mũ (Pom-pom) */}
            <circle cx="32" cy="7.2" r="2.6" fill="#f8fafc" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
            <circle cx="32" cy="7.2" r="1.6" fill="#e2e8f0" opacity="0.6" />

            {/* 3. Đường vân dệt trên thân mũ (Knit ribs) */}
            <path d="M 32 7.8 L 32 16.5" stroke="rgba(255,255,255,0.22)" strokeWidth="0.7" />
            <path d="M 27 9 Q 25 12.5 24 16.8" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" fill="none" />
            <path d="M 37 9 Q 39 12.5 40 16.8" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" fill="none" />

            {/* 4. Vành len gập (Folded Cuff): Cong tự nhiên ôm trán từ x=17.5 đến 46.5, mép dưới tại y=20.2 */}
            <path
              d="M 17.5 16.2 Q 32 17.2 46.5 16.2 L 46.5 19.8 Q 32 20.3 17.5 19.8 Z"
              fill="#1e293b"
              stroke={outfitColor}
              strokeWidth="0.7"
            />

            {/* 5. Các đường gân len đan trên vành gập (Ribbed stitches) */}
            <line x1="21.5" y1="16.6" x2="21.5" y2="19.9" stroke="rgba(255,255,255,0.22)" strokeWidth="0.7" />
            <line x1="25.0" y1="16.9" x2="25.0" y2="20.1" stroke="rgba(255,255,255,0.22)" strokeWidth="0.7" />
            <line x1="28.5" y1="17.1" x2="28.5" y2="20.2" stroke="rgba(255,255,255,0.22)" strokeWidth="0.7" />
            <line x1="32.0" y1="17.2" x2="32.0" y2="20.3" stroke="rgba(255,255,255,0.22)" strokeWidth="0.7" />
            <line x1="35.5" y1="17.1" x2="35.5" y2="20.2" stroke="rgba(255,255,255,0.22)" strokeWidth="0.7" />
            <line x1="39.0" y1="16.9" x2="39.0" y2="20.1" stroke="rgba(255,255,255,0.22)" strokeWidth="0.7" />
            <line x1="42.5" y1="16.6" x2="42.5" y2="19.9" stroke="rgba(255,255,255,0.22)" strokeWidth="0.7" />

            {/* 6. Nhãn da thời trang nhỏ bên góc mũ (Brand leather patch) */}
            <rect x="23.5" y="17.2" width="4.5" height="2.2" rx="0.5" fill="#ca8a04" stroke="#a16207" strokeWidth="0.4" />
            <line x1="24.8" y1="18.3" x2="26.7" y2="18.3" stroke="#ffffff" strokeWidth="0.5" />
          </g>
        );

      // TAI NGHE CHỤP TAI
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
            <rect x="11.5" y="20.5" width="5.5" height="11" rx="2.5" fill="#0f172a" stroke={outfitColor} strokeWidth="1" />
            <circle cx="14.2" cy="26" r="1.5" fill="#38bdf8" />
            <rect x="47" y="20.5" width="5.5" height="11" rx="2.5" fill="#0f172a" stroke={outfitColor} strokeWidth="1" />
            <circle cx="49.8" cy="26" r="1.5" fill="#38bdf8" />
          </g>
        );

      // KÍNH MẮT TRÍ THỨC
      case 'glasses':
        return (
          <g stroke="#0f172a" strokeWidth="1.3" fill="none">
            <rect x="23" y="22.5" width="7.5" height="6.5" rx="2" fill="rgba(255,255,255,0.08)" />
            <rect x="33.5" y="22.5" width="7.5" height="6.5" rx="2" fill="rgba(255,255,255,0.08)" />
            <line x1="30.5" y1="25" x2="33.5" y2="25" />
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

  // 4. DIVERSE OUTFITS: MALE (Casual to Sports) & FEMALE (Sports to Fashion)
  // REQUIREMENT: Bộ đồ KHÔNG được che tay của nhân vật (Thân áo nằm trong x=21-43, không lấn ra vùng tay x=19.2 và x=44.8)
  const renderOutfitTorso = () => {
    // A. MALE OUTFITS
    if (!isFemale) {
      switch (outfitStyle) {
        // THỂ THAO 1: GYM / FITNESS PRO (Áo thun thể thao ôm sát, tay ngắn lộ bắp tay)
        case 'sport_gym':
          return (
            <g>
              <path d="M 21 38 L 43 38 L 44 52 L 20 52 Z" fill={outfitColor} />
              {/* Gym V-neck */}
              <polygon points="32,44 28,38 36,38" fill={skinColor} />
              {/* Sporty athletic side stripes */}
              <line x1="23" y1="40" x2="22" y2="52" stroke="#ffffff" strokeWidth="1.2" />
              <line x1="41" y1="40" x2="42" y2="52" stroke="#ffffff" strokeWidth="1.2" />
              {/* Chest logo */}
              <circle cx="32" cy="46" r="1.8" fill="#ffffff" />
            </g>
          );

        // THỂ THAO 2: BASKETBALL JERSEY #07 (Áo sát nách thể thao, lộ trọn cánh tay)
        case 'sport_jersey':
          return (
            <g>
              {/* Sleeveless tank top */}
              <path d="M 23 38 L 41 38 L 43 52 L 21 52 Z" fill={outfitColor} />
              {/* Deep scoop neck */}
              <path d="M 27 38 Q 32 44 37 38" fill={skinColor} />
              {/* Number 07 on chest */}
              <text x="32" y="49" fontSize="6" fontWeight="900" fill="#ffffff" textAnchor="middle" fontFamily="sans-serif">
                07
              </text>
              {/* Contrast armhole trim */}
              <line x1="23" y1="38" x2="21" y2="52" stroke="#ffffff" strokeWidth="1" />
              <line x1="41" y1="38" x2="43" y2="52" stroke="#ffffff" strokeWidth="1" />
            </g>
          );

        // THOẢI MÁI 1: ÁO PHÔNG STREETWEAR OVERSIZE
        case 'casual_tee':
        case 'casual':
          return (
            <g>
              <path d="M 21 38 L 43 38 L 44 52 L 20 52 Z" fill={outfitColor} />
              <path d="M 27 38 Q 32 42 37 38" stroke="#ffffff" strokeWidth="1.2" fill={skinColor} />
              {/* Streetwear graphic line */}
              <rect x="27" y="44" width="10" height="3.5" rx="1" fill="rgba(255,255,255,0.2)" />
            </g>
          );

        // THOẢI MÁI 2: ÁO POLO NĂNG ĐỘNG
        case 'casual_polo':
        case 'shirt':
          return (
            <g>
              <path d="M 21 38 L 43 38 L 44 52 L 20 52 Z" fill={outfitColor} />
              {/* White collar */}
              <polygon points="32,43 26,38 38,38" fill="#ffffff" />
              <line x1="32" y1="43" x2="32" y2="48" stroke="#0f172a" strokeWidth="0.8" />
              <circle cx="32" cy="45" r="0.7" fill="#0f172a" />
            </g>
          );

        // THOẢI MÁI 3: HOODIE TRẺ TRUNG
        case 'hoodie':
          return (
            <g>
              <path d="M 20 38 L 44 38 L 44 52.5 L 20 52.5 Z" fill={outfitColor} rx="2" />
              {/* Kangaroo pocket */}
              <rect x="25" y="46" width="14" height="5.5" rx="1.5" fill="rgba(0,0,0,0.15)" />
              <line x1="29" y1="39" x2="29" y2="43" stroke="#ffffff" strokeWidth="1" />
              <line x1="35" y1="39" x2="35" y2="43" stroke="#ffffff" strokeWidth="1" />
            </g>
          );

        // CÔNG SỞ: VEST NAM LỊCH LÃM
        case 'suit':
        default:
          return (
            <g>
              <path d="M 20 38 L 44 38 L 45 52 L 19 52 Z" fill={outfitColor} />
              <polygon points="32,45 28,38 36,38" fill="#ffffff" />
              <polygon points="32,40 33,48 32,50 31,48" fill="#dc2626" />
            </g>
          );
      }
    }

    // B. FEMALE OUTFITS (Sports & Fashion)
    switch (outfitStyle) {
      // THỂ THAO 1: ACTIVEWEAR GYM & YOGA (Áo thể thao crop-top thể thao, tôn dáng, lộ eo và tay)
      case 'female_sport_active':
        return (
          <g>
            {/* Sporty crop top */}
            <path d="M 23 38 L 41 38 L 42 46 L 22 46 Z" fill={outfitColor} />
            <path d="M 26 38 Q 32 42 38 38" fill={skinColor} />
            {/* Bare midriff / waist */}
            <rect x="23" y="46" width="18" height="3" fill={skinColor} />
            {/* High-waist yoga leggings top */}
            <path d="M 22 49 L 42 49 L 43 53 L 21 53 Z" fill="#0f172a" />
            {/* Sport stripe */}
            <line x1="24" y1="41" x2="40" y2="41" stroke="#ffffff" strokeWidth="1" />
          </g>
        );

      // THỂ THAO 2: TENNIS FIT (Áo polo thể thao & chân váy tennis xếp ly)
      case 'female_sport_tennis':
        return (
          <g>
            {/* Top polo */}
            <path d="M 23 38 L 41 38 L 42 45 L 22 45 Z" fill={outfitColor} />
            <polygon points="32,42 27,38 37,38" fill="#ffffff" />
            {/* Tennis Pleated Skirt (Width strictly 22-42, leaving hands at x=19.2 and 44.8 clear) */}
            <path d="M 22 45 L 42 45 L 43 53 L 21 53 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
            {/* Pleats */}
            <line x1="26" y1="45" x2="25" y2="53" stroke="#cbd5e1" strokeWidth="0.8" />
            <line x1="32" y1="45" x2="32" y2="53" stroke="#cbd5e1" strokeWidth="0.8" />
            <line x1="38" y1="45" x2="39" y2="53" stroke="#cbd5e1" strokeWidth="0.8" />
          </g>
        );

      // FASHION 1: VÁY RUNWAY DẠ TIỆC (Chiết eo, khóa vàng, xòe thời trang không chạm tay)
      case 'female_fashion_dress':
      case 'dress':
        return (
          <g>
            {/* Bodice */}
            <path d="M 23 38 L 41 38 L 41.5 45 L 22.5 45 Z" fill={outfitColor} />
            <path d="M 27 38 Q 32 41 37 38" stroke="#ffffff" strokeWidth="1" fill={skinColor} />
            {/* Gold belted waist */}
            <rect x="22.5" y="44" width="19" height="2.5" fill="#facc15" />
            <rect x="30.5" y="43.5" width="3" height="3.5" fill="#ca8a04" rx="0.5" />
            {/* Flare Skirt (width capped at x=21.5 to 42.5 so hands at 19.2 & 44.8 are totally unblocked) */}
            <path d="M 22.5 46.5 L 41.5 46.5 L 42.5 53.5 L 21.5 53.5 Z" fill={outfitColor} />
          </g>
        );

      // FASHION 2: BLAZER PARISIAN SÀNH ĐIỆU (Blazer suông sành điệu, trong phối lụa)
      case 'female_fashion_blazer':
      case 'suit':
        return (
          <g>
            {/* Inner silk top */}
            <rect x="25" y="38" width="14" height="14" fill="#f8fafc" />
            <path d="M 28 38 Q 32 42 36 38" fill={skinColor} />
            {/* Chic open blazer */}
            <path d="M 22 38 L 28 38 L 27 52 L 21 52 Z" fill={outfitColor} />
            <path d="M 36 38 L 42 38 L 43 52 L 37 52 Z" fill={outfitColor} />
            {/* Gold buttons on blazer */}
            <circle cx="26" cy="46" r="0.8" fill="#facc15" />
            <circle cx="38" cy="46" r="0.8" fill="#facc15" />
          </g>
        );

      // FASHION 3: CHIC PEPLUM & NGỌC TRAI
      case 'female_fashion_chic':
      case 'shirt':
        return (
          <g>
            <path d="M 23 38 L 41 38 L 42 47 L 22 47 Z" fill={outfitColor} />
            <path d="M 26 38 Q 32 42 38 38" fill={skinColor} />
            {/* Pearl buttons */}
            <circle cx="32" cy="42" r="0.9" fill="#ffffff" />
            <circle cx="32" cy="45" r="0.9" fill="#ffffff" />
            {/* Peplum flair & pencil skirt */}
            <path d="M 21.5 47 L 42.5 47 L 42 53 L 22 53 Z" fill="#1e293b" />
          </g>
        );

      // THOẢI MÁI: HOODIE PASTEL
      case 'casual_hoodie':
      case 'hoodie':
      default:
        return (
          <g>
            <path d="M 21 38 L 43 38 L 43 52.5 L 21 52.5 Z" fill={outfitColor} rx="2" />
            <rect x="26" y="46" width="12" height="5" rx="1.5" fill="rgba(0,0,0,0.12)" />
            <line x1="29.5" y1="39" x2="29.5" y2="43" stroke="#ffffff" strokeWidth="1" />
            <line x1="34.5" y1="39" x2="34.5" y2="43" stroke="#ffffff" strokeWidth="1" />
          </g>
        );
    }
  };

  // 5. SLEEVES & ARMS (Tailored cleanly based on outfit type, NEVER covers hands)
  const renderArms = () => {
    // Determine if sleeveless (e.g. basketball jersey, activewear gym top)
    const isSleeveless = outfitStyle === 'sport_jersey' || outfitStyle === 'female_sport_active';
    // Determine if short sleeves (T-shirt, gym tee, tennis polo)
    const isShortSleeve =
      outfitStyle === 'sport_gym' ||
      outfitStyle === 'casual_tee' ||
      outfitStyle === 'casual_polo' ||
      outfitStyle === 'female_sport_tennis';

    if (isSleeveless) {
      // Entire arm is bare skin!
      return (
        <g fill={skinColor}>
          {/* Left Arm */}
          <rect x="17.2" y="39" width="4" height="11" rx="2" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
          {/* Right Arm */}
          <rect x="42.8" y="39" width="4" height="11" rx="2" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
        </g>
      );
    }

    if (isShortSleeve) {
      return (
        <g>
          {/* Short sleeve tops with outfit color */}
          <rect x="17" y="38.5" width="4.5" height="5.5" rx="1.5" fill={outfitColor} />
          <rect x="42.5" y="38.5" width="4.5" height="5.5" rx="1.5" fill={outfitColor} />
          {/* Bare skin forearms */}
          <rect x="17.2" y="44" width="4" height="6" rx="1.5" fill={skinColor} />
          <rect x="42.8" y="44" width="4" height="6" rx="1.5" fill={skinColor} />
        </g>
      );
    }

    // Long sleeve styles (Suit, Hoodie, Blazer, Dress)
    return (
      <g fill={outfitColor}>
        {/* Sleeves stop cleanly at y=49, well above the hands at y=51 */}
        <rect x="17" y="38.5" width="4.5" height="10" rx="1.8" />
        <rect x="42.5" y="38.5" width="4.5" height="10" rx="1.8" />
        {/* Subtle cuff trim */}
        <line x1="17" y1="48.5" x2="21.5" y2="48.5" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
        <line x1="42.5" y1="48.5" x2="47" y2="48.5" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
      </g>
    );
  };

  // 6. EYES, EYEBROWS & SMILE
  const renderEyes = () => {
    if (isFacingUp) return null;

    const leftEyeX = 26.5;
    const rightEyeX = 37.5;
    const eyeY = 25.5;

    return (
      <g>
        {/* LÔNG MÀY (EYEBROWS) */}
        {isFemale ? (
          // Lông mày nữ lá liễu: Dáng cong thanh tú, mềm mại, đối xứng hoàn hảo 2 bên
          <g stroke="#1e293b" strokeWidth="1.1" strokeLinecap="round" fill="none">
            {/* Lông mày trái: Từ đầu mày gần mũi uốn cong lên vòm rồi vuốt nhẹ đuôi về thái dương */}
            <path d={`M ${leftEyeX + 3.0} ${eyeY - 4.2} Q ${leftEyeX} ${eyeY - 5.4} ${leftEyeX - 3.2} ${eyeY - 4.3}`} />
            {/* Lông mày phải: Từ đầu mày gần mũi uốn cong lên vòm rồi vuốt nhẹ đuôi về thái dương */}
            <path d={`M ${rightEyeX - 3.0} ${eyeY - 4.2} Q ${rightEyeX} ${eyeY - 5.4} ${rightEyeX + 3.2} ${eyeY - 4.3}`} />
          </g>
        ) : (
          // Lông mày nam: Thẳng, rậm, nam tính sắc nét
          <g stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round">
            <line x1={leftEyeX - 3.0} y1={eyeY - 4.5} x2={leftEyeX + 2.8} y2={eyeY - 4.0} />
            <line x1={rightEyeX - 2.8} y1={eyeY - 4.0} x2={rightEyeX + 3.0} y2={eyeY - 4.5} />
          </g>
        )}

        {/* TRÒNG MẮT (EYEBALLS) */}
        {/* Mắt trái */}
        <circle cx={leftEyeX} cy={eyeY} r="3.2" fill="#ffffff" />
        <circle cx={leftEyeX} cy={eyeY} r="2.1" fill={eyeColor} />
        <circle cx={leftEyeX - 0.7} cy={eyeY - 0.7} r="1" fill="#ffffff" />
        {isFemale && <circle cx={leftEyeX + 0.8} cy={eyeY + 0.8} r="0.6" fill="#ffffff" />}

        {/* Mắt phải */}
        <circle cx={rightEyeX} cy={eyeY} r="3.2" fill="#ffffff" />
        <circle cx={rightEyeX} cy={eyeY} r="2.1" fill={eyeColor} />
        <circle cx={rightEyeX - 0.7} cy={eyeY - 0.7} r="1" fill="#ffffff" />
        {isFemale && <circle cx={rightEyeX + 0.8} cy={eyeY + 0.8} r="0.6" fill="#ffffff" />}

        {/* MI MẮT NỮ (EYELINER & EYELASHES) - ĐỐI XỨNG CHUẨN XÁC RA 2 THÁI DƯƠNG */}
        {isFemale && (
          <g stroke="#0f172a" strokeWidth="1.1" strokeLinecap="round" fill="none">
            {/* Viền mí trên mắt trái cong tự nhiên theo bờ mắt */}
            <path d={`M ${leftEyeX + 2.6} ${eyeY - 2.4} Q ${leftEyeX} ${eyeY - 3.3} ${leftEyeX - 2.6} ${eyeY - 2.4}`} />
            {/* Đuôi mi mắt trái vút nhẹ ra phía thái dương ngoài */}
            <line x1={leftEyeX - 2.6} y1={eyeY - 2.4} x2={leftEyeX - 3.8} y2={eyeY - 3.4} />

            {/* Viền mí trên mắt phải cong tự nhiên theo bờ mắt */}
            <path d={`M ${rightEyeX - 2.6} ${eyeY - 2.4} Q ${rightEyeX} ${eyeY - 3.3} ${rightEyeX + 2.6} ${eyeY - 2.4}`} />
            {/* Đuôi mi mắt phải vút nhẹ ra phía thái dương ngoài */}
            <line x1={rightEyeX + 2.6} y1={eyeY - 2.4} x2={rightEyeX + 3.8} y2={eyeY - 3.4} />
          </g>
        )}

        {/* MÁ HỒNG (BLUSH) */}
        <ellipse cx={leftEyeX - 1} cy={eyeY + 4} rx={isFemale ? 3.2 : 2.2} ry="1.5" fill="#f43f5e" opacity={isFemale ? 0.45 : 0.3} />
        <ellipse cx={rightEyeX + 1} cy={eyeY + 4} rx={isFemale ? 3.2 : 2.2} ry="1.5" fill="#f43f5e" opacity={isFemale ? 0.45 : 0.3} />

        {/* NỤ CƯỜI (SMILE) */}
        <path
          d="M 30 32 Q 32 34.5 34 32"
          stroke={isFemale ? '#e11d48' : '#991b1b'}
          strokeWidth={isFemale ? '1.5' : '1.3'}
          strokeLinecap="round"
          fill="none"
        />
      </g>
    );
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
        <defs>
          {/* Exact circular clipping boundary matching head cx=32 cy=25 r=14 */}
          <clipPath id="head-contour-clip">
            <circle cx="32" cy="25" r="14" />
          </clipPath>
        </defs>

        {/* Floor Shadow */}
        <ellipse cx="32" cy="60" rx="14" ry="4" fill="rgba(0,0,0,0.35)" />

        {/* 1. BACK HAIR */}
        {renderBackHair()}

        {/* 2. LEGS & FEET */}
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

        {/* 3. TORSO BODY OUTFIT (Stays strictly within x=21-43, leaving hands clear) */}
        {renderOutfitTorso()}

        {/* 4. SLEEVES & ARMS */}
        {renderArms()}

        {/* 5. HANDS: ALWAYS ON TOP, 100% VISIBLE & NEVER COVERED BY CLOTHING */}
        <g>
          {/* Left Hand */}
          <circle cx="19.2" cy="51" r="2.6" fill={skinColor} stroke="rgba(0,0,0,0.2)" strokeWidth="0.6" />
          {/* Right Hand */}
          <circle cx="44.8" cy="51" r="2.6" fill={skinColor} stroke="rgba(0,0,0,0.2)" strokeWidth="0.6" />
        </g>

        {/* 6. NECK */}
        <rect x="29" y="34" width="6" height="5" fill={skinColor} />

        {/* 7. HEAD & EARS */}
        <circle cx="32" cy="25" r="14" fill={skinColor} />
        <circle cx="18" cy="26" r="2.5" fill={skinColor} />
        <circle cx="46" cy="26" r="2.5" fill={skinColor} />

        {/* 8. FRONT HAIR (Covers crown, strictly stops above eyes) */}
        {renderFrontHair()}

        {/* 9. ACCESSORIES (Băng rôn clipped exactly to head circumference) */}
        {renderAccessory()}

        {/* 10. EYES (100% unblocked & radiant) */}
        {renderEyes()}

        {/* 11. ACTION PROPS */}
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
