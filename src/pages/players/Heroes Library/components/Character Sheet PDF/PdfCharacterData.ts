import type { HeroFormData, HeroSpell } from '../../../../../features/heroes/schemas/heroSchema';

import {
  getAbilityModifier,
  formatModifier,
  getProficiencyBonus,
} from '../../../../../features/heroes/constants/dndData';
import { SKILLS_BY_ABILITY } from './Skillsbyability';
import raceData from '../../../../../../public/data/charactersPerson.json';

export interface PdfClassEntry {
  className: string;
  subclass: string;
  level: number;
}

export type AbilityKey =
  | 'strength'
  | 'dexterity'
  | 'constitution'
  | 'intelligence'
  | 'wisdom'
  | 'charisma';

export interface PdfSkillEntry {
  name: string;
  isProficient: boolean;
  modifier: number;
  modifierLabel: string;
}

export interface PdfAbilityScore {
  key: AbilityKey;
  label: string;
  score: number;
  modifier: number;
  modifierLabel: string;
  isSavingThrowProficient: boolean;
  savingThrowModifier: number;
  savingThrowModifierLabel: string;
  skills: PdfSkillEntry[];
}

export interface PdfCombatAbility {
  name: string;
  bonus?: number;
  damage?: string;
  description?: string;
}

export interface PdfFeat {
  name: string;
  description?: string;
}

export interface PdfCharacterData {
  isBlank: boolean;

  name: string;
  race: string;
  size: string;
  background: string;
  alignment: string;
  level: number;
  experience: number;
  classes: PdfClassEntry[];
  proficiencyBonus: number;

  avatarSrc: string | null;
  raceFigureSrc: string | null;

  abilityScores: PdfAbilityScore[];
  passivePerception: number;
  armorClass: number;
  initiative: number;
  speed: number;
  inspiration: boolean;
  exhaustionLevel: number;

  hitPoints: { current: number; max: number; temporary: number };
  hitDice: { total: number; spent: number; type: string };
  deathSaves: { successes: number; failures: number };

  skills: string[];
  savingThrows: string[];
  languages: string[];
  weaponProficiencies: string[];
  armorProficiencies: string[];
  toolProficiencies: string[];

  combatAbilities: PdfCombatAbility[];
  classFeatures: string;
  raceFeatures: string;
  feats: PdfFeat[];
  backstory: string;
  appearance: string;
  additionalFeatures: string;
  campaignGoals: string;
  teamMembers: PdfTeamMember[];
  equippedItems: PdfEquipmentItem[];
  backpackItems: PdfEquipmentItem[];
  consumables: PdfConsumable[];
  treasures: string;
  magicItems: { maxSlots: number; items: string[] };
  currency: PdfCurrency;
  carryCapacity: { current: number; max: number };
  spellcastingAbilityLabel: string;
  spellcastingModifierLabel: string;
  spellSaveDC: number;
  spellAttackBonusLabel: string;
  spellSlots: PdfSpellSlotRow[];
  cantrips: PdfSpell[];
  preparedSpells: PdfSpell[];
  knownSpells: PdfSpell[];
  notes: PdfNotes;
}

export interface PdfTeamMember {
  name: string;
  race: string;
  className: string;
  subclass: string;
  level: number;
  notes: string;
  avatarSrc: string | null;
}

export interface PdfEquipmentItem {
  name: string;
  type: string;
  slotLabel: string;
  attackDice: string;
  armorBonus: number;
  otherBonuses: string;
  isTwoHanded: boolean;
  quantity: number;
  weight: number;
  description: string;
  bonusLabel: string;
  featuresLabel: string;
}

export interface PdfConsumable {
  name: string;
  quantity: number;
  weight: number;
  description: string;
}

export interface PdfCurrency {
  copper: number;
  silver: number;
  gold: number;
  electrum: number;
  platinum: number;
}

export interface PdfSpell {
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  isConcentration: boolean;
  isRitual: boolean;
  damageLabel: string;
}

