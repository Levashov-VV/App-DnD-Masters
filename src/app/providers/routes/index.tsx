import { LayoutMaster } from '../layout/LayoutMaster';
import { Routes, Route } from 'react-router-dom';
import App from '../../../app/index';
import { SelectRole } from '../../../features/select-role/Select-role';
import { DashboardMaster } from '../../../pages/masters/home/ui/Dashboard';
import { SoundPad } from '../../../pages/masters/SoundPad/ui/SoundPad';
<<<<<<< HEAD
import { SoundPadScenePage } from '../../../pages/masters/SoundPad/ui/SoundPadPage/SPPage';
=======
>>>>>>> 3a5e96b6430a78bbd1955d2da18657abd8f200b0
import { BattleField } from '../../../pages/masters/Battlefield/ui/Battlefield';
import { DiceTray } from '../../../pages/masters/DiceTray/ui/DiceTray';
import { DashboardPlayer } from '../../../pages/players/home/ui/Dashboard';
import { CloneVoice } from '@/pages/masters/home/ui/CloneVoice/CloneVoice';

export function Routing() {
  return (
    <Routes>
      <Route index element={<App />} />
      <Route path="select-role" element={<SelectRole />} />
<<<<<<< HEAD

      <Route element={<LayoutMaster />}>
        <Route path="master" element={<DashboardMaster />} />

        {/* список локаций */}
        <Route path="soundpad" element={<SoundPad />} />

        {/* одна страница-шаблон для любой сцены */}
        <Route path="soundpad/:sceneSlug" element={<SoundPadScenePage />} />

=======
      <Route element={<LayoutMaster />}>
        <Route path="master" element={<DashboardMaster />} />
        <Route path="soundPad" element={<SoundPad />} />
>>>>>>> 3a5e96b6430a78bbd1955d2da18657abd8f200b0
        <Route path="battlefield" element={<BattleField />} />
        <Route path="diceTray" element={<DiceTray />} />
        <Route path="cloneVoice" element={<CloneVoice />} />
      </Route>
<<<<<<< HEAD

=======
>>>>>>> 3a5e96b6430a78bbd1955d2da18657abd8f200b0
      <Route element={<LayoutMaster />}>
        <Route path="player" element={<DashboardPlayer />} />
      </Route>
    </Routes>
  );
}
