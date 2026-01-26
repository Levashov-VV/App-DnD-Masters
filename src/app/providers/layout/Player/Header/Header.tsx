import { Link } from 'react-router-dom';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800">
      {/* Мобильный хедер */}
      <div className="flex items-center justify-between md:hidden">
        <Link to={'/'} className="flex-shrink-0">
          <img 
            className="w-[10vh] h-[10vh] md:w-[5vw] md:h-[5vw] object-contain" 
            src="/img/logo/logo.png" 
            alt="Logo" 
          />
        </Link>
        
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>
      </div>

      {/* Мобильное меню (скрыто по умолчанию) */}
      <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-neutral-900/95 border-t border-neutral-800`}>
        <ul className="flex flex-col">
          <li><Link to={'/player'} className="block hover:text-red-500 font-medium">Главная</Link></li>
          <li><Link to={'/CharacterSheet'} className="block hover:text-red-500 font-medium">Листы персонажей</Link></li>
          <li><Link to={'/DiceTray'} className="block hover:text-red-500 font-medium">Броски кубиков</Link></li>
        </ul>
      </nav>

      {/* Десктопное меню */}
      <div className="hidden md:flex items-center justify-start gap-[25vw]">
        <Link to={'/'} className="flex-shrink-0">
          <img 
            className="w-[8vw] h-[8vw] object-contain" 
            src="/img/logo/logo.png" 
            alt="Logo" 
          />
        </Link>
        <ul className="flex gap-[10vw]">
          <li><Link to={'/player'} className="hover:text-red-500 transition-colors font-medium">Главная</Link></li>
          <li><Link to={'/CharacterSheet'} className="hover:text-red-500 transition-colors font-medium">Листы персонажей</Link></li>
          <li><Link to={'/DiceTray'} className="hover:text-red-500 transition-colors font-medium">Броски кубиков</Link></li>
        </ul>
      </div>
    </header>
  );
}
