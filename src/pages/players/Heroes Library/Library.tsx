import { LibraryDesktop } from './LibraryDesktop/LibraryDesktop';
import { LibraryMobile } from './LibraryMobile/LibraryMobile';
import { useMediaQuery } from '../../../shared/hooks/auth/useMediaQuery';

export const HeroLibrary = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  return <>{isDesktop ? <LibraryDesktop /> : <LibraryMobile />}</>;
};
