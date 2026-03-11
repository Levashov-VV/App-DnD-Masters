import './style.css';
import BlurText from '../../shared/ui/BlurText/BlurText';
import { LazyMotion, domAnimation } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '../../shared/hooks//auth/useMediaQuery';
import { assetUrl } from '@/shared/utils/assetUrl';

export function SelectRole() {
  const navigate = useNavigate();
  const isLaptopUp = useMediaQuery('(min-width: 1024px)');
  const handleClickMaster = () => navigate('/master');
  const handleClickPlayer = () => navigate('/player');

  if (isLaptopUp) {
    return (
      <>
        <div className="selectRoleBlock desktop-select">
          <div className="imageWrapper" onClick={handleClickMaster}>
            <img
              className="selectRole desktop-selectRole"
              src={assetUrl('img/Select-role/Master.png')}
              alt="Master"
            />
          </div>
          <LazyMotion features={domAnimation} strict>
            <BlurText
              text="Для мастеров"
              delay={100}
              animateBy="words"
              direction="top"
              className="title text-[2.5vh]"
            />
          </LazyMotion>
        </div>
        <div className="border"></div>
        <div className="selectRoleBlock desktop-select">
          <div className="imageWrapper" onClick={handleClickPlayer}>
            <img
              className="selectRole desktop-selectRole"
              src={assetUrl('img/Select-role/Players.png')}
              alt="Player"
            />
          </div>
          <LazyMotion features={domAnimation} strict>
            <BlurText
              text="Для игроков"
              delay={100}
              animateBy="words"
              direction="top"
              className="title text-[2.5vh] second"
            />
          </LazyMotion>
        </div>
      </>
    );
  }

  // МОБИЛЬНЫЙ
  return (
    <div className="mobile-select-wrapper">
      <div className="selectRoleBlock mobile-select" onClick={handleClickMaster}>
        <div className="imageWrapper">
          <img
            className="selectRole mobile-selectRole"
            src={assetUrl('img/Select-role/Master.png')}
            alt="Master"
          />
        </div>
        <LazyMotion features={domAnimation} strict>
          <BlurText
            text="Для мастеров"
            delay={100}
            animateBy="words"
            direction="top"
            className="mobile-title second text-[2vh]"
          />
        </LazyMotion>
      </div>
      <div className="selectRoleBlock mobile-select" onClick={handleClickPlayer}>
        <div className="imageWrapper">
          <img
            className="selectRole mobile-selectRole"
            src={assetUrl('img/Select-role/Players.png')}
            alt="Player"
          />
        </div>
        <LazyMotion features={domAnimation} strict>
          <BlurText
            text="Для игроков"
            delay={100}
            animateBy="words"
            direction="top"
            className="mobile-title second text-[2vh]"
          />
        </LazyMotion>
      </div>
    </div>
  );
}
