import { useState } from 'react';
import { DicesSection } from './DicesSection/MulipleDicesSection/DicesSection';
import { SelectShot } from './SelectShot/SelectShot';
import type { RollMode, DiceCounts } from './types/rollTypes';

export function DiceTray() {
  const [rollMode, setRollMode] = useState<RollMode>('single');
  const [diceCounts, setDiceCounts] = useState<DiceCounts>({});

  return (
    <div className="flex flex-row justify-center items-center w-[100vw] h-[100vh]">
      <div className="flex flex-col gap-[5vh] z-40 w-[20vw]">
        <SelectShot rollMode={rollMode} onChangeRollMode={setRollMode} />
      </div>

      <div className="relative top-[5vh] z-50">
        <img
          className="w-[50vw]"
          src="../../../../../public/img/masters/home/DiceTray/DiceTray.png"
          alt="dice tray"
        />
      </div>

      <div className="relative z-50">
        <DicesSection rollMode={rollMode} diceCounts={diceCounts} setDiceCounts={setDiceCounts} />
      </div>
    </div>
  );
}
