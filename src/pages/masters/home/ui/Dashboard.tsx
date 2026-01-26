import { StartBlock } from './StartBlock/StartBlock';
import { DescriptionApp } from './DescriptionApp/DescriptionApp';
import BattleField from './Battlefield/Battlefield';
import { DiceTray } from './DiceTray/DiceTray';
import { CloneVoice } from './CloneVoice/CloneVoice';

export function DashboardMaster() {
  return (
    <main>
      <StartBlock />
      <DescriptionApp />
      <BattleField />
      <DiceTray />
      <CloneVoice />
    </main>
  );
}
