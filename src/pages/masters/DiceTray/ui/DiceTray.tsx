import { useMediaQuery } from '../../../../shared/hooks/auth/useMediaQuery';
import { DiceTrayDesktop } from '../../DiceTray/ui/DiceTrayDesktop/DiceTray';
import { DiceTrayMobile } from '../../DiceTray/ui/DiceTrayMobile/DiceTray';

export function DiceTray() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  return <>{isDesktop ? <DiceTrayDesktop /> : <DiceTrayMobile />}</>;
}
