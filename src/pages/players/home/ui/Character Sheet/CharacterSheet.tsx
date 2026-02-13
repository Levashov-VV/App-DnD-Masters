import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMediaQuery } from '../../../../../shared/hooks/auth/useMediaQuery';
import { CharacterSheetDesktop } from './CharacterSheetDesktop/CharacterSheetDesktop';
import { CharacterSheetMobile } from './CharacterSheetMobile/CharacterSheetMobile';

gsap.registerPlugin(ScrollTrigger);

export const CharacterSheet = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  return <>{isDesktop ? <CharacterSheetDesktop /> : <CharacterSheetMobile />}</>;
};
