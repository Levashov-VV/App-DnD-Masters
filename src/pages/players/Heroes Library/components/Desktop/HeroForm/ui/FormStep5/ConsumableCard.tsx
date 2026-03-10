import type { Consumable } from '../../../../../../../../features/heroes/schemas/heroSchema';
import { Input } from '../Input';

interface ConsumableCardProps {
  consumable: Consumable;
  onQuantityChange: (newQuantity: number) => void;
  onUse: () => void;
  onDelete: () => void;
}

export function ConsumableCard({
  consumable,
  onQuantityChange,
  onUse,
  onDelete,
}: ConsumableCardProps) {
  if (consumable.quantity === 0) return null;

  return (
    <div
      style={{ padding: '0 0.5vw' }}
      className="bg-stone-900 border-2 border-amber-600 rounded-lg max-h-[6vh]"
    >
      <div className="flex items-start justify-between gap-[1vw]">
        <div className="w-[15vw]">
          <div className="text-[1.3vh] font-bold text-amber-100">{consumable.name}</div>
          {consumable.description && (
            <div className="text-[1.2vh] text-amber-100/70 ">{consumable.description}</div>
          )}
        </div>

        <div style={{ padding: '0.5vw' }} className="flex items-center justify-center gap-[1vw]">
          {/* Количество */}
          <div className="flex items-center justify-center gap-[0.1vw]">
            <button
              type="button"
              onClick={() => onQuantityChange(Math.max(0, consumable.quantity - 1))}
              className="w-[5vh] h-[3vh] bg-red-600 hover:bg-red-500 rounded-4xl flex items-center justify-center transition-colors text-white font-bold text-[1.6vh]"
            >
              −
            </button>

            <Input
              type="number"
              min={0}
              value={consumable.quantity}
              onChange={(e) => onQuantityChange(parseInt(e.target.value) || 0)}
              className="text-center "
              style={{ paddingLeft: '0.5vw' }}
            />

            <button
              type="button"
              onClick={() => onQuantityChange(consumable.quantity + 1)}
              className="w-[5vh] h-[3vh] bg-green-600 hover:bg-green-500 flex items-center justify-center transition-colors text-amber-100 font-bold text-[1.6vh] rounded-4xl"
            >
              +
            </button>
          </div>

          {/* Использовать */}
          <button
            type="button"
            onClick={onUse}
            disabled={consumable.quantity === 0}
            style={{ padding: '0.23vw' }}
            className={`rounded font-bold transition-colors text-[1.3vh] ${
              consumable.quantity > 0
                ? 'bg-amber-600 hover:bg-amber-500 text-black'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Использовать
          </button>

          {/* Удалить */}
          <button
            type="button"
            onClick={onDelete}
            className="w-[5vh] h-[2.5vh] bg-amber-600 hover:bg-amber-500 flex items-center justify-center transition-colors rounded-4xl"
          >
            <svg
              className="w-[1.5vh] h-[1.5vh] text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
