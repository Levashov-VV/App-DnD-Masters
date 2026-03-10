import { useMemo } from 'react';
import spellsData from '../../../features/heroes/constants/spells.json';
import type { HeroSpell } from '../../../features/heroes/schemas/heroSchema';

export interface SpellEntry {
  id: string;
  name: string;
  nameEn: string;
  level: number;
  school: string;
  castingTime: string;
  isRitual: boolean;
  isConcentration: boolean;
  range: string;
  components: {
    verbal: boolean;
    somatic: boolean;
    material: boolean;
    materialDescription: string;
  };
  duration: string;
  classes: string[];
  subclasses: string[];
  description: string;
  atHigherLevels: string;
  damage?: {
    dice: string;
    type: string;
    saveType?: string;
    attackType?: string;
  };
  isDamageSpell: boolean;
  tags: string[];
  source: string;
}

const CLASS_MAP: Record<string, string> = {
  Волшебник: 'wizard',
  Жрец: 'cleric',
  Друид: 'druid',
  Бард: 'bard',
  Паладин: 'paladin',
  Следопыт: 'ranger',
  Колдун: 'warlock',
  Чародей: 'sorcerer',
  Изобретатель: 'artificer',
  Варвар: 'barbarian',
  Монах: 'monk',
  Воин: 'fighter',
  Плут: 'rogue',
};

export function spellEntryToHeroSpell(spell: SpellEntry): HeroSpell {
  return {
    id: spell.id,
    name: spell.name,
    nameEn: spell.nameEn,
    level: spell.level,
    school: spell.school,
    castingTime: spell.castingTime,
    range: spell.range,
    isConcentration: spell.isConcentration,
    isRitual: spell.isRitual,
    isDamageSpell: spell.isDamageSpell,
    damage: spell.damage ? { dice: spell.damage.dice, type: spell.damage.type } : undefined,
    source: spell.source,
  };
}

function getAllSpells(): SpellEntry[] {
  const data = spellsData as Record<string, SpellEntry[]>;
  return Object.values(data).flat();
}

interface UseSpellLibraryOptions {
  characterClass?: string;
  showAll?: boolean;
  searchQuery?: string;
  filterLevel?: number | null;
  filterSchool?: string | null;
  filterConcentration?: boolean | null;
  filterRitual?: boolean | null;
  filterDamageType?: string | null;
}

export function useSpellLibrary(options: UseSpellLibraryOptions = {}) {
  const {
    characterClass = '',
    showAll = false,
    searchQuery = '',
    filterLevel = null,
    filterSchool = null,
    filterConcentration = null,
    filterRitual = null,
    filterDamageType = null,
  } = options;

  const allSpells = useMemo(() => getAllSpells(), []);

  const filtered = useMemo(() => {
    let result = allSpells;

    if (characterClass && !showAll) {
      const classEn = CLASS_MAP[characterClass] ?? characterClass.toLowerCase();
      result = result.filter((s) => s.classes.includes(classEn));
    }

    // Поиск по названию
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) => s.name.toLowerCase().includes(q) || s.nameEn.toLowerCase().includes(q)
      );
    }

    // Фильтр по уровню
    if (filterLevel !== null) {
      result = result.filter((s) => s.level === filterLevel);
    }

    // Фильтр по школе
    if (filterSchool) {
      result = result.filter((s) => s.school === filterSchool);
    }

    // Фильтр концентрации
    if (filterConcentration !== null) {
      result = result.filter((s) => s.isConcentration === filterConcentration);
    }

    // Фильтр ритуала
    if (filterRitual !== null) {
      result = result.filter((s) => s.isRitual === filterRitual);
    }

    // Фильтр типа урона
    if (filterDamageType) {
      result = result.filter((s) => s.damage?.type === filterDamageType);
    }

    return result;
  }, [
    allSpells,
    showAll,
    characterClass,
    searchQuery,
    filterLevel,
    filterSchool,
    filterConcentration,
    filterRitual,
    filterDamageType,
  ]);

  // Сгруппировано по уровням
  const byLevel = useMemo(() => {
    const groups: Record<number, SpellEntry[]> = {};
    for (let i = 0; i <= 9; i++) groups[i] = [];
    filtered.forEach((s) => groups[s.level]?.push(s));
    return groups;
  }, [filtered]);

  // Уникальные школы для фильтра
  const availableSchools = useMemo(() => {
    return [...new Set(allSpells.map((s) => s.school))].sort();
  }, [allSpells]);

  // Уникальные типы урона для фильтра
  const availableDamageTypes = useMemo(() => {
    return [...new Set(allSpells.filter((s) => s.damage).map((s) => s.damage!.type))].sort();
  }, [allSpells]);

  return {
    spells: filtered,
    byLevel,
    total: filtered.length,
    availableSchools,
    availableDamageTypes,
  };
}
