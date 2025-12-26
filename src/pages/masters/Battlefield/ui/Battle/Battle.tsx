import { useEffect, useRef, useState } from 'react';
import { BattlePreload } from '../../../../../app/providers/BattlefieldPreload/BattlePreload';
import { PersonList } from './PersonList/PersonList';
import { BattleBoard } from './BattleBoard/BattleBoard';
import type { BattleFormData, HoveredToken } from '../Form/types';
import { maps } from '../Form/types';

interface BattleProps {
  battleData: BattleFormData;
}

export function Battle({ battleData }: BattleProps) {
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [battleState, setBattleState] = useState(battleData);
  const [hoveredToken, setHoveredToken] = useState<HoveredToken>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setLoading(false);
      timeoutRef.current = null;
    }, 3000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  useEffect(() => {
    setBattleState(battleData);
  }, [battleData]);

  const handleToggleDead = (index: number, isDead: boolean) => {
    console.log('toggleDead', { index, isDead });
    setBattleState((prev) => ({
      ...prev,
      enemies: prev.enemies.map((enemy, i) => (i === index ? { ...enemy, isDead } : enemy)),
    }));
  };
  const handleHpChange = (entityId: number, hp: number) => {
    setBattleState((prev) => ({
      ...prev,
      users: prev.users.map((user) => (user.id === entityId ? { ...user, hp } : user)),
    }));
  };

  if (loading) return <BattlePreload />;

  const mapId = battleState.mapId ?? 1;
  const customMapImage = battleState.customMapImage ?? '';
  const selectedMap = maps.find((map) => map.id === mapId) || maps[0];
  const mapImage = customMapImage || selectedMap.img;
  const gridSizeX = battleState.gridWidth ?? 30;
  const gridSizeY = battleState.gridHeight ?? 30;

  return (
    <div className="w-full h-[85vh] relative left-[1vw] top-[1vh] z-50 flex flex-row items-center gap-[1vw] text-white">
      <div className="flex flex-row justify-around">
        <div className="w-[20vw] h-[70vh]">
          <PersonList
            side="users"
            users={battleState.users}
            enemies={battleState.enemies}
            hoveredToken={hoveredToken}
            onUpdateHp={handleHpChange}
          />
        </div>
      </div>

      <div className="relative w-[55vw] h-[85vh] top-[5vh] battleboard-container">
        <BattleBoard
          battleData={battleState}
          gridWidth={gridSizeX}
          gridHeight={gridSizeY}
          mapImage={mapImage}
          onHoverToken={(hover) => setHoveredToken(hover)}
        />
      </div>

      <div className="w-[20vw] h-[80vh] flex flex-col justify-center">
        <div className="w-[20vw] h-[70vh]">
          <PersonList
            side="enemies"
            users={battleState.users}
            enemies={battleState.enemies}
            onToggleDead={handleToggleDead}
            hoveredToken={hoveredToken}
            onUpdateHp={handleHpChange}
          />
        </div>
      </div>
    </div>
  );
}
