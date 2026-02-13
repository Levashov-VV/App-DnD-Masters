import type { Hero } from './hero';

export interface AppStorage {
  'dnd-heroes': Hero[];
  [key: string]: unknown;
}

