import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="fixed top-0 left-0 z-50 text-amber-100 text-[1vw] py-4 gap-[4vw] flex items-center w-full">
      <div className="shrink-0">
        <Link to={'/'}>
          <img className="w-[8vw] h-[8vw] object-contain" src="/img/logo/logo.png" alt="Logo" />
        </Link>
      </div>
      <nav className="w-full max-w-[80%] mx-auto px-4">
        <ul className="flex flex-row w-full gap-4 md:gap-6 justify-center flex-wrap items-center max-w-8xl">
          <li className="px-2 py-2 shrink-0">
            <Link
              to={'/master'}
              className="block hover:text-red-500 transition-colors duration-300 whitespace-nowrap"
            >
              Главная
            </Link>
          </li>
          <li className="px-2 py-2 shrink-0">
            <Link
              to={'/persons'}
              className="block hover:text-red-500 transition-colors duration-300 whitespace-nowrap"
            >
              Создание персонажей
            </Link>
          </li>
          <li className="px-2 py-2 shrink-0">
            <Link
              to={'/BattleField'}
              className="block hover:text-red-500 transition-colors duration-300 whitespace-nowrap"
            >
              Поле боя
            </Link>
          </li>
          <li className="px-2 py-2 shrink-0">
            <Link
              to={'/diceTray'}
              className="block hover:text-red-500 transition-colors duration-300 whitespace-nowrap"
            >
              Броски кубиков
            </Link>
          </li>
          <li className="px-2 py-2shrink-0">
            <Link
              to={'/tables'}
              className="block hover:text-red-500 transition-colors duration-300 whitespace-nowrap"
            >
              Таблица
            </Link>
          </li>
          <li className="px-2 py-2 shrink-0">
            <Link
              to={'/master/tables'}
              className="block hover:text-red-500 transition-colors duration-300 whitespace-nowrap"
            >
              Таблица
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
