import type { WorkDesk, DiningTable, RecreationArea, Seat } from '../types/game';

export const MAP_WIDTH = 2600;
export const MAP_HEIGHT = 1750;

// Zone Boundaries for Minimap and Navigation
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
  
  // 4 rows of 5 desks = 20 desks
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

// Recreation Areas Setup
export const RECREATION_AREAS: RecreationArea[] = [
  {
    type: 'fishing',
    name: 'Khu Câu Cá Hồ Koi',
    x: 1300,
    y: 180,
    width: 520,
    height: 660,
    seats: [
      { id: 'fish-seat-1', label: 'Bến câu 1', x: 1420, y: 380, type: 'fishing', direction: 'down' },
      { id: 'fish-seat-2', label: 'Bến câu 2', x: 1540, y: 380, type: 'fishing', direction: 'down' },
      { id: 'fish-seat-3', label: 'Bến câu 3', x: 1660, y: 380, type: 'fishing', direction: 'down' },
      { id: 'fish-seat-4', label: 'Bến câu 4', x: 1720, y: 520, type: 'fishing', direction: 'left' },
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
      // Row 1 (4 seats)
      { id: 'cine-1', label: 'Sofa Vip 1', x: 1980, y: 480, type: 'cinema', direction: 'up' },
      { id: 'cine-2', label: 'Sofa Vip 2', x: 2080, y: 480, type: 'cinema', direction: 'up' },
      { id: 'cine-3', label: 'Sofa Vip 3', x: 2180, y: 480, type: 'cinema', direction: 'up' },
      { id: 'cine-4', label: 'Sofa Vip 4', x: 2280, y: 480, type: 'cinema', direction: 'up' },
      // Row 2 (4 seats)
      { id: 'cine-5', label: 'Sofa Vip 5', x: 1980, y: 580, type: 'cinema', direction: 'up' },
      { id: 'cine-6', label: 'Sofa Vip 6', x: 2080, y: 580, type: 'cinema', direction: 'up' },
      { id: 'cine-7', label: 'Sofa Vip 7', x: 2180, y: 580, type: 'cinema', direction: 'up' },
      { id: 'cine-8', label: 'Sofa Vip 8', x: 2280, y: 580, type: 'cinema', direction: 'up' },
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
      // Table 1 (4 seats)
      { id: 'card-1', label: 'Bàn Poker A - Ghế Bắc', x: 1470, y: 1100, type: 'card', direction: 'down' },
      { id: 'card-2', label: 'Bàn Poker A - Ghế Nam', x: 1470, y: 1240, type: 'card', direction: 'up' },
      { id: 'card-3', label: 'Bàn Poker A - Ghế Tây', x: 1390, y: 1170, type: 'card', direction: 'right' },
      { id: 'card-4', label: 'Bàn Poker A - Ghế Đông', x: 1550, y: 1170, type: 'card', direction: 'left' },
      // Table 2 (4 seats)
      { id: 'card-5', label: 'Bàn Poker B - Ghế Bắc', x: 1680, y: 1370, type: 'card', direction: 'down' },
      { id: 'card-6', label: 'Bàn Poker B - Ghế Nam', x: 1680, y: 1510, type: 'card', direction: 'up' },
      { id: 'card-7', label: 'Bàn Poker B - Ghế Tây', x: 1600, y: 1440, type: 'card', direction: 'right' },
      { id: 'card-8', label: 'Bàn Poker B - Ghế Đông', x: 1760, y: 1440, type: 'card', direction: 'left' },
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
      { id: 'game-1', label: 'Máy Thùng Street Fighter', x: 1990, y: 1140, type: 'gaming', direction: 'up' },
      { id: 'game-2', label: 'Máy Thùng Pac-Man', x: 2090, y: 1140, type: 'gaming', direction: 'up' },
      { id: 'game-3', label: 'Máy Đua Xe F1', x: 2210, y: 1140, type: 'gaming', direction: 'up' },
      { id: 'game-4', label: 'Sofa PS5 Trái', x: 2060, y: 1420, type: 'gaming', direction: 'up' },
      { id: 'game-5', label: 'Sofa PS5 Phải', x: 2180, y: 1420, type: 'gaming', direction: 'up' },
      { id: 'game-6', label: 'Ghế Lười VR', x: 2320, y: 1420, type: 'gaming', direction: 'up' },
    ],
  },
];
