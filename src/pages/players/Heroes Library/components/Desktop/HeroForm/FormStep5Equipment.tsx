import { useState } from 'react';
import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { HeroFormData, EquipmentItem, Consumable, EquipmentSlot } from '../../../../../../features/heroes/schemas/heroSchema';
import { TextareaWithFontControl } from './ui/TextareaFontControl';
import { Input } from './ui/Input';
import { EquipmentSlots } from './ui/FormStep5/EquipmentSlots';
import { EquipmentModal } from './ui/FormStep5/EquipmentModal';
import { ConsumableModal } from './ui/FormStep5/ConsumableModal';
import { ConsumableCard } from './ui/FormStep5/ConsumableCard';
import { CurrencyCalculatorModal } from './ui/FormStep5/CurrencyCalculatorModal';

interface FormStep5InventoryProps {
  register: UseFormRegister<HeroFormData>;
  errors: FieldErrors<HeroFormData>;
  watch: UseFormWatch<HeroFormData>;
  setValue: UseFormSetValue<HeroFormData>;
}

export function FormStep5Inventory({
  register,
  errors,
  watch,
  setValue,
}: FormStep5InventoryProps) {
  const inventoryData = watch('inventory');
  
  const inventory = {
    equipped: inventoryData?.equipped || [],
    inventory: inventoryData?.inventory || [],
    consumables: inventoryData?.consumables || [],
    treasures: inventoryData?.treasures || '',
    magicItems: inventoryData?.magicItems || { maxSlots: 3, items: [] },
    currency: inventoryData?.currency || { copper: 0, silver: 0, gold: 0, electrum: 0, platinum: 0 },
    carryCapacity: inventoryData?.carryCapacity || { current: 0, max: 0 },
  };

  const [isConsumableModalOpen, setIsConsumableModalOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null);
  const [editingSlotType, setEditingSlotType] = useState<EquipmentSlot | undefined>(undefined);

  // ==================== ВАЛИДАЦИЯ СЛОТОВ ====================
  
  // Проверка: свободен ли слот (с учётом двуручного оружия)
  const isSlotAvailable = (slotType: EquipmentSlot, excludeId?: string): boolean => {
    // Получаем все предметы в экипировке (кроме редактируемого)
    const equippedItems = inventory.equipped.filter((item) => item.id !== excludeId);

    // Проверяем, не занят ли уже этот конкретный слот
    const slotOccupied = equippedItems.some((item) => item.slot === slotType);
    if (slotOccupied) return false;

    // Если это рука (mainHand или offHand), проверяем двуручное оружие
    if (slotType === 'mainHand' || slotType === 'offHand') {
      const hasTwoHandedWeapon = equippedItems.some(
        (item) => (item.slot === 'mainHand' || item.slot === 'offHand') && item.isTwoHanded
      );
      if (hasTwoHandedWeapon) return false; // Обе руки заняты двуручным оружием
    }

    return true;
  };

  // Проверка: можно ли добавить двуручное оружие (обе руки должны быть свободны)
  const canEquipTwoHanded = (excludeId?: string): boolean => {
    const equippedItems = inventory.equipped.filter((item) => item.id !== excludeId);
    const mainHandOccupied = equippedItems.some((item) => item.slot === 'mainHand');
    const offHandOccupied = equippedItems.some((item) => item.slot === 'offHand');
    return !mainHandOccupied && !offHandOccupied;
  };

  const getSlotName = (slot: EquipmentSlot): string => {
    const names: Record<EquipmentSlot, string> = {
      armor: 'Броня',
      mainHand: 'Сильная рука',
      offHand: 'Слабая рука',
      ranged: 'Дальнобойное оружие',
    };
    return names[slot];
  };

  // ==================== СНАРЯЖЕНИЕ ====================
  
  const handleSaveEquipment = (item: EquipmentItem, slotType?: EquipmentSlot) => {
    // Если у предмета есть слот - проверяем валидацию
    if (item.slot) {
      // Проверка двуручного оружия
      if (item.isTwoHanded && !canEquipTwoHanded(item.id)) {
        alert('⚠️ Обе руки должны быть свободны для двуручного оружия!');
        return;
      }

      // Проверка доступности слота
      if (!isSlotAvailable(item.slot, item.id)) {
        alert(`⚠️ Слот "${getSlotName(item.slot)}" уже занят!`);
        return;
      }
    }

    if (editingItem) {
      // Редактирование существующего предмета
      const updatedEquipped = inventory.equipped.map((i) =>
        i.id === item.id ? item : i
      );
      setValue('inventory.equipped', updatedEquipped, { shouldDirty: true });
    } else {
      // Добавление нового предмета
      setValue('inventory.equipped', [...inventory.equipped, item], { shouldDirty: true });
    }

    setIsEquipmentModalOpen(false);
    setEditingItem(null);
    setEditingSlotType(undefined);
  };

  const handleEditEquipment = (item: EquipmentItem) => {
    setEditingItem(item);
    setEditingSlotType(item.slot);
    setIsEquipmentModalOpen(true);
  };

  const handleRemoveEquipment = (id: string) => {
    if (window.confirm('Снять этот предмет?')) {
      const updated = inventory.equipped.filter((i) => i.id !== id);
      setValue('inventory.equipped', updated, { shouldDirty: true });
    }
  };

  const handleAddFromSlot = (slotType: EquipmentSlot) => {
    // Проверяем, свободен ли слот
    if (!isSlotAvailable(slotType)) {
      alert(`⚠️ Слот "${getSlotName(slotType)}" уже занят!`);
      return;
    }

    setEditingItem(null);
    setEditingSlotType(slotType);
    setIsEquipmentModalOpen(true);
  };

  // ==================== РЮКЗАК ====================
  const handleDeleteFromInventory = (id: string) => {
    if (window.confirm('Удалить этот предмет?')) {
      const updated = inventory.inventory.filter((i) => i.id !== id);
      setValue('inventory.inventory', updated, { shouldDirty: true });
    }
  };

  // ==================== РАСХОДНИКИ ====================
  const handleSaveConsumable = (consumable: Consumable) => {
    setValue('inventory.consumables', [...inventory.consumables, consumable], {
      shouldDirty: true,
    });
    setIsConsumableModalOpen(false);
  };

  const handleConsumableQuantityChange = (id: string, newQuantity: number) => {
    const updated = inventory.consumables.map((c) =>
      c.id === id ? { ...c, quantity: newQuantity } : c
    );
    setValue('inventory.consumables', updated, { shouldDirty: true });
  };

  const handleUseConsumable = (id: string) => {
    const consumable = inventory.consumables.find((c) => c.id === id);
    if (!consumable || consumable.quantity === 0) return;

    const newQuantity = consumable.quantity - 1;

    if (newQuantity === 0) {
      const updated = inventory.consumables.filter((c) => c.id !== id);
      setValue('inventory.consumables', updated, { shouldDirty: true });
    } else {
      const updated = inventory.consumables.map((c) =>
        c.id === id ? { ...c, quantity: newQuantity } : c
      );
      setValue('inventory.consumables', updated, { shouldDirty: true });
    }
  };

  const handleDeleteConsumable = (id: string) => {
    if (window.confirm('Удалить этот расходник?')) {
      const updated = inventory.consumables.filter((c) => c.id !== id);
      setValue('inventory.consumables', updated, { shouldDirty: true });
    }
  };

  return (
    <div className="relative left-[0.5vw] top-[1vh] w-[74vw] flex flex-col gap-[1.5vh] uppercase max-h-[63vh] overflow-y-auto">
      <h2 className="text-[2.5vh] font-bold text-amber-100">Инвентарь</h2>

      {/* Секция 1: Визуальные слоты + Полный список снаряжения + Рюкзак */}
      <div className="grid grid-cols-2 gap-[2vw]">
        {/* Левая колонка: Визуальные слоты + Список всего экипированного */}
        <div className="flex flex-col gap-[1.5vh]">
          {/* Визуальная схема экипировки (4 основных слота) */}
          <div className="border-2 border-amber-600 bg-stone-800 rounded-lg p-[1vh]">
            <h3 className="text-[2vh] font-bold text-amber-100 mb-[1vh] text-center">
              Основное снаряжение
            </h3>
            <EquipmentSlots
              equipped={inventory.equipped}
              onSlotClick={handleAddFromSlot}
              onEdit={handleEditEquipment}
              onRemove={handleRemoveEquipment}
            />
          </div>

          {/* ЕДИНЫЙ список всего экипированного снаряжения */}
          <div className="border-2 border-amber-600 bg-stone-800 rounded-lg p-[1vh]">
            <div className="flex items-center justify-between mb-[1vh]">
              <h3 className="text-[1.8vh] font-bold text-amber-100">
                Экипировано ({inventory.equipped.length})
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setEditingSlotType(undefined);
                  setIsEquipmentModalOpen(true);
                }}
                className="px-[1vw] py-[0.3vh] bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold rounded transition-colors text-[1.2vh]"
              >
                + Добавить
              </button>
            </div>
            <div className="flex flex-col gap-[0.8vh] max-h-[25vh] overflow-y-auto pr-[0.5vw]">
              {inventory.equipped.length > 0 ? (
                inventory.equipped.map((item) => {
                  // Определяем цвет рамки в зависимости от типа слота
                  const borderColor = item.slot 
                    ? 'border-green-600' // Основные слоты - зелёный
                    : 'border-blue-600';  // Остальное - синий

                  return (
                    <div
                      key={item.id}
                      className={`p-[0.8vh] bg-stone-900 border-2 ${borderColor} rounded-lg`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-[0.5vw]">
                            <div className="text-[1.4vh] font-bold text-green-400">
                              {item.name}
                            </div>
                            {item.slot && (
                              <div className="px-[0.5vw] py-[0.2vh] bg-amber-600 text-stone-900 rounded text-[1vh] font-bold">
                                {getSlotName(item.slot)}
                              </div>
                            )}
                            {item.isTwoHanded && (
                              <div className="px-[0.5vw] py-[0.2vh] bg-orange-600 text-white rounded text-[1vh] font-bold">
                                2 РУКИ
                              </div>
                            )}
                          </div>
                          {item.description && (
                            <div className="text-[1.1vh] text-amber-100/70 mt-[0.2vh]">
                              {item.description}
                            </div>
                          )}
                          {item.type && (
                            <div className="text-[1vh] text-amber-100/60 mt-[0.2vh]">
                              {item.type}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-[0.3vw]">
                          <button
                            type="button"
                            onClick={() => handleEditEquipment(item)}
                            className="w-[2.5vh] h-[2.5vh] bg-blue-600 hover:bg-blue-500 rounded flex items-center justify-center transition-colors"
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
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveEquipment(item.id)}
                            className="w-[2.5vh] h-[2.5vh] bg-red-600 hover:bg-red-500 rounded flex items-center justify-center transition-colors"
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
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-amber-100/60 text-[1.2vh]">
                  Нет экипированного снаряжения
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Правая колонка: Рюкзак */}
        <div className="border-2 border-amber-600 bg-stone-800 rounded-lg p-[1vh]">
          <h3 className="text-[2vh] font-bold text-amber-100 mb-[1vh]">
            Рюкзак ({inventory.inventory.length})
          </h3>
          <div className="flex flex-col gap-[1vh] max-h-[58vh] overflow-y-auto pr-[0.5vw]">
            {inventory.inventory.length > 0 ? (
              inventory.inventory.map((item) => (
                <div
                  key={item.id}
                  className="p-[1vh] bg-stone-900 border-2 border-amber-600 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-[1.6vh] font-bold text-amber-100">{item.name}</div>
                      {item.description && (
                        <div className="text-[1.2vh] text-amber-100/70 mt-[0.3vh]">
                          {item.description}
                        </div>
                      )}
                      {item.type && (
                        <div className="text-[1.1vh] text-amber-100/60 mt-[0.5vh]">
                          {item.type}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteFromInventory(item.id)}
                      className="w-[3vh] h-[3vh] bg-red-600 hover:bg-red-500 rounded flex items-center justify-center transition-colors"
                    >
                      <svg
                        className="w-[1.5vh] h-[1.5vh] text-white"
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
              ))
            ) : (
              <p className="text-amber-100/60 text-[1.4vh]">Рюкзак пуст</p>
            )}
          </div>
        </div>
      </div>

      {/* Секция 2: Расходники */}
      <div className="border-2 border-amber-600 bg-stone-800 rounded-lg p-[1vh]">
        <div className="flex items-center justify-between mb-[1vh]">
          <h3 className="text-[2vh] font-bold text-amber-100">Расходники</h3>
          <button
            type="button"
            onClick={() => setIsConsumableModalOpen(true)}
            className="px-[1.5vw] py-[0.5vh] bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold rounded transition-colors text-[1.4vh]"
          >
            + Добавить расходник
          </button>
        </div>

        <div className="flex flex-col gap-[1vh] max-h-[20vh] overflow-y-auto pr-[0.5vw]">
          {inventory.consumables.length > 0 ? (
            inventory.consumables.map((consumable) => (
              <ConsumableCard
                key={consumable.id}
                consumable={consumable}
                onQuantityChange={(newQuantity) =>
                  handleConsumableQuantityChange(consumable.id, newQuantity)
                }
                onUse={() => handleUseConsumable(consumable.id)}
                onDelete={() => handleDeleteConsumable(consumable.id)}
              />
            ))
          ) : (
            <p className="text-amber-100/60 text-[1.4vh]">Нет расходников</p>
          )}
        </div>
      </div>

      {/* Секция 3: Сокровища + Магические предметы */}
      <div className="grid grid-cols-2 gap-[2vw]">
        <div className="border-2 border-amber-600 bg-stone-800 rounded-lg">
          <TextareaWithFontControl
            label="Сокровища"
            value={inventory.treasures}
            onChange={(e) => setValue('inventory.treasures', e.target.value, { shouldDirty: true })}
            placeholder="Опишите сокровища и безделушки..."
            style={{ paddingLeft: '0.2vw' }}
            className="h-[10vh]"
            defaultFontSize={14}
            minFontSize={10}
            maxFontSize={24}
          />
        </div>

        <div className="border-2 border-amber-600 bg-stone-800 rounded-lg p-[1vh]">
          <h3 className="text-[1.8vh] font-bold text-amber-100 mb-[0.8vh]">
            Магические предметы
          </h3>
          <div className="flex items-center gap-[1vw] mb-[0.8vh]">
            <span className="text-[1.3vh] text-amber-100">Максимум слотов:</span>
            <Input
              type="number"
              min={0}
              max={20}
              value={inventory.magicItems.maxSlots}
              onChange={(e) =>
                setValue('inventory.magicItems.maxSlots', parseInt(e.target.value) || 0, {
                  shouldDirty: true,
                })
              }
              className="w-[4vw]"
              style={{ paddingLeft: '0.2vw' }}
            />
          </div>
          <div className="text-[1.3vh] text-amber-100/80 mb-[0.8vh]">
            Занято {inventory.magicItems.items.length} из {inventory.magicItems.maxSlots}
          </div>

          <div className="flex flex-col gap-[0.5vh] mb-[0.8vh] max-h-[6vh] overflow-y-auto">
            {inventory.magicItems.items.length > 0 && inventory.magicItems.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-[0.4vh] bg-stone-900 border border-amber-600 rounded"
              >
                <span className="text-[1.3vh] text-amber-100">{item}</span>
                <button
                  type="button"
                  onClick={() => {
                    const updated = inventory.magicItems.items.filter((_, i) => i !== index);
                    setValue('inventory.magicItems.items', updated, { shouldDirty: true });
                  }}
                  className="w-[2vh] h-[2vh] bg-red-600 hover:bg-red-500 rounded flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-[1vh] h-[1vh] text-white"
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
            ))}
          </div>

          {inventory.magicItems.items.length < inventory.magicItems.maxSlots ? (
            <Input
              placeholder="Добавить... (Enter)"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const input = e.target as HTMLInputElement;
                  const value = input.value.trim();
                  if (value) {
                    setValue(
                      'inventory.magicItems.items',
                      [...inventory.magicItems.items, value],
                      { shouldDirty: true }
                    );
                    input.value = '';
                  }
                }
              }}
              style={{ paddingLeft: '0.2vw' }}
            />
          ) : (
            <p className="text-[1.1vh] text-orange-400">⚠️ Максимум слотов</p>
          )}
        </div>
      </div>

      {/* Секция 4: Монеты */}
      <div className="border-2 border-amber-600 bg-stone-800 rounded-lg p-[1vh]">
        <div className="flex items-center justify-between mb-[0.8vh]">
          <h3 className="text-[1.8vh] font-bold text-amber-100">Монеты</h3>
          <button
            type="button"
            onClick={() => setIsCurrencyModalOpen(true)}
            className="px-[1.2vw] py-[0.4vh] bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold rounded transition-colors text-[1.3vh]"
          >
            Управлять
          </button>
        </div>

        <div className="grid grid-cols-5 gap-[0.8vw]">
          {[
            { key: 'copper', label: 'ММ' },
            { key: 'silver', label: 'СМ' },
            { key: 'gold', label: 'ЗМ' },
            { key: 'electrum', label: 'ЭМ' },
            { key: 'platinum', label: 'ПМ' },
          ].map(({ key, label }) => (
            <div key={key} className="flex flex-col items-center">
              <label className="text-[1.4vh] font-bold text-amber-100 mb-[0.3vh]">
                {label}
              </label>
              <Input
                type="number"
                min={0}
                value={inventory.currency[key as keyof typeof inventory.currency]}
                onChange={(e) =>
                  setValue(
                    `inventory.currency.${key}` as any,
                    parseInt(e.target.value) || 0,
                    { shouldDirty: true }
                  )
                }
                className="text-center h-[3.5vh]"
                style={{ paddingLeft: '0.2vw' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Секция 5: Переносимый вес */}
      <div className="border-2 border-amber-600 bg-stone-800 rounded-lg p-[1vh]">
        <h3 className="text-[1.8vh] font-bold text-amber-100 mb-[0.8vh]">Переносимый вес</h3>
        <div className="grid grid-cols-2 gap-[2vw]">
          <Input
            label="Текущий вес"
            type="number"
            min={0}
            value={inventory.carryCapacity.current}
            onChange={(e) =>
              setValue('inventory.carryCapacity.current', parseInt(e.target.value) || 0, {
                shouldDirty: true,
              })
            }
            style={{ paddingLeft: '0.2vw' }}
            className="h-[3.5vh]"
          />
          <Input
            label="Максимальный вес"
            type="number"
            min={0}
            value={inventory.carryCapacity.max}
            onChange={(e) =>
              setValue('inventory.carryCapacity.max', parseInt(e.target.value) || 0, {
                shouldDirty: true,
              })
            }
            style={{ paddingLeft: '0.2vw' }}
            className="h-[3.5vh]"
          />
        </div>
        <p className="text-[1.1vh] text-amber-100/60 mt-[0.5vh]">
          💡 Обычно максимальный вес = Сила × 15 (если нет особых способностей)
        </p>
      </div>

      {/* Модальные окна */}
      {isEquipmentModalOpen && (
        <EquipmentModal
          item={editingItem}
          slotType={editingSlotType}
          onSave={handleSaveEquipment}
          onClose={() => {
            setIsEquipmentModalOpen(false);
            setEditingItem(null);
            setEditingSlotType(undefined);
          }}
        />
      )}

      {isConsumableModalOpen && (
        <ConsumableModal
          onSave={handleSaveConsumable}
          onClose={() => setIsConsumableModalOpen(false)}
        />
      )}

      {isCurrencyModalOpen && (
        <CurrencyCalculatorModal
          currentCurrency={inventory.currency}
          onApply={(newCurrency) => {
            setValue('inventory.currency', newCurrency, { shouldDirty: true });
            setIsCurrencyModalOpen(false);
          }}
          onClose={() => setIsCurrencyModalOpen(false)}
        />
      )}
    </div>
  );
}
