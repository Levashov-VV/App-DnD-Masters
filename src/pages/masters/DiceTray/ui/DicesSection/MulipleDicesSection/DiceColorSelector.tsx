import { useState } from 'react';
import type { DiceSetColor } from '../../types/rollTypes';

const COLORS: { id: DiceSetColor; label: string; className: string }[] = [
  { id: 'blue', label: 'Голубой', className: 'bg-blue-500' },
  { id: 'red', label: 'Красный', className: 'bg-red-900' },
  { id: 'black', label: 'Серый', className: 'bg-gray-700' },
  { id: 'green', label: 'Зеленый', className: 'bg-green-800' },
  { id: 'purple', label: 'Фиолетовый', className: 'bg-purple-700' },
  { id: 'darkBlue', label: 'Темно-синий', className: 'bg-indigo-900' },
  { id: 'orange', label: 'Оранжевый', className: 'bg-orange-400' },
];

export function DiceColorSelector({ onColorChange }: { onColorChange: (c: DiceSetColor) => void }) {
  const [selected, setSelected] = useState<DiceSetColor>('blue');

  return (
    <div className="flex flex-col gap-[1vh] w-full h-[6vh]">
      <span className="text-[1.6vh] text-slate-200">Цвет набора</span>
      <div className="flex flex-wrap gap-[0.4vw]">
        {COLORS.map((c) => (
          <button
            key={c.id}
            className={`w-[1vw] h-[1vw] rounded-full ${c.className} ${
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
