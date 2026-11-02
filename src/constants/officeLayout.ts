import type { WorkDesk, DiningTable, RecreationArea, Seat, DimensionConfig } from '../types/game';

export const MAP_WIDTH = 2600;
export const MAP_HEIGHT = 1750;

// MULTIDIMENSIONAL UNIVERSE REALMS (4 CHIỀU KHÔNG GIAN ĐA CHIỀU)
export const DIMENSIONS: DimensionConfig[] = [
  {
    id: 'office',
    name: 'Trụ Sở Công Sở Số 4.0',
    tagline: 'Không gian làm việc & giải trí văn phòng hiện đại',
    icon: '🏢',
    badge: 'CHIỀU 01: TRỤ SỞ CHÍNH',
    themeColor: '#3b82f6',
    skyVoidClass: 'cyber-space-void',
    portalPosition: { x: 1210, y: 280 },
    defaultSpawn: { x: 1210, y: 520 },
  },
  {
    id: 'sky_lounge',
    name: 'Tầng Thượng Sky Lounge',
    tagline: 'Quầy bar không gian, hồ bơi vô cực & đài ngắm sao ngàn mây',
    icon: '☁️',
    badge: 'CHIỀU 02: ROOFTOP SKY',
    themeColor: '#06b6d4',
    skyVoidClass: 'sky-lounge-void',
    portalPosition: { x: 1210, y: 280 },
    defaultSpawn: { x: 1210, y: 520 },
  },
  {
    id: 'quantum_matrix',
    name: 'Không Gian Lượng Tử Cyberpunk',
    tagline: 'Phòng AI Core siêu cấp, khoang Zero-G & máy chủ lượng tử',
    icon: '⚡',
    badge: 'CHIỀU 03: MA TRẬN QUANTUM',
    themeColor: '#ec4899',
    skyVoidClass: 'quantum-matrix-void',
    portalPosition: { x: 1210, y: 280 },
    defaultSpawn: { x: 1210, y: 520 },
  },
  {
    id: 'zen_island',
    name: 'Đảo Bồng Lai Thiền Tịnh',
    tagline: 'Ốc đảo trên mây, hoa anh đào, trà đạo & suối Onsen',
    icon: '🌸',
    badge: 'CHIỀU 04: ĐẢO BỒNG LAI',
    themeColor: '#10b981',
    skyVoidClass: 'zen-island-void',
    portalPosition: { x: 1210, y: 280 },
    defaultSpawn: { x: 1210, y: 520 },
  },
];

// Zone Boundaries for Minimap and Navigation (Office Dimension)
export const OFFICE_ZONES = [
  {
    id: 'work-zone',
    name: 'Khu Làm Việc',
    description: '20 bàn làm việc với máy tính & màn hình kép',
    icon: '💻',
    bounds: { x: 80, y: 150, width: 1120, height: 780 },
    focusPoint: { x: 620, y: 520 },
    color: '#3b82f6',
  },
  {
    id: 'kitchen-zone',
    name: 'Khu Bếp & Căn Tin',
    description: '3 bàn ăn lớn (8 ghế/bàn) & quầy cà phê, tủ lạnh',
    icon: '🍽️',
    bounds: { x: 80, y: 980, width: 1120, height: 680 },
    focusPoint: { x: 620, y: 1320 },
    color: '#10b981',
  },
  {
    id: 'fishing-zone',
    name: 'Khu Câu Cá Zen',
    description: 'Hồ cá Koi trong nhà, cầu gỗ và cần câu cá',
    icon: '🎣',
    bounds: { x: 1260, y: 150, width: 580, height: 720 },
    focusPoint: { x: 1550, y: 510 },
    color: '#06b6d4',
  },
  {
    id: 'cinema-zone',
    name: 'Khu Xem Phim',
    description: 'Màn chiếu cinema khổng lồ & sofa rạp chiếu phim',
    icon: '🎬',
    bounds: { x: 1880, y: 150, width: 620, height: 720 },
    focusPoint: { x: 2190, y: 510 },
    color: '#8b5cf6',
  },
  {
    id: 'cards-zone',
    name: 'Khu Đánh Bài',
    description: 'Bàn Poker & board games bài Tây thư giãn',
    icon: '🃏',
    bounds: { x: 1260, y: 920, width: 580, height: 740 },
    focusPoint: { x: 1550, y: 1290 },
    color: '#f59e0b',
  },
  {
    id: 'gaming-zone',
    name: 'Khu Chơi Game Arcade',
    description: 'Máy thùng điện tử neon, PS5 & ghế lười gaming',
    icon: '🎮',
    bounds: { x: 1880, y: 920, width: 620, height: 740 },
    focusPoint: { x: 2190, y: 1290 },
    color: '#ec4899',
  },
];

