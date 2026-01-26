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
import { CharacterSheet } from '../../../pages/players/Character Sheet/Character Sheet';

export function Routing() {
  return (
    <Routes>
      <Route index element={<App />} />
      <Route path="select-role" element={<SelectRole />} />

      {/* ВСЕ мастер-страницы под LayoutMaster */}
      <Route element={<LayoutMaster />}>
        <Route path="master" element={<DashboardMaster />} />
        
        {/* SoundPad: список + детальная страница */}
        <Route path="soundpad" element={<SoundPad />} />
        <Route path="soundpad/:sceneSlug" element={<SoundPadScenePage />} />
        
        {/* Остальные */}
        <Route path="battlefield" element={<BattleField />} />
        <Route path="diceTray" element={<DiceTray />} />
        <Route path="cloneVoice" element={<CloneVoice />} />
      </Route>

      {/* Player отдельно */}
      <Route element={<LayoutPlayer />}>
        <Route path="player" element={<DashboardPlayer />} />
        <Route path='CharacterSheet' element={<CharacterSheet />} />
      </Route>
    </Routes>
  );
}
