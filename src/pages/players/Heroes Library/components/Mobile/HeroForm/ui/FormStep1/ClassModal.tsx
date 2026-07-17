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
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 right-0 bottom-0 max-h-[85vh] bg-stone-900 border-t-4 border-amber-600 rounded-t-2xl shadow-2xl z-101 flex flex-col"
          >
            <div style={{ padding: '3vw' }} className="border-b border-amber-700/40">
              <div className="flex items-center justify-between">
                <h2 className="text-[2.2vh] font-bold text-amber-100 uppercase">Выбор классов</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-[8vw] h-[8vw] bg-amber-600 hover:bg-amber-500 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-[4vw] h-[4vw] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-[1.8vh] text-amber-400">
                {selectedNames.size > 0
                  ? `Выбрано классов: ${selectedNames.size}`
                  : 'Классы не выбраны'}
              </p>
            </div>

            <div className="overflow-y-auto flex-1" style={{ padding: '3vw' }}>
              <div className="flex flex-col gap-[2vh]">
                {DND_CLASSES.map((className, index) => {
                  const isSelected = selectedNames.has(className);
                  return (
                    <motion.button
                      key={className}
                      type="button"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => onToggleClass(className)}
                      style={{ padding: '3vw' }}
                      className={`w-full flex items-center justify-between rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-900/40'
                          : 'border-amber-600/50 bg-stone-800'
                      }`}
                    >
                      <span className="text-[2vh] font-bold text-amber-100 uppercase">
                        {className}
                      </span>
                      <span
                        className={`text-[1.6vh] font-bold uppercase rounded ${
                          isSelected
                            ? 'bg-amber-500 text-stone-900'
                            : 'bg-amber-600 text-stone-900'
                        }` }
                        style={{ padding: '1vw' }}
                      >
                        {isSelected ? 'Убрать' : 'Выбрать'}
                      </span>
                    </motion.button>
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