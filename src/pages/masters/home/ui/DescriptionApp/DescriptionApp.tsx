import { useMediaQuery } from '../../../../../shared/hooks/auth/useMediaQuery';
import { DescriptionAppDesktop } from './DescriptionDesktop';
import { DescriptionAppMobile } from './DescriptionMobile';

export function DescriptionApp() {
  const isMobile = useMediaQuery('(max-width: 1024px)');

  return isMobile ? <DescriptionAppMobile /> : <DescriptionAppDesktop />;
}
