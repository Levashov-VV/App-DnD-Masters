import DefaultLogo from '../../../../../../../public/img/masters/Battlefield/Figures/Logo-Profile.png';
import type { Environment as EnvItem } from '../../Form/types';

export type EnvironmentPreset = {
  id: number;
  label: string;
  img: string;
  defaultFeet: number;
};

const ENV_SIZE_FEET_OPTIONS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60] as const;
const cellsToFeet = (cells: number) => Math.max(5, cells * 5);

type Props = {
  environment?: EnvItem[];
  presets: readonly EnvironmentPreset[];
  title?: string;

  onAdd: () => void;
  onRemove: (index: number) => void;

  onChangePreset: (index: number, presetId: number) => void;
  onChangeSizeFeet: (index: number, feet: number) => void;

  onRotate: (id: number) => void;
};

export function Environment({
  environment = [],
  presets,
  title = 'Окружение',
  onAdd,
  onRemove,
  onChangePreset,
  onChangeSizeFeet,
  onRotate,
}: Props) {
  return (
    <div className="flex flex-col gap-[2vh] bg-neutral-900/70 rounded-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-sky-300">{title}</h3>
        <button
          type="button"
          onClick={onAdd}
          className="w-[10vw] text-[1.8vh] rounded bg-sky-700/80 text-sky-100 font-bold hover:bg-sky-600/80"
        >
          + Добавить
        </button>
      </div>

      {environment.map((env, index) => {
        const preset = presets.find((p) => p.id === env.presetId);
        const src = preset?.img ?? env.img ?? DefaultLogo;

        return (
          <div key={env.id} className="flex items-center gap-[0.8vw] rounded-xl bg-neutral-800/80">
            <img
              src={src}
              alt={preset?.label ?? 'Environment'}
              className="w-[2vw] rounded-full object-cover"
            />

            <select
              className="flex-1 bg-neutral-900/60 text-amber-50 rounded text-[1.8vh]"
              value={env.presetId}
              onChange={(e) => onChangePreset(index, Number(e.target.value))}
            >
              {presets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>

            <select
              className="w-[6vw] bg-neutral-900/60 text-center text-amber-100 text-[1.8vh] rounded"
              value={cellsToFeet(env.sizeCells)}
              onChange={(e) => onChangeSizeFeet(index, Number(e.target.value))}
            >
              {ENV_SIZE_FEET_OPTIONS.map((feet) => (
                <option key={feet} value={feet}>
                  {feet} ft
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => onRotate(env.id)}
              className="w-[3vw] rounded bg-amber-600/80 text-amber-100 font-bold hover:bg-amber-500/80"
              title="Повернуть"
            >
              ⟳
            </button>

            <button
              type="button"
              onClick={() => onRemove(index)}
              className="w-[3vw] rounded bg-red-600/80 text-red-100 font-bold hover:bg-red-500/80"
              title="Удалить"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
