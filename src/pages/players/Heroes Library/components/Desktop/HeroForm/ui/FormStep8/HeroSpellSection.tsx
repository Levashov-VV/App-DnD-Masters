import type { UseFormSetValue, UseFormReturn } from 'react-hook-form';
import { useState, useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import type {
  HeroFormData,
  HeroSpell,
} from '../../../../../../../../features/heroes/schemas/heroSchema';
import { HeroSpellCard } from './HeroSpellCard';
import { SpellInfoModal } from './SpellInfoModal';

interface HeroSpellSectionProps {
  control: UseFormReturn<HeroFormData>['control'];
  setValue: UseFormSetValue<HeroFormData>;
  onOpenCantripsLibrary: () => void;
  onOpenSpellsLibrary: () => void;
  onOpenFullLibrary: () => void;
}

export function HeroSpellSection({
  control,
  setValue,
  onOpenCantripsLibrary,
  onOpenSpellsLibrary,
  onOpenFullLibrary,
}: HeroSpellSectionProps) {
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
  const recommendedCount = useWatch({
    control,
    name: 'recommendedPreparedCount' as any,
    defaultValue: 0,
  }) as number;

  const [preparedLevelFilter, setPreparedLevelFilter] = useState<number | null>(null);
  const [knownLevelFilter, setKnownLevelFilter] = useState<number | null>(null);

  const [selectedSpellId, setSelectedSpellId] = useState<string | null>(null);

  const openInfoModal = useCallback((spellId: string) => {
    setSelectedSpellId(spellId);
  }, []);

  const closeInfoModal = useCallback(() => {
    setSelectedSpellId(null);
  }, []);

  const handleMoveUp = useCallback(
    (spell: HeroSpell) => {
      const newKnown = knownSpells.filter((s) => s.id !== spell.id);
      const newPrepared = [...preparedSpells, spell];
      setValue('knownSpells' as any, newKnown, { shouldDirty: true });
      setValue('preparedSpells' as any, newPrepared, { shouldDirty: true });
    },
    [knownSpells, preparedSpells, setValue]
  );

  const handleMoveDown = useCallback(
    (spell: HeroSpell) => {
      const newPrepared = preparedSpells.filter((s) => s.id !== spell.id);
      const newKnown = [...knownSpells, spell];
      setValue('preparedSpells' as any, newPrepared, { shouldDirty: true });
      setValue('knownSpells' as any, newKnown, { shouldDirty: true });
    },
    [preparedSpells, knownSpells, setValue]
  );

  const handleRemoveCantrip = useCallback(
    (spell: HeroSpell) => {
      setValue(
        'cantrips' as any,
        cantrips.filter((s) => s.id !== spell.id),
        { shouldDirty: true }
      );
    },
    [cantrips, setValue]
  );

  const handleRemovePrepared = useCallback(
    (spell: HeroSpell) => {
      setValue(
        'preparedSpells' as any,
        preparedSpells.filter((s) => s.id !== spell.id),
        { shouldDirty: true }
      );
    },
    [preparedSpells, setValue]
  );

  const handleRemoveKnown = useCallback(
    (spell: HeroSpell) => {
      setValue(
        'knownSpells' as any,
        knownSpells.filter((s) => s.id !== spell.id),
        { shouldDirty: true }
      );
    },
    [knownSpells, setValue]
  );

  const sortedPreparedSpells = useMemo(() => {
    return preparedSpells.sort((a, b) => a.level - b.level);
  }, [preparedSpells]);

  const sortedKnownSpells = useMemo(() => {
    return knownSpells.sort((a, b) => a.level - b.level);
  }, [knownSpells]);

  const filteredPreparedSpells = useMemo(() => {
    if (preparedLevelFilter === null) return preparedSpells;
    return preparedSpells.filter((spell) => spell.level === preparedLevelFilter);
  }, [preparedSpells, preparedLevelFilter]);

  const filteredKnownSpells = useMemo(() => {
    if (knownLevelFilter === null) return knownSpells;
    return knownSpells.filter((spell) => spell.level === knownLevelFilter);
  }, [knownSpells, knownLevelFilter]);

  return (
    <div className="flex flex-col gap-[1.5vh]">
      {/* Кнопка полной библиотеки */}
      <button
        type="button"
        onClick={onOpenFullLibrary}
        style={{ padding: '0.6vh 1vw' }}
        className="self-start flex items-center gap-[0.5vw] bg-stone-800 hover:bg-stone-700 border-2 border-amber-600 text-amber-100 rounded-lg text-[1.6vh] font-bold transition-colors uppercase"
      >
        <span>Библиотека заклинаний</span>
        <span className="text-[1.2vh] text-amber-400/70 font-normal">
          ({cantrips.length + preparedSpells.length + knownSpells.length} добавлено)
        </span>
      </button>

      {/* Секция 1: Заговоры */}
      <div
        style={{ padding: '1vh 0.8vw' }}
        className="border-2 border-indigo-500/70 bg-stone-800 rounded-lg"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-[1.6vh] font-bold text-indigo-300 uppercase">Заговоры</h3>
          <span className="text-[1.3vh] text-amber-100/60">
            Количество: <span className="text-indigo-300 font-bold">{cantrips.length}</span>
          </span>
        </div>

        {cantrips.length === 0 ? (
          <button
            type="button"
            onClick={onOpenCantripsLibrary}
            style={{ padding: '0.8vh 0' }}
            className="w-full border-2 border-dashed border-indigo-600/40 rounded-lg text-[1.3vh] text-indigo-400/60 hover:text-indigo-300 hover:border-indigo-500/60 transition-colors"
          >
            + Добавить заговор
          </button>
        ) : (
          <div className="grid grid-cols-3 gap-[0.5vw]">
            {cantrips.map((spell) => (
              <HeroSpellCard
                key={spell.id}
                spell={spell}
                section="cantrip"
                onRemove={handleRemoveCantrip}
                onInfo={openInfoModal}
              />
            ))}
            <button
              type="button"
              onClick={onOpenCantripsLibrary}
              style={{ padding: '0.6vh 0' }}
              className="border-2 border-dashed border-indigo-600/30 rounded-lg text-[1.2vh] text-indigo-400/50 hover:text-indigo-300 hover:border-indigo-500/50 transition-colors"
            >
              + Добавить
            </button>
          </div>
        )}
      </div>

      {/* Секция 2: Подготовленные заклинания - отсортировано + фильтр */}
      <div
        style={{ padding: '1vh 0.8vw' }}
        className="border-2 border-amber-500/70 bg-stone-800 rounded-lg"
      >
        <div className="flex flex-col gap-[0.4vh]">
          <div className="flex justify-between items-center">
            <h3 className="text-[1.6vh] font-bold text-amber-300 uppercase">
              Подготовленные заклинания
            </h3>
            <div className="flex items-center gap-[0.8vw]">
              {recommendedCount > 0 ? (
                <span className="text-[1.3vh] text-amber-100/60">
                  Рекомендовано:{' '}
                  <span
                    className={`font-bold ${
                      sortedPreparedSpells.length > recommendedCount
                        ? 'text-red-400'
                        : 'text-amber-300'
                    }`}
                  >
                    {sortedPreparedSpells.length}/{recommendedCount}
                  </span>
                </span>
              ) : (
                <span className="text-[1.3vh] text-amber-100/60">
                  Количество:{' '}
                  <span className="text-amber-300 font-bold">{sortedPreparedSpells.length}</span>
                </span>
              )}
            </div>
          </div>

          {/* Фильтр по уровням */}
          <div style={{ padding: '0.8vh 0' }} className="flex flex-wrap gap-[0.3vw]">
            {[null, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
              <button
                key={level ?? 'all'}
                type="button"
                onClick={() => setPreparedLevelFilter(level)}
                style={{ padding: '0.2vh 0.4vw' }}
                className={`text-[1.1vh] font-bold rounded border-2 transition-colors ${
                  preparedLevelFilter === level
                    ? 'bg-amber-600 border-amber-500 text-stone-900'
                    : 'bg-stone-900 border-amber-600/40 text-amber-100/60 hover:border-amber-500'
                }`}
              >
                {level === null ? 'Все' : level}
              </button>
            ))}
          </div>
        </div>

        {filteredPreparedSpells.length === 0 ? (
          <button
            type="button"
            onClick={onOpenSpellsLibrary}
            style={{ padding: '0.8vh 0' }}
            className="w-full border-2 border-dashed border-amber-600/40 rounded-lg text-[1.3vh] text-amber-400/60 hover:text-amber-300 hover:border-amber-500/60 transition-colors"
          >
            + Добавить подготовленное заклинание
          </button>
        ) : (
          <div className="grid grid-cols-3 gap-[0.5vw]">
            {filteredPreparedSpells.map((spell) => (
              <HeroSpellCard
                key={spell.id}
                spell={spell}
                section="prepared"
                onMoveDown={handleMoveDown}
                onRemove={handleRemovePrepared}
                onInfo={openInfoModal}
              />
            ))}
            <button
              type="button"
              onClick={onOpenSpellsLibrary}
              style={{ padding: '0.6vh 0' }}
              className="border-2 border-dashed border-amber-600/30 rounded-lg text-[1.2vh] text-amber-400/50 hover:text-amber-300 hover:border-amber-500/50 transition-colors"
            >
              + Добавить
            </button>
          </div>
        )}
      </div>

      {/* Секция 3: Известные заклинания - отсортировано + фильтр */}
      <div
        style={{ padding: '1vh 0.8vw' }}
        className="border-2 border-amber-700/50 bg-stone-800 rounded-lg"
      >
        <div className="flex flex-col gap-[0.4vh]">
          <div className="flex justify-between items-center">
            <h3 className="text-[1.6vh] font-bold text-amber-100/70 uppercase">
              Известные заклинания
            </h3>
            <span className="text-[1.3vh] text-amber-100/60">
              Количество:{' '}
              <span className="text-amber-100/80 font-bold">{sortedKnownSpells.length}</span>
            </span>
          </div>

          {/* Фильтр по уровням */}
          <div style={{ padding: '0.8vh 0' }} className="flex flex-wrap gap-[0.3vw]">
            {[null, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
              <button
                key={level ?? 'all'}
                type="button"
                onClick={() => setKnownLevelFilter(level)}
                style={{ padding: '0.2vh 0.4vw' }}
                className={`text-[1.1vh] font-bold rounded border-2 transition-colors ${
                  knownLevelFilter === level
                    ? 'bg-amber-700 border-amber-600 text-stone-900'
                    : 'bg-stone-900 border-amber-700/40 text-amber-100/60 hover:border-amber-600'
                }`}
              >
                {level === null ? 'Все' : level}
              </button>
            ))}
          </div>
        </div>

        {filteredKnownSpells.length === 0 ? (
          <button
            type="button"
            onClick={onOpenSpellsLibrary}
            style={{ padding: '0.8vh 0' }}
            className="w-full border-2 border-dashed border-amber-700/30 rounded-lg text-[1.3vh] text-amber-400/50 hover:text-amber-300/70 hover:border-amber-600/50 transition-colors"
          >
            + Добавить известное заклинание
          </button>
        ) : (
          <div className="grid grid-cols-3 gap-[0.5vw]">
            {filteredKnownSpells.map((spell) => (
              <HeroSpellCard
                key={spell.id}
                spell={spell}
                section="known"
                onMoveUp={handleMoveUp}
                onRemove={handleRemoveKnown}
                onInfo={openInfoModal}
              />
            ))}
            <button
              type="button"
              onClick={onOpenSpellsLibrary}
              style={{ padding: '0.6vh 0' }}
              className="border-2 border-dashed border-amber-700/25 rounded-lg text-[1.2vh] text-amber-400/40 hover:text-amber-300/60 hover:border-amber-600/40 transition-colors"
            >
              + Добавить
            </button>
          </div>
        )}
      </div>

      {/* МОДАЛКА */}
      <SpellInfoModal
        isOpen={!!selectedSpellId}
        spellId={selectedSpellId}
        onClose={closeInfoModal}
      />
    </div>
  );
}
