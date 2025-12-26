import { useDraggable } from '@dnd-kit/core';
import DefaultLogo from '/img/masters/Battlefield/Figures/Logo-Profile.png';
import type { User, Enemies } from '../../Form/types';
import { useState, useEffect, useCallback } from 'react';

type Creature = User | Enemies;

type TokenType = {
  id: string;
  type: 'user' | 'enemy';
  data: Creature;
  cellX: number;
  cellY: number;
  size: 'small' | 'medium' | 'large' | 'huge';
};

interface TokenProps {
  token: TokenType;
  gridWidth: number;
  gridHeight: number;
  onHoverToken?: (hover: { type: 'user' | 'enemy'; id: string | number | null } | null) => void;
}

const SIZE_MAP = { small: 1, medium: 1, large: 2, huge: 3 };

export default function Token({ token, gridWidth, gridHeight, onHoverToken }: TokenProps) {
  const [hoverTimeout, setHoverTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [mode, setMode] = useState<'figure' | 'logo' | 'default'>('default');
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: token.id });
  const size = SIZE_MAP[token.size];
  const left = (token.cellX / gridWidth) * 100;
  const top = (token.cellY / gridHeight) * 100;
  const width = (size / gridWidth) * 100;
  const height = (size / gridHeight) * 100;

  const enemy = token.type === 'enemy' ? (token.data as Enemies) : undefined;
  const isDead = enemy?.isDead;

  const normalizeImagePath = (path: string | undefined): string => {
    if (!path || path === '') return DefaultLogo;
    let cleanPath = path.replace(/\.\./g, '');
    if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
    return cleanPath;
  };

  const figureSrc = token.data.img ? normalizeImagePath(token.data.img) : '';
  const logoSrc = token.data.logo ? normalizeImagePath(token.data.logo) : '';
  const computedMode = figureSrc ? 'figure' : logoSrc ? 'logo' : 'default';
  useEffect(() => {
    setMode(computedMode);
  }, [computedMode]);
  const entityId = 'id' in token.data ? Number(token.data.id) : null;

  const handleMouseEnter = useCallback(() => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    const timeout = setTimeout(() => {
      onHoverToken?.({
        type: token.type,
        id: entityId,
      });
    }, 0);
    setHoverTimeout(timeout);
  }, [token.type, entityId, onHoverToken, hoverTimeout]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setHoverTimeout(null);
    onHoverToken?.(null);
  }, [hoverTimeout, onHoverToken]);

  const handleError = useCallback(() => {
    if (mode === 'figure' && logoSrc) {
      setMode('logo');
    } else if (mode === 'logo') {
      setMode('default');
    }
  }, [mode, logoSrc]);

  if (isDead) return null;

  const imageSrc =
    mode === 'figure'
      ? figureSrc || logoSrc || DefaultLogo
      : mode === 'logo'
        ? logoSrc || DefaultLogo
        : DefaultLogo;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="absolute z-40 cursor-grab active:cursor-grabbing shadow-2xl hover:scale-105 hover:shadow-3xl transition-all duration-200"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${width}%`,
        height: `${height}%`,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : 'none',
      }}
    >
      <img
        src={imageSrc}
        alt={token.data.name || 'Token'}
        className="w-full h-full object-contain drop-shadow-2xl pointer-events-none"
        onError={handleError}
      />
      <div className="absolute -bottom-0 -right-0 w-[60%] bg-black/95 backdrop-blur-sm text-center text-[60%] rounded-tl-xl truncate font-bold z-50 pointer-events-none">
        {token.data.name?.slice(0, 8)}
      </div>
    </div>
  );
}
