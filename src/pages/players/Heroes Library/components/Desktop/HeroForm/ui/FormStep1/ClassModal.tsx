import { motion, AnimatePresence } from 'framer-motion';
import { DND_CLASSES } from '../../../../../../../../features/heroes/constants/dndData';

export interface ClassEntry {
  className: string;
  subclass: string;
  level: number;
}

interface ClassManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: ClassEntry[];
  onToggleClass: (className: string) => void;
}

export function ClassModal({ isOpen, onClose, classes, onToggleClass }: ClassManagerModalProps) {
  const selectedNames = new Set(classes.map((c) => c.className));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-100"
            onClick={onClose}
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
                <h2 className="text-[3vh] font-bold text-amber-100 uppercase">Выбор классов</h2>
                <button
                  type="button"
                  onClick={onClose}
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
                {selectedNames.size > 0
                  ? `Выбрано классов: ${selectedNames.size}`
                  : 'Классы не выбраны'}
              </p>
            </div>

            <div className="relative left-[0.5vw] w-[38vw] flex-1 overflow-y-auto">
              <div className="flex flex-col gap-[2vh]">
                {DND_CLASSES.map((className, index) => {
                  const isSelected = selectedNames.has(className);
                  return (
                    <motion.div
                      key={className}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`border-2 rounded-lg transition-all ${
                        isSelected
                          ? 'border-amber-600 bg-amber-900/40'
                          : 'border-amber-600 bg-stone-800'
                      }`}
                    >
                      <div className="flex flex-row items-center justify-between relative right-[1vw]">
                        <h3 className="relative left-[2vw] text-[2.5vh] font-bold text-amber-100 uppercase">
                          {className}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onToggleClass(className)}
                          className={`w-[8vw] rounded font-bold text-[1.6vh] uppercase transition-colors ${
                            isSelected
                              ? 'bg-amber-500 hover:bg-amber-400 text-stone-900'
                              : 'bg-amber-600 hover:bg-amber-500 text-stone-900'
                          }`}
                        >
                          {isSelected ? 'Убрать' : 'Выбрать'}
                        </button>
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
  );
}
