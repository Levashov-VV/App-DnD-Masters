import { useState } from 'react';
import { DicesSection } from './DicesSection/MulipleDicesSection/DicesSection';
import { SelectShot } from './SelectShot/SelectShot';
import { PhysicsWorld } from './PhysicalWorld/PhysicalWorld';
import { RollingDice } from './RollingDice/RollingDice';
import type { RollMode, DiceCounts, DiceType, DiceSetColor } from './types/rollTypes';

export function DiceTray() {
  const [rollMode, setRollMode] = useState<RollMode>('single');
  const [diceCounts, setDiceCounts] = useState<DiceCounts>({});
  const [throwId, setThrowId] = useState(0);
  const [currentRoll, setCurrentRoll] = useState<{
    type: DiceType;
    colorSet: DiceSetColor;
    position: [number, number, number];
    rotation: [number, number, number];
  } | null>(null);
  const [rollResult, setRollResult] = useState<number | null>(null);

  const handleSingleThrow = (type: DiceType, colorSet: DiceSetColor) => {
    setThrowId((prev) => prev + 1);

    const randomRotation: [number, number, number] = [
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
    ];

    setCurrentRoll({
      type,
      colorSet,
      position: [0, 6, 0],
      rotation: randomRotation,
    });
    setRollResult(null);
  };
  const diceKey = throwId;

  const handleRollResult = (value: number) => {
    setRollResult(value);
    setCurrentRoll(null);
  };

  return (
    <div className="flex flex-row justify-center items-center w-[100vw] h-[100vh] relative">
      <PhysicsWorld>
        {currentRoll && (
          <RollingDice
            key={diceKey}
            type={currentRoll.type}
            colorSet={currentRoll.colorSet}
            rotation={currentRoll.rotation}
            onResult={handleRollResult}
          />
        )}
      </PhysicsWorld>

      {/* Левая панель */}
      <div className="flex flex-col gap-[5vh] z-80 w-[20vw]">
        <SelectShot rollMode={rollMode} onChangeRollMode={setRollMode} />
      </div>

      {/* DiceTray изображение */}
      <div className="relative top-[5vh] z-50">
        <img
          className="w-[50vw]"
          src="../../../../../public/img/masters/home/DiceTray/DiceTray.png"
          alt="dice tray"
        />
      </div>

      {/* Правая панель */}
      <div className="relative z-80">
        <DicesSection
          rollMode={rollMode}
          diceCounts={diceCounts}
          setDiceCounts={setDiceCounts}
          onSingleThrow={handleSingleThrow}
        />
      </div>

      {/* Результат */}
      {rollResult !== null && (
        <div className="absolute top-20 right-10 bg-black/90 text-white p-4 rounded-xl z-70 shadow-2xl">
          <div className="text-2xl font-bold text-amber-400">
            {rollResult === 0 ? '—' : rollResult}
          </div>
          <div className="text-sm text-slate-300 mt-1">
            {rollResult === 0 ? 'Нет калибровки' : 'Выпало!'}
          </div>
        </div>
      )}
    </div>
  );
}