// Generate exactly 20 work desks (4 rows x 5 desks)
export const WORK_DESKS: WorkDesk[] = (() => {
  const desks: WorkDesk[] = [];
  const startX = 160;
  const startY = 270;
  const colSpacing = 200;
  const rowSpacing = 150;

  let count = 1;
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 5; col++) {
      const x = startX + col * colSpacing;
      const y = startY + row * rowSpacing;
      const isFacingDown = row % 2 === 0;

      const seat: Seat = {
        id: `desk-seat-${count}`,
        label: `Bàn 0${count}`.slice(-6),
        x: x + 45,
        y: isFacingDown ? y + 80 : y - 35,
        type: 'desk',
        direction: isFacingDown ? 'up' : 'down',
        dimensionId: 'office',
      };

      desks.push({
        id: `desk-${count}`,
        number: count,
        x,
        y,
        seat,
        hasLaptop: count % 3 !== 0,
        screenColor: ['#38bdf8', '#818cf8', '#34d399', '#f472b6', '#fbbf24'][count % 5],
        monitorState: (['code', 'chart', 'design', 'doc'] as const)[count % 4],
        plant: count % 2 === 0,
        coffee: count % 3 === 1,
      });

      count++;
    }
  }
  return desks;
})();

// Generate exactly 3 dining tables with 8 seats each (3 x 8 = 24 seats)
export const DINING_TABLES: DiningTable[] = (() => {
  const tables: DiningTable[] = [];
  const tableConfigs = [
    { num: 1, x: 240, y: 1140 },
    { num: 2, x: 580, y: 1140 },
    { num: 3, x: 920, y: 1140 },
  ];

  tableConfigs.forEach(({ num, x, y }) => {
    const seats: Seat[] = [];
    const tableHeight = 110;

    // 4 seats on top edge
    for (let i = 0; i < 4; i++) {
      seats.push({
        id: `dining-t${num}-s${i + 1}`,
        label: `Bàn ${num} - Ghế ${i + 1}`,
        x: x + 25 + i * 55,
        y: y - 35,
        type: 'dining',
        direction: 'down',
        dimensionId: 'office',
      });
    }

    // 4 seats on bottom edge
    for (let i = 0; i < 4; i++) {
      seats.push({
        id: `dining-t${num}-s${i + 5}`,
        label: `Bàn ${num} - Ghế ${i + 5}`,
        x: x + 25 + i * 55,
        y: y + tableHeight + 10,
        type: 'dining',
        direction: 'up',
        dimensionId: 'office',
      });
    }

    tables.push({
      id: `dining-table-${num}`,
      tableNumber: num,
      x,
      y,
      seats,
    });
  });

  return tables;
})();

