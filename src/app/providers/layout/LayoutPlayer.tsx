import { Header } from './Player/Header/Header';
import { Footer } from './Player/Footer/Footer';
import { Outlet } from 'react-router-dom';
import { HeroesProvider } from '../../../pages/players/Heroes Library/Context/HeroesContext';

export function LayoutPlayer() {
  return (
    <HeroesProvider>
      <div className="layout">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </HeroesProvider>
  );
}
