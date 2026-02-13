import type { EquipmentItem, EquipmentSlot } from '../../../../../../../../features/heroes/schemas/heroSchema';

interface EquipmentSlotsProps {
  equipped: EquipmentItem[];
  onSlotClick: (slotType: EquipmentSlot) => void;
  onEdit: (item: EquipmentItem) => void;
  onRemove: (id: string) => void;
}

export function EquipmentSlots({ equipped, onSlotClick, onEdit, onRemove }: EquipmentSlotsProps) {

  const getItemInSlot = (slotType: EquipmentSlot): EquipmentItem | null => {
    return equipped.find((item) => item.slot === slotType) || null;
  };

  const Slot = ({
    type,
    label,
    icon,
    position,
  }: {
    type: EquipmentSlot;
    label: string;
    icon: string;
    position: string;
  }) => {
    const item = getItemInSlot(type);
    const isOccupied = !!item;

    return (
      <div className={`absolute ${position}`}>
        <button
          type="button"
          onClick={() => {
            if (isOccupied) {
              onEdit(item);
            } else {
              onSlotClick(type);
            }
          }}
          className={`
            relative w-[8vw] h-[8vw] rounded-lg border-4 transition-all duration-200
            flex flex-col items-center justify-center gap-[0.5vh]
            ${
              isOccupied
                ? 'bg-green-900/40 border-green-500 hover:bg-green-800/50 hover:border-green-400'
                : 'bg-stone-900/60 border-amber-600 hover:bg-stone-800/80 hover:border-amber-500'
            }
          `}
        >
          <div className="text-[3vh]">{icon}</div>

          {/* Название слота или предмета */}
          <div className="text-center">
            {isOccupied ? (
              <>
                <div className="text-[1.3vh] font-bold text-green-400 truncate max-w-[7vw]">
                  {item.name}
                </div>
                <div className="text-[1vh] text-green-300/70">Экипировано</div>
              </>
            ) : (
              <>
                <div className="text-[1.3vh] font-semibold text-amber-100">{label}</div>
                <div className="text-[1vh] text-amber-100/60">Пусто</div>
              </>
            )}
          </div>

          {isOccupied && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item.id);
              }}
              className="absolute top-[0.3vh] right-[0.3vh] w-[2.5vh] h-[2.5vh] bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
            >
              <svg
                className="w-[1.2vh] h-[1.2vh] text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Визуальная схема персонажа */}
      <div className="relative w-full h-[40vh] flex items-center justify-center">
        {/* Фон */}
        <div className="absolute bottom-[10vh] w-[12vw] h-[30vh] bg-stone-900/30 border-2 border-amber-600/30 rounded-full" />

        {/* Торс (Броня) */}
        <Slot type="armor" label="Броня" icon="👕" position="top-[5vh] left-[50%] -translate-x-1/2" />

        {/* Слабая рука (Щит/Второе оружие) */}
        <Slot
          type="offHand"
          label="Слабая рука"
          icon="🛡"
          position="top-[5vh] left-[15%]"
        />

        {/* Сильная рука (Основное оружие) */}
        <Slot
          type="mainHand"
          label="Сильная рука"
          icon="🗡️"
          position="top-[5vh] right-[15%]"
        />

        {/* Дальнобойное оружие - Снизу */}
        <Slot
          type="ranged"
          label="Дальнобой"
          icon="🏹"
          position="bottom-[5%] left-[40%] -translate-x-1/2"
        />
      </div>

      {/* Легенда */}
      <div style={{ padding: '0.5vh'}} className="bg-stone-800/50 border-2 border-amber-600 rounded-lg">
        <div className="flex items-center justify-center gap-[3vw] text-[1.3vh]">
          <div className="flex items-center gap-[0.5vw]">
            <div className="w-[2vh] h-[2vh] bg-green-900 border-2 border-green-500 rounded" />
            <span className="text-amber-100">Экипировано</span>
          </div>
          <div className="flex items-center gap-[0.5vw]">
            <div className="w-[2vh] h-[2vh] bg-stone-900 border-2 border-amber-600 rounded" />
            <span className="text-amber-100">Пусто</span>
          </div>
          <div className="text-amber-100/70">Нажмите на слот, чтобы добавить/изменить</div>
        </div>
      </div>
    </div>
  );
}
