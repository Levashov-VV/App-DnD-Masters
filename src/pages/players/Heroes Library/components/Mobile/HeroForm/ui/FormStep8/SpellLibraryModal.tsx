import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWatch } from 'react-hook-form';
import type { UseFormReturn, UseFormSetValue } from 'react-hook-form';
import {
  useSpellLibrary,
  spellEntryToHeroSpell,
} from '../../../../../../../../shared/hooks/PersonForm/useSpellLibrary';
import { Select } from '../Select';
import { DND_CLASSES } from '../../../../../../../../features/heroes/constants/dndData';
import type { SpellEntry } from '../../../../../../../../shared/hooks/PersonForm/useSpellLibrary';
import type {
  HeroFormData,
  HeroSpell,
} from '../../../../../../../../features/heroes/schemas/heroSchema';

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

const DAMAGE_TYPE_LABELS: Record<string, string> = {
  acid: 'Кислота',
  cold: 'Холод',
  fire: 'Огонь',
  force: 'Силовое',
  lightning: 'Молния',
  necrotic: 'Некротический',
  poison: 'Яд',
  psychic: 'Психический',
  radiant: 'Лучистый',
  thunder: 'Звук',
  bludgeoning: 'Дробящий',
  variable: 'Выбор',
  piercing: 'Колющий',
  slashing: 'Рубящий',
  varies: 'Разный',
  weapon: 'Оружие',
};

const CASTING_TIME_LABELS: Record<string, string> = {
  action: 'Действие',
  bonus_action: 'Бонусное действие',
  reaction: 'Реакция',
  '1 minute': '1 минута',
  '10 minutes': '10 минут',
  '1 hour': '1 час',
  '12 hours': '12 часов',
};

interface SpellLibraryModalMobileProps {
  isOpen: boolean;
  onClose: () => void;
  characterClass: string;
  control: UseFormReturn<HeroFormData>['control'];
  setValue: UseFormSetValue<HeroFormData>;
  mode: 'cantrips' | 'spells' | 'full';
}

type MobileStep = 1 | 2 | 3;

const STEPS: { step: MobileStep; label: string }[] = [
  { step: 1, label: 'Фильтры' },
  { step: 2, label: 'Заклинания' },
  { step: 3, label: 'Детали' },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
};

