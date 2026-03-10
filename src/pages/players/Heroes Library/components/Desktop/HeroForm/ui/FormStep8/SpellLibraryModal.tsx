import { useState, useMemo } from 'react';
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

interface SpellLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterClass: string;
  control: UseFormReturn<HeroFormData>['control'];
  setValue: UseFormSetValue<HeroFormData>;
  mode: 'cantrips' | 'spells' | 'full';
}

export function SpellLibraryModal({
  isOpen,
  onClose,
  characterClass,
  control,
  setValue,
  mode,
}: SpellLibraryModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<number | null>(null);
  const [filterSchool, setFilterSchool] = useState<string | null>(null);
  const [filterConcentration, setFilterConcentration] = useState<boolean | null>(null);
  const [filterRitual, setFilterRitual] = useState<boolean | null>(null);
  const [filterDamageType, setFilterDamageType] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedFilterClass, setSelectedFilterClass] = useState<string | null>(null);
  const [selectedSpell, setSelectedSpell] = useState<SpellEntry | null>(null);

  const cantrips = useWatch({ control, name: 'cantrips' as any, defaultValue: [] }) as HeroSpell[];
  const preparedSpells = useWatch({
    control,
    name: 'preparedSpells' as any,
    defaultValue: [],
  }) as HeroSpell[];
  const knownSpells = useWatch({
    control,
    name: 'knownSpells' as any,
    defaultValue: [],
  }) as HeroSpell[];

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
    return spells.filter((spell) => spell.level > 0);
  }, [spells, mode]);

  const addedIds = useMemo(() => {
    return new Set([
      ...cantrips.map((s) => s.id),
      ...preparedSpells.map((s) => s.id),
      ...knownSpells.map((s) => s.id),
    ]);
  }, [cantrips, preparedSpells, knownSpells]);

  const handleAdd = (target: 'cantrip' | 'prepared' | 'known') => {
    if (!selectedSpell) return;
    const heroSpell = spellEntryToHeroSpell(selectedSpell);
    if (target === 'cantrip' && !cantrips.find((s) => s.id === heroSpell.id)) {
      setValue('cantrips' as any, [...cantrips, heroSpell], { shouldDirty: true });
    }
    if (target === 'prepared' && !preparedSpells.find((s) => s.id === heroSpell.id)) {
      setValue('preparedSpells' as any, [...preparedSpells, heroSpell], { shouldDirty: true });
    }
    if (target === 'known' && !knownSpells.find((s) => s.id === heroSpell.id)) {
      setValue('knownSpells' as any, [...knownSpells, heroSpell], { shouldDirty: true });
    }
  };

  const handleRemove = (target: 'cantrip' | 'prepared' | 'known') => {
    if (!selectedSpell) return;
    if (target === 'cantrip') {
      setValue(
        'cantrips' as any,
        cantrips.filter((s) => s.id !== selectedSpell.id),
        { shouldDirty: true }
      );
    }
    if (target === 'prepared') {
      setValue(
        'preparedSpells' as any,
        preparedSpells.filter((s) => s.id !== selectedSpell.id),
        { shouldDirty: true }
      );
    }
    if (target === 'known') {
      setValue(
        'knownSpells' as any,
        knownSpells.filter((s) => s.id !== selectedSpell.id),
        { shouldDirty: true }
      );
    }
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
      case 'cantrips':
        return 'Библиотека заговоров';
      case 'spells':
        return 'Библиотека заклинаний';
      case 'full':
        return 'Полная библиотека заклинаний';
      default:
        return 'Библиотека заклинаний';
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
          className="fixed top-[15vh] inset-0 z-50 flex items-center justify-center bg-black/85"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="flex flex-col bg-stone-900 border-4 border-amber-600 rounded-xl overflow-hidden"
            style={{ width: '92vw', height: '80vh' }}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Шапка */}
            <div
              style={{ padding: '1vh 1.5vw' }}
              className="flex justify-between items-center border-b-2 border-amber-600 bg-stone-800 shrink-0"
            >
              <div className="flex items-center gap-[1vw]">
                <span className="text-[2.2vh] font-bold text-amber-100 uppercase">
                  {getTitle()}
                </span>
                <span className="text-[1.4vh] text-amber-400/70">
                  {filteredSpells.length} заклинаний
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                style={{ padding: '0.3vh 0.6vw' }}
                className="text-[1.6vh] font-bold text-amber-100/70 hover:text-amber-100 border-2 border-amber-600/50 hover:border-amber-500 rounded-lg transition-colors"
              >
                ✕ Закрыть
              </button>
            </div>

            {/* Содержимое */}
            <div className="flex flex-1 overflow-hidden">
              {/* ЛЕВАЯ ПАНЕЛЬ: Фильтры */}
              <div
                style={{ padding: '1vh 0.8vw', width: '18vw' }}
                className="flex flex-col gap-[1vh] border-r-2 border-amber-600/40 bg-stone-800/50 overflow-y-auto shrink-0"
              >
                {/* Поиск */}
                <div>
                  <label className="text-[1.2vh] text-amber-100/60 uppercase block">Поиск</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Название заклинания..."
                    style={{ padding: '0.4vh 0.4vw' }}
                    className="w-full bg-stone-900 border-2 border-amber-600/50 rounded text-[1.3vh] text-amber-100 placeholder:text-amber-100/30 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Фильтр по классу */}
                <div>
                  <label className="text-[1.2vh] text-amber-100/60 uppercase block">
                    Фильтр по классу
                  </label>
                  <Select
                    options={['Все классы', ...DND_CLASSES]}
                    value={selectedFilterClass || 'Все классы'}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === 'Все классы') {
                        setSelectedFilterClass(null);
                      } else {
                        setSelectedFilterClass(value);
                      }
                    }}
                    placeholder="Выберите класс"
                    className="w-full"
                  />
                </div>

                {/* "Мой класс / Все" без изменений */}
                <div>
                  <label className="text-[1.2vh] text-amber-100/60 uppercase block">Показать</label>
                  <div className="flex gap-[0.3vw]">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAll(false);
                        setSelectedFilterClass(null);
                      }}
                      style={{ padding: '0.3vh 0.4vw' }}
                      className={`flex-1 text-[1.1vh] font-bold rounded border-2 transition-colors ${
                        !showAll && !selectedFilterClass
                          ? 'bg-amber-600 border-amber-500 text-stone-900'
                          : 'bg-stone-900 border-amber-600/40 text-amber-100/60 hover:border-amber-500/60'
                      }`}
                    >
                      Мой класс
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAll(true);
                        setSelectedFilterClass(null);
                      }}
                      style={{ padding: '0.3vh 0.4vw' }}
                      className={`flex-1 text-[1.1vh] font-bold rounded border-2 transition-colors ${
                        showAll
                          ? 'bg-amber-600 border-amber-500 text-stone-900'
                          : 'bg-stone-900 border-amber-600/40 text-amber-100/60 hover:border-amber-500/60'
                      }`}
                    >
                      Все
                    </button>
                  </div>
                </div>

                {/* Уровень */}
                <div>
                  <label className="text-[1.2vh] text-amber-100/60 uppercase block">Уровень</label>
                  <div className="flex flex-wrap gap-[0.3vw]">
                    {[null, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
                      <button
                        key={lvl ?? 'all'}
                        type="button"
                        onClick={() => setFilterLevel(lvl)}
                        style={{ padding: '0.2vh 0.4vw' }}
                        className={`text-[1.1vh] font-bold rounded border-2 transition-colors ${
                          filterLevel === lvl
                            ? 'bg-amber-600 border-amber-500 text-stone-900'
                            : 'bg-stone-900 border-amber-600/40 text-amber-100/60 hover:border-amber-500'
                        }`}
                      >
                        {lvl === null ? 'Все' : lvl === 0 ? 'Загов.' : lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Школа */}
                <div>
                  <label className="text-[1.2vh] text-amber-100/60 uppercase block">Школа</label>
                  <div className="flex flex-col gap-[0.2vh]">
                    <button
                      type="button"
                      onClick={() => setFilterSchool(null)}
                      style={{ padding: '0.2vh 0.4vw' }}
                      className={`text-left text-[1.1vh] rounded border-2 transition-colors ${
                        filterSchool === null
                          ? 'bg-amber-600 border-amber-500 text-stone-900 font-bold'
                          : 'bg-stone-900 border-amber-600/40 text-amber-100/60 hover:border-amber-500'
                      }`}
                    >
                      Все школы
                    </button>
                    {availableSchools.map((school) => (
                      <button
                        key={school}
                        type="button"
                        onClick={() => setFilterSchool(school === filterSchool ? null : school)}
                        style={{ padding: '0.2vh 0.4vw' }}
                        className={`text-left text-[1.1vh] rounded border-2 transition-colors ${
                          filterSchool === school
                            ? 'bg-amber-600 border-amber-500 text-stone-900 font-bold'
                            : 'bg-stone-900 border-amber-600/40 text-amber-100/60 hover:border-amber-500'
                        }`}
                      >
                        {SCHOOL_LABELS[school] ?? school}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Тип урона */}
                <div>
                  <label className="text-[1.2vh] text-amber-100/60 uppercase block">
                    Тип урона
                  </label>
                  <div className="flex flex-col gap-[0.2vh]">
                    <button
                      type="button"
                      onClick={() => setFilterDamageType(null)}
                      style={{ padding: '0.2vh 0.4vw' }}
                      className={`text-left text-[1.1vh] rounded border-2 transition-colors ${
                        filterDamageType === null
                          ? 'bg-amber-600 border-amber-500 text-stone-900 font-bold'
                          : 'bg-stone-900 border-amber-600/40 text-amber-100/60 hover:border-amber-500'
                      }`}
                    >
                      Все типы
                    </button>
                    {availableDamageTypes.map((dt) => (
                      <button
                        key={dt}
                        type="button"
                        onClick={() => setFilterDamageType(dt === filterDamageType ? null : dt)}
                        style={{ padding: '0.2vh 0.4vw' }}
                        className={`text-left text-[1.1vh] rounded border-2 transition-colors ${
                          filterDamageType === dt
                            ? 'bg-amber-600 border-amber-500 text-stone-900 font-bold'
                            : 'bg-stone-900 border-amber-600/40 text-amber-100/60 hover:border-amber-500'
                        }`}
                      >
                        {DAMAGE_TYPE_LABELS[dt] ?? dt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Концентрация / Ритуал */}
                <div>
                  <label className="text-[1.2vh] text-amber-100/60 uppercase block">Особые</label>
                  <div className="flex flex-col gap-[0.3vh]">
                    <button
                      type="button"
                      onClick={() =>
                        setFilterConcentration(filterConcentration === true ? null : true)
                      }
                      style={{ padding: '0.2vh 0.4vw' }}
                      className={`text-left text-[1.1vh] rounded border-2 transition-colors ${
                        filterConcentration === true
                          ? 'bg-blue-700 border-blue-500 text-white font-bold'
                          : 'bg-stone-900 border-amber-600/40 text-amber-100/60 hover:border-amber-500'
                      }`}
                    >
                      Концентрация
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterRitual(filterRitual === true ? null : true)}
                      style={{ padding: '0.2vh 0.4vw' }}
                      className={`text-left text-[1.1vh] rounded border-2 transition-colors ${
                        filterRitual === true
                          ? 'bg-green-700 border-green-500 text-white font-bold'
                          : 'bg-stone-900 border-amber-600/40 text-amber-100/60 hover:border-amber-500'
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
                  style={{ padding: '0.4vh 0' }}
                  className="w-full text-[1.2vh] font-bold border-2 border-red-700/50 text-red-400/70 hover:border-red-600 hover:text-red-300 rounded transition-colors"
                >
                  Сбросить фильтры
                </button>
              </div>

              {/* ЦЕНТРАЛЬНАЯ ПАНЕЛЬ: Список */}
              <div className="flex flex-col flex-1 overflow-hidden border-r-2 border-amber-600/40">
                <div
                  style={{ padding: '0.6vh 0.8vw' }}
                  className="text-[1.2vh] text-amber-100/50 border-b border-amber-600/20 shrink-0"
                >
                  Найдено:{' '}
                  <span className="text-amber-300 font-bold">{filteredSpells.length}</span>{' '}
                </div>

                <div className="flex-1 overflow-y-auto" style={{ padding: '0.8vh 0.8vw' }}>
                  {filteredSpells.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-[1.4vh] text-amber-100/40">
                      Заклинания не найдены
                    </div>
                  ) : (
                    <div className="flex flex-col gap-[0.4vh]">
                      {filteredSpells.map((spell) => {
                        const isSelected = selectedSpell?.id === spell.id;
                        const isAlreadyAdded = addedIds.has(spell.id);
                        return (
                          <button
                            key={spell.id}
                            type="button"
                            onClick={() => setSelectedSpell(spell)}
                            style={{ padding: '0.6vh 0.6vw' }}
                            className={`w-full text-left rounded-lg border-2 transition-all ${
                              isSelected
                                ? 'border-amber-400 bg-amber-900/30'
                                : 'border-amber-600/30 bg-stone-800/60 hover:border-amber-500/60 hover:bg-stone-800'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-[0.5vw]">
                                <span
                                  style={{ padding: '0.1vh 0.3vw' }}
                                  className={`text-[1vh] font-bold rounded shrink-0 ${
                                    spell.level === 0
                                      ? 'border-2 border-indigo-500 text-indigo-300'
                                      : 'border-2 border-amber-600/60 text-amber-400/80'
                                  }`}
                                >
                                  {spell.level === 0 ? 'Загов.' : `${spell.level} ур.`}
                                </span>
                                <span className="text-[1.3vh] font-bold text-amber-100">
                                  {spell.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-[0.4vw] shrink-0">
                                {spell.isConcentration && (
                                  <span className="text-[1vh] text-blue-400" title="Концентрация">
                                    К
                                  </span>
                                )}
                                {spell.isRitual && (
                                  <span className="text-[1vh] text-green-400" title="Ритуал">
                                    Р
                                  </span>
                                )}
                                {spell.isDamageSpell && (
                                  <span className="text-[1vh] text-red-400" title="Урон">
                                    ⚔
                                  </span>
                                )}
                                {isAlreadyAdded && (
                                  <span className="text-[1vh] text-amber-400" title="Уже добавлено">
                                    ✓
                                  </span>
                                )}
                                <span className="text-[1.1vh] text-amber-100/40">
                                  {SCHOOL_LABELS[spell.school] ?? spell.school}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* ── ПРАВАЯ ПАНЕЛЬ: Детали ── */}
              <div
                style={{ padding: '1vh 1vw', width: '28vw' }}
                className="flex flex-col overflow-y-auto shrink-0"
              >
                {!selectedSpell ? (
                  <div className="flex items-center justify-center h-full text-[1.4vh] text-amber-100/30 text-center">
                    Выберите заклинание
                    <br />
                    из списка слева
                  </div>
                ) : (
                  <>
                    {/* Заголовок */}
                    <div>
                      <div className="flex items-start justify-between gap-[0.5vw] ">
                        <h2 className="text-[2vh] font-bold text-amber-100 uppercase leading-tight">
                          {selectedSpell.name}
                        </h2>
                        <span
                          style={{ padding: '0.2vh 0.4vw' }}
                          className={`shrink-0 text-[1.1vh] font-bold rounded border-2 ${
                            selectedSpell.level === 0
                              ? 'border-indigo-500 text-indigo-300'
                              : 'border-amber-500 text-amber-300'
                          }`}
                        >
                          {selectedSpell.level === 0 ? 'Заговор' : `${selectedSpell.level} уровень`}
                        </span>
                      </div>
                      <p className="text-[1.2vh] text-amber-100/50 italic">
                        {selectedSpell.nameEn}
                      </p>
                    </div>

                    {/* Характеристики */}
                    <div
                      style={{ padding: '0.8vh 0.8vw' }}
                      className="border-2 border-amber-600/40 bg-stone-800 rounded-lg"
                    >
                      <div className="grid grid-cols-2 gap-x-[1vw] gap-y-[0.4vh]">
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
                            ]
                              .filter(Boolean)
                              .join(', ') || '—',
                          ],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <span className="text-[1.1vh] text-amber-100/50 block">{label}</span>
                            <span className="text-[1.2vh] text-amber-100 font-bold">{value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Теги */}
                      <div className="flex flex-wrap gap-[0.3vw]">
                        {selectedSpell.isConcentration && (
                          <span
                            style={{ padding: '0.1vh 0.3vw' }}
                            className="text-[1vh] bg-blue-900/50 border-2 border-blue-600/60 text-blue-300 rounded"
                          >
                            Концентрация
                          </span>
                        )}
                        {selectedSpell.isRitual && (
                          <span
                            style={{ padding: '0.1vh 0.3vw' }}
                            className="text-[1vh] bg-green-900/50 border-2 border-green-600/60 text-green-300 rounded"
                          >
                            Ритуал
                          </span>
                        )}
                        {selectedSpell.isDamageSpell && selectedSpell.damage && (
                          <span
                            style={{ padding: '0.1vh 0.3vw' }}
                            className="text-[1vh] bg-red-900/50 border-2 border-red-600/60 text-red-300 rounded"
                          >
                            {selectedSpell.damage.dice}{' '}
                            {DAMAGE_TYPE_LABELS[selectedSpell.damage.type] ??
                              selectedSpell.damage.type}
                          </span>
                        )}
                      </div>

                      {/* Материальный компонент */}
                      {selectedSpell.components.material &&
                        selectedSpell.components.materialDescription && (
                          <p
                            style={{ marginTop: '0.5vh' }}
                            className="text-[1.1vh] text-amber-100/50 italic"
                          >
                            Материал: {selectedSpell.components.materialDescription}
                          </p>
                        )}
                    </div>

                    {/* Описание */}
                    <div style={{ marginTop: '1vh' }} className="flex-1">
                      <p className="text-[1.3vh] text-amber-100/80 leading-relaxed whitespace-pre-line">
                        {selectedSpell.description}
                      </p>
                      {selectedSpell.atHigherLevels && (
                        <div className="">
                          <p className="text-[1.6vh] text-amber-400/80 font-bold uppercase">
                            На высших уровнях:
                          </p>
                          <p className="text-[1.3vh] text-amber-100/60 leading-relaxed">
                            {selectedSpell.atHigherLevels}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* ── Кнопки добавления / удаления ── */}
                    <div className="flex flex-col gap-[0.5vh]">
                      <p className="text-[1.2vh] text-amber-100/50 uppercase">
                        {selectedSpell.level === 0 ? 'Заговоры:' : 'Добавить в:'}
                      </p>

                      {selectedSpell.level === 0 ? (
                        // Заговор
                        inCantrips ? (
                          <button
                            type="button"
                            onClick={() => handleRemove('cantrip')}
                            style={{ padding: '0.6vh 0' }}
                            className="w-full bg-red-900/60 hover:bg-red-800/80 border-2 border-red-600/60 text-red-300 rounded-lg text-[1.4vh] font-bold transition-colors"
                          >
                            ✕ Удалить из заговоров
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAdd('cantrip')}
                            style={{ padding: '0.6vh 0' }}
                            className="w-full bg-indigo-700 hover:bg-indigo-600 border-2 border-indigo-500 text-white rounded-lg text-[1.4vh] font-bold transition-colors"
                          >
                            + Заговоры
                          </button>
                        )
                      ) : (
                        // Обычное заклинание
                        <>
                          {inPrepared ? (
                            <button
                              type="button"
                              onClick={() => handleRemove('prepared')}
                              style={{ padding: '0.6vh 0' }}
                              className="w-full bg-red-900/60 hover:bg-red-800/80 border-2 border-red-600/60 text-red-300 rounded-lg text-[1.4vh] font-bold transition-colors"
                            >
                              ✕ Удалить из подготовленных
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAdd('prepared')}
                              disabled={inKnown}
                              style={{ padding: '0.6vh 0' }}
                              className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-amber-500 text-stone-900 rounded-lg text-[1.4vh] font-bold transition-colors"
                              title={inKnown ? 'Сначала удалите из известных' : ''}
                            >
                              + Подготовленные
                            </button>
                          )}

                          {inKnown ? (
                            <button
                              type="button"
                              onClick={() => handleRemove('known')}
                              style={{ padding: '0.6vh 0' }}
                              className="w-full bg-red-900/60 hover:bg-red-800/80 border-2 border-red-600/60 text-red-300 rounded-lg text-[1.4vh] font-bold transition-colors"
                            >
                              ✕ Удалить из известных
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAdd('known')}
                              disabled={inPrepared}
                              style={{ padding: '0.6vh 0' }}
                              className="w-full bg-stone-700 hover:bg-stone-600 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-amber-600/60 text-amber-100 rounded-lg text-[1.4vh] font-bold transition-colors"
                              title={inPrepared ? 'Сначала удалите из подготовленных' : ''}
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
