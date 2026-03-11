import { useState, useEffect, useMemo, useRef } from 'react';
import type { User, Enemies, HoveredToken } from '../../Form/types';
import DefaultLogo from '/img/masters/Battlefield/Figures/Logo-Profile.png';
import { GameImage } from '@/components/GameImage';

interface InitiativeTimerProps {
  users: User[];
  enemies: Enemies[];
  hoveredToken?: HoveredToken;
  onNextTurn: () => void;
}

interface InitiativeItem {
  id: number;
  name: string;
  initiative: number;
  logo: string;
}

const TURN_SECONDS = 60;
const VIEWBOX = 100;
const STROKE = 10;
const R = (VIEWBOX - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

export function InitiativeTimer({
  users,
  enemies,
  hoveredToken,
  onNextTurn,
}: InitiativeTimerProps) {
  const [timeLeft, setTimeLeft] = useState(TURN_SECONDS);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevQueueRef = useRef<InitiativeItem[]>([]);

  const initiativeQueue = useMemo(() => {
    const allCreatures: InitiativeItem[] = [
      ...users.map((u) => ({
        id: u.id,
        name: u.name,
        initiative: u.initiative ?? 0,
        logo: u.logo || DefaultLogo,
      })),
      ...enemies
        .filter((e) => !e.isDead) // ← мёртвые выпадают из очереди
        .map((e) => ({
          id: e.id,
          name: e.name,
          initiative: e.initiative ?? 0,
          logo: e.logo || DefaultLogo,
        })),
    ].sort((a, b) => b.initiative - a.initiative);

    return allCreatures;
  }, [users, enemies]);

  // Корректируем индекс при изменении очереди (смерть/воскрешение)
  useEffect(() => {
    const prevQueue = prevQueueRef.current;
    if (prevQueue.length === 0) {
      prevQueueRef.current = initiativeQueue;
      return;
    }

    const prevCreature = prevQueue[currentIndex % (prevQueue.length || 1)];

    if (prevCreature && initiativeQueue.length > 0) {
      const newIndex = initiativeQueue.findIndex((c) => c.id === prevCreature.id);

      if (newIndex === -1) {
        // Текущее существо умерло — переходим к следующему по кругу
        setCurrentIndex((i) => i % initiativeQueue.length);
      } else {
        // Существо живо — обновляем на новую позицию
        setCurrentIndex(newIndex);
      }
    }

    prevQueueRef.current = initiativeQueue;
  }, [initiativeQueue]); // eslint-disable-line react-hooks/exhaustive-deps

  // Безопасный индекс
  const safeCurrentIndex = useMemo(() => {
    if (initiativeQueue.length === 0) return 0;
    return currentIndex % initiativeQueue.length;
  }, [currentIndex, initiativeQueue.length]);

  useEffect(() => {
    if (isPaused || initiativeQueue.length === 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, initiativeQueue.length]);

  const togglePause = () => {
    setIsPaused((p) => {
      const next = !p;
      if (next === true && timerRef.current) clearInterval(timerRef.current);
      return next;
    });
  };

  const handleNextTurn = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPaused(true);
    setTimeLeft(TURN_SECONDS);
    setCurrentIndex((i) => (initiativeQueue.length ? (i + 1) % initiativeQueue.length : 0));
    onNextTurn();
  };

  const currentCreature = initiativeQueue[safeCurrentIndex];
  const progress =
    initiativeQueue.length === 0 ? 0 : Math.max(0, Math.min(1, timeLeft / TURN_SECONDS));
  const dashOffset = CIRC * (1 - progress);

  return (
    <div className="w-full h-full bg-gradient-to-b from-neutral-900/95 to-neutral-800/90 rounded-2xl p-[1.2vh] shadow-2xl border-2 border-amber-500/60 backdrop-blur-sm flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-emerald-500/10" />

      <h4 className="text-[2vh] font-bold text-amber-400 text-center relative z-10 tracking-wide">
        ТЕКУЩИЙ ХОД
      </h4>

      <div className="flex-1 flex items-center gap-[0.8vw] bg-neutral-800/70 rounded-xl border-neutral-600/50 shadow-lg relative z-10 backdrop-blur-sm">
        <div className="relative flex-shrink-0 w-[5vw] h-[5vw]">
          <GameImage
            src={currentCreature?.logo || DefaultLogo}
            alt={currentCreature?.name || ''}
            className="absolute inset-0 w-full h-full rounded-full object-cover shadow-2xl"
          />
          <div className="absolute inset-0 rounded-full ring-2 ring-neutral-900/70" />

          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
          >
            <defs>
              <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <circle
              cx={VIEWBOX / 2}
              cy={VIEWBOX / 2}
              r={R}
              fill="none"
              stroke="url(#ringGradient)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              opacity="0.25"
            />
            <circle
              cx={VIEWBOX / 2}
              cy={VIEWBOX / 2}
              r={R}
              fill="none"
              stroke="url(#ringGradient)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={dashOffset}
              style={{ transition: isPaused ? 'none' : 'stroke-dashoffset 1s linear' }}
              opacity={isPaused ? 0.35 : 1}
            />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <span className="font-bold text-[2vh] text-amber-300 block truncate leading-tight bg-gradient-to-r from-amber-300 to-amber-100 bg-clip-text text-transparent">
            {currentCreature?.name || 'Нет игроков'}
          </span>
          <span className="text-[1.4vh] text-neutral-300 font-mono tracking-wide">
            Инициатива:{' '}
            <span className="text-amber-400 font-bold">{currentCreature?.initiative ?? 0}</span>
          </span>
        </div>

        <div className="relative right-[0.5vw] flex flex-col items-center gap-[0.4vh] flex-shrink-0">
          <div
            className={`w-[5vh] h-[5vh] rounded-2xl flex items-center justify-center shadow-2xl font-mono font-black text-[2vh] border-2 transition-all duration-300 ${
              timeLeft <= 10
                ? 'bg-red-500/90 border-red-400 shadow-red-500/50 animate-pulse'
                : timeLeft <= 30
                  ? 'bg-amber-500/90 border-amber-400 shadow-amber-500/50'
                  : 'bg-emerald-500/90 border-emerald-400 shadow-emerald-500/50'
            }`}
          >
            {timeLeft.toString().padStart(2, '0')}
          </div>
          <span className="text-[1vh] text-neutral-400 font-medium uppercase tracking-wide">
            сек
          </span>
        </div>
      </div>

      <div className="flex gap-[0.6vh] relative z-10">
        <button
          type="button"
          onClick={togglePause}
          className={`flex-1 h-[3.8vh] rounded-xl font-bold shadow-lg transition-all active:scale-[0.96] text-[1.6vh] tracking-wide backdrop-blur-sm border-2 ${
            isPaused
              ? 'bg-emerald-600/95 hover:bg-emerald-500 border-emerald-400 text-emerald-50 shadow-emerald-500/40'
              : 'bg-amber-600/95 hover:bg-amber-500 border-amber-400 text-amber-50 shadow-amber-500/40'
          }`}
        >
          {isPaused ? '▶️ Запуск' : '⏸️ Пауза'}
        </button>

        <button
          type="button"
          onClick={handleNextTurn}
          className="w-[10vw] h-[3.8vh] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-xl transition-all active:scale-[0.96] border-2 border-blue-400/50 text-[1.6vh] backdrop-blur-sm"
          title="Следующий ход"
        >
          Следующий ход
        </button>
      </div>

      {hoveredToken && (
        <div className="absolute top-1 right-1 w-[1.2vh] h-[1.2vh] bg-amber-400 rounded-full shadow-lg ring-1 ring-amber-400/50 animate-ping" />
      )}
    </div>
  );
}
