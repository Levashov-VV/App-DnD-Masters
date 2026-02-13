import { AnimatePresence, motion } from 'framer-motion';
import type { Feat } from '../../../../../../../../features/heroes/constants/dndData';

interface FeatsModalProps {
  isFeatsOpen: boolean;
  setIsFeatsOpen: (val: boolean) => void;
  selectedFeat: Feat | null;
  setSelectedFeat: (feat: Feat | null) => void;
  activeFeats: Set<string>;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedFeatType: string;
  setSelectedFeatType: (val: string) => void;
  filteredFeats: Feat[];
  handleFeatClick: (feat: Feat, action: 'toggle' | 'details', e: React.MouseEvent) => void;
  applyFeatAndClose: (featNameEn: string) => void;
  goBackToFeatsList: () => void;
}

const featTypeLabels: Record<string, string> = {
  all: 'Все',
  combat: 'Боевые',
  epic: 'Эпические',
  origin: 'Происхождение',
  dragonmark: 'Метка дракона',
  general: 'Общие',
};

const FeatType = {
  COMBAT: 'combat',
  EPIC: 'epic',
  ORIGIN: 'origin',
  DRAGONMARK: 'dragonmark',
  GENERAL: 'general',
} as const;

export function FeatsModal({
  isFeatsOpen,
  setIsFeatsOpen,
  selectedFeat,
  activeFeats,
  searchQuery,
  setSearchQuery,
  selectedFeatType,
  setSelectedFeatType,
  filteredFeats,
  handleFeatClick,
  applyFeatAndClose,
  goBackToFeatsList,
}: FeatsModalProps) {
  return (
    <>
      {/* МОДАЛЬНОЕ ОКНО СО СПИСКОМ ЧЕРТ */}
      <AnimatePresence>
        {isFeatsOpen && !selectedFeat && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-100 uppercase"
              onClick={() => setIsFeatsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[40vw] bg-stone-900 border-l-4 border-amber-600 shadow-2xl z-101 flex flex-col"
            >
              <div style={{ marginLeft: '0.5vw', marginRight: '0.5vw', marginTop: '1vh' }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-[3vh] font-bold text-amber-100 uppercase">Выбор черты</h2>
                  <button
                    type="button"
                    onClick={() => setIsFeatsOpen(false)}
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

                {activeFeats.size > 0 ? (
                  <p className="text-[2vh] text-amber-400">Выбрано: {activeFeats.size}</p>
                ) : (
                  <p className="text-[2vh] text-amber-400">Нет выбранных черт</p>
                )}

                {/* Поиск */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск черты..."
                    style={{ marginBottom: '0.5vh', paddingLeft: '0.2vw' }}
                    className="w-full bg-stone-800 border-2 border-amber-600 rounded-lg text-[1.8vh] text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-500 transition-colors uppercase"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-[0.5vw] top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      <svg className="w-[2vh] h-[2vh]" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Фильтры по типам */}
                <div className="flex gap-[0.5vw] overflow-x-auto scrollbar-thin">
                  {['all', ...Object.values(FeatType)].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedFeatType(type)}
                      style={{ padding: '0.5vh 1.5vh' }}
                      className={`rounded-lg text-[1.5vh] font-bold uppercase whitespace-nowrap transition-colors ${
                        selectedFeatType === type
                          ? 'bg-amber-600 text-stone-900'
                          : 'bg-stone-800 text-amber-400 hover:bg-stone-700 border-2 border-amber-600'
                      }`}
                    >
                      {featTypeLabels[type] || type}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-[1.7vh] text-amber-500">Найдено: {filteredFeats.length}</p>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedFeatType('all');
                      }}
                      className="text-[1.5vh] text-amber-400 hover:text-amber-300 underline"
                    >
                      Сбросить фильтры
                    </button>
                  )}
                </div>
              </div>

              {/* Список черт */}
              <div className="flex-1 overflow-y-scroll overflow-x-hidden">
                <div
                  className="flex flex-col gap-[2vh]"
                  style={{ marginLeft: '0.5vw', marginRight: '0.5vw', paddingBottom: '2vh' }}
                >
                  {filteredFeats.length > 0 ? (
                    filteredFeats.map((feat, index) => {
                      const isActive = activeFeats.has(feat.nameEn);
                      return (
                        <motion.div
                          key={feat.nameEn}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: Math.min(index * 0.02, 0.3) }}
                          style={{ paddingLeft: '0.2vw' }}
                          className={`border-2 rounded-lg transition-all ${
                            isActive
                              ? 'border-amber-600 bg-amber-900/40'
                              : 'border-amber-600 bg-stone-800'
                          }`}
                        >
                          <div className="flex flex-row justify-between items-center gap-[1vh] p-[1vh]">
                            <div className="flex flex-col flex-1">
                              <h3 className="text-[2vh] font-bold text-amber-100 uppercase">
                                {feat.name}
                              </h3>
                              {feat.type && (
                                <span className="text-[1.4vh] text-amber-500 uppercase">
                                  {featTypeLabels[feat.type] || feat.type}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-[0.5vw]">
                              <button
                                type="button"
                                onClick={(e) => handleFeatClick(feat, 'toggle', e)}
                                className={`w-[8vw] rounded font-bold text-[1.6vh] uppercase transition-colors ${
                                  isActive
                                    ? 'bg-amber-500 hover:bg-amber-400 text-stone-900'
                                    : 'bg-amber-600 hover:bg-amber-500 text-stone-900'
                                }`}
                              >
                                {isActive ? 'Убрать' : 'Добавить'}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleFeatClick(feat, 'details', e)}
                                style={{ padding: '0.5vh 1.5vh', marginRight: '0.5vw' }}
                                className="w-[8vw] bg-stone-700 hover:bg-stone-600 text-amber-100 rounded font-bold text-[1.6vh] uppercase transition-colors"
                              >
                                Подробнее
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[40vh] text-center">
                      <p className="text-[2.5vh] text-amber-400 uppercase font-bold">
                        Черты не найдены
                      </p>
                      <p className="text-[1.8vh] text-amber-600 uppercase mt-[1vh]">
                        Попробуйте изменить параметры поиска
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* МОДАЛЬНОЕ ОКНО ДЕТАЛЕЙ ЧЕРТЫ */}
      <AnimatePresence>
        {selectedFeat && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-102"
              onClick={goBackToFeatsList}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[40vw] bg-stone-900 border-l-4 border-amber-600 shadow-2xl z-103 flex flex-col"
            >
              <div>
                <button
                  type="button"
                  onClick={goBackToFeatsList}
                  className="flex items-center gap-[1vw] text-amber-400 hover:text-amber-300 transition-colors"
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
                  <span className="text-[2vh] font-bold uppercase">Назад</span>
                </button>
                <h2 className="text-[3vh] text-center font-bold text-amber-100 uppercase">
                  {selectedFeat.name}
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <div className="flex flex-col gap-[1.5vh]">
                  {selectedFeat.description?.split('\n').map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-[1vw]"
                    >
                      <span
                        className="text-amber-500 text-[2vh] flex-shrink-0"
                        style={{ marginLeft: '0.5vw' }}
                      >
                        •
                      </span>
                      <p className="text-[1.8vh] text-amber-200 leading-relaxed flex-1">
                        {line.replace(/^[•\-]\s*/, '')}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div
                  className="w-[96%] bg-stone-800 rounded-lg border-2 border-amber-600"
                  style={{ margin: '0 2%', padding: '1vh' }}
                >
                  <h4 className="text-[2vh] font-bold text-amber-100 uppercase">Статус черты</h4>
                  <div className="flex items-center gap-[1vw] text-[2vh] font-bold">
                    {activeFeats.has(selectedFeat.nameEn) ? (
                      <>
                        <svg
                          className="w-[2.5vh] h-[2.5vh] text-amber-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-amber-400">Черта активна</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-[2.5vh] h-[2.5vh] text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-400">Черта не активна</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <motion.button
                type="button"
                onClick={() => applyFeatAndClose(selectedFeat.nameEn)}
                className={`w-full font-bold text-[2vh] uppercase transition-colors shadow-lg flex items-center justify-center gap-[1vw] ${
                  activeFeats.has(selectedFeat.nameEn)
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-amber-600 hover:bg-amber-500 text-stone-900'
                }`}
              >
                <svg className="w-[2.5vh] h-[2.5vh]" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {activeFeats.has(selectedFeat.nameEn) ? 'Удалить черту' : 'Применить черту'}
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
