import type { RollMode } from '../types/rollTypes';

interface SelectShotProps {
  rollMode: RollMode;
  onChangeRollMode: (mode: RollMode) => void;
}

export function SelectShot({ rollMode, onChangeRollMode }: SelectShotProps) {
  const baseBtn =
    'h-[4vh] rounded-xl text-[2vh] transition-colors duration-150 flex items-center justify-center';

  return (
    <div className="flex flex-col w-[90vw]">
      <div className="flex flex-col gap-[0.5vh] bg-neutral-900">
        <p className="text-[3vh] uppercase text-center tracking-wide text-slate-400">
          Режим броска
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onChangeRollMode('single')}
            className={
              baseBtn +
              (rollMode === 'single'
                ? ' bg-amber-500 text-neutral-900'
                : ' bg-slate-800 text-slate-200 hover:bg-slate-700')
            }
          >
            Единичный
          </button>

          <button
            onClick={() => onChangeRollMode('sum')}
            className={
              baseBtn +
              (rollMode === 'sum'
                ? ' bg-amber-500 text-neutral-900'
                : ' bg-slate-800 text-slate-200 hover:bg-slate-700')
            }
          >
            Суммируемый
          </button>
        </div>
      </div>
    </div>
  );
}
