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
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 right-0 bottom-0 max-h-[85vh] bg-stone-900 border-t-4 border-amber-600 rounded-t-2xl shadow-2xl z-101 flex flex-col"
          >
            <div style={{ padding: '3vw' }} className="border-b border-amber-700/40">
              <div className="flex items-center justify-between">
                <h2 className="text-[2.2vh] font-bold text-amber-100 uppercase">
                  Уровни и подклассы
                </h2>
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="w-[8vw] h-[8vw] bg-amber-600 hover:bg-amber-500 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-[4vw] h-[4vw] text-white"
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
              <p className="text-[1.8vh] text-amber-400">
                Уровень: {totalLevel} · Распределено: {distributedLevels} ·{' '}
                <span className={remainingLevels === 0 ? 'text-green-400' : 'text-amber-300'}>
                  Осталось: {remainingLevels}
                </span>
              </p>
            </div>

            <div className="overflow-y-auto flex-1" style={{ padding: '3vw' }}>
              {classes.length === 0 ? (
                <p className="text-[1.8vh] text-amber-100/60">
                  Сначала выберите классы в предыдущем окне.
                </p>
              ) : (
                <div className="flex flex-col gap-[2vh]">
                  {classes.map((entry, index) => (
                    <motion.div
                      key={entry.className}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      style={{ padding: '3vw' }}
                      className="border-2 border-amber-600 bg-stone-800 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-[2vh] font-bold text-amber-100 uppercase">
                            {entry.className}
                          </h3>
                          <p className="text-[1.5vh] text-amber-400">
                            Уровень {entry.level}
                            {entry.subclass ? ` · ${entry.subclass}` : ' · подкласс не выбран'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => openClass(entry.className)}
                          className="bg-amber-600 hover:bg-amber-500 text-stone-900 rounded font-bold text-[1.6vh] uppercase transition-colors px-[3vw] py-[1.5vh]"
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
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 right-0 bottom-0 max-h-[85vh] bg-stone-900 border-t-4 border-amber-600 rounded-t-2xl shadow-2xl z-103 flex flex-col"
          >
            <div style={{ padding: '3vw' }} className="border-b border-amber-700/40">
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-[2vw] text-amber-400 hover:text-amber-300 transition-colors"
              >
                <svg
                  className="w-[4vw] h-[4vw]"
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
                <span className="text-[1.8vh] font-bold uppercase">Назад к списку</span>
              </button>
              <h2 className="text-[2.5vh] text-center font-bold text-amber-100 uppercase mt-[1vh]">
                {activeEntry.className}
              </h2>
            </div>

            <div className="overflow-y-auto flex-1" style={{ padding: '3vw' }}>
              <div className="flex flex-col gap-[3vh]">
                <div>
                  <label className="text-[1.8vh] font-bold text-amber-100 uppercase block mb-[1vh]">
                    Уровень в классе
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={levelInputText}
                    onChange={(e) => handleLevelInputChange(e.target.value)}
                    className={`w-[25vw] h-[8vh] bg-stone-800 border-2 rounded-lg text-center text-[3vh] font-bold text-amber-100 focus:outline-none ${
                      levelError ? 'border-red-500' : 'border-amber-600 focus:border-amber-400'
                    }`}
                  />
                  {levelError && <p className="text-[1.5vh] text-red-400 mt-[1vh]">{levelError}</p>}
                </div>

                {hasSubclasses(activeEntry.className) ? (
                  <div>
                    <label className="text-[1.8vh] font-bold text-amber-100 uppercase block mb-[1vh]">
                      Подкласс
                    </label>
                    <div className="flex flex-col gap-[1.5vh]">
                      {getSubclassesForClass(activeEntry.className).map((subclass) => {
                        const isActive = activeEntry.subclass === subclass;
                        return (
                          <button
                            key={subclass}
                            type="button"
                            onClick={() => onChangeSubclass(activeEntry.className, subclass)}
                            style={{ padding: '3vw' }}
                            className={`w-full text-left rounded-lg border-2 transition-all ${
                              isActive
                                ? 'border-amber-500 bg-amber-900/40 text-amber-100 font-bold'
                                : 'border-amber-600/50 bg-stone-800 text-amber-100/80'
                            }`}
                          >
                            <span className="text-[1.8vh]">{subclass}</span>
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
