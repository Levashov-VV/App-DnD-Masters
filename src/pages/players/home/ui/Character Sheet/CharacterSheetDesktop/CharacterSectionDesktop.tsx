import { useState, useEffect, useRef } from 'react';

interface CharacterSectionProps {
  peakValue: number;
  minValue?: number;
  label: string;
  riseDuration?: number;
  fallDuration?: number;
  pauseDuration?: number;
  rootRef?: React.Ref<HTMLDivElement>;
}

export const CharacterSectionDesktop = ({
  peakValue = 18,
  minValue = 0,
  label,
  riseDuration = 1000,
  fallDuration = 750,
  pauseDuration = 750,
  rootRef,
}: CharacterSectionProps) => {
  const [count, setCount] = useState(minValue);
  const rafRef = useRef<number>(0);
  const phaseRef = useRef<'rise' | 'fall'>('rise');
  const startCountRef = useRef(minValue);
  const startTimeRef = useRef(0);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const isRising = phaseRef.current === 'rise';
      const duration = isRising ? riseDuration : fallDuration;
      const endValue = isRising ? peakValue : minValue;

      if (elapsed < duration) {
        const progress = elapsed / duration;
        const newCount = startCountRef.current + (endValue - startCountRef.current) * progress;
        setCount(Math.floor(newCount));
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setCount(endValue);
        pauseTimerRef.current = setTimeout(() => {
          phaseRef.current = isRising ? 'fall' : 'rise';
          startCountRef.current = endValue;
          startTimeRef.current = Date.now();
          rafRef.current = requestAnimationFrame(animate);
        }, pauseDuration);
      }
    };

    startCountRef.current = minValue;
    startTimeRef.current = Date.now();
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, [riseDuration, fallDuration, pauseDuration, peakValue, minValue]);

  return (
    <div
      ref={rootRef}
      className="character-section w-[10vw] h-[25vh] bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-500 relative overflow-hidden"
      style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)' }}
    >
      <div className="text-[2.3vh] uppercase tracking-[0.2em] font-black z-20 text-gray-900/80">
        {label}
      </div>
      <div className="relative left-[0.5vw] z-10 h-0.5 w-[9vw] bg-black"></div>

      <div className="relative top-[3.5vh] text-center text-[5vh] text-black z-20 font-mono">
        {count}
      </div>

      <img
        className="relative z-10 left-[3.5vw] top-[6.0vh] w-[3vw]"
        src="../../../../../../public/img/players/Sword.png"
        alt="sword"
      />
    </div>
  );
};
