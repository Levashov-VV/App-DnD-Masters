import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SoundPad from '/img/masters/home/SoundPads/SoundPad.png';
import type { FC } from 'react';

gsap.registerPlugin(ScrollTrigger);

interface SoundPadButtonProps {
  gradientFrom: string;
  gradientTo: string;
  className?: string;
}

export const SoundPadButton: FC<SoundPadButtonProps> = ({
  gradientFrom,
  gradientTo,
  className = '',
}) => {
  return (
    <button
      className={`
        sound-pad-button
        relative w-[20vw] h-[20vw] rounded-2xl
        bg-gradient-to-br ${gradientFrom} ${gradientTo}
        shadow-lg shadow-black/50
        border-white/10
        ${className}
      `}
    ></button>
  );
};

export const SoundPadsMobile = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const soundPadsRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const soundPads = [
    { id: 1, from: 'from-cyan-400', to: 'to-blue-600' },
    { id: 2, from: 'from-fuchsia-500', to: 'to-pink-600' },
    { id: 3, from: 'from-purple-500', to: 'to-fuchsia-600' },
    { id: 4, from: 'from-orange-400', to: 'to-pink-500' },
  ];

  useLayoutEffect(() => {
    const titleElement = titleRef.current;
    const descriptionElement = descriptionRef.current;
    const imageElement = imageRef.current;
    const soundPadsContainer = soundPadsRef.current;
    const textElement = textRef.current;

    if (!titleElement || !descriptionElement || !imageElement || !textElement) return;

    gsap.fromTo(
      titleElement,
      { y: '-15vh', opacity: 0, scale: 0.6 },
      {
        opacity: 1,
        scale: 1,
        y: '0vh',
        duration: 1,
        scrollTrigger: {
          trigger: titleElement,
          start: 'top 90%',
          end: 'bottom 70%',
          scrub: 1,
        },
      }
    );

    gsap.fromTo(
      descriptionElement,
      { x: '-10vw', opacity: 0 },
      {
        x: '0',
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: descriptionElement,
          start: 'top 85%',
          end: 'bottom 50%',
          scrub: 1,
        },
      }
    );

    gsap.fromTo(
      imageElement,
      { x: '10vw', opacity: 0, rotate: -10 },
      {
        x: '0vw',
        opacity: 1,
        rotate: 0,
        duration: 1,
        scrollTrigger: {
          trigger: imageElement,
          start: 'top 85%',
          end: 'bottom 70%',
          scrub: 1,
        },
      }
    );
    gsap.fromTo(
      textRef.current,
      { opacity: 0, x: '20vw' },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 85%',
          end: 'bottom 70%',
          scrub: 1,
        },
      }
    );

    if (soundPadsContainer) {
      const buttons = soundPadsContainer.querySelectorAll('.sound-pad-button');

      gsap.timeline({ repeat: -1, repeatDelay: 0 }).to(buttons, {
        scale: 1.15,
        duration: 0.4,
        ease: 'power1.inOut',
        stagger: {
          each: 0.15,
          repeat: -1,
          yoyo: true,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.killTweensOf('.sound-pad-button');
    };
  }, []);

  return (
    <section className="relative top-[10vh] w-screen h-[130vh] bg-neutral-900 overflow-x-hidden">
      <article className="flex flex-col items-center gap-[10vh] text-[3.2vh]">
        <div ref={titleRef} className="w-[90vw] text-center font-bold text-amber-100">
          Погрузись в приключение с помощью Саундпадов
        </div>
        <div ref={imageRef} className="relative right-[2vw] w-[60vw] drop-shadow-2xl">
          <img src={SoundPad} alt="SoundPad" className="w-full h-auto object-contain" loading="eager" fetchPriority="high" />
        </div>
        <div className="flex flex-row gap-[20vw] items-start">
          <div
            ref={descriptionRef}
            className="flex flex-col text-center gap-[2vh] w-[98vw] text-[3vh] text-amber-100 leading-relaxed"
          >
            <div>
              Выбери направление - мрачные коридоры подземелий, эпичная битва или оживлённая
              атмосфера таверны
            </div>
          </div>
        </div>
        <div ref={soundPadsRef} className="flex flex-col">
          <div className="flex flex-row gap-[4vw]">
            {soundPads.map((pad) => (
              <SoundPadButton key={pad.id} gradientFrom={pad.from} gradientTo={pad.to} />
            ))}
          </div>
        </div>
        <div ref={textRef} className=" w-[95vw] text-center text-amber-100">
          Управляй настроением игры с помощью готовых звуковых эффектов
        </div>
      </article>
      <div className="w-screen rounded-xl bg-amber-100 h-0.5 opacity-50 relative top-[10vh]" />
    </section>
  );
};
