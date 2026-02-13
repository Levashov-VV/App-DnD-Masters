import { useState, useEffect } from 'react';
import type {
  EquipmentItem,
  EquipmentSlot,
} from '../../../../../../../../features/heroes/schemas/heroSchema';
import { equipmentItemSchema } from '../../../../../../../../features/heroes/schemas/heroSchema';
import { Input } from '../Input';

interface EquipmentModalProps {
  item: EquipmentItem | null;
  slotType?: EquipmentSlot;
  onSave: (item: EquipmentItem) => void;
  onClose: () => void;
}

// Типы предметов
const EQUIPMENT_TYPES = [
  'Оружие ближнего боя',
  'Щит',
  'Броня',
  'Дальнобойное оружие',
  'Кольцо',
  'Ожерелье',
  'Сапоги',
  'Перчатки',
  'Плащ',
  'Пояс',
  'Инструмент',
  'Разное',
];

// Слоты экипировки
const EQUIPMENT_SLOTS: Record<EquipmentSlot, string> = {
  armor: 'Броня (торс)',
  mainHand: 'Сильная рука',
  offHand: 'Слабая рука',
  ranged: 'Дальнобойное',
};

// Определение доступных слотов
const getAvailableSlots = (type: string): EquipmentSlot[] => {
  switch (type) {
    case 'Оружие ближнего боя':
      return ['mainHand', 'offHand'];
    case 'Щит':
      return ['offHand'];
    case 'Броня':
      return ['armor'];
    case 'Дальнобойное оружие':
      return ['ranged'];
    default:
      return [];
  }
};

const getAvailableTypesForSlot = (slot?: EquipmentSlot): string[] => {
  if (!slot) {
    return EQUIPMENT_TYPES;
  }

  switch (slot) {
    case 'mainHand':
      return ['Оружие ближнего боя'];
    case 'offHand':
      return ['Оружие ближнего боя', 'Щит'];
    case 'armor':
      return ['Броня'];
    case 'ranged':
      return ['Дальнобойное оружие'];
    default:
      return EQUIPMENT_TYPES;
  }
};

// Определение видимых полей
const getVisibleFields = (type: string) => {
  const isWeapon = type === 'Оружие ближнего боя';
  const isShield = type === 'Щит';
  const isArmor = type === 'Броня';
  const isRanged = type === 'Дальнобойное оружие';

  return {
    attackDice: isWeapon || isRanged,
    armorBonus: isShield || isArmor,
    isTwoHanded: isWeapon || isRanged,
  };
};

