import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Dice } from './DiceLoader';
import { DiceColorSelector } from './DiceColorSelector';
import { useState, useCallback } from 'react';
import type { RollMode, DiceCounts, DiceType, DiceSetColor } from '../../types/rollTypes';
import * as THREE from 'three';

const diceOrder: { type: DiceType; label: string }[] = [
  { type: 'd20', label: 'D20' },
  { type: 'd12', label: 'D12' },
  { type: 'd10', label: 'D10' },
  { type: 'd100', label: 'D100' },
  { type: 'd8', label: 'D8' },
  { type: 'd6', label: 'D6' },
  { type: 'd4', label: 'D4' },
];

interface VerticalDiceTrayProps {
  rollMode: RollMode;
  diceCounts: DiceCounts;
  onDiceCountsChange: (counts: DiceCounts) => void;
  onSingleThrow?: (type: DiceType, colorSet: DiceSetColor) => void;
}

interface SingleDiceSectionProps {
  type: DiceType;
  colorSet: DiceSetColor;
  label: string;
  count: number;
  onCountChange: (type: DiceType, newCount: number) => void;
  rollMode: RollMode;
  onSingleThrow?: (type: DiceType, colorSet: DiceSetColor) => void;
}

function SingleDiceSection({
  type,
  colorSet,
  label,
  count,
  onCountChange,
  rollMode,
  onSingleThrow,
}: SingleDiceSectionProps) {
  const isSingle = rollMode === 'single';

  const increment = () => onCountChange(type, count + 1);
  const decrement = () => onCountChange(type, Math.max(0, count - 1));
  const handleSingleThrow = () => {
    onSingleThrow?.(type, colorSet);
    onCountChange(type, 0);
  };

  return (
    <div className="w-full h-[11vh] flex flex-row items-center gap-[1vw] rounded-xl overflow-hidden bg-slate-900/80">
      {isSingle ? (
        <button
          onClick={handleSingleThrow}
          className="w-[8vw] h-10 bg-amber-500 text-neutral-900 hover:text-neutral-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-[1.6vh]"
        >
          Бросить {label}
        </button>
      ) : (
        <div className="flex flex-col items-center gap-1 ">
          <button
            onClick={increment}
            className="w-7 h-7 bg-slate-600/70 hover:bg-slate-500 rounded-lg text-white font-mono text-[1.6vh] flex items-center justify-center transition-all hover:scale-105"
            title="Добавить"
          >
            +
          </button>
          <span className="text-[1.6vh] font-bold text-slate-100 flex items-center">{count}</span>
          <button
            onClick={decrement}
            className="w-7 h-7 bg-slate-600/70 hover:bg-slate-500 rounded-lg text-white font-mono text-[1.6vh] flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={count === 0}
            title="Убрать"
          >
            −
          </button>
        </div>
      )}
      <div className="w-[2vw] text-[1.6vh] font-mono text-slate-400 text-right">{label}</div>
      <div className="flex-1 h-full rounded-lg overflow-hidden">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <color attach="background" args={['#050515']} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[3, 5, 3]} intensity={1.8} />
          <pointLight position={[-2, -2, 4]} intensity={0.7} />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={false}
            autoRotate={true}
            autoRotateSpeed={1.2}
          />
          <Dice type={type} colorSet={colorSet} position={[0, 0, 0]} scale={2.2} autoRotate />
        </Canvas>
      </div>
    </div>
  );
}

export function VerticalDiceTray({
  rollMode,
  diceCounts,
  onDiceCountsChange,
  onSingleThrow,
}: VerticalDiceTrayProps) {
  console.log('🎯 VerticalDiceTray получил:', { onSingleThrow: !!onSingleThrow });
  const [colorSet, setColorSet] = useState<DiceSetColor>('blue');

  const handleCountChange = useCallback(
    (type: DiceType, newCount: number) => {
      onDiceCountsChange({
        ...diceCounts,
        [type]: newCount,
      });
    },
    [diceCounts, onDiceCountsChange]
  );

  return (
    <div className="flex flex-col items-center gap-3 w-[22vw]">
      <DiceColorSelector onColorChange={setColorSet} />
      <div className="flex flex-col gap-2 w-full h-[75vh]">
        {diceOrder.map((d) => (
          <SingleDiceSection
            key={d.type}
            type={d.type}
            colorSet={colorSet}
            label={d.label}
            count={diceCounts[d.type] || 0}
            onCountChange={handleCountChange}
            rollMode={rollMode}
            onSingleThrow={onSingleThrow}
          />
        ))}
      </div>
    </div>
  );
}
