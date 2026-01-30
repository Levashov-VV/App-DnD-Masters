interface GridOverlayProps {
  gridWidth: number;
  gridHeight: number;
}

export function GridOverlay({ gridWidth, gridHeight }: GridOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Вертикальные линии */}
      {Array.from({ length: gridWidth + 1 }, (_, i) => (
        <div
          key={`v-${i}`}
          className="absolute top-0 h-full"
          style={{
            left: `${(i * 100) / gridWidth}%`,
            width: '2px',
            background:
              'linear-gradient(to bottom, rgba(251, 191, 36, 0.6), rgba(245, 158, 11, 0.7))',
            boxShadow: '0 0 4px rgba(251, 191, 36, 0.5), inset 0 0 2px rgba(255, 255, 255, 0.3)',
          }}
        />
      ))}
      {/* Горизонтальные линии */}
      {Array.from({ length: gridHeight + 1 }, (_, i) => (
        <div
          key={`h-${i}`}
          className="absolute left-0 w-full"
          style={{
            top: `${(i * 100) / gridHeight}%`,
            height: '2px',
            background:
              'linear-gradient(to right, rgba(251, 191, 36, 0.6), rgba(245, 158, 11, 0.7))',
            boxShadow: '0 0 4px rgba(251, 191, 36, 0.5), inset 0 0 2px rgba(255, 255, 255, 0.3)',
          }}
        />
      ))}
    </div>
  );
}
