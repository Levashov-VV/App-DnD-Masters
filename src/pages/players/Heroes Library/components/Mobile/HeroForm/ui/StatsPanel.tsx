import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { HeroFormData } from '../../../../../../../features/heroes/schemas/heroSchema';
import {
  getAbilityModifier,
  formatModifier,
  getProficiencyBonus,
  DND_CONDITIONS,
  type Condition,
} from '../../../../../../../features/heroes/constants/dndData';

interface StatsPanelProps {
  register: UseFormRegister<HeroFormData>;
  watch: UseFormWatch<HeroFormData>;
  setValue: UseFormSetValue<HeroFormData>;
  exhaustionLevel: number;
  conditions: string[];
}

export function StatsPanel({
  register,
  watch,
  setValue,
  exhaustionLevel: formExhaustionLevel,
  conditions,
}: StatsPanelProps) {
  const [isConditionsOpen, setIsConditionsOpen] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  const activeConditions = new Set(conditions);

  const dexterity = watch('abilityScores.dexterity') || 10;
  const wisdom = watch('abilityScores.wisdom') || 10;
  const level = watch('level') || 1;
  const skills = watch('skills') || [];

  const dexModifier = getAbilityModifier(dexterity);
  const wisModifier = getAbilityModifier(wisdom);
  const proficiencyBonus = getProficiencyBonus(level);
  const hasPerceptionProficiency = skills.includes('Внимательность');
  const initiative = dexModifier;
  const passivePerception = 10 + wisModifier + (hasPerceptionProficiency ? proficiencyBonus : 0);

  const toggleCondition = (conditionName: string) => {
    const newConditions = activeConditions.has(conditionName)
      ? conditions.filter((c) => c !== conditionName)
      : [...conditions, conditionName];
    setValue('conditions', newConditions, { shouldDirty: true });
  };

  const clearAllConditions = () => {
    setValue('conditions', [], { shouldDirty: true });
    setValue('exhaustionLevel', 0, { shouldDirty: true });
  };

  const handleExhaustionClick = (lvl: number) => {
    const newLevel = formExhaustionLevel === lvl ? 0 : lvl;
    setValue('exhaustionLevel', newLevel, { shouldDirty: true });
  };

  const openConditionDetails = (condition: Condition, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCondition(condition);
  };

  const applyConditionAndClose = (conditionName: string) => {
    toggleCondition(conditionName);
    setSelectedCondition(null);
    setIsConditionsOpen(false);
  };

  const goBackToList = () => {
    setSelectedCondition(null);
  };

  const handleConditionClick = (
    condition: Condition,
    action: 'toggle' | 'details',
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (action === 'toggle') {
      toggleCondition(condition.nameEn);
    } else {
      openConditionDetails(condition, e);
    }
  };

  return (
    <>
      <input type="hidden" {...register('exhaustionLevel', { valueAsNumber: true })} />

      <div className="flex flex-col gap-[1vh]">
        <div className="grid grid-cols-3 gap-[2vw]">
          {/* Инициатива */}
          <div className="flex flex-col items-center bg-stone-800 border-2 border-amber-600 rounded-lg">
            <label className="text-[1.4vh] text-amber-100 uppercase">Инициатива</label>
            <div className="text-[3vh] font-bold text-amber-100">
              {formatModifier(initiative)}
            </div>
          </div>

          {/* Скорость */}
          <div className="flex flex-col items-center bg-stone-800 border-2 border-amber-600 rounded-lg">
            <label className="text-[1.4vh] text-amber-100 uppercase">Скорость</label>
            <input
              type="number"
              min={0}
              {...register('speed', { valueAsNumber: true })}
              className="w-[6vw] text-[2.5vh] font-bold text-center bg-transparent border-amber-600 rounded text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Пассивное восприятие */}
          <div className="flex flex-col items-center bg-stone-800 border-2 border-amber-600 rounded-lg">
            <label className="text-[1.4vh] text-amber-100 uppercase text-center">
              П. Восприятие
            </label>
            <div className="text-[3vh] font-bold text-amber-100">{passivePerception}</div>
          </div>

          {/* Истощение */}
          <div
            style={{ padding: '0.5vh' }}
            className="flex flex-col items-center justify-center bg-stone-800 border-2 border-amber-600 rounded-lg"
          >
            <label className="text-[1.4vh] text-amber-100 uppercase text-center">
              Истощение
            </label>
            <div className="flex flex-wrap justify-center gap-x-[3vw]">
              {[1, 2, 3, 4, 5, 6].map((lvl) => {
                const isActive = lvl <= formExhaustionLevel;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleExhaustionClick(lvl)}
                    className="relative bottom-[0.5vh] flex flex-col items-center cursor-pointer group"
                    title={`Уровень ${lvl}`}
                  >
                    <span
                      className={`text-[1.2vh] font-bold transition-colors ${
                        isActive ? 'text-amber-100' : 'text-amber-400'
                      }`}
                    >
                      {lvl}
                    </span>
                    <div
                      className={`w-[2.5vh] h-[2.5vh] border-2 rounded transition-all hover:scale-110 flex items-center justify-center ${
                        isActive ? 'border-amber-500 bg-amber-600' : 'border-amber-600 bg-stone-700'
                      }`}
                    >
                      {isActive && (
                        <svg
                          className="w-[1.5vh] h-[1.5vh] text-amber-100"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            {formExhaustionLevel > 0 && (
              <p className="text-[1.4vh] text-amber-100">Уровень: {formExhaustionLevel}</p>
            )}
          </div>

          {/* Состояния */}
          <button
            type="button"
            onClick={() => setIsConditionsOpen(true)}
            className="flex flex-col items-center justify-center bg-stone-800 border-2 border-amber-600 rounded-lg hover:bg-stone-700 transition-colors relative"
          >
            <label className="text-[1.4vh] text-amber-100 uppercase pointer-events-none">
              Состояния
            </label>
            <div className="text-[2vh] font-bold text-amber-100 pointer-events-none">
              {activeConditions.size > 0 ? `Активно: ${activeConditions.size}` : 'Нет'}
            </div>
            {activeConditions.size > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-[1vh] -right-[1vh] bg-amber-600 text-stone-800 rounded-full w-[3vh] h-[3vh] flex items-center justify-center text-[1.6vh] font-bold"
              >
                {activeConditions.size}
              </motion.div>
            )}
          </button>
          <input type="hidden" {...register('conditions')} />

          {/* Очистить все состояния */}
          {activeConditions.size > 0 && (
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              type="button"
              onClick={clearAllConditions}
              className="border-2 border-amber-600 bg-stone-800 hover:bg-stone-700 text-amber-100 font-bold text-[1.6vh] uppercase rounded-lg transition-colors flex items-center justify-center gap-[1vw]"
            >
              Полное излечение
            </motion.button>
          )}
        </div>
      </div>
      <AnimatePresence>
        {isConditionsOpen && !selectedCondition && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-[100]"
              onClick={() => setIsConditionsOpen(false)}
            />
            <motion.div
              key="conditions-list-mobile"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              style={{padding: '15vh 1vw 0'}}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 h-screen bg-stone-900 border-t-4 border-amber-600 shadow-2xl z-[101] flex flex-col"
            >
              {/* header */}
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-[3vh] font-bold text-amber-100 uppercase">
                    СОСТОЯНИЯ ПЕРСОНАЖА
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsConditionsOpen(false)}
                    className="w-[4vh] h-[4vh] bg-amber-600 hover:bg-amber-500 rounded-full flex items-center justify-center transition-colors"
                  >
                    <svg
                      className="w-[2.5vh] h-[2.5vh] text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <p className="text-[2vh] text-amber-400">
                  {activeConditions.size > 0
                    ? `Активных состояний: ${activeConditions.size}`
                    : 'Нет активных состояний'}
                </p>
              </div>

              {/* list */}
              <div className="relative top-[5vh] overflow-y-auto flex-1">
                <div className="flex flex-col gap-[2vh]">
                  {DND_CONDITIONS.map((condition, index) => {
                    const isActive = activeConditions.has(condition.nameEn);
                    return (
                      <motion.div
                        key={condition.nameEn}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={`border-2 rounded-lg transition-all ${
                          isActive
                            ? 'border-amber-600 bg-amber-900/40'
                            : 'border-amber-600 bg-stone-800'
                        }`}
                      >
                        <div className="flex flex-col gap-[1vh]">
                          <div className="flex flex-row items-center justify-between gap-[2vw]">
                            <h3 className="text-[2.2vh] font-bold text-amber-100 uppercase">
                              {condition.name}
                            </h3>
                            <div className="flex  items-center gap-[2vw]">
                              <button
                                type="button"
                                onClick={(e) =>
                                  handleConditionClick(condition, 'toggle', e)
                                }
                                className={`w-[25vw] h-[4vh] rounded font-bold text-[1.4vh] uppercase transition-colors ${
                                  isActive
                                    ? 'bg-amber-500 hover:bg-amber-400 text-stone-900'
                                    : 'bg-amber-600 hover:bg-amber-500 text-stone-900'
                                }`}
                              >
                                {isActive ? 'Снять' : 'Применить'}
                              </button>
                              <button
                                type="button"
                                onClick={(e) =>
                                  handleConditionClick(condition, 'details', e)
                                }
                                style={{padding: '1vh 1vw'}}
                                className="w-[25vw] h-[4vh] bg-stone-700 hover:bg-stone-600 text-amber-100 rounded font-bold text-[1.4vh] uppercase transition-colors"
                              >
                                Подробнее →
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedCondition && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-[102]"
              onClick={goBackToList}
            />
            <motion.div
              key="condition-details-mobile"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ paddingTop: '15vh'}}
              className="fixed inset-x-0 bottom-0 h-screen bg-stone-900 border-t-4 border-amber-600 shadow-2xl z-[103] flex flex-col"
            >

              {/* back */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={goBackToList}
                  className="flex items-center gap-[2vw] text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <svg
                    className="w-[2.5vh] h-[2.5vh]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="text-[2vh] font-bold uppercase">Назад к списку</span>
                </button>
              </div>

              <div>
                <h2 className="text-[3vh] text-center font-bold text-amber-100 uppercase">
                  {selectedCondition.name}
                </h2>
              </div>

              <div style={{paddingLeft: '2vw'}} className="flex-1 overflow-y-auto">
                <div className="flex flex-col gap-[2vh]">
                  <div>
                    {selectedCondition.description.split('\n').map((line, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-[2vw]"
                      >
                        <span className="text-amber-500 text-[2vh]">•</span>
                        <p className="text-[1.8vh] text-amber-200 leading-relaxed flex-1">
                          {line.replace('• ', '')}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <div>
                    <h4 className="text-[2vh] font-bold text-amber-100 uppercase">
                      ТЕКУЩИЙ СТАТУС:
                    </h4>
                    <div
                      className={`flex items-center gap-[2vw] text-[2vh] font-bold ${
                        activeConditions.has(selectedCondition.nameEn)
                          ? 'text-amber-500'
                          : 'text-gray-400'
                      }`}
                    >
                      {activeConditions.has(selectedCondition.nameEn) ? (
                        <>
                          <svg
                            className="w-[2.5vh] h-[2.5vh]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          АКТИВНО
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-[2.5vh] h-[2.5vh]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          НЕ АКТИВНО
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-[4vw] pb-[2vh]">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => applyConditionAndClose(selectedCondition.nameEn)}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold text-[2vh] uppercase transition-colors shadow-lg flex items-center justify-center gap-[2vw] py-[1.2vh]"
                >
                  <svg
                    className="w-[2.5vh] h-[2.5vh]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {activeConditions.has(selectedCondition.nameEn)
                    ? 'СНЯТЬ СОСТОЯНИЕ'
                    : 'ПРИМЕНИТЬ СОСТОЯНИЕ'}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