// Recreation Areas Setup (Office Dimension - 26 seats)
export const RECREATION_AREAS: RecreationArea[] = [
  {
    type: 'fishing',
    name: 'Khu Câu Cá Hồ Koi',
    x: 1300,
    y: 180,
    width: 520,
    height: 660,
    seats: [
      { id: 'fish-seat-1', label: 'Bến câu 1', x: 1420, y: 380, type: 'fishing', direction: 'down', dimensionId: 'office' },
      { id: 'fish-seat-2', label: 'Bến câu 2', x: 1540, y: 380, type: 'fishing', direction: 'down', dimensionId: 'office' },
      { id: 'fish-seat-3', label: 'Bến câu 3', x: 1660, y: 380, type: 'fishing', direction: 'down', dimensionId: 'office' },
      { id: 'fish-seat-4', label: 'Bến câu 4', x: 1720, y: 520, type: 'fishing', direction: 'left', dimensionId: 'office' },
    ],
  },
  {
    type: 'cinema',
    name: 'Rạp Phim Công Sở',
    x: 1910,
    y: 180,
    width: 570,
    height: 660,
    seats: [
      { id: 'cine-1', label: 'Sofa Vip 1', x: 1980, y: 480, type: 'cinema', direction: 'up', dimensionId: 'office' },
      { id: 'cine-2', label: 'Sofa Vip 2', x: 2080, y: 480, type: 'cinema', direction: 'up', dimensionId: 'office' },
      { id: 'cine-3', label: 'Sofa Vip 3', x: 2180, y: 480, type: 'cinema', direction: 'up', dimensionId: 'office' },
      { id: 'cine-4', label: 'Sofa Vip 4', x: 2280, y: 480, type: 'cinema', direction: 'up', dimensionId: 'office' },
      { id: 'cine-5', label: 'Sofa Vip 5', x: 1980, y: 580, type: 'cinema', direction: 'up', dimensionId: 'office' },
      { id: 'cine-6', label: 'Sofa Vip 6', x: 2080, y: 580, type: 'cinema', direction: 'up', dimensionId: 'office' },
      { id: 'cine-7', label: 'Sofa Vip 7', x: 2180, y: 580, type: 'cinema', direction: 'up', dimensionId: 'office' },
      { id: 'cine-8', label: 'Sofa Vip 8', x: 2280, y: 580, type: 'cinema', direction: 'up', dimensionId: 'office' },
    ],
  },
  {
    type: 'cards',
    name: 'Sòng Bài Poker & Tiến Lên',
    x: 1300,
    y: 950,
    width: 520,
    height: 680,
    seats: [
      { id: 'card-1', label: 'Bàn Poker A - Ghế Bắc', x: 1470, y: 1100, type: 'card', direction: 'down', dimensionId: 'office' },
      { id: 'card-2', label: 'Bàn Poker A - Ghế Nam', x: 1470, y: 1240, type: 'card', direction: 'up', dimensionId: 'office' },
      { id: 'card-3', label: 'Bàn Poker A - Ghế Tây', x: 1390, y: 1170, type: 'card', direction: 'right', dimensionId: 'office' },
      { id: 'card-4', label: 'Bàn Poker A - Ghế Đông', x: 1550, y: 1170, type: 'card', direction: 'left', dimensionId: 'office' },
      { id: 'card-5', label: 'Bàn Poker B - Ghế Bắc', x: 1680, y: 1370, type: 'card', direction: 'down', dimensionId: 'office' },
      { id: 'card-6', label: 'Bàn Poker B - Ghế Nam', x: 1680, y: 1510, type: 'card', direction: 'up', dimensionId: 'office' },
      { id: 'card-7', label: 'Bàn Poker B - Ghế Tây', x: 1600, y: 1440, type: 'card', direction: 'right', dimensionId: 'office' },
      { id: 'card-8', label: 'Bàn Poker B - Ghế Đông', x: 1760, y: 1440, type: 'card', direction: 'left', dimensionId: 'office' },
    ],
  },
  {
    type: 'gaming',
    name: 'Phòng Game Arcade & PS5',
    x: 1910,
    y: 950,
    width: 570,
    height: 680,
    seats: [
      { id: 'game-1', label: 'Máy Thùng Street Fighter', x: 1990, y: 1140, type: 'gaming', direction: 'up', dimensionId: 'office' },
      { id: 'game-2', label: 'Máy Thùng Pac-Man', x: 2090, y: 1140, type: 'gaming', direction: 'up', dimensionId: 'office' },
      { id: 'game-3', label: 'Máy Đua Xe F1', x: 2210, y: 1140, type: 'gaming', direction: 'up', dimensionId: 'office' },
      { id: 'game-4', label: 'Sofa PS5 Trái', x: 2060, y: 1420, type: 'gaming', direction: 'up', dimensionId: 'office' },
      { id: 'game-5', label: 'Sofa PS5 Phải', x: 2180, y: 1420, type: 'gaming', direction: 'up', dimensionId: 'office' },
      { id: 'game-6', label: 'Ghế Lười VR', x: 2320, y: 1420, type: 'gaming', direction: 'up', dimensionId: 'office' },
    ],
  },
];

