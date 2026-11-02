export type CharacterStatus = 'online' | 'offline' | 'busy';
export type Gender = 'male' | 'female';
export type DimensionId = 'office' | 'sky_lounge' | 'quantum_matrix' | 'zen_island';

export interface DimensionConfig {
  id: DimensionId;
  name: string;
  tagline: string;
  icon: string;
  badge: string;
  themeColor: string;
  skyVoidClass: string;
  portalPosition: { x: number; y: number };
  defaultSpawn: { x: number; y: number };
}

export interface CharacterAppearance {
  gender: Gender;
  hairColor: string;
  hairStyle: string;
  skinColor: string;
  outfitColor: string;
  outfitStyle: string;
  eyeColor: string;
  accessory?: 'none' | 'glasses' | 'headphones' | 'cap' | 'beanie' | 'headband' | 'badge';
}

export interface Character {
  id: string;
  name: string;
  gender?: Gender;
  role: string;
  appearance: CharacterAppearance;
  status: CharacterStatus;
  position: { x: number; y: number };
  targetPosition?: { x: number; y: number };
  direction: 'left' | 'right' | 'up' | 'down';
  isMoving: boolean;
  isSitting: boolean;
  sittingSeatId?: string;
  currentAction?:
    | 'idle'
    | 'working'
    | 'eating'
    | 'fishing'
    | 'gaming'
    | 'watching'
    | 'cards'
    | 'drinking'
    | 'swimming'
    | 'stargazing'
    | 'music'
    | 'quantum'
    | 'hacking'
    | 'zen'
    | 'tea';
  lastMessage: string;
  lastMessageTime: string;
  isUser: boolean;
  dimensionId?: DimensionId;
}

export interface Seat {
  id: string;
  label: string;
  x: number;
  y: number;
  type:
    | 'desk'
    | 'dining'
    | 'cinema'
    | 'card'
    | 'gaming'
    | 'fishing'
    | 'bar'
    | 'pool'
    | 'telescope'
    | 'music'
    | 'quantum'
    | 'hack'
    | 'zen'
    | 'tea'
    | 'onsen';
  occupiedBy?: string;
  direction: 'up' | 'down' | 'left' | 'right';
  dimensionId?: DimensionId;
}

export interface WorkDesk {
  id: string;
  number: number;
  x: number;
  y: number;
  seat: Seat;
  hasLaptop: boolean;
  screenColor: string;
  monitorState: 'code' | 'chart' | 'design' | 'doc';
  plant: boolean;
  coffee: boolean;
}

export interface DiningTable {
  id: string;
  tableNumber: number;
  x: number;
  y: number;
  seats: Seat[];
}

export interface RecreationArea {
  type: 'fishing' | 'cards' | 'cinema' | 'gaming';
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  seats?: Seat[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  senderAppearance: CharacterAppearance;
  content: string;
  timestamp: string;
  mentions: string[];
  isLong: boolean;
  dimensionId?: DimensionId;
}

export interface ToastItem {
  id: string;
  message: ChatMessage;
  isExpanded: boolean;
  isLong: boolean;
  createdAt: number;
  autoHideTimer?: number;
}
