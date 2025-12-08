import { StartBlock } from './StartBlock/StartBlock';
import { DescriptionApp } from './DescriptionApp/DescriptionApp';
import  BattleField  from './Battlefield/Battlefield';

export function DashboardMaster() {
  return (
    <main>
      <StartBlock />
      <DescriptionApp />
      <BattleField />
    </main>
  );
}
