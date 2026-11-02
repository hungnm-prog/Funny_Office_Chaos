export type CharacterStatus = 'online' | 'offline' | 'busy';
export type Gender = 'male' | 'female';

export interface CharacterAppearance {
  gender: Gender;
  hairColor: string;
  hairStyle: string;
  skinColor: string;
  outfitColor: string;
  outfitStyle: 'suit' | 'hoodie' | 'shirt' | 'casual' | 'dress';
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
  currentAction?: 'idle' | 'working' | 'eating' | 'fishing' | 'gaming' | 'watching' | 'cards';
  lastMessage: string;
  lastMessageTime: string;
  isUser: boolean;
}

export interface Seat {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'desk' | 'dining' | 'cinema' | 'card' | 'gaming' | 'fishing';
  occupiedBy?: string;
  direction: 'up' | 'down' | 'left' | 'right';
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
}

export interface ToastItem {
  id: string;
  message: ChatMessage;
  isExpanded: boolean;
  isLong: boolean;
  createdAt: number;
  autoHideTimer?: number;
}
