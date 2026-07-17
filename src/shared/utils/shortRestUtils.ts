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

export interface ClassEntry {
  className: string;
  subclass: string;
  level: number;
}

const SLOT_LABELS: Record<string, string> = {
  level1: 'Уровень 1',
  level2: 'Уровень 2',
  level3: 'Уровень 3',
  level4: 'Уровень 4',
  level5: 'Уровень 5',
};

function buildAvailableSlots(
  spellSlots: Record<string, { max: number; used: number }>
): SpellSlotAvailable[] {
  return ['level1', 'level2', 'level3', 'level4', 'level5']
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
}

export function getShortRestContext(
  classes: ClassEntry[],
  characterLevel: number,
  spellSlots: Record<string, { max: number; used: number }>,
  arcaneRecoveryUsed: boolean,
  naturalRecoveryUsed: boolean
): ShortRestContext {
  const availableSlots = buildAvailableSlots(spellSlots);

  const warlock = classes.find((c) => c.className === 'Колдун');
  if (warlock) {
    const recoveryLimit = Math.ceil(warlock.level / 2);
    return { type: 'warlock-auto', recoveryLimit, availableSlots };
  }

  const wizard = classes.find((c) => c.className === 'Волшебник');
  if (wizard) {
    const recoveryLimit = Math.ceil(wizard.level / 2);
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

  const druid = classes.find((c) => c.className === 'Друид');
  if (druid) {
    const recoveryLimit = Math.ceil(druid.level / 2);
    if (druid.subclass !== 'Круг земли') {
      return {
        type: 'druid-no-subclass',
        recoveryLimit,
        availableSlots,
        message:
          'Восстановление ячеек заклинаний на коротком отдыхе доступно только друидам Круга земли.',
      };
    }
    if (druid.level < 6) {
      return {
        type: 'druid-level-locked',
        recoveryLimit,
        availableSlots,
        message: `Естественное восстановление откроется на 6-м уровне друида. Сейчас у вас ${druid.level}-й уровень в этом классе.`,
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

  // Ни один класс не даёт восстановления ячеек на коротком отдыхе
  const recoveryLimit = Math.ceil(characterLevel / 2);
  return {
    type: 'none',
    recoveryLimit,
    availableSlots,
    message:
      'Ваш персонаж не обладает способностями для восстановления ячеек заклинаний на коротком отдыхе.',
  };
}