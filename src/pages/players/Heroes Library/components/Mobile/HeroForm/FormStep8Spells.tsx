import { useState, useEffect } from 'react';
import type {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue,
  UseFormReturn,
} from 'react-hook-form';
import type { HeroFormData } from '../../../../../../features/heroes/schemas/heroSchema';
import { HeroSpellSection } from './ui/FormStep8/HeroSpellSection';
import { SpellLibraryModal } from './ui/FormStep8/SpellLibraryModal';

import {
  getAbilityModifier,
  formatModifier,
  getProficiencyBonus,
} from '../../../../../../features/heroes/constants/dndData';
import { getShortRestContext } from '../../../../../../shared/utils/shortRestUtils';
import { ShortRestModal } from './ui/FormStep8/ShortRestModal';

interface FormStep8SpellsProps {
  register: UseFormRegister<HeroFormData>;
  errors: FieldErrors<HeroFormData>;
  watch: UseFormWatch<HeroFormData>;
  setValue: UseFormSetValue<HeroFormData>;
  control: UseFormReturn<HeroFormData>['control'];
}

const SPELLCASTING_ABILITIES = [
  { value: 'none', label: '—' },
  { value: 'intelligence', label: 'Интеллект' },
  { value: 'wisdom', label: 'Мудрость' },
  { value: 'charisma', label: 'Харизма' },
] as const;

const SPELL_LEVEL_KEYS = [
  'level1',
  'level2',
  'level3',
  'level4',
  'level5',
  'level6',
  'level7',
  'level8',
  'level9',
] as const;

const SPELL_LEVEL_LABELS: Record<string, string> = {
  level1: 'Уровень 1',
  level2: 'Уровень 2',
  level3: 'Уровень 3',
  level4: 'Уровень 4',
  level5: 'Уровень 5',
  level6: 'Уровень 6',
  level7: 'Уровень 7',
  level8: 'Уровень 8',
  level9: 'Уровень 9',
};

function useSpellSlot(watch: UseFormWatch<HeroFormData>, key: string) {
  const max = watch(`spellSlots.${key}.max` as any) || 0;
  const used = watch(`spellSlots.${key}.used` as any) || 0;
  return { max, used };
}

