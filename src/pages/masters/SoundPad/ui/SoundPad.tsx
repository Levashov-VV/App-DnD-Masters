import { SoundPadDesktop } from './SoundPadDesktop/SoundPadDesktop';
import { SoundPadMobile } from './SoundPadMobile/SoundPadMobile';
import { useMediaQuery } from '../../../../shared/hooks/auth/useMediaQuery';

export const SoundPad: React.FC = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  return <>{isDesktop ? <SoundPadDesktop /> : <SoundPadMobile />}</>;
};

export default SoundPad;
