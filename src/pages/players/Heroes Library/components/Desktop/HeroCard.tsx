// features/heroes/components/Desktop/HeroCard.tsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { Hero } from '../../types/hero';
import { useHeroes } from '../../Context/HeroesContext';

interface HeroCardProps {
  hero: Hero;
}

export function HeroCard({ hero }: HeroCardProps) {
  const navigate = useNavigate();
  const { deleteHero } = useHeroes();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

const handleEdit = () => {
  navigate(`/player/heroes/${hero.id}/edit`);
};

  const handleDelete = () => {
    deleteHero(hero.id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="bg-gray-800 rounded-lg overflow-hidden border-gray-700 hover:border-purple-500 transition-all group">
        {/* Avatar */}
        <div className="h-48 bg-gradient-to-br from-purple-900 to-gray-900 flex items-center justify-center relative overflow-hidden">
          {hero.avatar ? (
            <img src={hero.avatar} alt={hero.name} className="w-full h-full object-cover" />
          ) : (
            <svg
              className="w-24 h-24 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          )}

          {/* Level Badge */}
          <div className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
            Ур. {hero.level}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-xl font-bold text-white mb-2 truncate">{hero.name}</h3>

          <div className="text-gray-400 text-sm mb-4">
            <div>
              {hero.race} • {hero.class}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-red-400">
                ❤️ {hero.hitPoints.current}/{hero.hitPoints.max}
              </span>
              <span className="text-blue-400">🛡️ AC {hero.armorClass}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Редактировать
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-gray-700 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border-gray-700">
            <h3 className="text-xl font-bold text-white mb-3">Удалить персонажа?</h3>
            <p className="text-gray-400 mb-6">
              Вы уверены, что хотите удалить{' '}
              <span className="text-white font-semibold">{hero.name}</span>? Это действие нельзя
              отменить.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
