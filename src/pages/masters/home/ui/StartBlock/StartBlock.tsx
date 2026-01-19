import backgroundImage from '/img/masters/home/StartHomeImage.png';
import { SplittingText } from '@/components/ui/shadcn-io/splitting-text';
import BlurText from '../../../../../shared/ui/BlurText/BlurText';
import { LazyMotion, domAnimation } from 'motion/react';

export function StartBlock() {
  return (
    <section>
      <div
        className="relative z-20 flex flex-col items-center justify-center  h-screen text-center"
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
