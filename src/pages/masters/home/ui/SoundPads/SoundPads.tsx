import { SoundPadsDesktop } from './SoundPadsDesktop/SoundPadsDesktop';
import { SoundPadsMobile } from './SoundPadsMobile/SoundPadsMobile';
import { useMediaQuery } from '../../../../../shared/hooks/auth/useMediaQuery';

export const SoundPads = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  return <>{isDesktop ? <SoundPadsDesktop /> : <SoundPadsMobile />}</>;
};
