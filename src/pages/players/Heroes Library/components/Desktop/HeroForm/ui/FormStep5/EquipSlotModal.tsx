import type {
  EquipmentItem,
  EquipmentSlot,
} from '../../../../../../../../features/heroes/schemas/heroSchema';

interface EquipSlotModalProps {
  item: EquipmentItem;
  availableSlots: EquipmentSlot[];
  equippedItems: EquipmentItem[];
  onConfirm: (slotType: EquipmentSlot) => void;
  onClose: () => void;
}

const SLOT_NAMES: Record<EquipmentSlot, string> = {
  armor: 'Броня',
  mainHand: 'Сильная рука',
  offHand: 'Слабая рука',
  ranged: 'Дальнобойное оружие',
};

export function EquipSlotModal({
  item,
  availableSlots,
  equippedItems,
  onConfirm,
  onClose,
}: EquipSlotModalProps) {
  const getItemInSlot = (slotType: EquipmentSlot): EquipmentItem | undefined => {
    return equippedItems.find((i) => i.slot === slotType);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70">
      <div className="relative w-[20vw]  bg-stone-900 border-4 border-amber-600 rounded-2xl">
        {/* Заголовок */}
        <div style={{padding: '0.2vw'}} className="flex items-center justify-center gap-[1vw] bg-amber-600 rounded-t-xl">
          <h2 className="text-[2vh] font-bold text-white uppercase">Выберите слот экипировки</h2>
        </div>

        {/* Контент */}
        <div style={{padding: '0.2vw'}} >
          <p style={{padding: '0.5vw'}} className="text-[1.8vh] text-center text-amber-100">
            Куда экипировать предмет <span className="font-bold text-amber-400">"{item.name}"</span>?
          </p>

          {/* Кнопки слотов */}
          <div className="flex flex-col gap-[1vh]">
            {availableSlots.map((slot) => {
              const itemInSlot = getItemInSlot(slot);
              const isOccupied = !!itemInSlot;

              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onConfirm(slot)}
                  className={`w-full ${
                    isOccupied
                      ? 'bg-orange-900/50 hover:bg-orange-800 border-2 border-orange-600'
                      : 'bg-stone-800 hover:bg-amber-700 border-2 border-amber-600'
                  } hover:border-amber-400 rounded-lg text-[1.6vh] font-bold text-amber-100 hover:text-white transition-all`}
                >
                  <div style={{paddingLeft: '0.2vw'}} className="flex items-center justify-between">
                    <span>{SLOT_NAMES[slot]}</span>
                    {isOccupied && (
                      <span style={{paddingRight: '0.5vw'}} className="text-[1.2vh] text-orange-400">{itemInSlot.name}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Кнопка отмены */}
        <div style={{margin: '1vh 0'}} className="flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="w-[10vw] bg-amber-600 hover:bg-amber-500 text-amber-100 rounded-lg font-bold transition-colors text-[1.6vh]"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
