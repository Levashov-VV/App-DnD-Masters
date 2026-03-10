import { StartBlock } from './StartBlock/StartBlock';
import { DescriptionApp } from './DescriptionApp/DescriptionApp';
import BattleField from './Battlefield/Battlefield';
import { DiceTray } from './DiceTray/DiceTray';
// import { CloneVoice } from './CloneVoice/CloneVoice';
import { SoundPads } from './SoundPads/SoundPads';
import { useMediaQuery } from '../../../../shared/hooks/auth/useMediaQuery';

export function DashboardMaster() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  if (isDesktop) {
    return (
      <main>
        <StartBlock />
        <DescriptionApp />
        <BattleField />
        <DiceTray />
        <SoundPads />
        {/* <CloneVoice /> */}
      </main>
    );
  }

  return (
    <main>
      <StartBlock />
      <SoundPads />
      <DiceTray />
    </main>
  );
}