export interface PdfSpellSlotRow {
  levelLabel: string;
  max: number;
  used: number;
  available: number;
}

export interface PdfNotes {
  plotNotes: string;
  npcNotes: string;
  locationNotes: string;
  questNotes: string;
  secretNotes: string;
  combatNotes: string;
  contactNotes: string;
  rumorNotes: string;
  miscNotes: string;
}

const ABILITY_LABELS: Record<string, string> = {
  strength: 'Сила',
  dexterity: 'Ловкость',
  constitution: 'Телосложение',
  intelligence: 'Интеллект',
  wisdom: 'Мудрость',
  charisma: 'Харизма',
};

const SLOT_LABELS: Record<string, string> = {
  armor: 'Броня',
  mainHand: 'Сильная рука',
  offHand: 'Слабая рука',
  ranged: 'Дальнобойное оружие',
};

const RACE_NAME_MAPPING: Record<string, string> = {
  Ааракокра: 'Aarakocra',
  Гном: 'Gnome',
  Гоблин: 'Goblin',
  Кенку: 'Kenku',
  Кобольд: 'Kobold',
  Людоящер: 'Lizard-man',
  Тритон: 'Triton',
  Фирболг: 'Firbolg',
  'Юань-ти': 'Yuan-ti',
  Человек: 'Human',
  Эльф: 'Elf',
  Дварф: 'Dwarf',
  Полурослик: 'Halfling',
  Драконорожденный: 'DragonBorn',
  Полуэльф: 'Elf',
  Полуорк: 'Orc',
  Орк: 'Orc',
  Тифлинг: 'Tiffling',
  Голиаф: 'Goliaf',
  Калаштар: 'Kalashtar',
  Минотавр: 'Minotaur',
  Шифтер: 'Shifter',
  Аасимар: 'Aasimar',
  Кентавр: 'Centaur',
  Леонин: 'Leonin',
  Табакси: 'Tabaxi',
  Дженази: 'Genasi',
  Грунг: 'Grung',
};

const SPELLCASTING_ABILITY_LABELS: Record<string, string> = {
  none: '—',
  intelligence: 'Интеллект',
  wisdom: 'Мудрость',
  charisma: 'Харизма',
};

const SPELL_LEVEL_LABELS_PDF: Record<number, string> = {
  1: 'Уровень 1',
  2: 'Уровень 2',
  3: 'Уровень 3',
  4: 'Уровень 4',
  5: 'Уровень 5',
  6: 'Уровень 6',
  7: 'Уровень 7',
  8: 'Уровень 8',
  9: 'Уровень 9',
};

const SCHOOL_LABELS: Record<string, string> = {
  abjuration: 'Ограждение',
  conjuration: 'Вызов',
  divination: 'Прорицание',
  enchantment: 'Очарование',
  evocation: 'Воплощение',
  illusion: 'Иллюзия',
  necromancy: 'Некромантия',
  transmutation: 'Преобразование',
};

const CASTING_TIME_LABELS: Record<string, string> = {
  action: 'Действие',
  bonus_action: 'Бонус. действие',
  reaction: 'Реакция',
  '1 minute': '1 минута',
  '10 minutes': '10 минут',
  '1 hour': '1 час',
  '12 hours': '12 часов',
};

const DAMAGE_TYPE_LABELS: Record<string, string> = {
  acid: 'Кислота',
  bludgeoning: 'Дробящий',
  cold: 'Холод',
  fire: 'Огонь',
  force: 'Силовое',
  lightning: 'Молния',
  necrotic: 'Некротич.',
  piercing: 'Колющий',
  poison: 'Яд',
  psychic: 'Психич.',
  radiant: 'Лучистый',
  slashing: 'Рубящий',
  thunder: 'Звук',
  varies: 'Разный',
  variable: 'Выбор',
};