// DIMENSION 2: SKY LOUNGE SEATS (14 SEATS)
export const SKY_LOUNGE_SEATS: Seat[] = [
  // Cocktail Bar Stools (4 seats)
  { id: 'sky-bar-1', label: 'Ghế Bar Cocktail 1', x: 520, y: 440, type: 'bar', direction: 'down', dimensionId: 'sky_lounge' },
  { id: 'sky-bar-2', label: 'Ghế Bar Cocktail 2', x: 620, y: 440, type: 'bar', direction: 'down', dimensionId: 'sky_lounge' },
  { id: 'sky-bar-3', label: 'Ghế Bar Cocktail 3', x: 720, y: 440, type: 'bar', direction: 'down', dimensionId: 'sky_lounge' },
  { id: 'sky-bar-4', label: 'Ghế Bar Cocktail 4', x: 820, y: 440, type: 'bar', direction: 'down', dimensionId: 'sky_lounge' },

  // Infinity Pool Sun Loungers (4 seats)
  { id: 'sky-pool-1', label: 'Giường Tắm Nắng Bể Bơi 1', x: 1700, y: 420, type: 'pool', direction: 'down', dimensionId: 'sky_lounge' },
  { id: 'sky-pool-2', label: 'Giường Tắm Nắng Bể Bơi 2', x: 1850, y: 420, type: 'pool', direction: 'down', dimensionId: 'sky_lounge' },
  { id: 'sky-pool-3', label: 'Giường Tắm Nắng Bể Bơi 3', x: 2000, y: 420, type: 'pool', direction: 'down', dimensionId: 'sky_lounge' },
  { id: 'sky-pool-4', label: 'Giường Tắm Nắng Bể Bơi 4', x: 2150, y: 420, type: 'pool', direction: 'down', dimensionId: 'sky_lounge' },

  // Stargazing Telescope Stations (2 seats)
  { id: 'sky-tele-1', label: 'Đài Kính Viễn Vọng Bắc', x: 1200, y: 220, type: 'telescope', direction: 'up', dimensionId: 'sky_lounge' },
  { id: 'sky-tele-2', label: 'Đài Kính Viễn Vọng Nam', x: 1200, y: 1540, type: 'telescope', direction: 'down', dimensionId: 'sky_lounge' },

  // Sunset Acoustic Lounge Sofas (4 seats)
  { id: 'sky-music-1', label: 'Sofa Acoustic Trái 1', x: 650, y: 1240, type: 'music', direction: 'up', dimensionId: 'sky_lounge' },
  { id: 'sky-music-2', label: 'Sofa Acoustic Trái 2', x: 780, y: 1240, type: 'music', direction: 'up', dimensionId: 'sky_lounge' },
  { id: 'sky-music-3', label: 'Sofa Acoustic Phải 1', x: 1820, y: 1240, type: 'music', direction: 'up', dimensionId: 'sky_lounge' },
  { id: 'sky-music-4', label: 'Sofa Acoustic Phải 2', x: 1950, y: 1240, type: 'music', direction: 'up', dimensionId: 'sky_lounge' },
];

