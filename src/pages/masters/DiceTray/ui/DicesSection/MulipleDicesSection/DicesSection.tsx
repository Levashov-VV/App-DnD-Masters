import { VerticalDiceTray } from './VerticalDiceTray';
import type { RollMode, DiceCounts } from '../../types/rollTypes';

interface DicesSectionProps {
  rollMode: RollMode;
  diceCounts: DiceCounts;
  setDiceCounts: (c: DiceCounts) => void;
}

export function DicesSection({ rollMode, diceCounts, setDiceCounts }: DicesSectionProps) {
  const throwDice = () => {
    console.log('diceCounts', diceCounts);
    setDiceCounts({});
  };

  const total = Object.values(diceCounts).reduce((a, b) => a + (b || 0), 0);

  return (
    <div className="flex flex-col gap-[3vh] w-[20vw]">
      <VerticalDiceTray
        rollMode={rollMode}
        diceCounts={diceCounts}
        onDiceCountsChange={setDiceCounts}
      />

      {rollMode === 'sum' && (
        <div className="flex flex-row items-center gap-[3vw]">
          <button
            onClick={throwDice}
            className="w-[10vw] h-20 bg-amber-500 text-neutral-900 hover:text-neutral-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col items-center justify-center text-[2vh]"
            disabled={total === 0}
          >
            <span>Бросить кубы</span>
          </button>
          <div className="text-xs text-slate-400 font-mono">Всего кубов: {total}</div>
        </div>
      )}
    </div>
  );
}