export function SpellLibraryModal({
  isOpen,
  onClose,
  characterClass,
  control,
  setValue,
  mode,
}: SpellLibraryModalMobileProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<number | null>(null);
  const [filterSchool, setFilterSchool] = useState<string | null>(null);
  const [filterConcentration, setFilterConcentration] = useState<boolean | null>(null);
  const [filterRitual, setFilterRitual] = useState<boolean | null>(null);
  const [filterDamageType, setFilterDamageType] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedFilterClass, setSelectedFilterClass] = useState<string | null>(null);
  const [selectedSpell, setSelectedSpell] = useState<SpellEntry | null>(null);
  const [step, setStep] = useState<MobileStep>(2);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setStep(2);
      setDir(1);
      setSelectedSpell(null);
    }
  }, [isOpen]);

  const goTo = (next: MobileStep) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const cantrips = useWatch({ control, name: 'cantrips' as any, defaultValue: [] }) as HeroSpell[];
  const preparedSpells = useWatch({ control, name: 'preparedSpells' as any, defaultValue: [] }) as HeroSpell[];
  const knownSpells = useWatch({ control, name: 'knownSpells' as any, defaultValue: [] }) as HeroSpell[];

  const { spells, availableSchools, availableDamageTypes } = useSpellLibrary({
    characterClass: selectedFilterClass || characterClass,
    showAll,
    searchQuery,
    filterLevel: mode === 'cantrips' ? 0 : filterLevel,
    filterSchool,
    filterConcentration,
    filterRitual,
    filterDamageType,
  });

  const filteredSpells = useMemo(() => {
    if (mode === 'full' || mode === 'cantrips') return spells;
    return spells.filter((s) => s.level > 0);
  }, [spells, mode]);

  const addedIds = useMemo(() => new Set([
    ...cantrips.map((s) => s.id),
    ...preparedSpells.map((s) => s.id),
    ...knownSpells.map((s) => s.id),
  ]), [cantrips, preparedSpells, knownSpells]);

  const handleSpellSelect = (spell: SpellEntry) => {
    setSelectedSpell(spell);
    goTo(3);
  };

  const handleAdd = (target: 'cantrip' | 'prepared' | 'known') => {
    if (!selectedSpell) return;
    const heroSpell = spellEntryToHeroSpell(selectedSpell);
    if (target === 'cantrip' && !cantrips.find((s) => s.id === heroSpell.id))
      setValue('cantrips' as any, [...cantrips, heroSpell], { shouldDirty: true });
    if (target === 'prepared' && !preparedSpells.find((s) => s.id === heroSpell.id))
      setValue('preparedSpells' as any, [...preparedSpells, heroSpell], { shouldDirty: true });
    if (target === 'known' && !knownSpells.find((s) => s.id === heroSpell.id))
      setValue('knownSpells' as any, [...knownSpells, heroSpell], { shouldDirty: true });
  };

  const handleRemove = (target: 'cantrip' | 'prepared' | 'known') => {
    if (!selectedSpell) return;
    if (target === 'cantrip')
      setValue('cantrips' as any, cantrips.filter((s) => s.id !== selectedSpell.id), { shouldDirty: true });
    if (target === 'prepared')
      setValue('preparedSpells' as any, preparedSpells.filter((s) => s.id !== selectedSpell.id), { shouldDirty: true });
    if (target === 'known')
      setValue('knownSpells' as any, knownSpells.filter((s) => s.id !== selectedSpell.id), { shouldDirty: true });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilterLevel(mode === 'cantrips' ? 0 : null);
    setFilterSchool(null);
    setFilterConcentration(null);
    setFilterRitual(null);
    setFilterDamageType(null);
    setSelectedFilterClass(null);
  };

  const getTitle = () => {
    switch (mode) {
      case 'cantrips': return 'Библиотека заговоров';
      case 'spells': return 'Библиотека заклинаний';
      default: return 'Полная библиотека';
    }
  };

  const castingTime = selectedSpell
    ? (CASTING_TIME_LABELS[selectedSpell.castingTime] ?? selectedSpell.castingTime)
    : '';

  const inCantrips = selectedSpell ? cantrips.some((s) => s.id === selectedSpell.id) : false;
  const inPrepared = selectedSpell ? preparedSpells.some((s) => s.id === selectedSpell.id) : false;
  const inKnown = selectedSpell ? knownSpells.some((s) => s.id === selectedSpell.id) : false;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/85"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            className="flex flex-col w-full bg-stone-900 border-t-4 border-x-4 border-amber-600 rounded-t-2xl overflow-hidden"
            style={{ height: '86vh' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >

            {/* ── Шапка ── */}
            <div style={{ padding: '2vh 1.5vw' }} className="flex items-center gap-2 bg-stone-800 border-b-2 border-amber-600 shrink-0">
              <span className="text-[1.8vh] font-bold text-amber-100 uppercase tracking-wide truncate flex-1 min-w-0">
                {getTitle()}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 text-[1.4vh] w-[2.5vh] h-[2.5vh] font-bold text-amber-100/70 border-2 border-amber-600/50 rounded-lg active:border-amber-500 active:text-amber-100 transition-colors"
              >
                ✕
              </button>
            </div>
              <div style={{ padding: '2vh 1.5vw' }} className="flex justify-center gap-[5vw] shrink-0">
                {STEPS.map(({ step: s, label }) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => goTo(s)}
                    style={{padding: '0.4vh 2vw'}}
                    className={`text-[1.4vh] font-bold rounded-lg border-2 transition-colors ${
                      step === s
                        ? 'bg-amber-600 border-amber-500 text-stone-900'
                        : 'bg-stone-900 border-amber-600/30 text-amber-100/50'
                    }`}
                  >
                    {s === 2 ? `${filteredSpells.length} ${label}` : label}
                  </button>
                ))}
              </div>

            {/* Контент */}
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence custom={dir} mode="wait">
                <motion.div
                  key={step}
                  custom={dir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="absolute inset-0 flex flex-col overflow-hidden"
                >

                  {/* ФИЛЬТРЫ */}
                  {step === 1 && (
                    <div style={{ margin: '2vh 1.5vw' }} className="flex-1 overflow-y-auto flex flex-col gap-4">

                      {/* Поиск */}
                      <div>
                        <label style={{marginBottom: '1vh'}} className="text-[1.2vh] text-amber-100/60 uppercase block">Поиск</label>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Название заклинания..."
                          className="w-full bg-stone-800 border-2 border-amber-600/50 rounded-lg px-3 py-2.5 text-sm text-amber-100 placeholder:text-amber-100/30 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      {/* Класс */}
                      <div>
                        <label style={{marginBottom: '1vh'}} className="text-[1.2vh] text-amber-100/60 uppercase block mb-1">Класс</label>
                        <Select
                          options={['Все классы', ...DND_CLASSES]}
                          value={selectedFilterClass || 'Все классы'}
                          onChange={(e) =>
                            setSelectedFilterClass(e.target.value === 'Все классы' ? null : e.target.value)
                          }
                          placeholder="Выберите класс"
                          className="w-full"
                        />
                      </div>

                      {/* Мой класс / Все */}
                      <div>
                        <label style={{marginBottom: '1vh'}} className="text-[1.2vh] text-amber-100/60 uppercase block mb-1">Показать</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => { setShowAll(false); setSelectedFilterClass(null); }}
                            className={`flex-1 text-sm font-bold rounded-lg border-2 transition-colors ${
                              !showAll && !selectedFilterClass
                                ? 'bg-amber-600 border-amber-500 text-stone-900'
                                : 'bg-stone-800 border-amber-600/40 text-amber-100/60'
                            }`}
                          >
                            Мой класс
                          </button>
                          <button
                            type="button"
                            onClick={() => { setShowAll(true); setSelectedFilterClass(null); }}
                            className={`flex-1 text-[1.2vh] font-bold rounded-lg border-2 transition-colors ${
                              showAll
                                ? 'bg-amber-600 border-amber-500 text-stone-900'
                                : 'bg-stone-800 border-amber-600/40 text-amber-100/60'
                            }`}
                          >
                            Все
                          </button>
                        </div>
                      </div>

                      {/* Уровень */}
                      <div>
                        <label style={{marginBottom: '1vh'}} className="text-[1.2vh] text-amber-100/60 uppercase block">Уровень</label>
                        <div className="flex flex-wrap gap-[2vw]">
                          {[null, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
                            <button
                              key={lvl ?? 'all'}
                              type="button"
                              onClick={() => setFilterLevel(lvl)}
                              className={`w-[10vw] h-[8vw] text-[1.4vh] font-bold rounded-lg border-2 transition-colors ${
                                filterLevel === lvl
                                  ? 'bg-amber-600 border-amber-500 text-stone-900'
                                  : 'bg-stone-800 border-amber-600/40 text-amber-100/60'
                              }`}
                            >
                              {lvl === null ? 'Все' : lvl === 0 ? 'Загов.' : lvl}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Школа */}
                      <div>
                        <label style={{marginBottom: '1vh'}} className="text-[1.2vh] text-amber-100/60 uppercase block">Школа</label>
                        <div className="flex flex-wrap gap-2">
                          {[null, ...availableSchools].map((school) => (
                            <button
                              key={school ?? 'all'}
                              type="button"
                              style={{padding: '1vh 2vw'}}
                              onClick={() => setFilterSchool(school ?? null)}
                              className={` text-[1.2vh] font-bold rounded-lg border-2 transition-colors ${
                                filterSchool === (school ?? null)
                                  ? 'bg-amber-600 border-amber-500 text-stone-900'
                                  : 'bg-stone-800 border-amber-600/40 text-amber-100/60'
                              }`}
                            >
                              {school == null ? 'Все' : (SCHOOL_LABELS[school] ?? school)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Тип урона */}
                      <div>
                        <label style={{marginBottom: '1vh'}} className="text-xs text-amber-100/60 uppercase block">Тип урона</label>
                        <div className="flex flex-wrap gap-2">
                          {[null, ...availableDamageTypes].map((dt) => (
                            <button
                              key={dt ?? 'all'}
                              type="button"
                              onClick={() => setFilterDamageType(dt ?? null)}
                              style={{padding: '1vh 2vw'}}
                              className={`text-[1.2vh] font-bold rounded-lg border-2 transition-colors ${
                                filterDamageType === (dt ?? null)
                                  ? 'bg-amber-600 border-amber-500 text-stone-900'
                                  : 'bg-stone-800 border-amber-600/40 text-amber-100/60'
                              }`}
                            >
                              {dt == null ? 'Все' : (DAMAGE_TYPE_LABELS[dt] ?? dt)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Концентрация / Ритуал */}
                      <div>
                        <label className="text-[1.2vh] text-amber-100/60 uppercase block mb-1">Особые</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            style={{padding: '1vh 2vw'}}
                            onClick={() => setFilterConcentration(filterConcentration === true ? null : true)}
                            className={`flex-1 text-[1.2vh] font-bold rounded-lg border-2 transition-colors ${
                              filterConcentration === true
                                ? 'bg-blue-700 border-blue-500 text-white'
                                : 'bg-stone-800 border-amber-600/40 text-amber-100/60'
                            }`}
                          >
                            Концентрация
                          </button>
                          <button
                            type="button"
                            onClick={() => setFilterRitual(filterRitual === true ? null : true)}
                            style={{padding: '1vh 2vw'}}
                            className={`flex-1 text-xs font-bold rounded-lg border-2 transition-colors ${
                              filterRitual === true
                                ? 'bg-green-700 border-green-500 text-white'
                                : 'bg-stone-800 border-amber-600/40 text-amber-100/60'
                            }`}
                          >
                            Ритуал
                          </button>
                        </div>
                      </div>

                      {/* Сброс фильтров */}
                      <button
                        type="button"
                        onClick={resetFilters}
                        style={{padding: '1vh 2vw'}}
                        className="w-full text-[1.2vh] font-bold border-2 border-red-700/50 text-red-400/70 rounded-lg transition-colors active:border-red-600 active:text-red-300"
                      >
                        Сбросить фильтры
                      </button>

                      {/* Перейти к списку */}
                      <button
                        type="button"
                        onClick={() => goTo(2)}
                        style={{padding: '1vh 2vw'}}
                        className="w-full bg-amber-600 active:bg-amber-500 text-stone-900 font-bold rounded-xl text-[1.2vh] transition-colors"
                      >
                        Показать заклинания ({filteredSpells.length}) →
                      </button>
                    </div>
                  )}

                  {/* ШАГ 2 — СПИСОК */}
                  {step === 2 && (
                    <div style={{padding: '2vh 1.5vw'}} className="flex-1 overflow-y-auto flex flex-col gap-2">
                      {filteredSpells.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-sm text-amber-100/40">
                          Заклинания не найдены
                        </div>
                      ) : (
                        filteredSpells.map((spell) => {
                          const isSelected = selectedSpell?.id === spell.id;
                          const isAdded = addedIds.has(spell.id);
                          return (
                            <button
                              key={spell.id}
                              type="button"
                              onClick={() => handleSpellSelect(spell)}
                              style={{padding: '1vh 2vw'}}
                              className={`w-full text-left rounded-xl border-2 transition-all ${
                                isSelected
                                  ? 'border-amber-400 bg-amber-900/30'
                                  : 'border-amber-600/30 bg-stone-800/60 active:border-amber-500 active:bg-stone-800'
                              }`}
                            >
                              <div className="flex justify-between items-center gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span style={{padding: '0.2vh 0.4vw'}} className={`text-[1.6vh] font-bold rounded border-2 shrink-0 ${
                                    spell.level === 0
                                      ? 'border-indigo-500 text-indigo-300'
                                      : 'border-amber-600/60 text-amber-400/80'
                                  }`}>
                                    {spell.level === 0 ? 'Загов.' : `${spell.level} ур.`}
                                  </span>
                                  <span className="text-[1.6vh] font-bold text-amber-100 truncate">
                                    {spell.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {spell.isConcentration && (
                                    <span className="text-[1.6vh] text-blue-400" title="Концентрация">К</span>
                                  )}
                                  {spell.isRitual && (
                                    <span className="text-[1.6vh] text-green-400" title="Ритуал">Р</span>
                                  )}
                                  {spell.isDamageSpell && (
                                    <span className="text-[1.6vh] text-red-400">⚔</span>
                                  )}
                                  {isAdded && (
                                    <span className="text-[1.6vh] text-amber-400">✓</span>
                                  )}
                                  <span className="text-[1.6vh] text-amber-100/40">
                                    {SCHOOL_LABELS[spell.school] ?? spell.school}
                                  </span>
                                </div>
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}

                  {/* ШАГ 3 — ДЕТАЛИ */}
                  {step === 3 && (
                    <div style={{padding: '1vh 1.6vw'}} className="flex-1 overflow-y-auto flex flex-col gap-4">
                      {!selectedSpell ? (
                        <div className="flex items-center justify-center h-full text-[1.6vh] text-amber-100/30 text-center">
                          Выберите заклинание из списка
                        </div>
                      ) : (
                        <>
                          {/* Заголовок заклинания */}
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <h2 className="text-[2vh] font-bold text-amber-100 uppercase leading-tight">
                                {selectedSpell.name}
                              </h2>
                              <span style={{padding: '1vh 1.6vw'}} className={`shrink-0 text-[1.4vh] font-bold rounded-lg border-2 ${
                                selectedSpell.level === 0
                                  ? 'border-indigo-500 text-indigo-300'
                                  : 'border-amber-500 text-amber-300'
                              }`}>
                                {selectedSpell.level === 0 ? 'Заговор' : `${selectedSpell.level} уровень`}
                              </span>
                            </div>
                            <p className="text-[1.4vh] text-amber-100/50 italic ">
                              {selectedSpell.nameEn}
                            </p>
                          </div>

                          {/* Характеристики */}
                          <div style={{padding: '1vh 1.6vw'}} className="bg-stone-800 border-2 border-amber-600/40 rounded-xl">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                              {[
                                ['Школа', SCHOOL_LABELS[selectedSpell.school] ?? selectedSpell.school],
                                ['Время', castingTime],
                                ['Дистанция', selectedSpell.range],
                                ['Длительность', selectedSpell.duration],
                                [
                                  'Компоненты',
                                  [
                                    selectedSpell.components.verbal && 'В',
                                    selectedSpell.components.somatic && 'С',
                                    selectedSpell.components.material && 'М',
                                  ].filter(Boolean).join(', ') || '—',
                                ],
                              ].map(([label, value]) => (
                                <div key={label}>
                                  <span className="text-[1.2vh] text-amber-100/50 uppercase block">
                                    {label}
                                  </span>
                                  <span className="text-[1.4vh] text-amber-100 font-bold">{value}</span>
                                </div>
                              ))}
                            </div>

                            {/* Теги */}
                            <div className="flex flex-wrap gap-1.5">
                              {selectedSpell.isConcentration && (
                                <span className="text-[1.4vh] bg-blue-900/50 border-2 border-blue-600/60 text-blue-300 rounded-md">
                                  Концентрация
                                </span>
                              )}
                              {selectedSpell.isRitual && (
                                <span className="text-[1.4vh] bg-green-900/50 border-2 border-green-600/60 text-green-300 rounded-md">
                                  Ритуал
                                </span>
                              )}
                              {selectedSpell.isDamageSpell && selectedSpell.damage && (
                                <span className="text-[1.4vh] bg-red-900/50 border-2 border-red-600/60 text-red-300 rounded-md">
                                  {selectedSpell.damage.dice}{' '}
                                  {DAMAGE_TYPE_LABELS[selectedSpell.damage.type] ?? selectedSpell.damage.type}
                                </span>
                              )}
                            </div>

                            {/* Материальный компонент */}
                            {selectedSpell.components.material &&
                              selectedSpell.components.materialDescription && (
                                <p className="text-[1.2vh] text-amber-100/50 italic">
                                  Материал: {selectedSpell.components.materialDescription}
                                </p>
                              )}
                          </div>

                          {/* Описание */}
                          <div>
                            <p className="text-[1.4vh] text-amber-100/80 leading-relaxed whitespace-pre-line">
                              {selectedSpell.description}
                            </p>
                            {selectedSpell.atHigherLevels && (
                              <div className="bg-stone-800/60 border border-amber-600/20 rounded-xl">
                                <p className="text-[1.2vh] text-amber-400/80 font-bold uppercase mb-1">
                                  На высших уровнях:
                                </p>
                                <p className="text-[1.4vh] text-amber-100/60 leading-relaxed">
                                  {selectedSpell.atHigherLevels}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Кнопки добавления / удаления */}
                          <div className="flex flex-col gap-2">
                            <p className="text-[1.2vh] text-amber-100/50 uppercase">
                              {selectedSpell.level === 0 ? 'Заговоры:' : 'Добавить в:'}
                            </p>

                            {selectedSpell.level === 0 ? (
                              inCantrips ? (
                                <button
                                  type="button"
                                  onClick={() => handleRemove('cantrip')}
                                  className="w-full bg-red-900/60 active:bg-red-800/80 border-2 border-red-600/60 text-red-300 rounded-xl text-[1.2vh] font-bold transition-colors"
                                >
                                  ✕ Удалить из заговоров
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleAdd('cantrip')}
                                  className="w-full bg-indigo-700 active:bg-indigo-600 border-2 border-indigo-500 text-white rounded-xl text-[1.2vh] font-bold transition-colors"
                                >
                                  + Заговоры
                                </button>
                              )
                            ) : (
                              <>
                                {inPrepared ? (
                                  <button
                                    type="button"
                                    onClick={() => handleRemove('prepared')}
                                    className="w-full bg-red-900/60 active:bg-red-800/80 border-2 border-red-600/60 text-red-300 rounded-xl text-sm font-bold transition-colors"
                                  >
                                    ✕ Удалить из подготовленных
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleAdd('prepared')}
                                    disabled={inKnown}
                                    title={inKnown ? 'Сначала удалите из известных' : ''}
                                    className="w-full py-3 bg-amber-600 active:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-amber-500 text-stone-900 rounded-xl text-sm font-bold transition-colors"
                                  >
                                    + Подготовленные
                                  </button>
                                )}

                                {inKnown ? (
                                  <button
                                    type="button"
                                    onClick={() => handleRemove('known')}
                                    className="w-full bg-red-900/60 active:bg-red-800/80 border-2 border-red-600/60 text-red-300 rounded-xl text-[1.2vh] font-bold transition-colors"
                                  >
                                    ✕ Удалить из известных
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleAdd('known')}
                                    disabled={inPrepared}
                                    title={inPrepared ? 'Сначала удалите из подготовленных' : ''}
                                    className="w-full bg-stone-700 active:bg-stone-600 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-amber-600/60 text-amber-100 rounded-xl text-[1.2vh] font-bold transition-colors"
                                  >
                                    + Известные
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
