import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  hasSubclasses,
  getSubclassesForClass,
} from '../../../../../../../../features/heroes/constants/dndData';
import type { ClassEntry } from './ClassModal';

interface SubclassManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: ClassEntry[];
  totalLevel: number;
  onChangeLevel: (className: string, level: number) => boolean;
  onChangeSubclass: (className: string, subclass: string) => void;
}

export function SubClassModal({
  isOpen,
  onClose,
  classes,
  totalLevel,
  onChangeLevel,
  onChangeSubclass,
}: SubclassManagerModalProps) {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [levelError, setLevelError] = useState<string | null>(null);
  const [levelInputText, setLevelInputText] = useState<string>('');

  const activeEntry = classes.find((c) => c.className === selectedClass);

  const distributedLevels = classes.reduce((sum, c) => sum + (c.level || 0), 0);
  const remainingLevels = totalLevel - distributedLevels;

  const goBack = () => {
    setSelectedClass(null);
    setLevelError(null);
  };

  const openClass = (className: string) => {
    setSelectedClass(className);
    const entry = classes.find((c) => c.className === className);
    setLevelInputText(String(entry?.level ?? 1));
    setLevelError(null);
  };

  const handleModalClose = () => {
    setSelectedClass(null);
    setLevelError(null);
    onClose();
  };

  const handleLevelInputChange = (rawValue: string) => {
    setLevelInputText(rawValue);
    setLevelError(null);

    if (rawValue === '') return;

    const parsed = parseInt(rawValue, 10);
    if (isNaN(parsed) || !activeEntry) return;

    const success = onChangeLevel(activeEntry.className, parsed);
    if (!success) {
      const otherSum = distributedLevels - (activeEntry.level || 0);
      const maxAllowed = totalLevel - otherSum;
      setLevelError(
        `Максимум для этого класса сейчас: ${maxAllowed} (общий уровень персонажа — ${totalLevel})`
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && !selectedClass && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-100"
            onClick={handleModalClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[40vw] bg-stone-900 border-l-4 border-amber-600 shadow-2xl z-101 flex flex-col"
          >
            <div>
              <div className="relative left-[0.5vw] flex items-center justify-between">
                <h2 className="text-[3vh] font-bold text-amber-100 uppercase">
                  Уровни и подклассы
                </h2>
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="relative top-[0.5vh] right-[1vw] w-[4vh] h-[4vh] bg-amber-600 hover:bg-amber-500 rounded-full flex items-center justify-center transition-colors"
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
              <p className="relative left-[0.5vw] text-[2vh] text-amber-400">
                Общий уровень: {totalLevel} · Распределено: {distributedLevels} ·{' '}
                <span className={remainingLevels === 0 ? 'text-green-400' : 'text-amber-300'}>
                  Осталось: {remainingLevels}
                </span>
              </p>
            </div>

            <div className="relative left-[0.5vw] w-[38vw] flex-1 overflow-y-auto">
              {classes.length === 0 ? (
                <p className="text-[1.8vh] text-amber-100/60">
                  Сначала выберите классы в предыдущем окне.
                </p>
              ) : (
                <div className="flex flex-col gap-[2vh]">
                  {classes.map((entry, index) => (
                    <motion.div
                      key={entry.className}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-2 border-amber-600 bg-stone-800 rounded-lg"
                    >
                      <div className="flex flex-row items-center justify-between relative right-[1vw]">
                        <div className="relative left-[2vw]">
                          <h3 className="text-[2.2vh] font-bold text-amber-100 uppercase">
                            {entry.className}
                          </h3>
                          <p className="text-[1.4vh] text-amber-400">
                            Уровень {entry.level}
                            {entry.subclass ? ` · ${entry.subclass}` : ' · подкласс не выбран'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => openClass(entry.className)}
                          className="w-[8vw] bg-amber-600 hover:bg-amber-500 text-stone-900 rounded font-bold text-[1.6vh] uppercase transition-colors"
                        >
                          Настроить →
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}

      {activeEntry && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-102"
            onClick={goBack}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[40vw] bg-stone-900 border-l-4 border-amber-600 shadow-2xl z-103 flex flex-col"
          >
            <div className="flex items-start justify-between">
              <button
                type="button"
                onClick={goBack}
                className="relative top-[0.5vh] flex items-center gap-[1vw] text-amber-400 hover:text-amber-300 transition-colors"
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
                {activeEntry.className}
              </h2>
            </div>

            <div className="flex-1">
              <div className="relative left-[0.5vw] flex flex-col gap-[3vh]">
                <div>
                  <label className="text-[1.8vh] font-bold text-amber-100 uppercase block">
                    Уровень в классе
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={levelInputText}
                    onChange={(e) => handleLevelInputChange(e.target.value)}
                    className={`w-[10vw] h-[5vh] bg-stone-800 border-2 rounded-lg text-center text-[2.5vh] font-bold text-amber-100 focus:outline-none ${
                      levelError ? 'border-red-500' : 'border-amber-600 focus:border-amber-400'
                    }`}
                  />
                  {levelError && (
                    <p className="text-[1.4vh] text-red-400 mt-[0.5vh]">{levelError}</p>
                  )}
                </div>

                {hasSubclasses(activeEntry.className) ? (
                  <div>
                    <label className="text-[1.8vh] font-bold text-amber-100 uppercase block">
                      Подкласс
                    </label>
                    <div className="flex flex-col gap-[1vh]">
                      {getSubclassesForClass(activeEntry.className).map((subclass) => {
                        const isActive = activeEntry.subclass === subclass;
                        return (
                          <button
                            key={subclass}
                            type="button"
                            onClick={() => onChangeSubclass(activeEntry.className, subclass)}
                            className={`w-full text-left px-[1vw] py-[1vh] rounded-lg border-2 transition-all ${
                              isActive
                                ? 'border-amber-500 bg-amber-900/40 text-amber-100 font-bold'
                                : 'border-amber-600/50 bg-stone-800 text-amber-100/80 hover:border-amber-500'
                            }`}
                          >
                            {subclass}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-[1.6vh] text-amber-100/60">
                    У этого класса нет подклассов на выбранном уровне.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
