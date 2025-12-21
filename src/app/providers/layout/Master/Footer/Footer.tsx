import { Link } from 'react-router-dom';
import LogoText from '../../../../../../public/img/logo/logo-text.png';

export function Footer() {
  return (
    <footer className="flex items-center px-[4vw] h-[15vh] w-[100vw] bg-neutral-900 text-amber-100 text-[1.8vh]">
      <div className="flex items-center relative  bottom-[5vh] left-[10vw] gap-[20vw]">
        <div className="flex flex-row items-center">
          <img className="h-[15vh] object-contain" src={LogoText} alt="Logo" />
          <div className="flex flex-col gap-[0.5vh]">
            <span className="text-[1.6vh]">
              The application was created by
              <a
                href={'https://github.com/Levashov-VV'}
                className="text-violet-400 hover:text-violet-500"
              >
                {' '}
                LevashovVV
              </a>
            </span>
            <span className="text-[1.4vh] text-neutral-400">© 2025 App D&D assistant</span>
          </div>
        </div>
        <ul className="flex flex-row relative bottom-[1.5vh] gap-[1vw] text-[1.8vh]">
          <li className="hover:text-red-500 transition-colors duration-300 whitespace-nowrap">
            <Link to="/master">Главная</Link>
          </li>
          <li className="hover:text-red-500 transition-colors duration-300 whitespace-nowrap">
            <Link to="/BattleField">Поле боя</Link>
          </li>
          <li className="hover:text-red-500 transition-colors duration-300 whitespace-nowrap">
            <Link to="/DiceTray">Броски кубиков</Link>
          </li>
          <li className="hover:text-red-500 transition-colors duration-300 whitespace-nowrap">
            <Link to="/persons">Создание персонажей</Link>
          </li>
          <li className="hover:text-red-500 transition-colors duration-300 whitespace-nowrap">
            <Link to="/CloneVoice">Генерация голоса</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
