import type { User, Enemies } from '../../Form/types';
import { useCharacter } from '@/shared/hooks/auth/useCharacter';
import type { CreatureSide, HoveredToken } from '../../Form/types';
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

  return (
    <div className="flex flex-col gap-[2vh] bg-neutral-900/70 rounded-2xl">
      <h3 className={`text-lg font-bold ${side === 'users' ? 'text-emerald-400' : 'text-red-400'}`}>
        {title ?? defaultTitle}
      </h3>
      {sortedInitiative.map((creature: Creature, sortedIndex) => {
        const entityId = 'id' in creature ? creature.id : sortedIndex;
        const originalIndex = data.findIndex((item: Creature) => 
          'id' in item && item.id === entityId
        );
        
        const hpValue = side === 'users' && 'hp' in creature 
          ? (creature as User).hp 
          : undefined;
        const isEnemy = side === 'enemies';
        const src = getImageSrc(creature);
        const isDead = 'isDead' in creature ? creature.isDead ?? false : false;
        
        const isHoveredRow =
          hoveredToken &&
          hoveredToken.type === (side === 'users' ? 'user' : 'enemy') &&
          hoveredToken.id === entityId;

        return (
          <div
            key={entityId ?? `fallback-${sortedIndex}`}
            className={[
              'flex items-center gap-[2vw] rounded-xl bg-neutral-800/80',
              isDead ? 'opacity-50 line-through' : '',
              isHoveredRow ? 'ring-2 ring-amber-400/90 bg-neutral-700' : '',
            ].filter(Boolean).join(' ')}
          >
            <img
              src={src}
              alt={creature.name}
              className="w-[2vw] rounded-full object-cover"
              onError={() => console.error('PersonList img error:', src)}
            />
            <span className="flex-1 font-semibold text-[1.8vh]">{creature.name}</span>

            {side === 'users' && (
              <div className="flex items-center gap-1">
                <span className="text-[1.8vh] font-bold text-amber-100">HP</span>
                <input
                  type="number"
                  className="w-[4vw] bg-neutral-800/80 text-center text-amber-100 text-[1.8vh] rounded"
                  value={hpValue ?? 0}
                  onChange={(e) => onUpdateHp?.(entityId, Number(e.target.value) || 0)}
                  min="0"
                />
              </div>
            )}

            <div className="flex flex-row relative right-[1vw] gap-[0.5vw]">
              <div className="text-[1.8vh] text-center font-bold text-amber-100 min-w-[1.5vw]">
                Ин
              </div>
              <div className="text-[1.8vh] text-center font-bold text-amber-100 min-w-[2vw]">
                {creature.initiative ?? 0}
              </div>
            </div>

            {isEnemy && originalIndex !== -1 && (
              <button
                type="button"
                onClick={() => onToggleDead?.(originalIndex, !isDead)}
                className={`w-[4vw] h-[4vh] flex items-center gap-[0.5vw] rounded text-[1.4vh] font-bold transition-all ${
                  isDead
                    ? 'bg-green-600/80 text-emerald-100 hover:bg-green-500/80'
                    : 'bg-red-600/80 text-red-100 hover:bg-red-500/80'
                }`}
              >
                {isDead ? '🪦 Воскресить' : '💀 Убить'}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
