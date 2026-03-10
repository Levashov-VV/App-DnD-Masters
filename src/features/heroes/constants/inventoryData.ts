export const EQUIPMENT_TYPES = [
  'Оружие ближнего боя',
  'Оружие дальнего боя',
  'Щит',
  'Лёгкий доспех',
  'Средний доспех',
  'Тяжёлый доспех',
  'Аксессуар',
  'Другое',
] as const;

/**
 * Слоты экипировки с ограничениями
 */
export const EQUIPMENT_SLOTS = {
  mainHand: { label: 'Основная рука', max: 1 },
  offHand: { label: 'Дополнительная рука', max: 1 },
  ranged: { label: 'Дальнобойное оружие', max: 1 },
  armor: { label: 'Доспех', max: 1 },
  shield: { label: 'Щит', max: 1 },
  rings: { label: 'Кольца', max: 10 },
  amulet: { label: 'Амулет', max: 1 },
  headgear: { label: 'Головной убор', max: 1 },
  gloves: { label: 'Перчатки', max: 1 },
  boots: { label: 'Обувь', max: 1 },
  cloak: { label: 'Плащ', max: 1 },
} as const;

/**
 * Конвертация валют (в медных монетах)
 */
export const COIN_CONVERSION = {
  ПМ: 1000, // Платиновая = 1000 медных
  ЗМ: 100, // Золотая = 100 медных
  ЭМ: 50, // Электрум = 50 медных
  СМ: 10, // Серебряная = 10 медных
  ММ: 1, // Медная = 1
} as const;

export const COIN_TYPES = ['ММ', 'СМ', 'ЗМ', 'ЭМ', 'ПМ'] as const;

export type CoinType = (typeof COIN_TYPES)[number];
export type EquipmentType = (typeof EQUIPMENT_TYPES)[number];
export type EquipmentSlot = keyof typeof EQUIPMENT_SLOTS;
