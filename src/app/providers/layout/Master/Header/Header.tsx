import { HeaderMobile } from './HeaderMobile/HeaderMobile';
import { HeaderDesktop } from './HeaderDesktop/HeaderDesktop';
import { useMediaQuery } from '../../../../../shared/hooks/auth/useMediaQuery';

export function Header() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  return <>{isDesktop ? <HeaderDesktop /> : <HeaderMobile />}</>;
}
