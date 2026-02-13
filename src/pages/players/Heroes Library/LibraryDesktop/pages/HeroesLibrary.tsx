import { useNavigate } from 'react-router-dom';
import { useHeroes } from '../../Context/HeroesContext';
import { HeroCard } from '../../components/Desktop/HeroCard';
import { HeroEmptyState } from '../../components/Desktop/HeroEmptyState';

export function HeroesLibrary() {
  const navigate = useNavigate();
  const { heroes } = useHeroes();

  const handleCreateHero = () => {
    navigate('/player/heroes/create');
  };

  return (
    <div className="relative top-[20vh] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Библиотека героев</h1>
            <p className="text-gray-400">
              {heroes.length === 0
                ? 'Создайте своего первого персонажа'
                : `Всего персонажей: ${heroes.length}`}
            </p>
          </div>

          {heroes.length > 0 && (
            <button
              onClick={handleCreateHero}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
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

        {/* Content */}
        {heroes.length === 0 ? (
          <HeroEmptyState onCreateHero={handleCreateHero} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {heroes.map((hero) => (
              <HeroCard key={hero.id} hero={hero} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
