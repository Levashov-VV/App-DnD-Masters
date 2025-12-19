import { useEffect, useState, useCallback } from 'react';
import { DndContext, MouseSensor, TouchSensor, useSensors, useSensor } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import type { User, Enemies, BattleFormData, HoveredToken } from '../../Form/types';
import { GridOverlay } from '../GridOverlay/GridOverlay';
import Token from './Token';

type TokenType = {
  id: string;
  type: 'user' | 'enemy';
  data: User | Enemies;
  cellX: number;
  cellY: number;
  size: 'small' | 'medium' | 'large' | 'huge';
};

interface BattleBoardProps {
  battleData: BattleFormData;
  gridWidth: number;
  gridHeight: number;
  mapImage: string;
  onTokenMove?: (id: string, cellX: number, cellY: number) => void;
onHoverToken?: (hover: HoveredToken) => void;

}

const SIZE_MAP: Record<TokenType['size'], number> = {
  small: 1,
  medium: 1,
  large: 2,
  huge: 3,
};

const getTokenSize = (sizeInput: string | undefined): TokenType['size'] => {
  const validSizes: TokenType['size'][] = ['small', 'medium', 'large', 'huge'];
  return (validSizes.find((s) => s === sizeInput) || 'medium') as TokenType['size'];
};

export function BattleBoard({
  battleData,
  gridWidth,
  gridHeight,
  mapImage,
  onTokenMove,
  onHoverToken,
}: BattleBoardProps) {
  const [tokens, setTokens] = useState<TokenType[]>([]);
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 4,
    },
  });
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    setTokens((prev) => {
      const next: TokenType[] = [];

      battleData.users.forEach((user, i) => {
        const id = `user-${user.id ?? i}`;
        const existing = prev.find((t) => t.id === id);

        next.push(
          existing
            ? { ...existing, data: user, size: getTokenSize(user.size) }
            : {
                id,
                type: 'user' as const,
                data: user,
                cellX: Math.max(0, i * 2),
                cellY: Math.floor(i / 3),
                size: getTokenSize(user.size),
              }
        );
      });

      battleData.enemies.forEach((enemy, i) => {
        const id = `enemy-${enemy.id ?? i}`;
        const existing = prev.find((t) => t.id === id);

        next.push(
          existing
            ? { ...existing, data: enemy, size: getTokenSize(enemy.size) }
            : {
                id,
                type: 'enemy' as const,
                data: enemy,
                cellX: Math.max(0, gridWidth - (SIZE_MAP[getTokenSize(enemy.size)] || 2) - i * 2),
                cellY: Math.floor(i / 3),
                size: getTokenSize(enemy.size),
              }
        );
      });

      return next;
    });
  }, [battleData, gridWidth, gridHeight]);

  const handleMove = useCallback(
    (id: string, newX: number, newY: number) => {
      setTokens((prev) => {
        const token = prev.find((t) => t.id === id);
        if (!token) return prev;

        const size = SIZE_MAP[token.size];
        const clampedX = Math.max(0, Math.min(gridWidth - size, newX));
        const clampedY = Math.max(0, Math.min(gridHeight - size, newY));

        const collides = prev.some(
          (other) =>
            other.id !== id &&
            Math.max(clampedX, other.cellX) <
              Math.min(clampedX + size, other.cellX + SIZE_MAP[other.size]) &&
            Math.max(clampedY, other.cellY) <
              Math.min(clampedY + size, other.cellY + SIZE_MAP[other.size])
        );

        const newToken: TokenType = collides
          ? token
          : { ...token, cellX: clampedX, cellY: clampedY };
        onTokenMove?.(id, newToken.cellX, newToken.cellY);
        return prev.map((t) => (t.id === id ? newToken : t));
      });
    },
    [gridWidth, gridHeight, onTokenMove]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, delta } = event;
      const tokenId = active.id as string;

      const token = tokens.find((t) => t.id === tokenId);
      if (!token) return;

      const size = SIZE_MAP[token.size];

      const container = document.querySelector('.battleboard-container') as HTMLElement;
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
        <GridOverlay gridWidth={gridWidth} gridHeight={gridHeight} />
      </div>
    </DndContext>
  );
}
