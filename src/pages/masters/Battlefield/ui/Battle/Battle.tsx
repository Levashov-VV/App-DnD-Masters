import { useEffect, useRef, useState } from 'react';
import { BattlePreload } from '../../../../../app/providers/BattlefieldPreload/BattlePreload';
import { PersonList } from './PersonList/PersonList';
import { Environment, type EnvironmentPreset } from './Environment/Environment';
import { BattleBoard } from './BattleBoard/BattleBoard';
import type { BattleFormData, HoveredToken } from '../Form/types';
import { maps } from '../Form/types';

interface BattleProps {
  battleData: BattleFormData;
}

const normalizeBattleData = (data: BattleFormData): BattleFormData => ({
  ...data,
  users: data.users ?? [],
  enemies: data.enemies ?? [],
  environment: data.environment ?? [],
});

const feetToCells = (feet: number) => Math.max(1, Math.round(feet / 5));

export function Battle({ battleData }: BattleProps) {
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [battleState, setBattleState] = useState<BattleFormData>(() =>
    normalizeBattleData(battleData)
  );
  const [hoveredToken, setHoveredToken] = useState<HoveredToken>(null);

  const environmentPresets: readonly EnvironmentPreset[] = [
    {
      id: 201,
      label: 'Огненный шар',
      img: '/img/masters/Battlefield/Environment/FireBall.png',
      defaultFeet: 20,
    },
    {
      id: 202,
      label: 'Конус холода',
      img: '/img/masters/Battlefield/Environment/Ice cone.png',
      defaultFeet: 30,
    },
    {
      id: 203,
      label: 'Молния',
      img: '/img/masters/Battlefield/Environment/Lightning.png',
      defaultFeet: 30,
    },
    {
      id: 204,
      label: 'Тьма',
      img: '/img/masters/Battlefield/Environment/Darkness.png',
      defaultFeet: 30,
    },
    {
      id: 205,
      label: 'Защитный барьер',
      img: '/img/masters/Battlefield/Environment/Protective Barrier.png',
      defaultFeet: 30,
    },
    {
      id: 206,
      label: 'Сфера',
      img: '/img/masters/Battlefield/Environment/Sphere.png',
      defaultFeet: 20,
    },
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

  useEffect(() => {
    setBattleState(normalizeBattleData(battleData));
  }, [battleData]);

  const handleToggleDead = (index: number, isDead: boolean) => {
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
            img: firstPreset.img,
            sizeCells: feetToCells(firstPreset.defaultFeet),
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
              img: preset.img,
              sizeCells: feetToCells(preset.defaultFeet),
            }
          : item
      ),
    }));
  };

  const handleChangeEnvironmentSizeFeet = (index: number, feet: number) => {
    setBattleState((prev) => ({
      ...prev,
      environment: prev.environment.map((item, i) =>
        i === index ? { ...item, sizeCells: feetToCells(feet) } : item
      ),
    }));
  };

  const handleRotateEnvironment = (id: number) => {
    setBattleState((prev) => ({
      ...prev,
      environment: prev.environment.map((e) =>
        e.id === id
          ? {
              ...e,
              rotation: ((e.rotation ?? 0) + 15) as
                | 0
                | 15
                | 30
                | 45
                | 60
                | 75
                | 90
                | 105
                | 120
                | 135
                | 150
                | 165
                | 180
                | 195
                | 210
                | 225
                | 240
                | 255
                | 270
                | 285
                | 300
                | 315
                | 330
                | 345
                | 360,
            }
          : e
      ),
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
    <div className="w-full h-[85vh] relative left-[1vw] top-[1vh] z-100 flex flex-row items-center gap-[1vw] text-white">
      <div className="flex flex-col justify-between w-[20vw] h-[70vh] max-h-[70vh]">
        <div className="w-[20vw] max-h-[40vh]">
          <PersonList
            side="users"
            users={battleState.users}
            enemies={battleState.enemies}
            hoveredToken={hoveredToken}
            onUpdateHp={handleHpChange}
          />
        </div>

        <div className="w-[20vw] max-h-[10vh]">
          <Environment
            environment={battleState.environment}
            presets={environmentPresets}
            onAdd={handleAddEnvironment}
            onRemove={handleRemoveEnvironment}
            onChangePreset={handleChangeEnvironmentPreset}
            onChangeSizeFeet={handleChangeEnvironmentSizeFeet}
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
