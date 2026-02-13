import { useMediaQuery } from '../../../../../shared/hooks/auth/useMediaQuery';
import { DiceTrayDesktop } from './DiceTrayDesktop/DiceTrayDesktop';
import { DiceTrayMobile } from './DiceTrayMobile/DiceTrayMobile';

export function DiceTray() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return isDesktop ? <DiceTrayDesktop /> : <DiceTrayMobile />;
}
