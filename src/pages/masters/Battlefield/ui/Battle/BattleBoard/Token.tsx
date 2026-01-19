import { useDraggable } from '@dnd-kit/core';
import DefaultLogo from '/img/masters/Battlefield/Figures/Logo-Profile.png';
import type { User, Enemies, Environment, HoveredToken } from '../../Form/types';
import { useState, useEffect, useCallback, useMemo } from 'react';

type AnyTokenData = User | Enemies | Environment;

type TokenType = {
  id: string;
  type: 'user' | 'enemy' | 'environment';
  data: AnyTokenData;
  cellX: number;
  cellY: number;
  sizeCells: number;
  sizeY?: number;
  rotation?: number;
};

interface TokenProps {
  token: TokenType;
  gridWidth: number;
  gridHeight: number;
  onHoverToken?: (hover: HoveredToken) => void;
}

function DraggableToken({ token, gridWidth, gridHeight, onHoverToken }: TokenProps) {
  const [hoverTimeout, setHoverTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [mode, setMode] = useState<'figure' | 'logo' | 'default'>('default');

  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: token.id });

  const dataAny = token.data as any;
  const left = (token.cellX / gridWidth) * 100;
  const top = (token.cellY / gridHeight) * 100;
  const width = (token.sizeCells / gridWidth) * 100;
  const height = ((token.sizeY ?? token.sizeCells) / gridHeight) * 100;

  const normalizeImagePath = (path: string | undefined): string => {
    if (!path || path === '') return DefaultLogo;
    let cleanPath = path.replace(/\.\./g, '');
    if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
    return cleanPath;
  };

  const figureSrc = dataAny.img ? normalizeImagePath(dataAny.img) : '';
  const logoSrc = dataAny.logo ? normalizeImagePath(dataAny.logo) : '';

  useEffect(() => {
    const computedMode = figureSrc ? 'figure' : logoSrc ? 'logo' : 'default';
    setMode(computedMode);
  }, [figureSrc, logoSrc]);

  const entityId = typeof dataAny?.id === 'number' ? dataAny.id : null;

  const handleMouseEnter = useCallback(() => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    const timeout = setTimeout(() => onHoverToken?.({ type: token.type, id: entityId }), 0);
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

  const rot = token.rotation ?? 0;
  const translate = transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : '';
  const rotate = `rotate(${rot}deg)`;
  const composedTransform = translate ? `${translate} ${rotate}` : rotate;

  const showNameBadge = token.type === 'user' || token.type === 'enemy';
  const badgeText = (dataAny.name ?? dataAny.label ?? '').slice(0, 8);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="absolute z-40 cursor-grab active:cursor-grabbing hover:scale-105 transition-all duration-200"
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
        className="w-full h-full object-contain pointer-events-none"
      />
      {showNameBadge && (
        <div className="absolute -bottom-0 -right-0 w-[60%] bg-black/95 text-center text-[90%] rounded-tl-xl truncate font-bold z-50 pointer-events-none">
          {badgeText}
        </div>
      )}
    </div>
  );
}