export function FormStep8Spells({
  register,
  errors,
  watch,
  setValue,
  control,
}: FormStep8SpellsProps) {
  const level = watch('level') || 1;
  const proficiencyBonus = getProficiencyBonus(level);
  const abilityScores = watch('abilityScores');
  const spellcastingAbility = watch('spellcastingAbility') || 'none';
  const characterClass = watch('class') || '';
  const subclass = watch('subclass') || '';
  const arcaneRecoveryUsed = watch('restFlags.arcaneRecoveryUsed' as any) || false;
  const naturalRecoveryUsed = watch('restFlags.naturalRecoveryUsed' as any) || false;
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [libraryMode, setLibraryMode] = useState<'cantrips' | 'spells' | 'full'>('full');

  const slot1 = useSpellSlot(watch, 'level1');
  const slot2 = useSpellSlot(watch, 'level2');
  const slot3 = useSpellSlot(watch, 'level3');
  const slot4 = useSpellSlot(watch, 'level4');
  const slot5 = useSpellSlot(watch, 'level5');
  const slot6 = useSpellSlot(watch, 'level6');
  const slot7 = useSpellSlot(watch, 'level7');
  const slot8 = useSpellSlot(watch, 'level8');
  const slot9 = useSpellSlot(watch, 'level9');

  const slots: Record<string, { max: number; used: number }> = {
    level1: slot1,
    level2: slot2,
    level3: slot3,
    level4: slot4,
    level5: slot5,
    level6: slot6,
    level7: slot7,
    level8: slot8,
    level9: slot9,
  };

  const [showRestConfirm, setShowRestConfirm] = useState(false);
  const [showShortRestModal, setShowShortRestModal] = useState(false);

  const spellcastingModifier = getAbilityModifier(
    spellcastingAbility !== 'none' && abilityScores
      ? abilityScores[spellcastingAbility as keyof typeof abilityScores] || 10
      : 10
  );

  const spellSaveDC = 8 + spellcastingModifier + proficiencyBonus;
  const spellAttackBonus = spellcastingModifier + proficiencyBonus;

  const displayTotals = (() => {
    let totalMax = 0;
    let totalCurrent = 0;
    SPELL_LEVEL_KEYS.forEach((key) => {
      const s = slots[key];
      totalMax += s.max;
      totalCurrent += s.used === 0 ? s.max : s.max - s.used;
    });
    return { current: totalCurrent, max: totalMax };
  })();

  useEffect(() => {
    setValue('totalSpellSlots.current' as any, displayTotals.current, { shouldDirty: true });
    setValue('totalSpellSlots.max' as any, displayTotals.max, { shouldDirty: true });
  }, [displayTotals.current, displayTotals.max, setValue]);

  const allSlotsFull = ['level1', 'level2', 'level3', 'level4', 'level5'].every((key) => {
    return slots[key].used === 0;
  });

  const shortRestContext = getShortRestContext(
    characterClass,
    subclass,
    level,
    slots,
    arcaneRecoveryUsed,
    naturalRecoveryUsed
  );

  const toggleSlot = (levelKey: string, index: number) => {
    const slot = slots[levelKey];
    if (!slot) return;
    const realIndex = slot.max - 1 - index;
    const newUsed = realIndex < slot.used ? slot.used - 1 : realIndex + 1;
    setValue(`spellSlots.${levelKey}.used` as any, newUsed, { shouldDirty: true });
  };

  const handleLongRest = () => {
    SPELL_LEVEL_KEYS.forEach((key) => {
      setValue(`spellSlots.${key}.used` as any, 0, { shouldDirty: true });
    });
    setValue('restFlags.arcaneRecoveryUsed' as any, false, { shouldDirty: true });
    setValue('restFlags.naturalRecoveryUsed' as any, false, { shouldDirty: true });
    setShowRestConfirm(false);
  };

  const handleShortRestConfirm = (selected: Record<string, number>) => {
    if (shortRestContext.type === 'warlock-auto') {
      SPELL_LEVEL_KEYS.forEach((key) => {
        setValue(`spellSlots.${key}.used` as any, 0, { shouldDirty: true });
      });
    } else if (Object.keys(selected).length > 0) {
      Object.entries(selected).forEach(([key, count]) => {
        const slot = slots[key];
        if (!slot || count <= 0) return;
        const newUsed = Math.max(0, slot.used - count);
        setValue(`spellSlots.${key}.used` as any, newUsed, { shouldDirty: true });
      });
      if (shortRestContext.type === 'wizard-manual') {
        setValue('restFlags.arcaneRecoveryUsed' as any, true, { shouldDirty: true });
      }
      if (shortRestContext.type === 'druid-land-manual') {
        setValue('restFlags.naturalRecoveryUsed' as any, true, { shouldDirty: true });
      }
    }
    setShowShortRestModal(false);
  };

  const openCantripsLibrary = () => {
    setLibraryMode('cantrips');
    setIsLibraryOpen(true);
  };

  const openSpellsLibrary = () => {
    setLibraryMode('spells');
    setIsLibraryOpen(true);
  };

  const openFullLibrary = () => {
    setLibraryMode('full');
    setIsLibraryOpen(true);
  };

  const closeLibrary = () => {
    setIsLibraryOpen(false);
  };

  return (
    <div className="relative left-[0.5vw] top-[1vh] w-[98vw] flex flex-col gap-[1.5vh] uppercase max-h-[79vh] overflow-y-auto">
      <h2 className="text-[2.5vh] font-bold text-amber-100 uppercase">Заклинания</h2>

      <div className="flex flex-col gap-[2vw]">
        {/* Подсекция 1: Магические характеристики */}
        <div
          style={{ padding: '1vh 1vw' }}
          className="w-[98vw] border-2 border-amber-600 bg-stone-800 rounded-lg"
        >
          <div className="grid grid-cols-1 gap-[1vh]">
            <div className="flex flex-col gap-[0.2vh]">
              <label className="text-[2vh] text-amber-100/80">Выбор характеристики</label>
              <select
                {...register('spellcastingAbility')}
                className="w-full h-[3vh] bg-stone-900 border-2 border-amber-600 rounded-lg text-[1.8vh] text-amber-100 focus:outline-none focus:border-amber-400"
              >
                {SPELLCASTING_ABILITIES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.spellcastingAbility && (
                <p className="text-red-400 text-[1.2vh]">{errors.spellcastingAbility.message}</p>
              )}
            </div>

            <div className="flex flex-row justify-between items-center">
              <label className="text-[2vh] text-amber-100/80">Заклинательный модификатор</label>
              <div
                style={{ padding: '0.2vh 0.5vw' }}
                className="flex flex-col items-center justify-center border-2 border-amber-600 bg-stone-900 rounded-lg"
              >
                <div className="w-[8vw] text-[2.5vh] text-center font-bold text-amber-100">
                  {formatModifier(spellcastingModifier)}
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-between items-center">
              <label className="text-[2vh] text-amber-100/80">Сложность спасброска</label>
              <div
                style={{ padding: '0.2vh 0.5vw' }}
                className="flex flex-col items-center justify-center border-2 border-amber-600 bg-stone-900 rounded-lg"
              >
                <div className="w-[8vw] text-[2.5vh] text-center font-bold text-amber-100">
                  {spellSaveDC}
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-between items-center">
              <label className="text-[2vh] text-amber-100/80">Бонус атаки заклинанием</label>
              <div className="flex flex-col items-center justify-center border-2 border-amber-600 bg-stone-900 rounded-lg">
                <div
                  style={{ padding: '0.2vh 0.5vw' }}
                  className="w-[9vw] text-[2.5vh] text-center font-bold text-amber-100"
                >
                  {formatModifier(spellAttackBonus)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Подсекция 2: Ячейки заклинаний */}
        <div
          style={{ padding: '1vh 0.5vw' }}
          className=" border-2 border-amber-600 bg-stone-800 rounded-lg"
        >
          <div>
            <h3 style={{ padding: '0 0.5vw' }} className="text-[2vh] font-bold text-amber-100">
              Ячейки заклинаний
            </h3>
          </div>
          <div>
            <div style={{ marginBottom: '1vh' }} className="flex flex-col">
              <div className="flex items-center gap-[1vw]">
                <div className="flex items-center gap-[0.3vw]">
                  <label className="text-[1.4vh] text-amber-100/80">Актуальное:</label>
                  <div
                    style={{ margin: '0 2vw' }}
                    className="w-[12vw] h-[2.5vh] bg-stone-900 border-2 border-amber-600/50 rounded flex items-center justify-center text-[1.6vh] font-bold text-amber-400"
                  >
                    {displayTotals.current}
                  </div>
                </div>

                <div className="flex items-center gap-[0.3vw]">
                  <label className="text-[1.4vh] text-amber-100/80">Максимум:</label>
                  <div
                    style={{ margin: '0 2vw' }}
                    className="w-[12vw] h-[2.5vh] bg-stone-900 border-2 border-amber-600/50 rounded flex items-center justify-center text-[1.6vh] font-bold text-amber-100"
                  >
                    {displayTotals.max}
                  </div>
                </div>
              </div>
              <div style={{ margin: '1vh 0' }} className="flex flex-row gap-[5vw]">
                <button
                  type="button"
                  onClick={() => setShowRestConfirm(true)}
                  style={{ padding: '0.2vh 0.5vw' }}
                  className="w-[30vw] h-[3vh] bg-green-600 hover:bg-green-500 border-2 border-green-600 text-stone-900 rounded-lg text-[1.4vh] font-bold transition-colors"
                >
                  Долгий отдых
                </button>

                <button
                  type="button"
                  onClick={() => setShowShortRestModal(true)}
                  style={{ padding: '0.2vh 0.5vw' }}
                  className="w-[30vw] h-[3vh] bg-indigo-700 hover:bg-blue-600 border-2 border-blue-700 text-white rounded-lg text-[1.4vh] font-bold transition-colors"
                >
                  Короткий отдых
                </button>
              </div>
            </div>
          </div>

          {/* Ячейки */}
          <div className="grid grid-cols-3 gap-[0.8vw]">
            {SPELL_LEVEL_KEYS.map((key) => {
              const slot = slots[key];
              const available = slot.max - slot.used;

              return (
                <div
                  key={key}
                  style={{ padding: '0.5vh 0.5vw' }}
                  className="border-2 border-amber-600 bg-stone-900 rounded-lg"
                >
                  <div className="flex flex-col">
                    <span className="text-[1.4vh] font-bold text-amber-100">
                      {SPELL_LEVEL_LABELS[key]}
                    </span>
                    <div className="text-[1.4vh] text-amber-100/80">
                      Доступно:{' '}
                      <span className="font-bold text-amber-400">
                        {available}/{slot.max}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-[0.3vw]">
                    <label className="text-[1.4vh] text-amber-100/80">Максимум:</label>
                    <input
                      type="number"
                      min={0}
                      max={30}
                      {...register(`spellSlots.${key}.max` as any, {
                        valueAsNumber: true,
                        onChange: (e) => {
                          const newMax = parseInt(e.target.value) || 0;
                          if (slot.used > newMax) {
                            setValue(`spellSlots.${key}.used` as any, newMax, {
                              shouldDirty: true,
                            });
                          }
                        },
                      })}
                      className="w-[10vw] h-[2vh] bg-stone-800 border-2 border-amber-600 rounded text-center text-[1.4vh] font-bold text-amber-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex flex-wrap gap-[0.3vw] max-h-[7vh] overflow-y-auto overflow-x-hidden">
                    {Array.from({ length: slot.max }).map((_, index) => {
                      const realIndex = slot.max - 1 - index;
                      const isAvailable = realIndex >= slot.used;
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => toggleSlot(key, index)}
                          title={
                            isAvailable
                              ? 'Ячейка доступна — нажмите чтобы использовать'
                              : 'Ячейка использована — нажмите чтобы восстановить'
                          }
                          className={`w-[2.2vh] h-[2.2vh] rounded-full border-2 transition-all flex-shrink-0 ${
                            isAvailable
                              ? 'bg-amber-500 border-amber-400 shadow-[0_0_4px_rgba(251,191,36,0.5)]'
                              : 'bg-stone-900 border-amber-600'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    disabled={available === 0}
                    onClick={() => {
                      const newUsed = slot.used + 1;
                      setValue(`spellSlots.${key}.used` as any, newUsed, { shouldDirty: true });
                    }}
                    title={available === 0 ? 'Нет доступных ячеек' : 'Использовать ячейку'}
                    style={{ padding: '0.2vh 0' }}
                    className="w-full bg-amber-600 hover:bg-amber-500/80 disabled:opacity-30 disabled:cursor-not-allowed rounded text-[1.2vh] font-bold text-stone-900 transition-colors"
                  >
                    Использовать
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Долгий отдых */}
      {showRestConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div
            style={{ padding: '2vh 1.5vw' }}
            className="bg-stone-800 border-4 border-amber-600 rounded-xl w-[80vw]"
          >
            <h3 className="text-[2.5vh] font-bold text-amber-100">Подтверждение долгого отдыха</h3>
            <p className="text-[1.8vh] text-amber-100/80">
              Вы уверены, что хотите восстановить все ячейки заклинаний?
            </p>
            <div className="flex gap-[1vw] justify-end">
              <button
                type="button"
                onClick={() => setShowRestConfirm(false)}
                style={{ padding: '0.4vh 0.8vw' }}
                className="bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-[1.6vh] font-bold transition-colors"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleLongRest}
                style={{ padding: '0.4vh 0.8vw' }}
                className="bg-green-600 hover:bg-green-500 text-stone-900 rounded-lg text-[1.6vh] font-bold transition-colors"
              >
                Восстановить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Короткий отдых */}
      {showShortRestModal && (
        <ShortRestModal
          context={shortRestContext}
          allSlotsFull={allSlotsFull}
          onConfirm={handleShortRestConfirm}
          onCancel={() => setShowShortRestModal(false)}
        />
      )}

      <HeroSpellSection
        control={control}
        setValue={setValue}
        onOpenCantripsLibrary={openCantripsLibrary}
        onOpenSpellsLibrary={openSpellsLibrary}
        onOpenFullLibrary={openFullLibrary}
      />

      <SpellLibraryModal
        isOpen={isLibraryOpen}
        onClose={closeLibrary}
        characterClass={characterClass}
        control={control}
        setValue={setValue}
        mode={libraryMode}
      />
    </div>
  );
}
