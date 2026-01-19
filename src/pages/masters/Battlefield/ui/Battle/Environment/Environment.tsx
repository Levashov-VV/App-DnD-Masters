import { useState } from 'react';
import type { Environment as EnvItem } from '../../Form/types';

export type EnvironmentPreset = {
  id: number;
  label: string;
  shape: 'cone' | 'line' | 'sphere' | 'hemisphere' | 'cube';
  defaultFeet: number;
  color: string;
};

type Props = {
  environment: EnvItem[];
  presets: readonly EnvironmentPreset[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChangePreset: (index: number, presetId: number) => void;
  onChangeSizeFeet: (index: number, width: number, height: number) => void;
  onChangeColor: (index: number, color: string) => void;
  onRotate: (index: number, rotation: number) => void;
};

const SIZE_OPTIONS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60];

export function Environment({
  environment = [],
  presets,
  onAdd,
  onRemove,
  onChangePreset,
  onChangeSizeFeet,
  onChangeColor,
  onRotate,
}: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-[0.8vh] bg-neutral-900/70 rounded-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-[2vh] font-bold text-sky-300">Окружение</h3>
        <button
          type="button"
          onClick={onAdd}
          className="w-[10vw] text-[2vh] rounded bg-sky-700/80 text-sky-100 font-bold hover:bg-sky-600/80 transition-colors"
        >
          + Добавить
        </button>
      </div>

      <div className="flex flex-col gap-[0.8vh] max-h-auto overflow-y-auto">
        {environment.map((env, index) => {
          const preset = presets.find((p) => p.id === env.presetId);
          const widthFeet = env.sizeCells * 5;
          const heightFeet = (env.sizeY ?? env.sizeCells) * 5;
          const isExpanded = expandedId === env.id;

          return (
            <div
              key={env.id}
              className="flex flex-col bg-neutral-800/90 rounded-xl overflow-hidden  transition-all" {...isExpanded ? { style: { height: '6.5vh' } } : {}}
            >
              <div className="flex items-center gap-[0.5vw]">
                <select
                  className="w-[5.5vw] bg-neutral-800/90 text-amber-100 rounded text-[1.6vh] truncate"
                  value={env.presetId}
                  onChange={(e) => onChangePreset(index, Number(e.target.value))}
                  title={preset?.label}
                >
                  {presets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>

                {/* Цвет */}
                <input
                  type="color"
                  value={env.color ?? preset?.color ?? '#ff4500'}
                  onChange={(e) => onChangeColor(index, e.target.value)}
                  className="w-[2.8vw] h-[3vh] rounded cursor-pointer transition-colors"
                  title="Цвет"
                />

                {/* Размер */}
                <div className="flex items-center gap-[0.4vw]" title="Ширина × Высота (футы)">
                  <select
                    className="w-[3vw] bg-neutral-900/60 text-center text-amber-100 text-[1.6vh] rounded"
                    value={widthFeet}
                    onChange={(e) => onChangeSizeFeet(index, Number(e.target.value), heightFeet)}
                  >
                    {SIZE_OPTIONS.map((feet) => (
                      <option key={feet} value={feet}>
                        {feet}
                      </option>
                    ))}
                  </select>
                  <span className="text-[2vh] text-amber-100">×</span>
                  <select
                    className="w-[3vw] bg-neutral-900/60 text-center text-amber-100 text-[1.6vh] rounded border-neutral-600/50"
                    value={heightFeet}
                    onChange={(e) => onChangeSizeFeet(index, widthFeet, Number(e.target.value))}
                  >
                    {SIZE_OPTIONS.map((feet) => (
                      <option key={feet} value={feet}>
                        {feet}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Кнопка раскрытия поворота */}
                <button
                  type="button"
                  className="w-[3vw] text-[1.6vh] text-amber-100 rounded hover:bg-neutral-700/50 hover:text-sky-300 transition-all border-transparent hover:border-sky-500/30"
                  onClick={() => setExpandedId(isExpanded ? null : env.id)}
                  title="Изменить поворот"
                >
                  ↻ {env.rotation ?? 0}°
                </button>

                {/* Удаление */}
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="w-[2.5vh] h-[2vh] rounded-full bg-red-600/80 text-red-100 font-bold hover:bg-red-500 transition-colors text-[0.8vh] flex items-center justify-center"
                  title="Удалить"
                >
                  ✕
                </button>
              </div>

              {/* Развернутая панель поворота */}
              {isExpanded && (
                <div className='relative top-[0.5vh]'>
                  <div className="flex items-center gap-[0.4vw]">
                    <span className="relative left-[0.2vw] text-[1.5vh] text-amber-100 font-semibold whitespace-nowrap w-[5vw]">
                      Поворот:
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="15"
                      value={env.rotation ?? 0}
                      onChange={(e) => onRotate(index, Number(e.target.value))}
                      className="flex-1 h-[2.5vh] rounded cursor-pointer appearance-none bg-neutral-700/50"
                      style={{
                        background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${((env.rotation ?? 0) / 360) * 100}%, #525252 ${((env.rotation ?? 0) / 360) * 100}%, #525252 100%)`,
                      }}
                    />
                    <span className="text-[1.6vh] text-amber-100 font-bold w-[3.5vw] text-right bg-neutral-800/90 rounded cursor-default">
                      {env.rotation ?? 0}°
                    </span>
                    {/* Кнопка закрыть */}
                    <button
                      type="button"
                      onClick={() => setExpandedId(null)}
                      className="w-[2vh] h-[2vh] rounded-full bg-neutral-700 text-red-100 font-bold hover:bg-red-500 hover:text-red-100 transition-colors text-[0.8vh] flex items-center justify-center "
                      title="Закрыть"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
