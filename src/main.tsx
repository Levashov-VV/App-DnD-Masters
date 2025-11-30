import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { DashboardMaster } from './pages/masters/home/ui/Dashboard.tsx';
import './style.css';
import App from './app/index.tsx';
import { DashboardPlayer } from './pages/players/home/ui/Dashboard.tsx';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/master" element={<DashboardMaster />} />
        <Route path="/player" element={<DashboardPlayer />} />
      </Routes>
    </BrowserRouter>

);
