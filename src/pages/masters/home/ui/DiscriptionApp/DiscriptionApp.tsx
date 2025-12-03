import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';
import dice20 from '../../../../../../public/img/masters/home/dice1d20.svg';
import dice10 from '../../../../../../public/img/masters/home/dice1d10.svg';


export function DescriptionApp() {
  gsap.registerPlugin(ScrollTrigger);
  const containerRef = useRef<HTMLDivElement>(null);
  const diceRef = useRef<HTMLImageElement>(null);
  const diceRef20 = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const dice10 = diceRef.current;
      const dice20 = diceRef20.current;

      if (!container || !dice10 || !dice20) return;

      const mainTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: '+=500%',
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      mainTimeline.to(container, {
        xPercent: -100 * (1 - 0.25),
        ease: 'none',
      });

      const diceTL = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          containerAnimation: mainTimeline,
          start: 'top top',
          end: '+=100%',
          scrub: 1,
        },
      });

      gsap.set(dice10, {
        x: '-10vw',
        y: '60vh',
        scale: 0.8,
        opacity: 1,
        rotation: 0,
      });

      diceTL.to(dice10, {
        x: '155vw',
        y: '-100vh',
        rotation: 720,
        scale: 0.8,
        duration: 4,
      });

      const dice20TL = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          containerAnimation: mainTimeline,
          start: 'top top',
          end: '+=100%',
          scrub: 1,
        },
      });

      gsap.set(dice20, {
        x: '-25vw',
        y: '20vh',
        scale: 0.7,
        opacity: 1,
        rotation: 0,
      });

      dice20TL
        .to(dice20, {
          x: '135vw',
          y: '20vh',
          rotation: 540,
          scale: 0.7,
          duration: 4,
        })
        .to(dice20, {
          x: '135vw',
          y: '-100vh',
          rotation: 1080,
          scale: 0.7,
          duration: 4,
        });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="h-screen">
      <div
        ref={containerRef}
        className="h-screen flex items-center justify-start w-[400vw] bg-neutral-900 relative overflow-hidden"
      >
        <img
          ref={diceRef}
          className="absolute z-10 pointer-events-none w-[12vw] h-[12vw] object-contain"
          src={dice10}
          alt="dice10"
        />
        <img
          ref={diceRef20}
          className="absolute z-10 pointer-events-none w-[12vw] h-[12vw] object-contain"
          src={dice20}
          alt="dice20"
        />

        <div className="w-screen h-screen flex flex-col items-center justify-center text-white px-8 ml-[20vw] relative z-20">
          <div>
            <h3 className="text-2xl md:text-[5vw] relative z-20 leading-tight">
              С нашим приложением вы можете
            </h3>
          </div>
        </div>
        <div className="w-screen h-screen flex items-center text-white relative z-20">
          <h3 className="text-2xl md:text-[5vw] relative z-20 right-[8.5vw]">
            погрузиться в мир D&D улучшить игру
          </h3>
        </div>
        <div className="w-screen h-screen flex items-center text-white relative right-[19vw]">
          <h3 className="text-2xl md:text-[5vw]">интерактивными механиками и сделать</h3>
        </div>
        <div className="w-screen h-screen flex items-center text-white relative right-[23vw]">
          <h3 className="text-2xl md:text-[5vw]">свою партию красочной и незабываемой</h3>
        </div>
      </div>
    </section>
  );
}
