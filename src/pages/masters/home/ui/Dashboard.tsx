import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
gsap.registerPlugin(ScrollTrigger);

export function DashboardMaster() {
  useEffect(() => {
    gsap.to('.parallax-bg', {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-container',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }, []);
  return (
    <main>
      <img
        className="w-[100vw] h-[100vh] opacity-80"
        src="/img/masters/home/parallax/parallax1.png"
        alt="Background"
      />
      <div className="relative z-20 flex flex-col items-center justify-center h-screen text-white text-center px-8">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold drop-shadow-2xl mb-4">
          Dashboard Master
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl drop-shadow-lg">Эпическое D&D приключение</p>
      </div>
    </main>
  );
}
