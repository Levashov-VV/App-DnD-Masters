import { StartBlock } from './StartBlock/StartBlock';
import { DescriptionApp } from './DescriptionApp/DescriptionApp';
import BattleField from './Battlefield/Battlefield';
import { DiceTray } from './DiceTray/DiceTray';
import { CreatePerson } from './CreatePerson/CreatePerson';

export function DashboardMaster() {
  return (
    <main>
      <StartBlock />
      <DescriptionApp />
      <BattleField />
      <DiceTray />
      <CreatePerson />
    </main>
  );
}
