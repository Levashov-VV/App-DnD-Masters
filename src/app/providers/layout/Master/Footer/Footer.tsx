import { FooterDesktop } from './FooterDesktop/FooterDesktop';
import { FooterMobile } from './FooterMobile/FooterMobile';
import { useMediaQuery } from '../../../../../shared/hooks/auth/useMediaQuery';

export function Footer() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  return <>{isDesktop ? <FooterDesktop /> : <FooterMobile />}</>;
}
