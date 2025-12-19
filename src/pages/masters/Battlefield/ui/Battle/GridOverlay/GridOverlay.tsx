interface GridOverlayProps {
  gridWidth: number;
  gridHeight: number;
}


export function GridOverlay({ gridWidth, gridHeight }: GridOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {Array.from({ length: gridWidth + 1 }, (_, i) => (
        <div
          key={`v-${i}`}
          className="absolute top-0 h-full w-px bg-gradient-to-b from-amber-500/30 to-amber-400/20"
          style={{ left: `${(i * 100) / gridWidth}%` }}
        />
      ))}
      {Array.from({ length: gridHeight + 1 }, (_, i) => (
        <div
          key={`h-${i}`}
          className="absolute left-0 w-full h-px bg-gradient-to-r from-amber-500/.0 to-amber-400/20"
          style={{ top: `${(i * 100) / gridHeight}%` }}
        />
      ))}
    </div>
  );
}