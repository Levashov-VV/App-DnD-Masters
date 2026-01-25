import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="fixed top-0 left-0 z-90 text-amber-100 bg-neutral-900/90 text-[1vw] gap-[4vw] flex items-center w-full">
      <div className="shrink-0">
        <Link to={'/'}>
          <img className="w-[8vw] h-[8vw] object-contain" src="/img/logo/logo.png" alt="Logo" />
        </Link>
      </div>
      <nav className="w-full max-w-[80%]">
        <ul className="flex flex-row w-full gap-[4vw] md:gap-6 justify-center flex-wrap items-center">
          <li className=" shrink-0">
            <Link
              to={'/Master'}
              className="block hover:text-red-500 transition-colors duration-300 whitespace-nowrap"
            >
              Главная
            </Link>
          </li>
          <li className="shrink-0">
            <Link
              to={'/BattleField'}
              className="block hover:text-red-500 transition-colors duration-300 whitespace-nowrap"
            >
              Поле боя
            </Link>
          </li>
          <li className="shrink-0">
            <Link
              to={'/DiceTray'}
              className="block hover:text-red-500 transition-colors duration-300 whitespace-nowrap"
            >
              Броски кубиков
            </Link>
          </li>
          <li className="shrink-0">
            <Link
              to={'/SoundPad'}
              className="block hover:text-red-500 transition-colors duration-300 whitespace-nowrap"
            >
              Саундпады
            </Link>
          </li>
          <li className="shrink-0">
            <Link
              to={'/CloneVoice'}
              className="block hover:text-red-500 transition-colors duration-300 whitespace-nowrap"
            >
              Генерация голоса
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
