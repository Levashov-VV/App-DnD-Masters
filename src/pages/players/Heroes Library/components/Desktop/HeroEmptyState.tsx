interface HeroEmptyStateProps {
  onCreateHero: () => void;
}

export function HeroEmptyState({ onCreateHero }: HeroEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-32 h-32 mb-8 rounded-full bg-gray-800 flex items-center justify-center">
        <svg
          className="w-16 h-16 text-gray-600"
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
      </div>

      <h2 className="text-2xl font-bold text-white mb-3">Ваша библиотека героев пуста</h2>

      <p className="text-gray-400 text-center max-w-md mb-8">
        Создайте своего первого персонажа для D&D приключений. Все герои будут сохранены локально в
        вашем браузере.
      </p>

      <button
        onClick={onCreateHero}
        className="flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium text-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Создать первого героя
      </button>
    </div>
  );
}
