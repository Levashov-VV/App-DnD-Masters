import { SoundPageDesktop } from './SoundPageDesktop/SoundPageDesktop';
import { SoundPageMobile } from './SoundPageMobile/SoundPageMobile';
import { useMediaQuery } from '@/shared/hooks/auth/useMediaQuery';

export const SoundPadScenePage = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  return <>{isDesktop ? <SoundPageDesktop /> : <SoundPageMobile />}</>;
};
