import './style.css';
import BlurText from '../../shared/ui/BlurText/BlurText';
import { LazyMotion, domAnimation } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export function SelectRole() {
  const navigate = useNavigate();

  const handleClickMaster = () => {
    navigate('/master');
  };

  const handleClickPlayer = () => {
    navigate('/player');
  }
  return (
    <>
      <div className="selectRoleBlock">
        <div className="imageWrapper" onClick={handleClickMaster}>
          <img className="selectRole" src="/img/Select-role/Master.png" alt="Master" />
        </div>
        <LazyMotion features={domAnimation} strict>
          <BlurText
            text="Для мастеров"
            delay={100}
            animateBy="words"
            direction="top"
            className="text-2xl mb-8 title"
          />
        </LazyMotion>
      </div>
      <div className="border"></div>
      <div className="selectRoleBlock">
        <div className="imageWrapper" onClick={handleClickPlayer}>
          <img className="selectRole" src="/img/Select-role/Players.png" alt="Player" />
        </div>
        <LazyMotion features={domAnimation} strict>
          <BlurText
            text="Для игроков"
            delay={100}
            animateBy="words"
            direction="top"
            className="text-2xl mb-8 title second"
          />
        </LazyMotion>
      </div>
    </>
  );
}
