import { useDraggable } from '@dnd-kit/core';
import DefaultLogo from '/img/masters/Battlefield/Figures/Logo-Profile.png';
import type { User, Enemies, Environment, HoveredToken } from '../../Form/types';
import { useState, useEffect, useCallback } from 'react';

type AnyTokenData = User | Enemies | Environment;

type TokenType = {
  id: string;
  type: 'user' | 'enemy' | 'environment';
  data: AnyTokenData;
  cellX: number;
  cellY: number;
  sizeCells: number;
  rotation?: number;
};

interface TokenProps {
  token: TokenType;
  gridWidth: number;
  gridHeight: number;
  onHoverToken?: (hover: HoveredToken) => void;
}

export default function Token({ token, gridWidth, gridHeight, onHoverToken }: TokenProps) {
  const [hoverTimeout, setHoverTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [mode, setMode] = useState<'figure' | 'logo' | 'default'>('default');

  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: token.id });

  const left = (token.cellX / gridWidth) * 100;
  const top = (token.cellY / gridHeight) * 100;
  const width = (token.sizeCells / gridWidth) * 100;
  const height = (token.sizeCells / gridHeight) * 100;

  const dataAny = token.data as any;

  const enemy = token.type === 'enemy' ? (token.data as Enemies) : undefined;
  const isDead = enemy?.isDead;
  if (isDead) return null;

  const normalizeImagePath = (path: string | undefined): string => {
    if (!path || path === '') return DefaultLogo;
    let cleanPath = path.replace(/\.\./g, '');
    if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
    return cleanPath;
  };

  const figureSrc = dataAny.img ? normalizeImagePath(dataAny.img) : '';
  const logoSrc = dataAny.logo ? normalizeImagePath(dataAny.logo) : '';

  const computedMode = figureSrc ? 'figure' : logoSrc ? 'logo' : 'default';
  useEffect(() => setMode(computedMode), [computedMode]);

  const entityId = typeof dataAny?.id === 'number' ? dataAny.id : null;

  const handleMouseEnter = useCallback(() => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    const timeout = setTimeout(() => {
      onHoverToken?.({ type: token.type, id: entityId });
    }, 0);
    setHoverTimeout(timeout);
  }, [token.type, entityId, onHoverToken, hoverTimeout]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setHoverTimeout(null);
    onHoverToken?.(null);
  }, [hoverTimeout, onHoverToken]);

  const imageSrc =
    mode === 'figure'
      ? figureSrc || logoSrc || DefaultLogo
      : mode === 'logo'
        ? logoSrc || DefaultLogo
        : DefaultLogo;

  const rot = token.rotation ?? (token.type === 'environment' ? (dataAny.rotation ?? 0) : 0);

  const translate = transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : '';
  const rotate = `rotate(${rot}deg)`;
  const composedTransform = translate ? `${translate} ${rotate}` : rotate;

  const showNameBadge = token.type === 'user' || token.type === 'enemy';
  const badgeText = (dataAny.name ?? '').slice(0, 8);

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
        transform: composedTransform,
        transformOrigin: 'center',
      }}
    >
      <img
        src={imageSrc}
        alt={dataAny.name || dataAny.label || 'Token'}
        className="w-full h-full object-contain drop-shadow-2xl pointer-events-none"
      />

      {showNameBadge && (
        <div className="absolute -bottom-0 -right-0 w-[60%] bg-black/95 backdrop-blur-sm text-center text-[60%] rounded-tl-xl truncate font-bold z-50 pointer-events-none">
          {badgeText}
        </div>
      )}
    </div>
  );
}
