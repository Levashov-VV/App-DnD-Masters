import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { assetUrl } from '@/shared/utils/assetUrl';

export const HeaderMobile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="w-screen fixed top-0 left-0 z-200 bg-neutral-900/95">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex-shrink-0">
          <img
            className="w-[30vw] h-[30vw] object-contain"
            src={assetUrl('/img/logo/logo.png')}
            alt="Logo"
          />
        </Link>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="relative right-[4vw]"
          aria-label="Toggle menu"
        >
          <svg className="w-[10vw] h-[10vw]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>

      {/* Мобильное меню */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.8 }}
              className="fixed right-0 top-0 h-screen w-[70vw] bg-neutral-900/95 border-l-2 border-neutral-800 z-50 flex flex-col"
            >
              <div className="flex items-center justify-end">
                <button onClick={() => setIsMenuOpen(false)}>
                  <svg
                    className=" relative top-[1vh] right-[1vw] w-[4vh] h-[4vh] border-2 rounded-4xl"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <ul className="relative left-[2vw] flex-1 flex flex-col gap-[3vh] overflow-y-auto">
                <li>
                  <Link
                    to="/master"
                    className="flex items-center text-[3vh] font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Главная
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Master/soundPad"
                    className="flex items-center text-[3vh] font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Саундпады
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Master/DiceTray"
                    className="flex items-center text-[3vh] font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Броски кубиков
                  </Link>
                </li>
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
