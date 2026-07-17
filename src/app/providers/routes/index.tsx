import { LayoutMaster } from '../layout/LayoutMaster';
import { LayoutPlayer } from '../layout/LayoutPlayer';
import { Routes, Route } from 'react-router-dom';
import App from '../../../app/index';
import { SelectRole } from '../../../features/select-role/Select-role';
import { DashboardMaster } from '../../../pages/masters/home/ui/Dashboard';
import { DashboardPlayer } from '../../../pages/players/home/ui/Dashboard';
import { CloneVoice } from '@/pages/masters/home/ui/CloneVoice/CloneVoice';
import { HeroLibrary } from '../../../pages/players/Heroes Library/Library';
import { lazy } from 'react';
import { useMediaQuery } from 'react-responsive';
const HeroFormMobile = lazy(
  () =>
    import('../../../pages/players/Heroes Library/LibraryMobile/pages/HeroForm') as Promise<{
      default: React.ComponentType<HeroFormProps>;
    }>
);

const HeroFormDesktop = lazy(
  () =>
    import('../../../pages/players/Heroes Library/LibraryDesktop/pages/HeroForm') as Promise<{
      default: React.ComponentType<HeroFormProps>;
    }>
);

interface HeroFormProps {
  mode: 'create' | 'edit';
  id?: string;
}

function HeroFormWrapper({ mode, id }: HeroFormProps) {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const HeroFormComponent = isMobile ? HeroFormMobile : HeroFormDesktop;

  return <HeroFormComponent mode={mode} id={id} />;
}

const DiceTray = lazy(() =>
  import('../../../pages/masters/DiceTray/ui/DiceTray').then((m) => ({ default: m.DiceTray }))
);
const BattleField = lazy(() =>
  import('../../../pages/masters/Battlefield/ui/Battlefield').then((m) => ({
    default: m.BattleField,
  }))
);
const SoundPad = lazy(() =>
  import('../../../pages/masters/SoundPad/ui/SoundPad').then((m) => ({ default: m.SoundPad }))
);
const SoundPadScenePage = lazy(() =>
  import('../../../pages/masters/SoundPad/ui/SoundPadPage/SPPage').then((m) => ({
    default: m.SoundPadScenePage,
  }))
);


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
          <Route path="player/heroes/create" element={<HeroFormWrapper mode="create" />} />
          <Route path="player/heroes/:id/edit" element={<HeroFormWrapper mode="edit" />} />
          <Route path="player/diceTray" element={<DiceTray />} />
        </Route>
      </Routes>
  );
}
