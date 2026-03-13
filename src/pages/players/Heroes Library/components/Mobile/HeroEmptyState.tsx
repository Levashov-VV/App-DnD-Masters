interface HeroEmptyStateProps {
  onCreateHero: () => void;
}

export function HeroEmptyState({ onCreateHero }: HeroEmptyStateProps) {
  return (
    <div className="relative top-[5vh] flex flex-col items-center justify-center">
      <div className="w-[10vw] h-[10vw] rounded-full bg-gray-800 flex items-center justify-center">
        <svg
          className="w-[8vh] h-[8vh] text-gray-600"
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

      <h2 style={{ marginTop: '1vh' }} className="text-[3vh] font-bold text-amber-100">
        Ваша библиотека героев пуста
      </h2>

      <p className="w-[80vw] text-amber-100 text-center">
        Создайте своего первого персонажа для D&D приключений. Все герои будут сохранены локально в
        вашем браузере.
      </p>

      <button
        onClick={onCreateHero}
        style={{ marginTop: '2vh', padding: '1vh 2vh' }}
        className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-amber-100 rounded-lg transition-colors font-medium text-[2vh]"
      >
        <svg className="w-[2vh] h-[2vh]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Создать первого героя
      </button>
    </div>
  );
}
