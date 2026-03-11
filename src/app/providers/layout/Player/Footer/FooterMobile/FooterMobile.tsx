import { Link } from 'react-router-dom';
import LogoText from '/img/logo/logo-text.png';

export const FooterMobile = () => {
  return (
    <footer className="flex items-center h-[10vh] w-screen bg-neutral-900 text-amber-100 text-[1.8vh]">
      <div className="flex items-center relative bottom-[10vh] left-[5vw] gap-[2vw]">
        <div className="flex flex-col items-center w-[90vw]">
          <Link to={'/'}>
            <img className="h-[20vh] object-contain" src={LogoText} alt="Logo" />
          </Link>
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
      </div>
    </footer>
  );
};
