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
    <div className="flex flex-col gap-[0.5vh] h-[10vh]">
      <span className="text-[3vh] text-center uppercase text-slate-400">Цвет набора</span>
      <div className="flex flex-wrap gap-[4vw]">
        {COLORS.map((c) => (
          <button
            key={c.id}
            className={`w-[9vw] h-[6vw] rounded-full ${c.className} ${
              selected === c.id ? 'border-white scale-110' : 'border-slate-500'
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
