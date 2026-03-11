import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useMediaQuery } from '../../../shared/hooks/auth/useMediaQuery';
import { assetUrl } from '@/shared/utils/assetUrl';

gsap.registerPlugin(MotionPathPlugin);

export function PreloaderProvider() {
  const isLaptopUp = useMediaQuery('(min-width: 1024px)');
  const preloaderRef = useRef(null);
  const diceRef = useRef(null);
  const circlePathRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
  const images = [assetUrl('/img/logo/logo.png'), assetUrl('/img/logo/dice.png')];
  let loadedCount = 0;

  images.forEach((src) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      loadedCount++;
      if (loadedCount === images.length) {
        setImagesLoaded(true);
      }
    };
    img.onerror = () => {
      loadedCount++;
      if (loadedCount === images.length) {
        setImagesLoaded(true);
      }
    };
  });
}, []);
  useLayoutEffect(() => {
    if (!imagesLoaded) return;

    gsap.fromTo(preloaderRef.current, { opacity: 0 }, { opacity: 1, duration: 1 });

    gsap
      .timeline()
      .to(circlePathRef.current, { x: 0 })
      .to(
        diceRef.current,
        {
          motionPath: {
            path: '#circlePath',
            autoRotate: true,
            align: '#circlePath',
            alignOrigin: [0.5, 0.5],
            offsetX: -200,
            offsetY: 0,
          },
          duration: 3,
          ease: 'none',
          repeat: -1,
        },
        '-=1.5'
      );
  }, [imagesLoaded]);

  if (!imagesLoaded) {
    return <div className="w-screen h-screen bg-black" />;
  }

  return (
    <>
      <div className="relative w-screen h-screen overflow-hidden">
        <img
          ref={preloaderRef}
          className="w-[400px] h-[400px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          src={assetUrl('/img/logo/logo.png')}
          alt="logo"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-0">
          <svg
            ref={circlePathRef}
            viewBox="0 0 600 600"
            className="w-full h-full stroke-white stroke-2"
          >
            <path
              id="circlePath"
              d="M 300 300 m -200, 0 a 200 200 0 1,1 400,0 a 200 200 0 1,1 -400,0"
              fill="none"
            />
          </svg>
        </div>
        <img
          className={`z-20 ${isLaptopUp ? 'w-[100px] h-[100px]' : 'w-[40px] h-[40px]'}`}
          ref={diceRef}
          alt="dice"
          src={assetUrl('/img/logo/dice.png')}
        />
      </div>
    </>
  );
}
