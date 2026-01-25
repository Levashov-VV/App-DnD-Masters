export type RollMode = 'single' | 'sum';
export type DiceCounts = Record<string, number>;

export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';
export type DiceSetColor = 'blue' | 'red' | 'black' | 'green' | 'purple' | 'darkBlue' | 'orange';

export const ROLL_HISTORY_KEY = 'dnd-single-roll-history' as const;

export interface RollHistoryItem {
  id: string;
  type: DiceType;
  value: number;
  timestamp: string; // ISO
}

export type StorageSchema = {
  [ROLL_HISTORY_KEY]: RollHistoryItem[];
};

// необязательная валидация (но полезно)
export const validateRollHistory = (value: unknown): RollHistoryItem[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((x): x is RollHistoryItem => {
      if (!x || typeof x !== 'object') return false;
      const r = x as RollHistoryItem;
      return (
        typeof r.id === 'string' &&
        typeof r.type === 'string' &&
        typeof r.value === 'number' &&
        typeof r.timestamp === 'string'
      );
    })
    .slice(0, 10);
};