export function EquipmentModal({ item, slotType, onSave, onClose }: EquipmentModalProps) {
  const [editedItem, setEditedItem] = useState<Partial<EquipmentItem>>({
    id: item?.id || crypto.randomUUID(),
    name: item?.name || '',
    description: item?.description || '',
    slot: item?.slot || slotType,
    type: item?.type || '',
    attackDice: item?.attackDice || '',
    armorBonus: item?.armorBonus || 0,
    otherBonuses: item?.otherBonuses || '',
    isTwoHanded: item?.isTwoHanded || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTwoHandedWarning, setShowTwoHandedWarning] = useState(false);

  const availableTypes = getAvailableTypesForSlot(editedItem.slot);

  useEffect(() => {
    if (editedItem.type) {
      const availableSlots = getAvailableSlots(editedItem.type);

      // Если был предзаданный слот (slotType), проверяем совместимость
      if (slotType && availableSlots.includes(slotType)) {
        setEditedItem((prev) => ({ ...prev, slot: slotType }));
      } else if (availableSlots.length === 1) {
        setEditedItem((prev) => ({ ...prev, slot: availableSlots[0] }));
      } else if (availableSlots.length === 0) {
        setEditedItem((prev) => ({ ...prev, slot: undefined }));
      }
    }
  }, [editedItem.type, slotType]);

  // Предупреждение о двуручном оружии
  useEffect(() => {
    if (editedItem.isTwoHanded) {
      setShowTwoHandedWarning(true);
      const timer = setTimeout(() => {
        setShowTwoHandedWarning(false);
      }, 10000);
      return () => clearTimeout(timer);
    } else {
      setShowTwoHandedWarning(false);
    }
  }, [editedItem.isTwoHanded]);

  const handleSave = () => {
    const result = equipmentItemSchema.safeParse(editedItem);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSave(result.data);
  };

  const visibleFields = getVisibleFields(editedItem.type || '');
  const availableSlots = getAvailableSlots(editedItem.type || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div
        style={{ padding: '0.5vh' }}
        className="relative w-[50vw] bg-stone-900 border-4 border-amber-600 rounded-2xl max-h-[80vh] overflow-y-auto"
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between ">
          <h2 className="text-[2.5vh] font-bold text-amber-100 uppercase">
            {item ? 'Редактировать предмет' : 'Добавить предмет'}
            {slotType && <span className="text-[1.8vh] text-amber-400"></span>}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-[4vh] h-[4vh] bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
          >
            <svg
              className="w-[2vh] h-[2vh] text-white"
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
        </div>

        {/* Предупреждение о двуручном оружии */}
        {showTwoHandedWarning && (
          <div>
            <p className="text-[1.4vh] text-amber-500 font-semibold">
              Двуручное оружие занимает обе руки
            </p>
          </div>
        )}

        {/* Форма */}
        <div className="flex flex-col gap-[1.5vh]">
          {/* Название */}
          <Input
            label="Название предмета"
            placeholder="Введите название..."
            value={editedItem.name}
            onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
            error={errors.name}
            style={{ paddingLeft: '0.2vw' }}
          />

          {/* Описание */}
          <div>
            <label className="block text-[1.6vh] font-semibold text-amber-100">Описание</label>
            <textarea
              value={editedItem.description || ''}
              onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
              placeholder="Описание предмета..."
              className="w-full h-[6vh] bg-stone-900 border-2 border-amber-600 rounded-lg  text-[1.4vh] text-amber-100 focus:outline-none focus:border-amber-400 resize-none"
              style={{ paddingLeft: '0.2vw' }}
            />
          </div>

          {/* Тип предмета */}
          <div>
            <label className="block text-[1.6vh] font-semibold text-amber-100 ">
              Тип предмета
              {slotType && availableTypes.length < EQUIPMENT_TYPES.length && (
                <span className="text-[1.2vh] text-amber-400"></span>
              )}
            </label>
            <select
              value={editedItem.type || ''}
              onChange={(e) => setEditedItem({ ...editedItem, type: e.target.value })}
              className="h-[4vh] w-full bg-stone-900 border-2 border-amber-600 rounded-lg  text-[1.4vh] text-amber-100 focus:outline-none focus:border-amber-400"
              style={{ paddingLeft: '0.2vw' }}
            >
              <option value="">Выберите...</option>
              {availableTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Слот экипировки
           */}
          {availableSlots.length > 0 && (
            <div>
              <label className="block text-[1.6vh] font-semibold text-amber-100">
                Слот экипировки
              </label>
              {availableSlots.length === 1 || slotType ? (
                <div className="h-[4vh] bg-stone-800 border-2 border-amber-600 rounded-lg flex items-center text-[1.4vh] text-amber-100">
                  {EQUIPMENT_SLOTS[editedItem.slot || slotType!]}
                </div>
              ) : (
                <select
                  value={editedItem.slot || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEditedItem({
                      ...editedItem,
                      slot: value === '' ? undefined : (value as EquipmentSlot),
                    });
                  }}
                  className="h-[4vh] w-full bg-stone-900 border-2 border-amber-600 rounded-lg text-[1.4vh] text-amber-100 focus:outline-none focus:border-amber-400"
                  style={{ paddingLeft: '0.2vw' }}
                >
                  <option value="">Выберите слот...</option>
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {EQUIPMENT_SLOTS[slot]}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Кубик атаки */}
          {visibleFields.attackDice && (
            <Input
              label="Кубик атаки"
              placeholder="Например: 1d8, 2d6+3"
              value={editedItem.attackDice || ''}
              onChange={(e) => setEditedItem({ ...editedItem, attackDice: e.target.value })}
              style={{ paddingLeft: '0.2vw' }}
            />
          )}

          {/* Бонус брони */}
          {visibleFields.armorBonus && (
            <Input
              label="Бонус брони"
              type="number"
              min={0}
              value={editedItem.armorBonus || 0}
              onChange={(e) =>
                setEditedItem({ ...editedItem, armorBonus: parseInt(e.target.value) || 0 })
              }
              style={{ paddingLeft: '0.2vw' }}
            />
          )}

          {/* Другие бонусы */}
          <div>
            <label className="block text-[1.6vh] font-semibold text-amber-100 mb-[0.5vh]">
              Другие бонусы (опционально)
            </label>
            <textarea
              value={editedItem.otherBonuses || ''}
              onChange={(e) => setEditedItem({ ...editedItem, otherBonuses: e.target.value })}
              placeholder="Например: +2 к инициативе, сопротивление огню..."
              className="w-full h-[8vh] bg-stone-900 border-2 border-amber-600 rounded-lg text-[1.4vh] text-amber-100 focus:outline-none focus:border-amber-400 resize-none"
              style={{ paddingLeft: '0.2vw' }}
            />
          </div>

          {/* Двуручное оружие  */}
          {visibleFields.isTwoHanded && (
            <div className="flex items-center gap-[1vw]">
              <input
                type="checkbox"
                id="twoHanded"
                checked={editedItem.isTwoHanded || false}
                onChange={(e) => setEditedItem({ ...editedItem, isTwoHanded: e.target.checked })}
                className="w-[2vh] h-[2vh] accent-amber-600"
              />
              <label htmlFor="twoHanded" className="text-[1.6vh] text-amber-100 cursor-pointer">
                Двуручное оружие
              </label>
            </div>
          )}
        </div>

        {/* Кнопки */}
        <div className="flex justify-end gap-[1vw] ">
          <button
            type="button"
            onClick={onClose}
            style={{ padding: '0.5vh 1.5vh' }}
            className="bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-bold transition-colors text-[1.6vh]"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={handleSave}
            style={{ padding: '0.5vh 1.5vh' }}
            className=" bg-amber-600 hover:bg-amber-500 text-stone-900 rounded-lg font-bold transition-colors text-[1.6vh]"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
