export type CreatureSide = 'allies' | 'enemies';

export type Character = {
  id: number;
  side: CreatureSide;
  name: string;
  img?: string;
  logo?: string;
  hp?: number | string;
  maxHp?: number;
};

export type User = {
  id: number;
  name: string;
  className?: string;
  img?: string;
  logo?: string;
  initiative?: number;
  hp?: number;
  maxHp?: number;
  size: string;
  cellX?: number;
  cellY?: number;
};

export type Enemies = {
  id: number;
  name: string;
  img?: string;
  logo?: string;
  className?: string;
  initiative?: number;
  isDead?: boolean;
  size: string;
  cellX?: number;
  cellY?: number;
};

export type Environment = {
  id: number;
  presetId: number;
  label?: string;
  img?: string;
  shape: 'cone' | 'line' | 'sphere' | 'hemisphere' | 'cube';
  color: string;
  sizeCells: number;
  sizeY?: number;
  cellX: number;
  cellY: number;
  rotation: number;
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
