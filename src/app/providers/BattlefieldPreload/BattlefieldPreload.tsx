import WhiteBlot from '../../../../public/img/masters/Battlefield/Preload/whiteBlot.png';
import { gsap } from 'gsap';
import { useLayoutEffect, useRef } from 'react';

export function BattleFieldPreload() {
  const loaderElementRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const loaderElement = loaderElementRef.current;
    if (!loaderElement) return;
    gsap.fromTo(
      loaderElement,
      { z: '-15vh', opacity: 0, scale: 1 },
      {
        opacity: 1,
        scale: 1,
        z: '0vh',
        duration: 3,
        scrollTrigger: {
          trigger: loaderElement,
          start: 'top 90%',
          end: 'bottom 20%',
        },
      }
    );
  });
  return (
    <section className="flex flex-col items-center w-[100vw] h-full bg-neutral-900">
      <div ref={loaderElementRef}>
        <div>
          <img className="w-[50vw] object-cover" src={WhiteBlot} alt="white blot" />
        </div>
        <div className="relative bottom-[60vh] text-[5vh] text-center text-neutral-900">
          Добро пожаловать
          <br /> на поле для боя
        </div>
      </div>
    </section>
  );
}
