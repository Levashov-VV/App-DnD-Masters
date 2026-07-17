import { useNavigate } from 'react-router-dom';
import { useHeroes } from '../../Context/HeroesContext';
import { HeroCard } from '../../components/Mobile/HeroCard';
import { HeroEmptyState } from '../../components/Mobile/HeroEmptyState';
import { useState } from 'react';
import { exportHeroesToFile } from '../../../Heroes Library/lib/ExportImport';
import { ImportModal } from '../../components/Mobile/ImportModal';

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
    <div className="relative top-[15vh] flex flex-col items-center min-h-screen">
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

          {heroes.length > 0 && (
            <button
              onClick={handleCreateHero}
              style={{ padding: '0.4vh 3vw' }}
              className="absolute right-[30vw] top-[17vh] flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-amber-100 rounded-lg transition-colors text-[2vh] font-medium"
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
          <div className="flex gap-[2vw]">
            <button
              onClick={handleExport}
              className="flex-1 bg-stone-700 active:bg-stone-600 text-amber-100 rounded-lg text-[1.6vh] font-medium transition-colors"
              style={{ padding: '1.5vh 0' }}
            >
              Экспорт
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex-1 bg-stone-700 active:bg-stone-600 text-amber-100 rounded-lg text-[1.6vh] font-medium transition-colors"
              style={{ padding: '1.5vh 0' }}
            >
              Импорт
            </button>
          </div>
          <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />

        {/* Контент */}
        {heroes.length === 0 ? (
          <HeroEmptyState onCreateHero={handleCreateHero} />
        ) : (
          <div
            style={{ padding: '0.4vh 2vw', marginBottom: '50vh' }}
            className="relative top-[10vh] grid grid-cols-2 gap-6 overflow-y-auto"
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
