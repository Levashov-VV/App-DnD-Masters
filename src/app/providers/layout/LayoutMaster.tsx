import { Header } from './Master/Header/Header';
import { Footer } from './Master/Footer/Footer';
import { Outlet } from 'react-router-dom';

export function LayoutMaster() {
  return (
    <div className="layout">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
