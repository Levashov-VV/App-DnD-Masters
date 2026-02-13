import { Link } from 'react-router-dom';
import LogoText from '../../../../../../../public/img/logo/logo-text.png';

export const FooterDesktop = () => {
  return (
    <footer className="flex items-center h-[15vh] w-[100vw] bg-neutral-900 text-amber-100 text-[1.8vh]">
      <div className="flex items-center relative  bottom-[5vh] left-[10vw] gap-[30vw]">
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
        <ul className="flex flex-row relative bottom-[1.5vh] gap-[1vw] text-[2vh]">
          <li>
            <Link to={'/player'} className="block hover:text-red-500 font-medium">
              Главная
            </Link>
          </li>
          <li>
            <Link to={'player/heroes'} className="block hover:text-red-500 font-medium">
              Библиотека персонажей
            </Link>
          </li>
          <li>
            <Link to={'/player/DiceTray'} className="block hover:text-red-500 font-medium">
              Броски кубиков
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};
