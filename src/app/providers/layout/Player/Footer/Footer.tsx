import { useMediaQuery } from '../../../../../shared/hooks/auth/useMediaQuery';
import { FooterDesktop } from './FooterDesktop/FooterDesktop';
import { FooterMobile } from './FooterMobile/FooterMobile';

export function Footer() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  return <>{isDesktop ? <FooterDesktop /> : <FooterMobile />}</>;
}
