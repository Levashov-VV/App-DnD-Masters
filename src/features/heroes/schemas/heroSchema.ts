// features/heroes/schemas/heroSchema.ts
import { z } from 'zod';

// Схема для боевых способностей
export const combatAbilitySchema = z.object({
  type: z.enum(['spell', 'equipment']),
  name: z.string(),
  bonus: z.number().optional(),
  damage: z.string().optional(),
  description: z.string().optional(),
  level: z.number().optional(),
  school: z.string().optional(),
  castingTime: z.string().optional(),
  range: z.string().optional(),
  components: z.string().optional(),
  duration: z.string().optional(),
});

// Схема для черт
export const featSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  source: z.string().optional(),
  prerequisite: z.string().optional(),
});

// Схема для члена команды
export const teamMemberSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Имя обязательно'),
  race: z.string().min(1, 'Выберите расу'),
  class: z.string().min(1, 'Выберите класс'),
  subclass: z.string().optional().default(''),
  level: z.number().min(1, 'Минимум 1').max(20, 'Максимум 20'),
  customAvatar: z.string().optional().default(''),
  notes: z.string().optional().default(''),
});

// Схема предмета снаряжения
export const equipmentItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().optional().default(''),
  weight: z.number().optional(),
  quantity: z.number().optional().default(1),
  // Новое поле для слотов экипировки
  slot: z.enum(['armor', 'mainHand', 'offHand', 'ranged']).optional(),
  // Дополнительные поля для оружия и брони
  type: z.string().optional().default(''),
  attackDice: z.string().optional().default(''),
  armorBonus: z.number().optional().default(0),
  otherBonuses: z.string().optional().default(''),
  isTwoHanded: z.boolean().optional().default(false),
});

// Схема расходника
export const consumableSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().optional().default(''),
  quantity: z.number().min(0).default(1),
});

// Схема валюты
export const currencySchema = z.object({
  copper: z.number().min(0).default(0),    // ММ
  silver: z.number().min(0).default(0),    // СМ
  gold: z.number().min(0).default(0),      // ЗМ
  electrum: z.number().min(0).default(0),  // ЭМ
  platinum: z.number().min(0).default(0),  // ПМ
});

// Схема магических предметов
export const magicItemsSchema = z.object({
  maxSlots: z.number().min(0).default(3),
  items: z.array(z.string()).default([]),
});

// Схема инвентаря
export const inventorySchema = z.object({
  equipped: z.array(equipmentItemSchema).default([]),
  inventory: z.array(equipmentItemSchema).default([]),
  consumables: z.array(consumableSchema).default([]),
  treasures: z.string().default(''),
  magicItems: magicItemsSchema.default({ maxSlots: 3, items: [] }),
  currency: currencySchema.default({ 
    copper: 0, 
    silver: 0, 
    gold: 0, 
    electrum: 0, 
    platinum: 0 
  }),
  carryCapacity: z.object({
    current: z.number().min(0).default(0),
    max: z.number().min(0).default(0),
  }).default({ current: 0, max: 0 }),
});

