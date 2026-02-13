import backgroundImage from '/img/masters/home/StartHomeImage.png';
import BackgroundMobileImage from '../../../../../../public/img/players/StartBlock/BackGround.jpg';
import { SplittingText } from '@/components/ui/shadcn-io/splitting-text';
import BlurText from '../../../../../shared/ui/BlurText/BlurText';
import { LazyMotion, domAnimation } from 'motion/react';
import { useMediaQuery } from '../../../../../shared/hooks/auth/useMediaQuery';

export function StartBlock() {
  const isLaptopUp = useMediaQuery('(min-width: 1024px)');
  if (isLaptopUp) {
    return (
      <section>
        <div
          className="relative z-20 flex flex-col items-center justify-center h-screen text-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            width: '100vw',
            height: '100vh',
            backgroundSize: 'cover',
          }}
        >
          <div className="relative left-[2vw] flex flex-col gap-[3vh]">
            <SplittingText
              className="text-[5vh] font-bold drop-shadow-lg"
              text="Добро пожаловать !"
            />
            <LazyMotion features={domAnimation} strict>
              <BlurText
                text="Ассистент Мастера Подземелий"
                delay={500}
                animateBy="words"
                direction="top"
                className="text-[7vh] font-bold drop-shadow-2xl"
              />
            </LazyMotion>
          </div>
        </div>
      </section>
    );
  }

  // МОБИЛЬНАЯ ВЕРСИЯ
  return (
    <section>
      <div
        className="relative z-20 flex flex-col items-center justify-center text-center h-screen overflow-x-hidden"
        style={{
          backgroundImage: `url(${BackgroundMobileImage})`,
          width: '100vw',
          height: '100vh',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

        <div className="relative top-[30vh] z-10 flex flex-col w-full">
          <SplittingText
            className="flex justify-center text-[15vw] font-bold drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] leading-tight -tracking-[0.02em]"
            text="Ассистент"
          />
          <LazyMotion features={domAnimation} strict>
            <BlurText
              text="Мастера Подземелий"
              delay={500}
              animateBy="words"
              direction="top"
              className="flex justify-center text-[15vw] font-bold drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] leading-tight -tracking-[0.01em]"
            />
          </LazyMotion>
        </div>
      </div>
    </section>
  );
}
