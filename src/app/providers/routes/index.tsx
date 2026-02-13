// widgets/router/Routing.tsx
import { LayoutMaster } from '../layout/LayoutMaster';
import { LayoutPlayer } from '../layout/LayoutPlayer';
import { Routes, Route } from 'react-router-dom';
import App from '../../../app/index';
import { SelectRole } from '../../../features/select-role/Select-role';
import { DashboardMaster } from '../../../pages/masters/home/ui/Dashboard';
import { SoundPad } from '../../../pages/masters/SoundPad/ui/SoundPad';
import { SoundPadScenePage } from '../../../pages/masters/SoundPad/ui/SoundPadPage/SPPage';
import { BattleField } from '../../../pages/masters/Battlefield/ui/Battlefield';
import { DiceTray } from '../../../pages/masters/DiceTray/ui/DiceTray';
import { DashboardPlayer } from '../../../pages/players/home/ui/Dashboard';
import { CloneVoice } from '@/pages/masters/home/ui/CloneVoice/CloneVoice';
import { HeroLibrary } from '../../../pages/players/Heroes Library/Library';
import HeroForm from '../../../pages/players/Heroes Library/LibraryDesktop/pages/HeroForm';

export function Routing() {
  return (
    <Routes>
      <Route index element={<App />} />
      <Route path="select-role" element={<SelectRole />} />

      {/* Master */}
      <Route element={<LayoutMaster />}>
        <Route path="master" element={<DashboardMaster />} />
        <Route path="master/soundpad" element={<SoundPad />} />
        <Route path="master/soundpad/:sceneSlug" element={<SoundPadScenePage />} />
        <Route path="master/battlefield" element={<BattleField />} />
        <Route path="master/diceTray" element={<DiceTray />} />
        <Route path="master/cloneVoice" element={<CloneVoice />} />
      </Route>

      {/* Player */}
      <Route element={<LayoutPlayer />}>
        <Route path="player" element={<DashboardPlayer />} />
        <Route path="player/heroes" element={<HeroLibrary />} />
        <Route path="player/heroes/create" element={<HeroForm mode="create" />} />
        <Route path="player/heroes/:id/edit" element={<HeroForm mode="edit" />} /> {/* ✅ Исправлено */}
        <Route path="player/diceTray" element={<DiceTray />} />
      </Route>
    </Routes>
  );
}
