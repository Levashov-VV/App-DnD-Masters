import { useState } from 'react';
import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type {
  HeroFormData,
  EquipmentItem,
  EquipmentSlot,
} from '../../../../../../features/heroes/schemas/heroSchema';
import { EquipmentSlots } from './ui/FormStep5/EquipmentSlots';
import { EquipmentModal } from './ui/FormStep5/EquipmentModal';
import { ConfirmDialog } from './ui/FormStep5/ConfirmDialog';
import { useConfirmDialog } from '../../../../../../shared/hooks/PersonForm/useConfirmDialog';
import { EquipSlotModal } from './ui/FormStep5/EquipSlotModal';

interface FormStep5InventoryProps {
  register: UseFormRegister<HeroFormData>;
  errors: FieldErrors<HeroFormData>;
  watch: UseFormWatch<HeroFormData>;
  setValue: UseFormSetValue<HeroFormData>;
}

export function FormStep5Inventory({ watch, setValue }: FormStep5InventoryProps) {
  const inventoryData = watch('inventory');

  const inventory = {
    equipped: inventoryData?.equipped || [],
    inventory: inventoryData?.inventory || [],
    consumables: inventoryData?.consumables || [],
    treasures: inventoryData?.treasures || '',
    magicItems: inventoryData?.magicItems || { maxSlots: 3, items: [] },
    currency: inventoryData?.currency || {
      copper: 0,
      silver: 0,
      gold: 0,
      electrum: 0,
      platinum: 0,
    },
    carryCapacity: inventoryData?.carryCapacity || { current: 0, max: 0 },
  };

  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isBackpackModalOpen, setIsBackpackModalOpen] = useState(false);
  const [isEquipSlotModalOpen, setIsEquipSlotModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null);
  const [editingSlotType, setEditingSlotType] = useState<EquipmentSlot | undefined>(undefined);
  const [itemToEquip, setItemToEquip] = useState<EquipmentItem | null>(null);

  const dialog = useConfirmDialog();

  // УТИЛИТЫ

  const getSlotName = (slot: EquipmentSlot): string => {
    const names: Record<EquipmentSlot, string> = {
      armor: 'Броня',
      mainHand: 'Сильная рука',
      offHand: 'Слабая рука',
      ranged: 'Дальнобойное оружие',
    };
    return names[slot];
  };

  const getAvailableSlotsForItem = (item: EquipmentItem): EquipmentSlot[] => {
    if (!item.type) return [];

    const typeLower = item.type.toLowerCase();
    if (typeLower.includes('оружие ближнего боя') || typeLower === 'оружие ближнего боя') {
      return ['mainHand', 'offHand'];
    }
    if (typeLower.includes('щит') || typeLower === 'щит') {
      return ['mainHand', 'offHand'];
    }
    if (typeLower.includes('броня') || typeLower === 'броня') {
      return ['armor'];
    }
    if (typeLower.includes('дальнобойное') || typeLower === 'дальнобойное оружие') {
      return ['ranged'];
    }
    return [];
  };

  const isSlotAvailable = (slotType: EquipmentSlot, excludeId?: string): boolean => {
    const equippedItems = inventory.equipped.filter((item) => item.id !== excludeId);
    const slotOccupied = equippedItems.some((item) => item.slot === slotType);
    if (slotOccupied) return false;

    if (slotType === 'mainHand' || slotType === 'offHand') {
      const hasTwoHandedWeapon = equippedItems.some(
        (item) => (item.slot === 'mainHand' || item.slot === 'offHand') && item.isTwoHanded
      );
      if (hasTwoHandedWeapon) return false;
    }

    return true;
  };

  const canEquipTwoHanded = (excludeId?: string): boolean => {
    const equippedItems = inventory.equipped.filter((item) => item.id !== excludeId);
    const mainHandOccupied = equippedItems.some((item) => item.slot === 'mainHand');
    const offHandOccupied = equippedItems.some((item) => item.slot === 'offHand');
    return !mainHandOccupied && !offHandOccupied;
  };

  //  СНАРЯЖЕНИЕ

  const handleSaveEquipment = async (item: EquipmentItem) => {
    if (item.slot) {
      if (
        item.isTwoHanded &&
        (item.slot === 'mainHand' || item.slot === 'offHand') &&
        !canEquipTwoHanded(item.id)
      ) {
        await dialog.error(
          'Невозможно экипировать',
          'Обе руки должны быть свободны для двуручного оружия!'
        );
        return;
      }

      if (!isSlotAvailable(item.slot, item.id)) {
        await dialog.error(
          'Слот занят',
          `Слот "${getSlotName(item.slot)}" уже занят другим предметом!`
        );
        return;
      }
    }

    if (editingItem) {
      const updatedEquipped = inventory.equipped.map((i) => (i.id === item.id ? item : i));
      setValue('inventory.equipped', updatedEquipped, { shouldDirty: true });
    } else {
      setValue('inventory.equipped', [...inventory.equipped, item], { shouldDirty: true });
    }

    setIsEquipmentModalOpen(false);
    setEditingItem(null);
    setEditingSlotType(undefined);
  };

  const handleSaveBackpackItem = (item: EquipmentItem) => {
    if (editingItem) {
      const updatedInventory = inventory.inventory.map((i) => (i.id === item.id ? item : i));
      setValue('inventory.inventory', updatedInventory, { shouldDirty: true });
    } else {
      setValue('inventory.inventory', [...inventory.inventory, item], { shouldDirty: true });
    }

    setIsBackpackModalOpen(false);
    setEditingItem(null);
  };

  const handleEditEquipment = (item: EquipmentItem) => {
    setEditingItem(item);
    setEditingSlotType(item.slot);
    setIsEquipmentModalOpen(true);
  };

  const handleEditBackpackItem = (item: EquipmentItem) => {
    setEditingItem(item);
    setIsBackpackModalOpen(true);
  };

  const handleRemoveEquipment = async (id: string) => {
    const confirmed = await dialog.confirm({
      title: 'Снять снаряжение',
      message: 'Вы уверены, что хотите снять этот предмет?',
      confirmText: 'Снять',
      cancelText: 'Отмена',
    });

    if (confirmed) {
      const updated = inventory.equipped.filter((i) => i.id !== id);
      setValue('inventory.equipped', updated, { shouldDirty: true });
    }
  };

  const handleMoveToBackpack = async (id: string) => {
    const item = inventory.equipped.find((i) => i.id === id);
    if (!item) return;

    const confirmed = await dialog.confirm({
      title: 'Переместить в рюкзак',
      message: `Переместить "${item.name}" в рюкзак?`,
      confirmText: 'Переместить',
      cancelText: 'Отмена',
    });

    if (confirmed) {
      const updatedEquipped = inventory.equipped.filter((i) => i.id !== id);
      setValue('inventory.equipped', updatedEquipped, { shouldDirty: true });

      const itemForBackpack = { ...item, slot: undefined };
      setValue('inventory.inventory', [...inventory.inventory, itemForBackpack], {
        shouldDirty: true,
      });
    }
  };

  const handleEquipFromBackpack = async (id: string) => {
    const item = inventory.inventory.find((i) => i.id === id);
    if (!item) return;

    const availableSlots = getAvailableSlotsForItem(item);

    if (availableSlots.length === 0) {
      const updatedInventory = inventory.inventory.filter((i) => i.id !== id);
      setValue('inventory.inventory', updatedInventory, { shouldDirty: true });
      setValue('inventory.equipped', [...inventory.equipped, item], { shouldDirty: true });
      return;
    }

    setItemToEquip(item);
    setIsEquipSlotModalOpen(true);
  };

  const handleConfirmEquipSlot = async (slotType: EquipmentSlot) => {
    if (!itemToEquip) return;

    setIsEquipSlotModalOpen(false);

    const currentInventoryData = watch('inventory');
    const currentEquipped = currentInventoryData?.equipped || [];
    const currentInventory = currentInventoryData?.inventory || [];
    const itemInSlot = currentEquipped.find((item) => item.slot === slotType);
    const itemsInHands = currentEquipped.filter(
      (item) => item.slot === 'mainHand' || item.slot === 'offHand'
    );

    if (itemToEquip.isTwoHanded && (slotType === 'mainHand' || slotType === 'offHand')) {
      if (itemsInHands.length === 0) {
        const updatedInventory = currentInventory.filter((i) => i.id !== itemToEquip.id);
        setValue('inventory.inventory', updatedInventory, { shouldDirty: true });

        const equippedItem = { ...itemToEquip, slot: slotType };
        setValue('inventory.equipped', [...currentEquipped, equippedItem], { shouldDirty: true });

        setItemToEquip(null);
        return;
      }

      const itemNames = itemsInHands.map((i) => i.name).join(', ');
      const confirmed = await dialog.confirm({
        title: 'Заменить предметы',
        message: `Двуручное оружие "${itemToEquip.name}" заменит предметы в обеих руках:\n\n${itemNames}\n\nПродолжить?`,
        confirmText: 'Да, заменить',
        cancelText: 'Отмена',
      });

      if (!confirmed) {
        setItemToEquip(null);
        return;
      }

      const itemsToMove = itemsInHands.map((i) => ({ ...i, slot: undefined }));
      const newInventory = [...currentInventory, ...itemsToMove];
      const newEquipped = currentEquipped.filter(
        (i) => i.slot !== 'mainHand' && i.slot !== 'offHand'
      );
      const finalInventory = newInventory.filter((i) => i.id !== itemToEquip.id);
      const equippedItem = { ...itemToEquip, slot: slotType };
      const finalEquipped = [...newEquipped, equippedItem];

      setValue('inventory.inventory', finalInventory, { shouldDirty: true });
      setValue('inventory.equipped', finalEquipped, { shouldDirty: true });

      setItemToEquip(null);
      return;
    }

    const hasTwoHandedInCurrentHands = itemsInHands.some((i) => i.isTwoHanded);
    if (
      hasTwoHandedInCurrentHands &&
      (slotType === 'mainHand' || slotType === 'offHand') &&
      !itemToEquip.isTwoHanded
    ) {
      const twoHandedItem = itemsInHands.find((i) => i.isTwoHanded);
      if (!twoHandedItem) {
        setItemToEquip(null);
        return;
      }

      const confirmed = await dialog.confirm({
        title: 'Заменить двуручное оружие',
        message: `В руках находится двуручное оружие "${twoHandedItem.name}".\n\nЗаменить его на "${itemToEquip.name}"?`,
        confirmText: 'Да, заменить',
        cancelText: 'Отмена',
      });

      if (!confirmed) {
        setItemToEquip(null);
        return;
      }

      const itemForBackpack = { ...twoHandedItem, slot: undefined };
      const newInventory = [...currentInventory, itemForBackpack];
      const newEquipped = currentEquipped.filter((i) => i.id !== twoHandedItem.id);
      const finalInventory = newInventory.filter((i) => i.id !== itemToEquip.id);
      const equippedItem = { ...itemToEquip, slot: slotType };
      const finalEquipped = [...newEquipped, equippedItem];

      setValue('inventory.inventory', finalInventory, { shouldDirty: true });
      setValue('inventory.equipped', finalEquipped, { shouldDirty: true });

      setItemToEquip(null);
      return;
    }

    if (!itemInSlot) {
      const updatedInventory = currentInventory.filter((i) => i.id !== itemToEquip.id);
      setValue('inventory.inventory', updatedInventory, { shouldDirty: true });

      const equippedItem = { ...itemToEquip, slot: slotType };
      setValue('inventory.equipped', [...currentEquipped, equippedItem], { shouldDirty: true });

      setItemToEquip(null);
      return;
    }

    const confirmed = await dialog.confirm({
      title: 'Заменить предмет',
      message: `В слоте "${getSlotName(slotType)}" находится "${itemInSlot.name}".\n\nЗаменить его на "${itemToEquip.name}"?`,
      confirmText: 'Да, заменить',
      cancelText: 'Отмена',
    });

    if (!confirmed) {
      setItemToEquip(null);
      return;
    }

    const itemForBackpack = { ...itemInSlot, slot: undefined };
    const newInventory = [...currentInventory, itemForBackpack];
    const newEquipped = currentEquipped.filter((i) => i.id !== itemInSlot.id);
    const finalInventory = newInventory.filter((i) => i.id !== itemToEquip.id);
    const equippedItem = { ...itemToEquip, slot: slotType };
    const finalEquipped = [...newEquipped, equippedItem];

    setValue('inventory.inventory', finalInventory, { shouldDirty: true });
    setValue('inventory.equipped', finalEquipped, { shouldDirty: true });

    setItemToEquip(null);
  };

  const handleAddFromSlot = async (slotType: EquipmentSlot) => {
    if (!isSlotAvailable(slotType)) {
      await dialog.error('Слот занят', `Слот "${getSlotName(slotType)}" уже занят!`);
      return;
    }

    setEditingItem(null);
    setEditingSlotType(slotType);
    setIsEquipmentModalOpen(true);
  };

  const handleDeleteFromInventory = async (id: string) => {
    const confirmed = await dialog.confirm({
      title: 'Удалить предмет',
      message: 'Вы уверены, что хотите удалить этот предмет из рюкзака?',
      confirmText: 'Да, удалить',
      cancelText: 'Отмена',
    });

    if (confirmed) {
      const updated = inventory.inventory.filter((i) => i.id !== id);
      setValue('inventory.inventory', updated, { shouldDirty: true });
    }
  };

  const handleDeleteEquipped = async (id: string) => {
    const confirmed = await dialog.confirm({
      title: 'Удалить предмет',
      message: 'Вы уверены, что хотите удалить этот предмет?',
      confirmText: 'Да, удалить',
      cancelText: 'Отмена',
    });

    if (confirmed) {
      const updated = inventory.equipped.filter((i) => i.id !== id);
      setValue('inventory.equipped', updated, { shouldDirty: true });
    }
  };

  return (
    <div className="relative left-[0.5vw] top-[1vh] w-[98vw] flex flex-col gap-[1.5vh] uppercase">
      <h2 className="text-[2.5vh] text-center font-bold text-amber-100">Инвентарь</h2>
      <div className="flex flex-col gap-[2vw]">
        {/* Визуальная схема экипировки */}
        <div className="border-2 border-amber-600 bg-stone-800 rounded-lg h-[35vh]">
          <h3 className="text-[2vh] font-bold text-amber-100 text-center">Основное снаряжение</h3>
          <EquipmentSlots
            equipped={inventory.equipped}
            onSlotClick={handleAddFromSlot}
            onEdit={handleEditEquipment}
            onRemove={handleRemoveEquipment}
          />
        </div>

        {/* Экипированное + Рюкзак */}
        <div className="flex flex-col gap-[1vh]">
          {/* Список всего экипированного снаряжения */}
          <div
            style={{ padding: '0.5vw' }}
            className="h-[20vh] border-2 border-amber-600 bg-stone-800 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[1.8vh] font-bold text-amber-100">
                Экипировка: ({inventory.equipped.length})
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setEditingSlotType(undefined);
                  setIsEquipmentModalOpen(true);
                }}
                style={{ padding: '0.5vh 0.5vw', margin: '0.5vh 0' }}
                className=" bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold rounded transition-colors text-[1.4vh]"
              >
                + Добавить
              </button>
            </div>
            <div className="grid grid-cols-2 gap-[0.8vh] max-h-[15vh] overflow-y-auto">
              {inventory.equipped.length > 0 ? (
                inventory.equipped.map((item) => {
                  const borderColor = item.slot ? 'border-green-400' : 'border-amber-600';

                  return (
                    <div
                      key={item.id}
                      className={`bg-stone-900 border-2 ${borderColor} rounded-lg`}
                    >
                      <div className="flex items-start justify-between">
                        <div style={{ margin: '0.2vh 0.2vw' }} className="flex-1">
                          <div className="flex items-center gap-[0.5vw]">
                            <div className="max-w-[5vw] text-[1.2vh] font-bold text-amber-500">
                              {item.name}
                            </div>
                            
                          </div>
                          {item.type && (
                            <div className="text-[1vh] text-amber-100/60">{item.type}</div>
                          )}
                          {item.attackDice ? (
                            <div className="text-[1.1vh] text-amber-100/70">
                              Бонус к урону: {item.attackDice}
                            </div>
                          ) : null}
                          {item.armorBonus ? (
                            <div className="text-[1.1vh] text-amber-100/70">
                              Бонус к броне: {item.armorBonus}
                            </div>
                          ) : null}
                        </div>
                        <div
                          style={{ margin: '0.4vh 0.2vw' }}
                          className="flex flex-col gap-[0.3vh]"
                        >
                          <button
                            type="button"
                            onClick={() => handleMoveToBackpack(item.id)}
                            className="w-[2.5vh] h-[2.5vh] bg-green-600 hover:bg-green-500 rounded-4xl flex items-center justify-center transition-colors"
                            title="Переместить в рюкзак"
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
                                d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"
                              />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditEquipment(item)}
                            className="w-[2.5vh] h-[2.5vh] bg-amber-600 hover:bg-amber-500 rounded-4xl flex items-center justify-center transition-colors"
                          >
                            <svg
                              className="w-[1.2vh] h-[1.2vh] text-amber-100"
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
                            onClick={() => handleDeleteEquipped(item.id)}
                            className="w-[2.5vh] h-[2.5vh] bg-red-600 hover:bg-red-500 rounded-4xl flex items-center justify-center transition-colors"
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
                <p className="text-amber-100/60 text-[1.2vh]">Нет экипированного снаряжения</p>
              )}
            </div>
          </div>

          <div
            style={{ padding: '0.5vw' }}
            className="h-[15vh] border-2 border-amber-600 bg-stone-800 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[1.8vh] font-bold text-amber-100">
                Рюкзак: ({inventory.inventory.length})
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setIsBackpackModalOpen(true);
                }}
                style={{ padding: '0.5vh 0.5vw', margin: '0.5vh 0' }}
                className=" bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold rounded transition-colors text-[1.2vh]"
              >
                + Добавить
              </button>
            </div>
            <div className="grid grid-cols-2 gap-[0.8vh] max-h-[15vh] overflow-y-auto">
              {inventory.inventory.length > 0 ? (
                inventory.inventory.map((item) => (
                  <div key={item.id} className="bg-stone-900 border-2 border-amber-600 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div style={{ margin: '0.2vh 0.2vw' }} className="flex-1">
                        <div className="flex items-center gap-[0.5vw]">
                          <div className="max-w-[5vw] text-[1.2vh] font-bold text-amber-500">
                            {item.name}
                          </div>
                        </div>
                        {item.attackDice ? (
                          <div className="text-[1.1vh] text-amber-100/70">
                            Бонус к урону: {item.attackDice}
                          </div>
                        ) : null}
                        {item.armorBonus ? (
                          <div className="text-[1.1vh] text-amber-100/70">
                            Бонус к броне: {item.armorBonus}
                          </div>
                        ) : null}
                      </div>
                      <div style={{ margin: '0.4vh 0.2vw' }} className="flex flex-col gap-[0.3vh]">
                        <button
                          type="button"
                          onClick={() => handleEquipFromBackpack(item.id)}
                          className="w-[2.5vh] h-[2.5vh] bg-green-600 hover:bg-green-500 rounded-4xl flex items-center justify-center transition-colors"
                          title="Экипировать"
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
                              d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditBackpackItem(item)}
                          className="w-[2.5vh] h-[2.5vh] bg-amber-600 hover:bg-amber-500 rounded-4xl flex items-center justify-center transition-colors"
                          title="Редактировать"
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
                          onClick={() => handleDeleteFromInventory(item.id)}
                          className="w-[2.5vh] h-[2.5vh] bg-red-600 hover:bg-red-500 rounded-4xl flex items-center justify-center transition-colors"
                          title="Удалить"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-amber-100/60 text-[1.2vh]">Рюкзак пуст</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Диалоги */}
      <ConfirmDialog isOpen={dialog.isOpen} config={dialog.config} onClose={dialog.handleClose} />

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

      {isBackpackModalOpen && (
        <EquipmentModal
          item={editingItem}
          slotType={undefined}
          isBackpackMode={true}
          onSave={handleSaveBackpackItem}
          onClose={() => {
            setIsBackpackModalOpen(false);
            setEditingItem(null);
          }}
        />
      )}

      {isEquipSlotModalOpen && itemToEquip && (
        <EquipSlotModal
          item={itemToEquip}
          availableSlots={getAvailableSlotsForItem(itemToEquip)}
          equippedItems={inventory.equipped}
          onConfirm={handleConfirmEquipSlot}
          onClose={() => {
            setIsEquipSlotModalOpen(false);
            setItemToEquip(null);
          }}
        />
      )}
    </div>
  );
}
