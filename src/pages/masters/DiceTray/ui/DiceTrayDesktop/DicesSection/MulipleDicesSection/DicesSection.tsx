import type { RollMode, DiceCounts, DiceType, DiceSetColor } from '../../types/rollTypes';
import { VerticalDiceTray } from '../../DicesSection/MulipleDicesSection/VerticalDiceTray';

interface DicesSectionProps {
  rollMode: RollMode;
  diceCounts: DiceCounts;
  setDiceCounts: (c: DiceCounts) => void;

  colorSet: DiceSetColor;
  onColorSetChange: (c: DiceSetColor) => void;

  onSingleThrow?: (type: DiceType, colorSet: DiceSetColor) => void;
  onMultiThrow?: () => void;
}

export function DicesSection({
  rollMode,
  diceCounts,
  setDiceCounts,
  colorSet,
  onColorSetChange,
  onSingleThrow,
  onMultiThrow,
}: DicesSectionProps) {
  const total = Object.values(diceCounts).reduce((a, b) => a + (b || 0), 0);

  const throwDice = () => {
    onMultiThrow?.();
    setDiceCounts({});
  };

  return (
    <div className="flex flex-col gap-[3vh] w-[20vw] h-[91vh]">
      <VerticalDiceTray
        rollMode={rollMode}
        diceCounts={diceCounts}
        onDiceCountsChange={setDiceCounts}
        onSingleThrow={onSingleThrow}
        colorSet={colorSet}
        onColorSetChange={onColorSetChange}
      />

      {rollMode === 'sum' && (
        <div className="flex flex-row items-center gap-[3vw]">
          <button
            onClick={throwDice}
            className="w-[10vw] h-[5vh] bg-amber-500 text-neutral-900 hover:text-neutral-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col items-center justify-center text-[2vh]"
            disabled={total === 0}
          >
            <span>Бросить кубы</span>
          </button>
          <div className="text-[1.4vh] text-slate-400 font-mono">Всего кубов: {total}</div>
        </div>
      )}
    </div>
  );
}
