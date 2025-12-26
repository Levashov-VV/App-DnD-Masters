import { useState } from 'react';
import type { DiceSetColor } from './DiceMeshes';

const COLORS: { id: DiceSetColor; label: string; className: string }[] = [
  { id: 'blue', label: 'Blue', className: 'bg-blue-500' },
  { id: 'red', label: 'Red', className: 'bg-red-500' },
  { id: 'black', label: 'Black', className: 'bg-gray-800' },
  { id: 'green', label: 'Green', className: 'bg-green-500' },
  { id: 'purple', label: 'Purple', className: 'bg-purple-500' },
  { id: 'darkBlue', label: 'DarkBlue', className: 'bg-indigo-800' },
  { id: 'orange', label: 'Orange', className: 'bg-orange-500' },
];

export function DiceColorSelector({ onColorChange }: { onColorChange: (c: DiceSetColor) => void }) {
  const [selected, setSelected] = useState<DiceSetColor>('blue');

  return (
    <div className="flex flex-col items-center gap-2 w-full h-[6vh]">
      <span className="text-[1.6vh] text-slate-200">Цвет набора</span>
      <div className="flex flex-wrap gap-2 justify-center">
        {COLORS.map((c) => (
          <button
            key={c.id}
            className={`w-6 h-6 rounded-full ${c.className} ${
              selected === c.id
                ? 'border-white scale-110'
                : 'border-slate-500 hover:border-white hover:scale-110'
            }`}
            onClick={() => {
              setSelected(c.id);
              onColorChange(c.id);
            }}
            title={c.label}
          />
        ))}
      </div>
    </div>
  );
}
