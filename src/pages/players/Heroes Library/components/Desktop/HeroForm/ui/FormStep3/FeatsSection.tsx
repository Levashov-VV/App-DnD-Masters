import { motion } from 'framer-motion';
import type { Feat } from '../../../../../../../../features/heroes/constants/dndData';
import { DND_FEATS } from '../../../../../../../../features/heroes/constants/dndData';

interface FeatsSectionProps {
  activeFeats: Set<string>;
  setIsFeatsOpen: (val: boolean) => void;
  clearAllFeats: () => void;
  toggleFeat: (featNameEn: string) => void;
  setSelectedFeat: (feat: Feat | null) => void;
}

export function FeatsSection({
  activeFeats,
  setIsFeatsOpen,
  clearAllFeats,
  toggleFeat,
  setSelectedFeat,
}: FeatsSectionProps) {
  const handleFeatClick = (feat: Feat) => {
    setSelectedFeat(feat);
  };

  return (
    <div className="col-span-1 border-2 border-amber-600 bg-stone-800 rounded-lg">
      <h3 className="text-[2vh] text-center font-bold text-amber-100">Черты</h3>

      <button
        type="button"
        onClick={() => setIsFeatsOpen(true)}
        style={{ marginLeft: '2%' }}
        className="w-[96%] flex flex-col items-center justify-center bg-stone-900 border-2 border-amber-600 rounded-lg hover:bg-stone-700 transition-colors relative"
      >
        <label className="text-[1.4vh] text-amber-100 uppercase pointer-events-none">
          Черты персонажа
        </label>
        <div className="text-[2vh] font-bold text-amber-100 pointer-events-none">
          {activeFeats.size > 0 ? `Активно: ${activeFeats.size}` : 'Нет'}
        </div>
        {activeFeats.size > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-[1vh] -right-[1vh] bg-amber-600 text-stone-900 rounded-full w-[3vh] h-[3vh] flex items-center justify-center text-[1.6vh] font-bold"
          >
            {activeFeats.size}
          </motion.div>
        )}
      </button>

      {activeFeats.size > 0 && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          type="button"
          onClick={clearAllFeats}
          style={{ marginTop: '1vh', marginBottom: '1vh', marginLeft: '2%' }}
          className="w-[96%] border-2 border-amber-600 bg-stone-800 hover:bg-stone-700 text-amber-100 font-bold text-[1.4vh] uppercase rounded-lg transition-colors"
        >
          Сбросить все черты
        </motion.button>
      )}

      {activeFeats.size > 0 && (
        <div className="max-h-[22vh] overflow-y-auto flex flex-col gap-[0.5vh]">
          {DND_FEATS.filter((feat) => activeFeats.has(feat.nameEn)).map((feat) => (
            <div
              key={feat.nameEn}
              style={{ marginLeft: '2%', paddingLeft: '0.5vw', paddingRight: '0.5vw' }}
              className="w-[96%] bg-amber-600 text-stone-900 rounded-lg text-[1.4vh] font-bold flex items-center justify-between gap-[0.5vw]"
            >
              {/* Название черты */}
              <button
                type="button"
                onClick={() => handleFeatClick(feat)}
                className="truncate flex-1 text-left hover:text-amber-100 hover:scale-102 transition-colors "
                title="Показать описание"
              >
                {feat.name}
              </button>

              {/* Кнопка удаления */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFeat(feat.nameEn);
                }}
                className="hover:scale-110 transition-transform flex-shrink-0"
                title="Удалить черту"
              >
                <svg
                  className="w-[1.5vh] h-[1.5vh]"
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
          ))}
        </div>
      )}
    </div>
  );
}