// DIMENSION 3: QUANTUM MATRIX SEATS (12 SEATS)
export const QUANTUM_MATRIX_SEATS: Seat[] = [
  // AI Core Quantum Pods (4 seats around central reactor)
  { id: 'quantum-core-1', label: 'Buồng Điều Khiển AI Bắc', x: 1200, y: 680, type: 'quantum', direction: 'down', dimensionId: 'quantum_matrix' },
  { id: 'quantum-core-2', label: 'Buồng Điều Khiển AI Nam', x: 1200, y: 1040, type: 'quantum', direction: 'up', dimensionId: 'quantum_matrix' },
  { id: 'quantum-core-3', label: 'Buồng Điều Khiển AI Tây', x: 1020, y: 860, type: 'quantum', direction: 'right', dimensionId: 'quantum_matrix' },
  { id: 'quantum-core-4', label: 'Buồng Điều Khiển AI Đông', x: 1380, y: 860, type: 'quantum', direction: 'left', dimensionId: 'quantum_matrix' },

  // Zero-G Floating Workstations (4 seats)
  { id: 'quantum-zerog-1', label: 'Khoang Không Trọng Lực 1', x: 480, y: 550, type: 'quantum', direction: 'down', dimensionId: 'quantum_matrix' },
  { id: 'quantum-zerog-2', label: 'Khoang Không Trọng Lực 2', x: 640, y: 550, type: 'quantum', direction: 'down', dimensionId: 'quantum_matrix' },
  { id: 'quantum-zerog-3', label: 'Khoang Không Trọng Lực 3', x: 480, y: 1150, type: 'quantum', direction: 'up', dimensionId: 'quantum_matrix' },
  { id: 'quantum-zerog-4', label: 'Khoang Không Trọng Lực 4', x: 640, y: 1150, type: 'quantum', direction: 'up', dimensionId: 'quantum_matrix' },

  // Cyber Hackathon Battle Terminals (4 seats)
  { id: 'quantum-hack-1', label: 'Đấu Trường Hackathon Terminal A', x: 1880, y: 650, type: 'hack', direction: 'down', dimensionId: 'quantum_matrix' },
  { id: 'quantum-hack-2', label: 'Đấu Trường Hackathon Terminal B', x: 2060, y: 650, type: 'hack', direction: 'down', dimensionId: 'quantum_matrix' },
  { id: 'quantum-hack-3', label: 'Đấu Trường Hackathon Terminal C', x: 1880, y: 1150, type: 'hack', direction: 'up', dimensionId: 'quantum_matrix' },
  { id: 'quantum-hack-4', label: 'Đấu Trường Hackathon Terminal D', x: 2060, y: 1150, type: 'hack', direction: 'up', dimensionId: 'quantum_matrix' },
];

// DIMENSION 4: ZEN ISLAND SEATS (12 SEATS)
export const ZEN_ISLAND_SEATS: Seat[] = [
  // Moonlight Tea Pavilion (4 tatami cushions)
  { id: 'zen-tea-1', label: 'Đệm Trà Đạo Tatami Bắc', x: 600, y: 600, type: 'tea', direction: 'down', dimensionId: 'zen_island' },
  { id: 'zen-tea-2', label: 'Đệm Trà Đạo Tatami Nam', x: 600, y: 760, type: 'tea', direction: 'up', dimensionId: 'zen_island' },
  { id: 'zen-tea-3', label: 'Đệm Trà Đạo Tatami Tây', x: 520, y: 680, type: 'tea', direction: 'right', dimensionId: 'zen_island' },
  { id: 'zen-tea-4', label: 'Đệm Trà Đạo Tatami Đông', x: 680, y: 680, type: 'tea', direction: 'left', dimensionId: 'zen_island' },

  // Zen Rock Garden Meditation (4 meditation mats)
  { id: 'zen-med-1', label: 'Tọa Cụ Thiền Đá Tĩnh Tâm 1', x: 1200, y: 720, type: 'zen', direction: 'down', dimensionId: 'zen_island' },
  { id: 'zen-med-2', label: 'Tọa Cụ Thiền Đá Tĩnh Tâm 2', x: 1340, y: 720, type: 'zen', direction: 'down', dimensionId: 'zen_island' },
  { id: 'zen-med-3', label: 'Tọa Cụ Thiền Đá Tĩnh Tâm 3', x: 1200, y: 920, type: 'zen', direction: 'up', dimensionId: 'zen_island' },
  { id: 'zen-med-4', label: 'Tọa Cụ Thiền Đá Tĩnh Tâm 4', x: 1340, y: 920, type: 'zen', direction: 'up', dimensionId: 'zen_island' },

  // Onsen Natural Hot Springs (4 benches)
  { id: 'zen-onsen-1', label: 'Ghế Ngâm Suối Onsen 1', x: 1900, y: 650, type: 'onsen', direction: 'down', dimensionId: 'zen_island' },
  { id: 'zen-onsen-2', label: 'Ghế Ngâm Suối Onsen 2', x: 2050, y: 650, type: 'onsen', direction: 'down', dimensionId: 'zen_island' },
  { id: 'zen-onsen-3', label: 'Ghế Ngâm Suối Onsen 3', x: 1900, y: 1100, type: 'onsen', direction: 'up', dimensionId: 'zen_island' },
  { id: 'zen-onsen-4', label: 'Ghế Ngâm Suối Onsen 4', x: 2050, y: 1100, type: 'onsen', direction: 'up', dimensionId: 'zen_island' },
];
