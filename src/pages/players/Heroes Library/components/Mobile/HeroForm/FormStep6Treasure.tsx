import { useState } from 'react';
import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type {
  HeroFormData,
  Consumable,
} from '../../../../../../features/heroes/schemas/heroSchema';
import { TextareaWithFontControl } from './ui/TextareaFontControl';
import { Input } from './ui/Input';
import { ConsumableModal } from './ui/FormStep5/ConsumableModal';
import { ConsumableCard } from './ui/FormStep5/ConsumableCard';
import { CurrencyCalculatorModal } from './ui/FormStep5/CurrencyCalculatorModal';
import { ConfirmDialog, type ConfirmDialogConfig } from './ui/FormStep5/ConfirmDialog';
import { CarryCapacityModal } from './ui/FormStep5/CarryCapacityModal';

interface FormStep5InventoryProps {
  register: UseFormRegister<HeroFormData>;
  errors: FieldErrors<HeroFormData>;
  watch: UseFormWatch<HeroFormData>;
  setValue: UseFormSetValue<HeroFormData>;
}

export function FormStep6Treasure({ register, errors, watch, setValue }: FormStep5InventoryProps) {
  const inventoryData = watch('inventory');

  const inventory = {
    equipped: inventoryData?.equipped || [],
    inventory: inventoryData?.inventory || [],
    consumables: inventoryData?.consumables || [],
    treasures: inventoryData?.treasures || '',
    magicItems: {
      maxSlots: inventoryData?.magicItems?.maxSlots ?? 3,
      items: inventoryData?.magicItems?.items ?? [],
    },
    currency: inventoryData?.currency || {
      copper: 0,
      silver: 0,
      gold: 0,
      electrum: 0,
      platinum: 0,
    },
    carryCapacity: inventoryData?.carryCapacity || { current: 0, max: 0 },
  };

  const [isConsumableModalOpen, setIsConsumableModalOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isCarryCapacityModalOpen, setIsCarryCapacityModalOpen] = useState(false);

  // Единый унифицированный state для всех диалогов
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    config: ConfirmDialogConfig;
    onClose: (confirmed: boolean) => void;
  }>({
    isOpen: false,
    config: { title: '', message: '' },
    onClose: () => {},
  });

  const closeConfirmDialog = () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  // РАСХОДНИКИ
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
    setConfirmDialog({
      isOpen: true,
      config: {
        title: 'Удаление расходника',
        message: 'Вы уверены, что хотите удалить этот расходник?\nЭто действие нельзя отменить.',
        type: 'error',
        confirmText: 'Удалить',
        cancelText: 'Отмена',
        showCancel: true,
      },
      onClose: (confirmed) => {
        if (confirmed) {
          const updated = inventory.consumables.filter((c) => c.id !== id);
          setValue('inventory.consumables', updated, { shouldDirty: true });
        }
        closeConfirmDialog();
      },
    });
  };

  // МАГИЧЕСКИЕ ПРЕДМЕТЫ
  const handleConfirmMaxSlotsReduction = (confirmed: boolean, newMaxSlots: number) => {
    if (confirmed) {
      const currentItems = inventory.magicItems.items || [];
      const itemsWithoutEmpty = currentItems.filter((item) => item && item.trim() !== '');
      const updatedItems = itemsWithoutEmpty.slice(0, newMaxSlots);

      while (updatedItems.length < newMaxSlots) {
        updatedItems.push('');
      }

      setValue('inventory.magicItems.maxSlots', newMaxSlots, { shouldDirty: true });
      setValue('inventory.magicItems.items', updatedItems, { shouldDirty: true });
    }
  };

  const handleMaxSlotsChange = (newMaxSlots: number) => {
    const currentItems = inventory.magicItems.items || [];

    if (newMaxSlots > currentItems.length) {
      setValue('inventory.magicItems.maxSlots', newMaxSlots, { shouldDirty: true });

      const updatedItems = [...currentItems];
      while (updatedItems.length < newMaxSlots) {
        updatedItems.push('');
      }
      setValue('inventory.magicItems.items', updatedItems, { shouldDirty: true });
      return;
    }

    if (newMaxSlots < currentItems.length) {
      const itemsWithoutEmpty = currentItems.filter((item) => item && item.trim() !== '');

      if (itemsWithoutEmpty.length > newMaxSlots) {
        const filledItemsToRemove = itemsWithoutEmpty.slice(newMaxSlots);

        setConfirmDialog({
          isOpen: true,
          config: {
            title: 'Уменьшение слотов',
            message: `Вы уменьшаете количество слотов до ${newMaxSlots}.\n\nБудут удалены следующие предметы:\n${filledItemsToRemove
              .map((item, i) => `${i + 1}. ${item}`)
              .join('\n')}\n\nПродолжить?`,
            type: 'confirm',
            confirmText: 'Да, продолжить',
            cancelText: 'Отмена',
          },
          onClose: (confirmed) => {
            handleConfirmMaxSlotsReduction(confirmed, newMaxSlots);
            closeConfirmDialog();
          },
        });
        return;
      }

      const updatedItems = [...itemsWithoutEmpty];
      while (updatedItems.length < newMaxSlots) {
        updatedItems.push('');
      }

      setValue('inventory.magicItems.maxSlots', newMaxSlots, { shouldDirty: true });
      setValue('inventory.magicItems.items', updatedItems, { shouldDirty: true });
      return;
    }

    setValue('inventory.magicItems.maxSlots', newMaxSlots, { shouldDirty: true });
  };

  const handleMagicItemChange = (index: number, value: string) => {
    const updatedItems = [...inventory.magicItems.items];
    updatedItems[index] = value;
    setValue('inventory.magicItems.items', updatedItems, { shouldDirty: true });
  };

  const magicItemSlots = Array.from({ length: inventory.magicItems.maxSlots }, (_, index) => ({
    index,
    value: inventory.magicItems.items[index] || '',
  }));

  return (
    <div className="relative left-[0.5vw] top-[1vh] w-[98vw] flex flex-col gap-[1.5vh] uppercase max-h-[63vh]">
      <h2 className="text-[2.5vh] font-bold text-amber-100">Инвентарь</h2>

      {/* Секция 1: Расходники */}
      <div
        style={{ padding: '0 0.5vw' }}
        className="border-2 border-amber-600 bg-stone-800 rounded-lg"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[2vh] font-bold text-amber-100">Расходники</h3>
          <button
            type="button"
            onClick={() => setIsConsumableModalOpen(true)}
            style={{ padding: '0.5vh 1vw', margin: '1vh 0' }}
            className="bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold rounded transition-colors text-[1.4vh]"
          >
            + Добавить расходник
          </button>
        </div>

        <div
          style={{ padding: '0.5vw 0' }}
          className="grid grid-cols-2 gap-[1vh] h-[20.5vh] overflow-y-auto overflow-x-hidden"
        >
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

      {/* Секция 2: Сокровища + Магические предметы */}
      <div className="grid grid-cols-2 gap-[2vw]">
        <div className="border-2 border-amber-600 bg-stone-800 rounded-lg">
          <TextareaWithFontControl
            label="Сокровища"
            value={inventory.treasures}
            onChange={(e) => setValue('inventory.treasures', e.target.value, { shouldDirty: true })}
            placeholder="Опишите сокровища и безделушки..."
            style={{ paddingLeft: '0.2vw' }}
            className="h-[15vh]"
            defaultFontSize={14}
            minFontSize={10}
            maxFontSize={24}
          />
        </div>

        <div
          style={{ padding: '0.2vw' }}
          className="border-2 border-amber-600 bg-stone-800 rounded-lg"
        >
          <h3 className="text-[1.8vh] font-bold text-amber-100">Магические предметы</h3>

          <div className="flex items-center gap-[0.5vw]">
            <span className="text-[1.3vh] text-amber-100">Максимум слотов:</span>
            <Input
              type="number"
              min={0}
              max={7}
              value={inventory.magicItems.maxSlots}
              onChange={(e) => {
                const newValue = parseInt(e.target.value) || 0;
                handleMaxSlotsChange(newValue);
              }}
              className="w-[4vw]"
              style={{ paddingLeft: '1vw' }}
            />
          </div>

          <div
            style={{ padding: '0.3vh' }}
            className="flex flex-col gap-[0.5vh] max-h-[10vh] overflow-y-auto"
          >
            {magicItemSlots.length > 0 ? (
              magicItemSlots.map((slot) => (
                <div key={slot.index} className="flex items-center gap-[0.5vw]">
                  <span className="text-[1.2vh] text-amber-100/60 w-[2vw]">{slot.index + 1}.</span>
                  <Input
                    value={slot.value}
                    onChange={(e) => handleMagicItemChange(slot.index, e.target.value)}
                    placeholder="Название предмета..."
                    className="flex-1"
                    style={{ paddingLeft: '0.5vw', height: '2.5vh' }}
                  />
                </div>
              ))
            ) : (
              <p
                style={{ paddingTop: '3vh' }}
                className="text-amber-100/60 text-center text-[1.6vh]"
              >
                Укажите количество слотов
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Секция 3: Монеты */}
      <div
        style={{ padding: '0.2vh 0.5vw' }}
        className="relative bottom-[0.5vh] border-2 border-amber-600 bg-stone-800 rounded-lg"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[1.8vh] font-bold text-amber-100">Монеты</h3>
          <button
            type="button"
            onClick={() => setIsCurrencyModalOpen(true)}
            style={{ padding: '0.2vh 0.5vw' }}
            className="bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold rounded transition-colors text-[1.3vh]"
          >
            Калькулятор
          </button>
        </div>
        <div style={{ paddingBottom: '0.5vh' }} className="grid grid-cols-5 gap-[0.8vw]">
          {[
            { key: 'copper', label: 'ММ' },
            { key: 'silver', label: 'СМ' },
            { key: 'gold', label: 'ЗМ' },
            { key: 'electrum', label: 'ЭМ' },
            { key: 'platinum', label: 'ПМ' },
          ].map(({ key, label }) => (
            <div key={key} className="flex flex-col items-center">
              <label className="text-[1.4vh] font-bold text-amber-100">{label}</label>
              <Input
                type="number"
                min={0}
                value={inventory.currency[key as keyof typeof inventory.currency]}
                onChange={(e) =>
                  setValue(`inventory.currency.${key}` as any, parseInt(e.target.value) || 0, {
                    shouldDirty: true,
                  })
                }
                className="text-center h-[3.5vh]"
                style={{ paddingLeft: '0.2vw' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Секция 4: Переносимый вес */}
      <div
        style={{ padding: '0.2vh 0.5vw' }}
        className="relative bottom-[0.8vh] border-2 border-amber-600 bg-stone-800 rounded-lg"
      >
        <div style={{marginBottom: '1.5vh'}} className="flex justify-between">
          <h3 className="text-[1.8vh] font-bold text-amber-100">Переносимый вес</h3>
          <button
            type="button"
            onClick={() => setIsCarryCapacityModalOpen(true)}
            style={{ padding: '0.2vh 0.2vw', marginTop: '0.5vh' }}
            className="flex items-center gap-[0.5vw] bg-amber-600 hover:bg-amber-500 border-2 border-amber-600 hover:border-amber-500 rounded-lg transition-colors shadow-lg group"
            title="Открыть памятку"
          >
            <svg
              className="w-[1.4vh] h-[1.4vh] text-stone-900"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-[1.4vh] font-bold text-stone-900">Памятка</span>
          </button>
        </div>
        <div className="relative bottom-[1vh] grid grid-cols-2 gap-[2vw]">
          <Input
            label="Текущий вес"
            type="number"
            min={0}
            value={inventory.carryCapacity.current || 0}
            onChange={(e) =>
              setValue('inventory.carryCapacity.current', Number(e.target.value) || 0, {
                shouldDirty: true,
              })
            }
            style={{ paddingLeft: '0.2vw' }}
            className="h-[2.5vh]"
          />
          <Input
            label="Максимальный вес"
            type="number"
            min={0}
            value={inventory.carryCapacity.max || 0}
            onChange={(e) =>
              setValue('inventory.carryCapacity.max', Number(e.target.value) || 0, {
                shouldDirty: true,
              })
            }
            style={{ paddingLeft: '0.2vw' }}
            className="h-[2.5vh]"
          />
        </div>
      </div>

      {/* Модальные окна */}
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

      {isCarryCapacityModalOpen && (
        <CarryCapacityModal
          currentSize={watch('size') || 'medium'}
          currentStrength={watch('abilityScores.strength') || 10}
          currentWeight={inventory.carryCapacity.current || 0}
          maxWeight={inventory.carryCapacity.max || 0}
          onApply={(newCurrentWeight, newMaxWeight) => {
            setValue('inventory.carryCapacity.current', newCurrentWeight, { shouldDirty: true });
            setValue('inventory.carryCapacity.max', newMaxWeight, { shouldDirty: true });
            setIsCarryCapacityModalOpen(false);
          }}
          onClose={() => setIsCarryCapacityModalOpen(false)}
        />
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        config={confirmDialog.config}
        onClose={confirmDialog.onClose}
      />
    </div>
  );
}
