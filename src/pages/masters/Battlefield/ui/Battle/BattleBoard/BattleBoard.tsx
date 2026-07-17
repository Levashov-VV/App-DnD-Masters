import { useMemo, useState, useCallback } from 'react';
import { DndContext, MouseSensor, TouchSensor, useSensors, useSensor } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import type { User, Enemies, BattleFormData, HoveredToken, Environment } from '../../Form/types';
import { GridOverlay } from '../GridOverlay/GridOverlay';
import Token from './Token';

type TokenType = {
  id: string;
  type: 'user' | 'enemy' | 'environment';
  data: User | Enemies | Environment;
  cellX: number;
  cellY: number;
  sizeCells: number;
  sizeY?: number;
  rotation?: number;
};

interface BattleBoardProps {
  battleData: BattleFormData;
  gridWidth: number;
  gridHeight: number;
  mapImage: string;
  onTokenMove?: (id: string, cellX: number, cellY: number) => void;
  onHoverToken?: (hover: HoveredToken) => void;
}

const SIZE_MAP_CREATURE: Record<'small' | 'medium' | 'large' | 'huge', number> = {
  small: 1,
  medium: 1,
  large: 2,
  huge: 3,
};

const getCreatureSizeCells = (sizeInput: string | undefined) => {
  const valid = ['small', 'medium', 'large', 'huge'] as const;
  const key = valid.find((s) => s === sizeInput) ?? 'medium';
  return SIZE_MAP_CREATURE[key];
};

export function BattleBoard({
  battleData,
  gridWidth,
  gridHeight,
  mapImage,
  onTokenMove,
  onHoverToken,
}: BattleBoardProps) {
  const [tokenPositions, setTokenPositions] = useState<
    Record<string, { cellX: number; cellY: number }>
  >({});

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 4 } });
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  const baseTokens = useMemo(() => {
    const next: TokenType[] = [];

    battleData.users.forEach((user, i) => {
      const id = `user-${user.id ?? i}`;
      const sizeCells = getCreatureSizeCells(user.size);

      next.push({
        id,
        type: 'user',
        data: user,
        cellX: Math.max(0, i * 1),
        cellY: Math.floor(i / 3),
        sizeCells,
      });
    });

    battleData.enemies.forEach((enemy, i) => {
      const id = `enemy-${enemy.id ?? i}`;
      const sizeCells = getCreatureSizeCells(enemy.size);

      next.push({
        id,
        type: 'enemy',
        data: enemy,
        cellX: Math.max(0, gridWidth - sizeCells - i * 2),
        cellY: Math.floor(i / 3),
        sizeCells,
      });
    });

    battleData.environment.forEach((env, i) => {
      const id = `env-${env.id}`;

      next.push({
        id,
        type: 'environment',
        data: env,
        cellX: env.cellX ?? i,
        cellY: env.cellY ?? 0,
        sizeCells: env.sizeCells,
        sizeY: env.sizeY,
        rotation: env.rotation ?? 0,
      });
    });

    return next;
  }, [battleData.users, battleData.enemies, battleData.environment, gridWidth]);

  const tokens = useMemo(() => {
    return baseTokens.map((token) => {
      const override = tokenPositions[token.id];
      if (override) {
        return { ...token, cellX: override.cellX, cellY: override.cellY };
      }
      return token;
    });
  }, [baseTokens, tokenPositions]);

  const handleMove = useCallback(
    (id: string, newX: number, newY: number) => {
      const token = tokens.find((t) => t.id === id);
      if (!token) return;

      const size = token.sizeCells;
      const clampedX = Math.max(0, Math.min(gridWidth - size, newX));
      const clampedY = Math.max(0, Math.min(gridHeight - size, newY));

      setTokenPositions((prev) => ({
        ...prev,
        [id]: { cellX: clampedX, cellY: clampedY },
      }));

      onTokenMove?.(id, clampedX, clampedY);
    },
    [tokens, gridWidth, gridHeight, onTokenMove]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, delta } = event;
      const tokenId = active.id as string;

      const token = tokens.find((t) => t.id === tokenId);
      if (!token) return;

      const size = token.sizeCells;

      const container = document.querySelector('.battleboard-container') as HTMLElement | null;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const cellWidth = rect.width / gridWidth;
      const cellHeight = rect.height / gridHeight;

      const deltaCellsX = Math.round(delta.x / cellWidth);
      const deltaCellsY = Math.round(delta.y / cellHeight);

      let newX = token.cellX + deltaCellsX;
      let newY = token.cellY + deltaCellsY;

      newX = Math.max(0, Math.min(gridWidth - size, newX));
      newY = Math.max(0, Math.min(gridHeight - size, newY));

      handleMove(tokenId, newX, newY);
    },
    [tokens, gridWidth, gridHeight, handleMove]
  );

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="relative w-full h-full border-4 border-amber-400/50 rounded-xl overflow-hidden shadow-2xl battleboard-container">
        <img
          src={mapImage}
          className="absolute inset-0 w-full h-full object-cover z-10"
          alt="Battle map"
          loading="eager"
          fetchPriority="high"
        />
        <GridOverlay gridWidth={gridWidth} gridHeight={gridHeight} />
        {tokens.map((token) => (
          <Token
            key={token.id}
            token={token}
            gridWidth={gridWidth}
            gridHeight={gridHeight}
            onHoverToken={onHoverToken}
          />
        ))}
      </div>
    </DndContext>
  );
}
