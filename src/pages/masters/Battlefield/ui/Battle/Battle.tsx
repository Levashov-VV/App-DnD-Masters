import { useEffect, useRef, useState, useMemo } from 'react';
import { BattlePreload } from '../../../../../app/providers/BattlefieldPreload/BattlePreload';
import { PersonList } from './PersonList/PersonList';
import { Environment, type EnvironmentPreset } from './Environment/Environment';
import { InitiativeTimer } from './Timer/Timer';
import { BattleBoard } from './BattleBoard/BattleBoard';
import type { BattleFormData, HoveredToken } from '../Form/types';
import { maps } from '../Form/types';
import { assetUrl } from '@/shared/utils/assetUrl';

interface BattleProps {
  battleData: BattleFormData;
}

const normalizeBattleData = (data: BattleFormData): BattleFormData => {
  const normalized = {
    ...data,
    users: data.users ?? [],
    enemies: data.enemies ?? [],
    environment: data.environment ?? [],
  };

  const fixedUsers = normalized.users.map((user) => ({
    ...user,
    maxHp: user.maxHp ?? user.hp ?? 100,
  }));

  return {
    ...normalized,
    users: fixedUsers,
  };
};

const feetToCells = (feet: number) => Math.max(1, Math.round(feet / 5));

export function Battle({ battleData }: BattleProps) {
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initialBattleState = useMemo(() => normalizeBattleData(battleData), [battleData]);

  const [battleState, setBattleState] = useState<BattleFormData>(initialBattleState);
  const [hoveredToken, setHoveredToken] = useState<HoveredToken>(null);

  const environmentPresets: readonly EnvironmentPreset[] = [
    { id: 201, label: 'Сфера', shape: 'sphere', defaultFeet: 4, color: '#ff4500' },
    { id: 202, label: 'Конус', shape: 'cone', defaultFeet: 6, color: '#FFFAFA' },
    { id: 203, label: 'Линия', shape: 'line', defaultFeet: 1, color: '#00bfff' },
    { id: 204, label: 'Куб', shape: 'cube', defaultFeet: 4, color: '#8B4513' },
    { id: 205, label: 'Полусфера', shape: 'hemisphere', defaultFeet: 6, color: '#00ff88' },
  ] as const;

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setLoading(false);
      timeoutRef.current = null;
    }, 3000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Обновляем состояние только когда изменились данные битвы
  useEffect(() => {
    setBattleState(initialBattleState);
  }, [initialBattleState]);

  const handleHpChange = (entityId: number, hp: number) => {
    setBattleState((prev) => ({
      ...prev,
      users: prev.users.map((user) => (user.id === entityId ? { ...user, hp } : user)),
      enemies: prev.enemies.map((enemy) => (enemy.id === entityId ? { ...enemy, hp } : enemy)),
    }));
  };

  const handleToggleDead = (index: number, isDead: boolean) => {
    setBattleState((prev) => ({
      ...prev,
      enemies: prev.enemies.map((enemy, i) => (i === index ? { ...enemy, isDead } : enemy)),
    }));
  };

  const handleAddEnvironment = () => {
    setBattleState((prev) => {
      const nextId = (prev.environment.reduce((m, e) => Math.max(m, e.id), 0) ?? 0) + 1;
      const firstPreset = environmentPresets[0];

      return {
        ...prev,
        environment: [
          ...prev.environment,
          {
            id: nextId,
            presetId: firstPreset.id,
            shape: firstPreset.shape,
            label: firstPreset.label,
            color: firstPreset.color,
            sizeCells: firstPreset.defaultFeet,
            sizeY: firstPreset.defaultFeet,
            cellX: 0,
            cellY: 0,
            rotation: 0,
          },
        ],
      };
    });
  };

  const handleRemoveEnvironment = (index: number) => {
    setBattleState((prev) => ({
      ...prev,
      environment: prev.environment.filter((_, i) => i !== index),
    }));
  };

  const handleChangeEnvironmentPreset = (index: number, presetId: number) => {
    const preset = environmentPresets.find((p) => p.id === presetId);
    if (!preset) return;

    setBattleState((prev) => ({
      ...prev,
      environment: prev.environment.map((item, i) =>
        i === index
          ? {
              ...item,
              presetId: preset.id,
              shape: preset.shape,
              label: preset.label,
              color: preset.color,
              sizeCells: preset.defaultFeet,
              sizeY: preset.defaultFeet,
            }
          : item
      ),
    }));
  };

  const handleChangeEnvironmentSizeFeet = (
    index: number,
    widthFeet: number,
    heightFeet: number
  ) => {
    setBattleState((prev) => ({
      ...prev,
      environment: prev.environment.map((item, i) =>
        i === index
          ? {
              ...item,
              sizeCells: feetToCells(widthFeet),
              sizeY: feetToCells(heightFeet),
            }
          : item
      ),
    }));
  };

  const handleChangeEnvironmentColor = (index: number, color: string) => {
    setBattleState((prev) => ({
      ...prev,
      environment: prev.environment.map((item, i) => (i === index ? { ...item, color } : item)),
    }));
  };

  const handleRotateEnvironment = (index: number, rotation: number) => {
    setBattleState((prev) => ({
      ...prev,
      environment: prev.environment.map((item, i) => (i === index ? { ...item, rotation } : item)),
    }));
  };

  const handleNextTurn = () => {
    console.log('Next turn (manual)');
  };

  if (loading) return <BattlePreload />;

  const mapId = battleState.mapId ?? 1;
  const customMapImage = battleState.customMapImage ?? '';
  const selectedMap = maps.find((map) => map.id === mapId) || maps[0];
  const mapImage = customMapImage || assetUrl(selectedMap.img);
  const gridSizeX = battleState.gridWidth ?? 30;
  const gridSizeY = battleState.gridHeight ?? 30;

  return (
    <div className="w-full h-[85vh] relative left-[1vw] top-[1vh] z-100 flex flex-row items-center gap-[1vw] text-white">
      <div className="flex flex-col justify-between w-[20vw] h-[90vh] gap-[1vh]">
        <div className="relative top-[9vh] w-[20vw] h-[65vh] overflow-x-auto">
          <PersonList
            side="users"
            users={battleState.users}
            enemies={battleState.enemies}
            hoveredToken={hoveredToken}
            onUpdateHp={handleHpChange}
          />
        </div>

        <div className="w-[20vw] h-[15vh] overflow-x-auto">
          <Environment
            environment={battleState.environment}
            presets={environmentPresets}
            onAdd={handleAddEnvironment}
            onRemove={handleRemoveEnvironment}
            onChangePreset={handleChangeEnvironmentPreset}
            onChangeSizeFeet={handleChangeEnvironmentSizeFeet}
            onChangeColor={handleChangeEnvironmentColor}
            onRotate={handleRotateEnvironment}
          />
        </div>
      </div>

      <div className="relative w-[55vw] h-[85vh] top-[5vh]">
        <BattleBoard
          battleData={battleState}
          gridWidth={gridSizeX}
          gridHeight={gridSizeY}
          mapImage={mapImage}
          onHoverToken={(hover) => setHoveredToken(hover)}
          onTokenMove={(id, cellX, cellY) => {
            if (!id.startsWith('env-')) return;
            const envId = Number(id.replace('env-', ''));

            setBattleState((prev) => ({
              ...prev,
              environment: prev.environment.map((e) =>
                e.id === envId ? { ...e, cellX, cellY } : e
              ),
            }));
          }}
        />
      </div>
      <div className="relative top-[5vh] w-[20vw] h-[90vh] flex flex-col justify-center gap-[1vh]">
        <div className="w-[20vw] h-[65vh] overflow-x-auto">
          <PersonList
            side="enemies"
            users={battleState.users}
            enemies={battleState.enemies}
            onToggleDead={handleToggleDead}
            hoveredToken={hoveredToken}
            onUpdateHp={handleHpChange}
          />
        </div>

        <div className="w-full h-[18vh] flex-shrink-0">
          <InitiativeTimer
            users={battleState.users}
            enemies={battleState.enemies}
            hoveredToken={hoveredToken}
            onNextTurn={handleNextTurn}
          />
        </div>
      </div>
    </div>
  );
}
