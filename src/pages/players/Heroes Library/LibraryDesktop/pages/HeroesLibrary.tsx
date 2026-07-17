import { useNavigate } from 'react-router-dom';
import { useHeroes } from '../../Context/HeroesContext';
import { HeroCard } from '../../components/Desktop/HeroCard';
import { HeroEmptyState } from '../../components/Desktop/HeroEmptyState';
import { useState } from 'react';
import { exportHeroesToFile } from '../../lib/ExportImport';
import { ImportModal } from '../../components/Desktop/ImportModal';

export function HeroesLibrary() {
  const navigate = useNavigate();
  const { heroes } = useHeroes();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleCreateHero = () => {
    navigate('/player/heroes/create');
  };

  const handleExport = () => {
    exportHeroesToFile(heroes);
  };

  return (
    <div className="relative top-[20vh] flex flex-col items-center min-h-screen">
      <div>
        {/* Header */}
        <div className="flex items-center">
          <div className="w-screen text-center">
            <h1 className="text-[3.5vh] font-bold text-amber-100">Библиотека героев</h1>
            <p className="text-amber-100 text-[2vh]">
              {heroes.length === 0
                ? 'Создайте своего первого персонажа'
                : `Всего персонажей: ${heroes.length}`}
            </p>
          </div>
          <div className="absolute right-10 top-0 flex items-center gap-[1vw]">
            <button
              onClick={handleExport}
              style={{ padding: '0.4vh 0.8vw' }}
              className="bg-stone-700 hover:bg-stone-600 text-amber-100 rounded-lg transition-colors font-medium"
            >
              Экспорт
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              style={{ padding: '0.4vh 0.8vw' }}
              className="bg-stone-700 hover:bg-stone-600 text-amber-100 rounded-lg transition-colors font-medium"
            >
              Импорт
            </button>
            {heroes.length > 0 && (
              <button
                onClick={handleCreateHero}
                style={{ padding: '0.4vh 0.8vw' }}
                className="absolute w-full top-10 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-amber-100 rounded-lg transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Создать героя
              </button>
            )}
          </div>

          <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
        </div>

        {/* Контент */}
        {heroes.length === 0 ? (
          <HeroEmptyState onCreateHero={handleCreateHero} />
        ) : (
          <div
            style={{ padding: '0.4vh 0.8vw', marginBottom: '30vh' }}
            className=" grid grid-cols-4 gap-6 overflow-y-auto"
          >
            {heroes.map((hero) => (
              <HeroCard key={hero.id} hero={hero} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
