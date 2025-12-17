export type CreatureSide = 'allies' | 'enemies';

export type Character = {
  id: number;
  side: CreatureSide;
  name: string;
  img: string;
  logo: string;
};

export type User = {
  id: number;
  name: string;
  className: string;
  img: string;
  logo: string;
  initiative: number;
  hp: number;
  size: string;
};

export type Enemies = {
  id: number;
  name: string;
  img: string;
  logo: string;
  initiative: number;
  size: string;
};

export interface BattleFormData {
  users: User[];
  enemies: Enemies[];
  mapId: number;
  gridSize: number;
  gridWidth?: number;
  gridHeight?: number;
  customMapImage?: string;
}

export const maps = [
  { title: 'Подземелье', id: 1, img: '/img/masters/Battlefield/Map/Dungeon.jpg' },
  { title: 'Городская площадь', id: 2, img: '/img/masters/Battlefield/Map/CitySquare.jpg' },
  { title: 'Болото', id: 3, img: '/img/masters/Battlefield/Map/Swamp.jpg' },
  { title: 'Лес', id: 4, img: '/img/masters/Battlefield/Map/Forest.jpg' },
  { title: 'Таверна', id: 5, img: '/img/masters/Battlefield/Map/Tavern.jpg' },
] as const;

interface MapType {
  title: string;
  id: number;
  img: string;
}

export type { MapType };
