export type CreatureSide = 'allies' | 'enemies';

export type Character = {
  id: number;
  side: CreatureSide;
  name: string;
  img?: string;
  logo?: string;
};

export type User = {
  id: number;
  name: string;
  className?: string;
  img?: string;
  logo?: string;
  initiative?: number;
  hp?: number;
  size: string; // оставляем как было
};

export type Enemies = {
  id: number;
  name: string;
  img?: string;
  logo?: string;
  initiative?: number;
  isDead?: boolean;
  size: string;
};

// Инстанс окружения НА ПОЛЕ
export type Environment = {
  id: number; // уникальный id инстанса
  presetId: number; // 201..206
  img?: string;

  sizeCells: number; // 1 клетка = 5 футов
  cellX: number;
  cellY: number;
  rotation:
    | 0
    | 15
    | 30
    | 45
    | 60
    | 75
    | 90
    | 105
    | 120
    | 135
    | 150
    | 165
    | 180
    | 195
    | 210
    | 225
    | 240
    | 255
    | 270
    | 285
    | 300
    | 315
    | 330
    | 345
    | 360;
};

export interface BattleFormData {
  users: User[];
  enemies: Enemies[];
  environment: Environment[];
  mapId: number;
  gridWidth?: number;
  gridHeight?: number;
  customMapImage?: string;
}

export type HoveredToken = {
  type: 'user' | 'enemy' | 'environment';
  id: string | number | null;
} | null;

export const maps = [
  { title: 'Подземелье', id: 1, img: '/img/masters/Battlefield/Map/Dungeon.jpg' },
  { title: 'Городская площадь', id: 2, img: '/img/masters/Battlefield/Map/CitySquare.jpg' },
  { title: 'Болото', id: 3, img: '/img/masters/Battlefield/Map/Swamp.jpg' },
  { title: 'Лес', id: 4, img: '/img/masters/Battlefield/Map/Forest.jpg' },
  { title: 'Таверна', id: 5, img: '/img/masters/Battlefield/Map/Tavern.jpg' },
] as const;

export type MapType = {
  title: string;
  id: number;
  img: string;
};
