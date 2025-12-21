import { LayoutMaster } from '../layout/LayoutMaster';
import { Routes, Route } from 'react-router-dom';
import App from '../../../app/index'; // предполагаю путь к App
import { SelectRole } from '../../../features/select-role/Select-role'; // добавьте импорт
import { DashboardMaster } from '../../../pages/masters/home/ui/Dashboard';
import { Persons } from '../../../pages/masters/Persons/ui/Persons';
import { BattleField } from '../../../pages/masters/Battlefield/ui/Battlefield';
import { DiceTray } from '../../../pages/masters/DiceTray/ui/DiceTray';
import { DashboardPlayer } from '../../../pages/players/home/ui/Dashboard';
import { CloneVoice } from '@/pages/masters/home/ui/CloneVoice/CloneVoice';

export function Routing() {
  return (
    <Routes>
      <Route index element={<App />} />
      <Route path="select-role" element={<SelectRole />} />
      <Route element={<LayoutMaster />}>
        <Route path="master" element={<DashboardMaster />} />
        <Route path="persons" element={<Persons />} />
        <Route path="battlefield" element={<BattleField />} />
        <Route path="diceTray" element={<DiceTray />} />
        <Route path="cloneVoice" element={<CloneVoice />} />
      </Route>
      <Route element={<LayoutMaster />}>
        <Route path="player" element={<DashboardPlayer />} />
      </Route>
    </Routes>
  );
}
