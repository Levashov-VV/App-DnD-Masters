import { useMediaQuery } from '../../../../../shared/hooks/auth/useMediaQuery';
import { CharacterSectionMobile } from './CharacterSheetMobile/CharacterSectionMobile';
import { CharacterSectionDesktop } from './CharacterSheetDesktop/CharacterSectionDesktop';

interface CharacterSectionProps {
  peakValue: number;
  minValue?: number;
  label: string;
  riseDuration?: number;
  fallDuration?: number;
  pauseDuration?: number;
  rootRef?: React.Ref<HTMLDivElement>;
}

export const CharacterSection = (props: CharacterSectionProps) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return isDesktop ? <CharacterSectionDesktop {...props} /> : <CharacterSectionMobile {...props} />;
};
