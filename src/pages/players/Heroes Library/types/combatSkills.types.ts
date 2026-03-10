export type CombatAbilityType = 'equipment' | 'spell';

export interface CombatAbility {
  type: 'spell' | 'equipment';
  name: string;
  bonus?: number;
  damage?: string;
  description?: string;
  level?: number;
  school?: string;
  castingTime?: string;
  range?: string;
  components?: string;
  duration?: string;
}

export interface EditingAbility {
  ability: CombatAbility;
  index: number;
}
