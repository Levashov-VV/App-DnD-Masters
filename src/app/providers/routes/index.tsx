import { Layout } from '../layout/Layout';
import { Routes, Route } from 'react-router-dom';
import { DashboardMaster } from '../../../pages/masters/home/ui/Dashboard';
import { DashboardPlayer } from '../../../pages/players/home/ui/Dashboard';
import App from '../../index.tsx';

export function Routing() {
  return (
    <Routes>
      <Route index element={<App />} />
      <Route path="/" element={<Layout />}>
        <Route path="master" element={<DashboardMaster />}>
          <Route path="character" element={<DashboardMaster />} />
          <Route path="diceTray" element={<DashboardMaster />} />
          <Route path="tables" element={<DashboardMaster />} />
        </Route>
        <Route path="player" element={<DashboardPlayer />} />
      </Route>
    </Routes>
  );
}
