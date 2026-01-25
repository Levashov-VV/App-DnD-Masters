import { Header } from './Player/Header/Header';
import { Footer } from './Player/Footer/Footer';
import { Outlet } from 'react-router-dom';

export function LayoutPlayer() {
  return (
    <div className="layout">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
