export const WEAPON_TYPES = [
  'Простое рукопашное',
  'Простое дальнобойное',
  'Воинское рукопашное',
  'Воинское дальнобойное',
] as const;

export const ARMOR_TYPES = [
  'Легкие доспехи',
  'Средние доспехи',
  'Тяжелые доспехи',
  'Щиты',
] as const;

export const FeatType = {
  COMBAT: 'combat',
  EPIC: 'epic',
  ORIGIN: 'origin',
  DRAGONMARK: 'dragonmark',
  GENERAL: 'general',
} as const;

export const featTypeLabels: Record<string, string> = {
  all: 'Все',
  combat: 'Боевые',
  epic: 'Эпические',
  origin: 'Происхождение',
  dragonmark: 'Метка дракона',
  general: 'Общие',
};
