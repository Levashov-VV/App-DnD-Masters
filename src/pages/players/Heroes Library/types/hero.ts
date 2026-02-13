// features/heroes/types/hero.ts
export interface Hero {
  id: string;
  createdAt: string;
  updatedAt: string;
  
  // Основная информация
  name: string;
  race: string;
  class: string;
  level: number;
  background: string;
  alignment: string;
  
  // Характеристики
  abilityScores: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  
  // Боевые характеристики
  hitPoints: {
    current: number;
    max: number;
    temporary?: number;
  };
  armorClass: number;
  initiative: number;
  speed: number;
  proficiencyBonus: number;
  
  // Навыки и владения
  skills: string[];
  savingThrows: string[];
  languages: string[];
  
  // Снаряжение
  equipment: {
    weapons: Array<{ name: string; damage: string; }>;
    armor: string;
    items: Array<{ name: string }>;
  };
  
  // Детали персонажа
  personality: {
    traits: string;
    ideals: string;
    bonds: string;
    flaws: string;
  };
  
  backstory?: string;
  appearance?: string;
  avatar?: string; // Пользовательский аватар
  raceLogo?: string; // Логотип расы
  raceFigure?: string; // Фигурка расы
}
