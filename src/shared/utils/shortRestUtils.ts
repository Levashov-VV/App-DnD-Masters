export type ShortRestRecoveryType =
  | 'warlock-auto'
  | 'wizard-manual'
  | 'druid-land-manual'
  | 'druid-no-subclass'
  | 'druid-level-locked'
  | 'already-used'
  | 'none';

export interface SpellSlotAvailable {
  levelKey: string;
  levelNum: number;
  label: string;
  spent: number;
  max: number;
}

export interface ShortRestContext {
  type: ShortRestRecoveryType;
  recoveryLimit: number;
  availableSlots: SpellSlotAvailable[];
  message?: string;
}

const SLOT_LABELS: Record<string, string> = {
  level1: 'Уровень 1',
  level2: 'Уровень 2',
  level3: 'Уровень 3',
  level4: 'Уровень 4',
  level5: 'Уровень 5',
};

export function getShortRestContext(
  characterClass: string,
  subclass: string,
  level: number,
  spellSlots: Record<string, { max: number; used: number }>,
  arcaneRecoveryUsed: boolean,
  naturalRecoveryUsed: boolean
): ShortRestContext {
  const recoveryLimit = Math.ceil(level / 2);

  // Потраченные ячейки только 1-5 уровня
  const availableSlots: SpellSlotAvailable[] = ['level1', 'level2', 'level3', 'level4', 'level5']
    .filter((key) => {
      const slot = spellSlots[key];
      return slot && slot.used > 0;
    })
    .map((key) => ({
      levelKey: key,
      levelNum: parseInt(key.replace('level', '')),
      label: SLOT_LABELS[key],
      spent: spellSlots[key].used,
      max: spellSlots[key].max,
    }));

  // КОЛДУН
  if (characterClass === 'Колдун') {
    return { type: 'warlock-auto', recoveryLimit, availableSlots };
  }

  // ВОЛШЕБНИК
  if (characterClass === 'Волшебник') {
    if (arcaneRecoveryUsed) {
      return {
        type: 'already-used',
        recoveryLimit,
        availableSlots,
        message:
          'Вы уже использовали Магическое восстановление. Способность восстановится после долгого отдыха.',
      };
    }
    return { type: 'wizard-manual', recoveryLimit, availableSlots };
  }

  // ДРУИД
  if (characterClass === 'Друид') {
    if (subclass !== 'Круг земли') {
      return {
        type: 'druid-no-subclass',
        recoveryLimit,
        availableSlots,
        message:
          'Восстановление ячеек заклинаний на коротком отдыхе доступно только друидам Круга земли.',
      };
    }
    if (level < 6) {
      return {
        type: 'druid-level-locked',
        recoveryLimit,
        availableSlots,
        message: `Естественное восстановление откроется на 6-м уровне. Сейчас у вас ${level}-й уровень.`,
      };
    }
    if (naturalRecoveryUsed) {
      return {
        type: 'already-used',
        recoveryLimit,
        availableSlots,
        message:
          'Вы уже использовали Естественное восстановление. Способность восстановится после долгого отдыха.',
      };
    }
    return { type: 'druid-land-manual', recoveryLimit, availableSlots };
  }

  // ВСЕ ОСТАЛЬНЫЕ
  return {
    type: 'none',
    recoveryLimit,
    availableSlots,
    message:
      'Ваш персонаж не обладает способностями для восстановления ячеек заклинаний на коротком отдыхе.',
  };
}