function mapSpell(spell: HeroSpell): PdfSpell {
  const damageType = spell.damage
    ? (DAMAGE_TYPE_LABELS[spell.damage.type] ?? spell.damage.type)
    : null;

  return {
    name: spell.name,
    level: spell.level,
    school: SCHOOL_LABELS[spell.school] ?? spell.school,
    castingTime: CASTING_TIME_LABELS[spell.castingTime] ?? spell.castingTime,
    range: spell.range,
    isConcentration: spell.isConcentration,
    isRitual: spell.isRitual,
    damageLabel: spell.damage ? `${spell.damage.dice} (${damageType})` : '',
  };
}

function computeSpellSlots(hero: HeroFormData): PdfSpellSlotRow[] {
  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
  const slotsData = hero.spellSlots;
  return keys
    .map((lvl) => {
      const key = `level${lvl}` as keyof typeof slotsData;
      const slot = slotsData?.[key] ?? { max: 0, used: 0 };
      return {
        levelLabel: SPELL_LEVEL_LABELS_PDF[lvl],
        max: slot.max,
        used: slot.used,
        available: slot.max - slot.used,
      };
    })
    .filter((s) => s.max > 0);
}

function getRaceLogo(race: string): string | null {
  if (!race || race.trim() === '') return null;
  const englishRaceName = RACE_NAME_MAPPING[race];
  if (!englishRaceName) return null;
  const raceInfo = raceData.find((r) => r.name === englishRaceName && r.side === 'allies');
  return raceInfo?.logo ?? null;
}

function resolveTeamMemberAvatar(customAvatar: string | undefined, race: string): string | null {
  const rawAvatar = customAvatar && customAvatar.trim() !== '' ? customAvatar : getRaceLogo(race);
  return rawAvatar ? resolveAssetSrc(rawAvatar) : null;
}

