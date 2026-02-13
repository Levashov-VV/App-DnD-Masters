import type { EquipmentItem } from '../../../../../../../../features/heroes/schemas/heroSchema';

interface EquipmentCardProps {
  item: EquipmentItem;
  onEdit: () => void;
  onDelete: () => void;
  onToggleEquip: () => void;
  isEquipped: boolean;
}

export function EquipmentCard({
  item,
  onEdit,
  onDelete,
  onToggleEquip,
  isEquipped,
}: EquipmentCardProps) {
  return (
    <div className="bg-stone-900 border-2 border-amber-600 rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-[1.6vh] font-bold text-amber-100">{item.name}</h4>
          {item.type && <p className="text-[1.2vh] text-amber-100/60">{item.type}</p>}
        </div>
				
        {/* Действия */}
        <div className="flex gap-[0.5vw]">
          <button
            type="button"
            onClick={onEdit}
            className="w-[2.5vh] h-[2.5vh] bg-blue-600 hover:bg-blue-500 rounded flex items-center justify-center transition-colors"
            title="Редактировать"
          >
            <svg
              className="w-[1.3vh] h-[1.3vh] text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="w-[2.5vh] h-[2.5vh] bg-red-600 hover:bg-red-500 rounded flex items-center justify-center transition-colors"
            title="Удалить"
          >
            <svg
              className="w-[1.3vh] h-[1.3vh] text-white"
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

      {/* Характеристики */}
      <div className="flex flex-col gap-[0.3vh]">
        {item.slot && (
          <p className="text-[1.2vh] text-amber-100/80">
            <strong>Слот:</strong> {item.slot}
          </p>
        )}
        {item.attackDice && (
          <p className="text-[1.2vh] text-amber-100/80">
            <strong>Урон:</strong> {item.attackDice}
          </p>
        )}
        {item.armorBonus !== undefined && item.armorBonus > 0 && (
          <p className="text-[1.2vh] text-amber-100/80">
            <strong>Броня:</strong> +{item.armorBonus}
          </p>
        )}
        {item.isTwoHanded && <p className="text-[1.2vh] text-orange-400">⚠️ Двуручное</p>}
        {item.otherBonuses && (
          <p className="text-[1.2vh] text-amber-100/80">
            <strong>Бонусы:</strong> {item.otherBonuses}
          </p>
        )}
      </div>

      {/* Кнопка экипировки */}
      <button
        type="button"
        onClick={onToggleEquip}
        className={`w-full py-[0.5vh] rounded font-bold text-[1.4vh] transition-colors ${
          isEquipped
            ? 'bg-orange-600 hover:bg-orange-500 text-white'
            : 'bg-green-600 hover:bg-green-500 text-white'
        }`}
      >
        {isEquipped ? 'Снять' : 'Одеть'}
      </button>
    </div>
  );
}
