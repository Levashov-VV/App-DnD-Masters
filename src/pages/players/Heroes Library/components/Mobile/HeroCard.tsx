import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { Hero } from '../../types/hero';
import { useHeroes } from '../../Context/HeroesContext';
import { GameImage } from '@/components/GameImage';
import { useGenerateCharacterPdf } from '../Character Sheet PDF/Usegeneratecharacterpdf';

interface HeroCardProps {
  hero: Hero;
}

export function HeroCard({ hero }: HeroCardProps) {
  const navigate = useNavigate();
  const { deleteHero } = useHeroes();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { generateFilled, isGenerating } = useGenerateCharacterPdf();

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
        <div className="h-[20vh] bg-gradient-to-br from-amber-600 to-gray-800 flex items-center justify-center relative overflow-hidden">
          {hero.avatar ? (
            <GameImage src={hero.avatar} alt={hero.name} className="w-full h-full object-contain" />
          ) : (
            <svg
              className="w-[10vh] h-[10vh] text-gray-600"
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

          <div className="w-[5vh] h-[5vh] flex items-center justify-center absolute top-3 right-3 bg-amber-600 text-amber-100 rounded-full text-[1.5vh] font-bold">
            Ур. {hero.level}
          </div>
        </div>

        {/* Контент */}
        <div>
          <h3 className="text-[2.5vh] font-bold text-amber-100 truncate">{hero.name}</h3>

          <div className="text-amber-100 text-[1.6vh]">
            <div>
              {hero.race} • {hero.classes.map((c) => c.className).join(', ')}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-100">
                HP: {hero.hitPoints.current}/{hero.hitPoints.max}
              </span>
              <span className="text-amber-100">КД: {hero.armorClass}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="flex-1 bg-amber-600 hover:bg-amber-500 text-amber-100 rounded-lg transition-colors text-[1.6vh] font-medium"
            >
              Редактировать
            </button>
            <button
              onClick={() => generateFilled(hero)}
              disabled={isGenerating}
              title="Скачать PDF"
              className="w-[3vh] h-[3vh] bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-amber-100 rounded-lg transition-colors flex items-center justify-center"
            >
              <svg
                className="w-[2vh] h-[2vh]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"
                />
              </svg>
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-[3vh] h-[3vh] bg-amber-600 hover:bg-amber-500 hover:scale-110 text-amber-100 rounded-lg transition-colors"
            >
              <svg
                className="w-[3vh] h-[2vh]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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

      {/* Окно удаления */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-stone-900 bg-opacity-50 flex items-center justify-center z-100">
          <div
            style={{ padding: '2vh 1.5vw' }}
            className="bg-stone-800 rounded-lg w-[20vw] border-gray-700"
          >
            <h3 className="text-[2vh] text-center font-bold text-amber-100">Удалить персонажа?</h3>
            <p className="text-amber-100">
              Вы уверены, что хотите удалить{' '}
              <span className="text-amber-400 font-semibold">{hero.name}</span>? Это действие нельзя
              отменить.
            </p>
            <div style={{ margin: '0.5vh 0' }} className="flex gap-[1vw]">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-amber-100 rounded-lg transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-amber-600 hover:bg-amber-500 text-amber-100 rounded-lg transition-colors"
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