function mapEquipmentItem(item: {
  name: string;
  type?: string;
  slot?: string;
  attackDice?: string;
  armorBonus?: number;
  otherBonuses?: string;
  isTwoHanded?: boolean;
  quantity?: number;
  weight?: number;
  description?: string;
}): PdfEquipmentItem {
  const attackDice = item.attackDice || '';
  const armorBonus = item.armorBonus || 0;
  const otherBonuses = item.otherBonuses || '';
  const isTwoHanded = item.isTwoHanded ?? false;

  const bonusParts: string[] = [];
  if (attackDice) bonusParts.push(`Урон: ${attackDice}`);
  if (armorBonus) bonusParts.push(`+${armorBonus} к КД`);
  const bonusLabel = bonusParts.length > 0 ? bonusParts.join(' · ') : '—';

  const featureParts: string[] = [];
  if (isTwoHanded) featureParts.push('Двуручное');
  if (otherBonuses) featureParts.push(otherBonuses);
  const featuresLabel = featureParts.length > 0 ? featureParts.join(', ') : '—';

  return {
    name: item.name,
    type: item.type || '',
    slotLabel: item.slot ? (SLOT_LABELS[item.slot] ?? item.slot) : '',
    attackDice,
    armorBonus,
    otherBonuses,
    isTwoHanded,
    quantity: item.quantity ?? 1,
    weight: item.weight ?? 0,
    description: item.description || '',
    bonusLabel,
    featuresLabel,
  };
}
function resolveAssetSrc(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('data:') || /^https?:\/\//.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}

function buildAbilityScores(
  abilityScores: HeroFormData['abilityScores'],
  savingThrows: string[],
  proficiencyBonus: number,
  proficientSkills: string[],
  skillOverrides: Record<string, number>
): PdfAbilityScore[] {
  return (Object.keys(ABILITY_LABELS) as AbilityKey[]).map((key) => {
    const score = abilityScores[key];
    const modifier = getAbilityModifier(score);

    const isSavingThrowProficient =
      savingThrows.includes(key) || savingThrows.includes(ABILITY_LABELS[key]);
    const savingThrowModifier = modifier + (isSavingThrowProficient ? proficiencyBonus : 0);

    const skills: PdfSkillEntry[] = (SKILLS_BY_ABILITY[key] ?? []).map((skillName) => {
      const isProficient = proficientSkills.includes(skillName);

      const overrideValue = skillOverrides[skillName];
      const computed = modifier + (isProficient ? proficiencyBonus : 0);
      const total = overrideValue ?? computed;
      return {
        name: skillName,
        isProficient,
        modifier: total,
        modifierLabel: formatModifier(total),
      };
    });

    return {
      key,
      label: ABILITY_LABELS[key],
      score,
      modifier,
      modifierLabel: formatModifier(modifier),
      isSavingThrowProficient,
      savingThrowModifier,
      savingThrowModifierLabel: formatModifier(savingThrowModifier),
      skills,
    };
  });
}

export function mapHeroToPdfData(hero: HeroFormData | null): PdfCharacterData {
  if (!hero) {
    return {
      isBlank: true,
      name: '',
      race: '',
      size: '',
      background: '',
      alignment: '',
      level: 0,
      experience: 0,
      classes: [],
      proficiencyBonus: 0,
      avatarSrc: null,
      raceFigureSrc: null,
      abilityScores: buildAbilityScores(
        {
          strength: 0,
          dexterity: 0,
          constitution: 0,
          intelligence: 0,
          wisdom: 0,
          charisma: 0,
        },
        [],
        0,
        [],
        {}
      ),
      armorClass: 0,
      initiative: 0,
      speed: 0,
      passivePerception: 10,
      inspiration: false,
      exhaustionLevel: 0,
      hitPoints: { current: 0, max: 0, temporary: 0 },
      hitDice: { total: 0, spent: 0, type: '' },
      deathSaves: { successes: 0, failures: 0 },
      skills: [],
      savingThrows: [],
      languages: [],
      weaponProficiencies: [],
      armorProficiencies: [],
      toolProficiencies: [],
      combatAbilities: [],
      classFeatures: '',
      raceFeatures: '',
      feats: [],
      backstory: '',
      appearance: '',
      additionalFeatures: '',
      campaignGoals: '',
      teamMembers: [],
      equippedItems: [],
      backpackItems: [],
      consumables: [],
      treasures: '',
      magicItems: { maxSlots: 3, items: [] },
      currency: { copper: 0, silver: 0, gold: 0, electrum: 0, platinum: 0 },
      carryCapacity: { current: 0, max: 0 },
      spellcastingAbilityLabel: '—',
      spellcastingModifierLabel: '+0',
      spellSaveDC: 0,
      spellAttackBonusLabel: '+0',
      spellSlots: [],
      cantrips: [],
      preparedSpells: [],
      knownSpells: [],
      notes: {
        plotNotes: '',
        npcNotes: '',
        locationNotes: '',
        questNotes: '',
        secretNotes: '',
        combatNotes: '',
        contactNotes: '',
        rumorNotes: '',
        miscNotes: '',
      },
    };
  }
  const spellAbility = hero.spellcastingAbility ?? 'none';
  const spellAbilityScore =
    spellAbility !== 'none'
      ? hero.abilityScores[spellAbility as keyof typeof hero.abilityScores]
      : 10;
  const spellcastingModifier = getAbilityModifier(spellAbilityScore ?? 10);
  const spellProficiencyBonus = getProficiencyBonus(hero.level);
  const spellSaveDC = 8 + spellcastingModifier + spellProficiencyBonus;
  const spellAttackBonus = spellcastingModifier + spellProficiencyBonus;
  return {
    isBlank: false,
    name: hero.name,
    race: hero.race,
    size: hero.size,
    background: hero.background,
    alignment: hero.alignment,
    level: hero.level,
    experience: hero.experience ?? 0,
    classes: hero.classes.map((c) => ({
      className: c.className,
      subclass: c.subclass,
      level: c.level,
    })),
    passivePerception: 10 + getAbilityModifier(hero.abilityScores.wisdom),
    proficiencyBonus: getProficiencyBonus(hero.level),
    avatarSrc: resolveAssetSrc(hero.avatar),
    raceFigureSrc: null,
    abilityScores: buildAbilityScores(
      hero.abilityScores,
      hero.savingThrows,
      getProficiencyBonus(hero.level),
      hero.skills,
      hero.skillOverrides ?? {}
    ),
    armorClass: hero.armorClass,
    initiative: hero.initiative,
    speed: hero.speed,
    inspiration: hero.inspiration ?? false,
    exhaustionLevel: hero.exhaustionLevel,
    hitPoints: hero.hitPoints,
    hitDice: hero.hitDice,
    deathSaves: hero.deathSaves,
    skills: hero.skills,
    savingThrows: hero.savingThrows,
    languages: hero.languages,
    weaponProficiencies: hero.weaponProficiencies ?? [],
    armorProficiencies: hero.armorProficiencies ?? [],
    toolProficiencies: hero.toolProficiencies ?? [],
    combatAbilities: (hero.combatAbilities ?? []).map((a) => ({
      name: a.name,
      bonus: a.bonus,
      damage: a.damage,
      description: a.description,
    })),
    classFeatures: hero.classFeatures ?? '',
    raceFeatures: hero.raceFeatures ?? '',
    feats: (hero.feats ?? []).map((f) => ({ name: f.name, description: f.description })),
    backstory: hero.backstory ?? '',
    appearance: hero.appearance ?? '',
    additionalFeatures: hero.additionalFeatures ?? '',
    campaignGoals: hero.campaignGoals ?? '',
    teamMembers: (hero.teamMembers ?? []).map((m) => ({
      name: m.name,
      race: m.race,
      className: m.class,
      subclass: m.subclass ?? '',
      level: m.level,
      notes: m.notes ?? '',
      avatarSrc: resolveTeamMemberAvatar(m.customAvatar, m.race),
    })),
    equippedItems: (hero.inventory?.equipped ?? []).map(mapEquipmentItem),
    backpackItems: (hero.inventory?.inventory ?? []).map(mapEquipmentItem),
    consumables: (hero.inventory?.consumables ?? []).map((c) => ({
      name: c.name,
      quantity: c.quantity,
      weight: c.weight,
      description: c.description ?? '',
    })),
    treasures: hero.inventory?.treasures ?? '',
    magicItems: {
      maxSlots: hero.inventory?.magicItems?.maxSlots ?? 3,
      items: (hero.inventory?.magicItems?.items ?? []).filter((i) => i && i.trim() !== ''),
    },
    currency: hero.inventory?.currency ?? {
      copper: 0,
      silver: 0,
      gold: 0,
      electrum: 0,
      platinum: 0,
    },
    carryCapacity: hero.inventory?.carryCapacity ?? { current: 0, max: 0 },
    spellcastingAbilityLabel: SPELLCASTING_ABILITY_LABELS[spellAbility] ?? '—',
    spellcastingModifierLabel: formatModifier(spellcastingModifier),
    spellSaveDC,
    spellAttackBonusLabel: formatModifier(spellAttackBonus),
    spellSlots: computeSpellSlots(hero),
    cantrips: (hero.cantrips ?? []).map(mapSpell),
    preparedSpells: (hero.preparedSpells ?? []).map(mapSpell),
    knownSpells: (hero.knownSpells ?? []).map(mapSpell),
    notes: {
      plotNotes: hero.notes?.plotNotes ?? '',
      npcNotes: hero.notes?.npcNotes ?? '',
      locationNotes: hero.notes?.locationNotes ?? '',
      questNotes: hero.notes?.questNotes ?? '',
      secretNotes: hero.notes?.secretNotes ?? '',
      combatNotes: hero.notes?.combatNotes ?? '',
      contactNotes: hero.notes?.contactNotes ?? '',
      rumorNotes: hero.notes?.rumorNotes ?? '',
      miscNotes: hero.notes?.miscNotes ?? '',
    },
  };
}
