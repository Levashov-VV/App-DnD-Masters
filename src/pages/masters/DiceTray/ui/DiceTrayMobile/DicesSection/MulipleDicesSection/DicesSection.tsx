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
    <div className="flex flex-col items-center gap-[3vh]">
      <VerticalDiceTray
        rollMode={rollMode}
        diceCounts={diceCounts}
        onDiceCountsChange={setDiceCounts}
        onSingleThrow={onSingleThrow}
        colorSet={colorSet}
        onColorSetChange={onColorSetChange}
      />

      {rollMode === 'sum' && (
        <div className="absolute right-[5vw] top-[15vh] flex flex-col items-center gap-[0.5vh]">
          <div className="text-[1.4vh] text-slate-400 font-mono">Всего кубов: {total}</div>
          <button
            onClick={throwDice}
            className="w-[25vw] h-[2vh] bg-amber-500 text-neutral-900 hover:text-neutral-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col items-center justify-center text-[1.4vh]"
            disabled={total === 0}
          >
            <span>Бросить кубы</span>
          </button>
        </div>
      )}
    </div>
  );
}
