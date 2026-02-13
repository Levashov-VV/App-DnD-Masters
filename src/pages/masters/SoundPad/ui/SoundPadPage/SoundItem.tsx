import { SoundPadItemsDesktop } from '../SoundPadItemsDesktop/SoundPadItemsDesktop';
import { SoundPadItemsMobile } from '../SoundPadItemsMobile/SoundPadItemsMobile';
import { useMediaQuery } from '../../../../../shared/hooks/auth/useMediaQuery';

interface Track {
  name: string;
  url: string;
}

interface SoundItemProps {
  track: Track;
}

export const SoundItem: React.FC<SoundItemProps> = ({ track }) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <>
      {isDesktop ? <SoundPadItemsDesktop track={track} /> : <SoundPadItemsMobile track={track} />}
    </>
  );
};
