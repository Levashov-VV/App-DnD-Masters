import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SoundPad from '/img/masters/home/SoundPads/SoundPad.png';

gsap.registerPlugin(ScrollTrigger);

export const SoundPadsDesktop = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const titleElement = titleRef.current;
    const descriptionElement = descriptionRef.current;
    const imageElement = imageRef.current;

    if (!titleElement || !descriptionElement || !imageElement) return;
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
        x: '0vw',
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

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section className="w-screen h-[60vh] bg-neutral-900">
      <article className="flex flex-col items-center gap-[10vh] text-[6vh] w-full">
        <div ref={titleRef} className="w-[80vw] text-center font-bold text-amber-100">
          Погрузись в приключение с помощью Саундпадов
        </div>

        <div className="flex flex-row gap-[20vw] items-start">
          <div
            ref={descriptionRef}
            className="relative left-[5vw] flex flex-col gap-[2vh] w-[55vw] text-[3vh] text-amber-100 leading-relaxed"
          >
            <div>
              Саундпады превращают каждую сессию в кинематографический опыт. Выбери направление —
              мрачные коридоры подземелий, грохот эпичной битвы или оживлённая атмосфера таверны и
              управляй настроением игры с помощью готовых звуковых эффектов. Никакой сложной
              настройки: просто выбери категорию и воспроизводи нужные звуки в нужный момент.
            </div>
          </div>

          <div ref={imageRef} className="relative right-[5vw] w-[25vw] drop-shadow-2xl">
            <img src={SoundPad} alt="SoundPad" className="w-full h-auto object-contain" />
          </div>
        </div>
      </article>
      <div className="w-[80vw] rounded-xl bg-amber-100 h-0.5 opacity-50 relative top-[10vh] left-[10vw]" />
    </section>
  );
};