const withAlpha = (hex: string, alpha: number) => {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

function ShapeSVG({
  shape,
  color,
  rotationDeg,
}: {
  shape: Environment['shape'] | string;
  color: string;
  rotationDeg: number;
}) {
  const fillStrong = withAlpha(color, 0.42);
  const stroke = withAlpha(color, 0.85);

  const id = useMemo(() => `grad-${Math.random().toString(16).slice(2)}`, []);

  const isCircleLocked = shape === 'sphere';

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 100 100"
      preserveAspectRatio={isCircleLocked ? 'xMidYMid meet' : 'none'}
      style={{
        transform: `rotate(${rotationDeg}deg)`,
        transformOrigin: '50% 50%',
        filter: `drop-shadow(0 0 10px ${withAlpha(color, 0.35)})`,
      }}
    >
      <defs>
        <radialGradient id={id} cx="30%" cy="30%" r="75%">
          <stop offset="0%" stopColor={withAlpha(color, 0.65)} />
          <stop offset="55%" stopColor={withAlpha(color, 0.35)} />
          <stop offset="100%" stopColor={withAlpha(color, 0.05)} />
        </radialGradient>
      </defs>

      {/* Sphere */}
      {shape === 'sphere' && (
        <circle cx="50" cy="50" r="47" fill={`url(#${id})`} stroke={stroke} strokeWidth="2" />
      )}

      {/* Hemisphere */}
      {shape === 'hemisphere' && (
        <>
          <path
            d="M 3 90 A 47 47 0 0 1 97 90 L 97 90 L 3 90 Z"
            fill={`url(#${id})`}
            stroke={stroke}
            strokeWidth="3"
          />
        </>
      )}

      {/* Cube */}
      {shape === 'cube' && (
        <>
          <rect
            x="3"
            y="3"
            width="94"
            height="94"
            rx="4"
            fill={fillStrong}
            stroke={stroke}
            strokeWidth="2"
          />
        </>
      )}

      {/* Cone */}
      {shape === 'cone' && (
        <>
          <path d="M 50 3 L 97 97 L 3 97 Z" fill={fillStrong} stroke={stroke} strokeWidth="2" />
        </>
      )}

      {/* Line  */}
      {shape === 'line' && (
        <>
          <rect
            x="3"
            y="3"
            width="94"
            height="94"
            rx="3"
            fill={fillStrong}
            stroke={stroke}
            strokeWidth="2"
          />
        </>
      )}

      {/* Fallback */}
      {!['sphere', 'hemisphere', 'cube',  'cone', 'line', ].includes(
        shape
      ) && (
        <rect
          x="3"
          y="3"
          width="94"
          height="94"
          rx="10"
          fill={fillStrong}
          stroke={stroke}
          strokeWidth="2"
        />
      )}
    </svg>
  );
}

function StaticToken({ token, gridWidth, gridHeight, onHoverToken }: TokenProps) {
  const [hoverTimeout, setHoverTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: token.id });

  const dataAny = token.data as any;
  const shape = (dataAny.shape || 'sphere') as Environment['shape'];
  const color = dataAny.color || '#ff4500';

  const left = (token.cellX / gridWidth) * 100;
  const top = (token.cellY / gridHeight) * 100;
  const width = (token.sizeCells / gridWidth) * 100;
  const height = ((token.sizeY ?? token.sizeCells) / gridHeight) * 100;

  const entityId = typeof dataAny?.id === 'number' ? dataAny.id : null;

  const handleMouseEnter = useCallback(() => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    const timeout = setTimeout(() => onHoverToken?.({ type: token.type, id: entityId }), 0);
    setHoverTimeout(timeout);
  }, [token.type, entityId, onHoverToken, hoverTimeout]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setHoverTimeout(null);
    onHoverToken?.(null);
  }, [hoverTimeout, onHoverToken]);

  const rot = token.rotation ?? 0;


  const translate = transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : '';
  const rotate = `rotate(${rot}deg)`;
  const composedTransform = translate ? `${translate} ${rotate}` : rotate;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes} 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="absolute z-30 group hover:scale-110 active:scale-105 transition-all duration-200 cursor-grab active:cursor-grabbing select-none"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${width}%`,
        height: `${height}%`,
        minWidth: '32px',
        minHeight: '32px',
        transform: composedTransform,
        transformOrigin: 'center',
      }}
    >
      <div className="absolute inset-0 rounded-lg  border-white/30 transition-all duration-200" />

      <div className="absolute inset-0 flex items-center justify-center overflow-visible">
        <div
          className="relative"
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <ShapeSVG shape={shape} color={color} rotationDeg={0} />
        </div>
      </div>
    </div>
  );
}

export default function Token({ token, gridWidth, gridHeight, onHoverToken }: TokenProps) {
  const enemy = token.type === 'enemy' ? (token.data as Enemies) : undefined;
  const isDeadEnemy = enemy?.isDead;

  if (isDeadEnemy) return null;

  if (token.type === 'environment') {
    return (
      <StaticToken
        token={token}
        gridWidth={gridWidth}
        gridHeight={gridHeight}
        onHoverToken={onHoverToken}
      />
    );
  }

  return (
    <DraggableToken
      token={token}
      gridWidth={gridWidth}
      gridHeight={gridHeight}
      onHoverToken={onHoverToken}
    />
  );
}
