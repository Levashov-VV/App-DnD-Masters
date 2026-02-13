import { StartBlock } from './StartBlock/StartBlock';
import { DescriptionApp } from '../../../masters/home/ui/DescriptionApp/DescriptionApp';
import { CharacterSheet } from './Character Sheet/CharacterSheet';
import { DiceTray } from '../../../masters/home/ui/DiceTray/DiceTray';

export function DashboardPlayer() {
  return (
    <div>
      <StartBlock />
      <DescriptionApp />
      <CharacterSheet />
      <DiceTray />
    </div>
  );
}
