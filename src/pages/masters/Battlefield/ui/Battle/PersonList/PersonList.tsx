import type { User, Enemies } from '../../Form/types';
import { useCharacter } from '@/shared/hooks/auth/useCharacter';
import type { CreatureSide, HoveredToken } from '../../Form/types';
import { useRef } from 'react';
import DefaultLogo from '../../../../../../../public/img/masters/Battlefield/Figures/Logo-Profile.png';

type Creature = User | Enemies;

interface PersonListProps {
  side: 'users' | 'enemies';
  users: User[];
  enemies: Enemies[];
  title?: string;
  onToggleDead?: (index: number, isDead: boolean) => void;
  hoveredToken?: HoveredToken;
  onUpdateHp?: (entityId: number, hp: number) => void;
}

export function PersonList({
  side,
  users,
  enemies,
  title,
  onToggleDead,
  hoveredToken,
  onUpdateHp,
}: PersonListProps) {
  const { data: characters } = useCharacter();
  const data = side === 'users' ? users : enemies;
  const sortedInitiative = [...data].sort((a, b) => (b.initiative ?? 1) - (a.initiative ?? 1));
  const defaultTitle = side === 'users' ? 'Герои' : 'Противники';

  const getImageSrc = (item: User | Enemies) => {
    const sideType: CreatureSide = side === 'users' ? 'allies' : 'enemies';
    const itemClassName = (item as User).className;
    const hasClass = !!itemClassName;

    if (hasClass && itemClassName) {
      const character = characters?.find((c) => c.side === sideType && c.name === itemClassName);
      return character?.logo || item.logo || DefaultLogo;
    }

    return item.img || item.logo || DefaultLogo;
  };

  const getHpValue = (creature: Creature): number | null => {
    if ('hp' in creature && creature.hp !== undefined) {
      return Number(creature.hp);
    }
    return null;
  };

  const getMaxHp = (creature: Creature): number => {
    const anyCreature = creature as any;
    const maxHp = anyCreature.maxHp ?? anyCreature.totalHp ?? 100;
    return maxHp;
  };

  const getStatusIcon = (creature: Creature): string => {
    const hp = getHpValue(creature);
    if (hp === null) return '';

    const maxHp = getMaxHp(creature);
    const percent = Math.max(0, Math.min(100, (hp / maxHp) * 100));

    if (percent <= 0) return '💀';
    if (percent < 25) return '🩸';
    if (percent < 50) return '⚠️';
    return '❤️';
  };

  const handleHpChange = (
    entityId: number,
    sign: 1 | -1,
    inputValue: number,
    currentHp: number,
    maxHp: number
  ) => {
    if (!onUpdateHp) return;
    const delta = sign * inputValue;
    const newHp = Math.max(-maxHp, currentHp + delta);
    onUpdateHp(entityId, newHp);
  };

  return (
    <div className="flex flex-col gap-[1.5vh] bg-neutral-900/70 rounded-2xl">
      <h3 className={`text-lg font-bold ${side === 'users' ? 'text-emerald-400' : 'text-red-400'}`}>
        {title ?? defaultTitle}
      </h3>
      {sortedInitiative.map((creature: Creature) => {
        const entityId = creature.id;
        const originalIndex = data.findIndex((item) => item.id === entityId);
        const hpValue = getHpValue(creature);
        const maxHpValue = getMaxHp(creature);
        const hpPercent =
          hpValue !== null ? Math.max(0, Math.min(100, (hpValue / maxHpValue) * 100)) : 0;
        const isEnemy = side === 'enemies';
        const src = getImageSrc(creature);

        // ✅ Логика состояний
        const hasHp = hpValue !== null;
        const isDeadByHp = hasHp && hpValue <= 0;
        const enemyIsDead = !hasHp && (creature as Enemies).isDead;
        const inputRef = useRef<HTMLInputElement>(null);

        const isHoveredRow =
          hoveredToken &&
          hoveredToken.type === (side === 'users' ? 'user' : 'enemy') &&
          hoveredToken.id === entityId;

        return (
          <div
            key={`row-${entityId}`}
            className={[
              'flex items-center gap-[1vw] rounded-xl bg-neutral-800/80 hover:bg-neutral-700/80 transition-all group',
              isDeadByHp || enemyIsDead
                ? 'opacity-60 line-through border-l-4 border-red-500/70'
                : '',
              isHoveredRow ? 'ring-2 ring-amber-400/90 shadow-lg scale-[1.01]' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {/* Аватарка */}
            <div className="relative flex-shrink-0">
              <img
                src={src}
                alt={creature.name}
                className="w-[4vw] h-[4vw] rounded-full object-cover border-neutral-600 group-hover:border-amber-400 transition-all shadow-sm"
                onError={() => console.error('PersonList img error:', src)}
              />
              {getStatusIcon(creature) && (
                <span className="absolute -bottom-0.5 -right-0.5 text-[1.1vw] drop-shadow-lg animate-pulse">
                  {getStatusIcon(creature)}
                </span>
              )}
            </div>

            <span className="flex-1 font-semibold text-[1.8vh] truncate">{creature.name}</span>

            {/* ✅ HP БЛОК - только герои */}
            {hasHp && (
              <div className="flex-shrink-0 w-[6vw] flex flex-col items-center gap-px bg-neutral-900/90 rounded-lg shadow-md group-hover:shadow-lg">
                <div className="w-full h-[0.4vh] bg-neutral-700 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      hpPercent > 70
                        ? 'bg-emerald-400'
                        : hpPercent > 40
                          ? 'bg-amber-400'
                          : hpPercent > 15
                            ? 'bg-orange-500'
                            : 'bg-red-500'
                    }`}
                    style={{ width: `${hpPercent}%` }}
                  />
                </div>
                <span
                  className={`text-[1.6vh] font-mono font-bold ${hpPercent <= 0 ? 'text-red-400 animate-pulse' : 'text-amber-100'}`}
                >
                  {hpValue}
                </span>
                <div className="flex items-center w-full gap-0.5">
                  <button
                    type="button"
                    className="flex-1 h-[3vh] bg-red-600/95 hover:bg-red-500 text-[1.5vh] font-bold rounded shadow transition-all active:scale-[0.97]"
                    onClick={() => {
                      const val = Number(inputRef.current?.value) || 5;
                      handleHpChange(entityId, -1, val, hpValue || 0, maxHpValue); // ✅ −
                    }}
                    title="Уменьшить"
                  >
                    −
                  </button>
                  <input
                    ref={inputRef}
                    type="number"
                    defaultValue="5"
                    min="1"
                    max={maxHpValue}
                    className="w-[2.2vw] h-[3vh] bg-neutral-700/90 border-neutral-600 hover:border-amber-400 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/50 focus:outline-none text-center text-[1.5vh] text-amber-100 rounded shadow-sm transition-colors duration-200 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pr-0"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = Number((e.target as HTMLInputElement).value) || 5;
                        handleHpChange(entityId, -1, val, hpValue || 0, maxHpValue);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="flex-1 h-[3vh] bg-emerald-600/95 hover:bg-emerald-500 text-[1.2vh] font-bold rounded shadow transition-all active:scale-[0.97]"
                    onClick={() => {
                      const val = Number(inputRef.current?.value) || 5;
                      handleHpChange(entityId, 1, val, hpValue || 0, maxHpValue); // ✅ +
                    }}
                    title="Увеличить"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="w-[3vw] flex items-center gap-[0.4vw]">
              <span className="text-[1.5vh] font-bold text-amber-300 inline-block">Ин:</span>
              <span className="text-[1.8vh] font-bold text-amber-300 inline-block">
                {creature.initiative ?? 0}
              </span>
            </div>

            {/* ✅ КНОПКИ ВРАГОВ (без HP) */}
            {isEnemy && !hasHp && originalIndex >= 0 && (
              <>
                {!enemyIsDead && (
                  <button
                    type="button"
                    onClick={() => onToggleDead?.(originalIndex, true)}
                    className="w-[4.5vw] h-[3.8vh] rounded-lg text-sm font-bold shadow-md transition-all bg-red-600/95 hover:bg-red-500 text-red-50"
                    title="Убить"
                  >
                    ☠️
                  </button>
                )}
                {enemyIsDead && (
                  <button
                    type="button"
                    onClick={() => onToggleDead?.(originalIndex, false)}
                    className="w-[4.5vw] h-[3.8vh] rounded-lg text-sm font-bold shadow-md transition-all bg-emerald-600/95 hover:bg-emerald-500 text-emerald-50"
                    title="Воскресить"
                  >
                    🪦
                  </button>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
