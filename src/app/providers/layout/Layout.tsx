import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="layout">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
