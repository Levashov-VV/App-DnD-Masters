import { StartBlock } from './StartBlock/StartBlock';
import { DescriptionApp } from './DescriptionApp/DescriptionApp';
import BattleField from './Battlefield/Battlefield';
import { DiceTray } from './DiceTray/DiceTray';

export function DashboardMaster() {
  return (
    <main>
      <StartBlock />
      <DescriptionApp />
      <BattleField />
      <DiceTray />
    </main>
  );
}
