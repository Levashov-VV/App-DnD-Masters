import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 text-white text-2xl px-12 py-4 gap-[4vw] backdrop-blur-sm flex items-center">
      <div className="flex-shrink-0">
        <Link to={'/'}>
          <img className="w-[8vw] h-[8vw] object-contain" src="/img/logo/logo.png" alt="Logo" />
        </Link>
      </div>
      <nav className="flex-1 flex justify-center">
        <ul className="flex flex-row gap-12 text-center">
          <li className="flex-1 min-w-[10%] px-3 flex justify-center items-center">
            <Link
              to="/master/tables"
              className="block hover:text-red-500 transition-colors duration-300 py-2"
            >
              Главная
            </Link>
          </li>
          <li className="flex-1 min-w-[10%] px-3 flex justify-center items-center">
            <Link
              to="/master/tables"
              className="block hover:text-red-500 transition-colors duration-300 py-2"
            >
              Создание персонажей
            </Link>
          </li>
          <li className="flex-1 min-w-[10%] px-3 flex justify-center items-center">
            <Link
              to="/master/tables"
              className="block hover:text-red-500 transition-colors duration-300 py-2"
            >
              Броски кубика
            </Link>
          </li>
          <li className="flex-1 min-w-[10%] px-3 flex justify-center items-center">
            <Link
              to="/master/tables"
              className="block hover:text-red-500 transition-colors duration-300 py-2"
            >
              Поле боя
            </Link>
          </li>
          <li className="flex-1 min-w-[10%] px-3 flex justify-center items-center">
            <Link
              to="/master/tables"
              className="block hover:text-red-500 transition-colors duration-300 py-2"
            >
              Таблицы
            </Link>
          </li>
          <li className="flex-1 min-w-[10%] px-3 flex justify-center items-center">
            <Link
              to="/master/tables"
              className="block hover:text-red-500 transition-colors duration-300 py-2"
            >
              Таблицы
            </Link>
          </li>
          <li className="flex-1 min-w-[10%] px-3 flex justify-center items-center">
            <Link
              to="/master/tables"
              className="block hover:text-red-500 transition-colors duration-300 py-2"
            >
              Таблицы
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