export const heroSchema = z.object({
  // Основная информация
  name: z.string().min(1, 'Имя обязательно').max(50, 'Слишком длинное имя'),
  race: z.string().min(1, 'Выберите расу'),
  class: z.string().min(1, 'Выберите класс'),
  subclass: z.string().optional().default(''),
  level: z.number().min(1, 'Минимальный уровень 1').max(20, 'Максимальный уровень 20'),
  experience: z.number().min(0, 'Опыт не может быть отрицательным').optional().default(0),
  background: z.string().min(1, 'Выберите предысторию'),
  alignment: z.string().min(1, 'Выберите мировоззрение'),
  customAvatar: z.string().optional(),

  // Характеристики
  abilityScores: z.object({
    strength: z.number().min(1, 'Мин. 1').max(30, 'Макс. 30'),
    dexterity: z.number().min(1, 'Мин. 1').max(30, 'Макс. 30'),
    constitution: z.number().min(1, 'Мин. 1').max(30, 'Макс. 30'),
    intelligence: z.number().min(1, 'Мін. 1').max(30, 'Макс. 30'),
    wisdom: z.number().min(1, 'Мин. 1').max(30, 'Макс. 30'),
    charisma: z.number().min(1, 'Мин. 1').max(30, 'Макс. 30'),
  }),

  // Хиты
  hitPoints: z.object({
    current: z.number().min(0, 'Минимум 0'),
    max: z.number().min(1, 'Минимум 1'),
    temporary: z.number().optional().default(0),
  }),

  // Кости хитов
  hitDice: z.object({
    total: z.number().min(0, 'Минимум 0'),
    spent: z.number().min(0, 'Минимум 0'),
    type: z.string(),
  }),

  // Спасброски от смерти
  deathSaves: z.object({
    successes: z.number().min(0).max(3),
    failures: z.number().min(0).max(3),
  }),

  // Боевые характеристики
  armorClass: z.number()
    .min(0, 'КД не может быть меньше 0')
    .max(30, 'КД не может быть больше 30'),
  initiative: z.number(),
  speed: z.number().min(0, 'Скорость не может быть отрицательной'),
  proficiencyBonus: z.number().min(2, 'Минимум 2').max(6, 'Максимум 6'),
  inspiration: z.boolean().optional().default(false),

  // Навыки и языки
  skills: z.array(z.string()).default([]),
  savingThrows: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),

  // Владение
  weaponProficiencies: z.array(z.string()).optional().default([]),
  armorProficiencies: z.array(z.string()).optional().default([]),
  toolProficiencies: z.array(z.string()).optional().default([]),

  // Умения
  classFeatures: z.string().optional().default(''),
  raceFeatures: z.string().optional().default(''),

  // Боевые способности (заклинания + снаряжение)
  combatAbilities: z.array(combatAbilitySchema).optional().default([]),

  // Черты персонажа
  feats: z.array(featSchema).optional().default([]),

  // Истощение
  exhaustionLevel: z.number().min(0).max(6).default(0),

  // Снаряжение
  equipment: z.object({
    weapons: z.array(z.object({
      name: z.string(),
      damage: z.string(),
    })).default([]),
    armor: z.string().default(''),
    items: z.array(z.object({
      name: z.string()
    })).default([]),
  }),

  // Полноценный инвентарь
  inventory: inventorySchema.default({
    equipped: [],
    inventory: [],
    consumables: [],
    treasures: '',
    magicItems: { maxSlots: 3, items: [] },
    currency: { copper: 0, silver: 0, gold: 0, electrum: 0, platinum: 0 },
    carryCapacity: { current: 0, max: 0 },
  }),

  // Личность
  personality: z.object({
    traits: z.string().default(''),
    ideals: z.string().default(''),
    bonds: z.string().default(''),
    flaws: z.string().default(''),
  }),

  // История и внешность
  backstory: z.string().optional().default(''),
  appearance: z.string().optional().default(''),
  additionalFeatures: z.string().optional().default(''),
  campaignGoals: z.string().optional().default(''),

  // Члены команды
  teamMembers: z.array(teamMemberSchema).optional().default([]),

  // Аватар
  avatar: z.string().optional().default(''),
});

// ЭКСПОРТ ТИПОВ
export type HeroFormData = z.infer<typeof heroSchema>;
export type CombatAbility = z.infer<typeof combatAbilitySchema>;
export type Feat = z.infer<typeof featSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type EquipmentItem = z.infer<typeof equipmentItemSchema>;
export type Consumable = z.infer<typeof consumableSchema>;
export type Currency = z.infer<typeof currencySchema>;
export type MagicItems = z.infer<typeof magicItemsSchema>;
export type Inventory = z.infer<typeof inventorySchema>;

// Экспорт типа для слотов снаряжения
export type EquipmentSlot = 'armor' | 'mainHand' | 'offHand' | 'ranged';
