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

  const [isConsumableModalOpen, setIsConsumableModalOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);


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
    if (window.confirm('Удалить этот расходник?')) {
      const updated = inventory.consumables.filter((c) => c.id !== id);
      setValue('inventory.consumables', updated, { shouldDirty: true });
    }
  };
  return (
    <div className="relative left-[0.5vw] top-[1vh] w-[74vw] flex flex-col gap-[1.5vh] uppercase max-h-[63vh]">
      <h2 className="text-[2.5vh] font-bold text-amber-100">Инвентарь</h2>

      {/* Секция 2: Расходники */}
      <div style={{padding: '0 0.5vw'}} className="border-2 border-amber-600 bg-stone-800 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-[2vh] font-bold text-amber-100">Расходники</h3>
          <button
            type="button"
            onClick={() => setIsConsumableModalOpen(true)}
            style={{padding: '0.5vh 1vw', margin: '1vh 0'}}
            className=" bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold rounded transition-colors text-[1.4vh]"
          >
            + Добавить расходник
          </button>
        </div>

        <div className="grid grid-cols-3 gap-[1vh] max-h-[20vh] overflow-y-auto">
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
          <h3 className="text-[1.8vh] font-bold text-amber-100 mb-[0.8vh]">Магические предметы</h3>
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
            {inventory.magicItems.items.length > 0 &&
              inventory.magicItems.items.map((item, index) => (
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
                    setValue('inventory.magicItems.items', [...inventory.magicItems.items, value], {
                      shouldDirty: true,
                    });
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
              <label className="text-[1.4vh] font-bold text-amber-100 mb-[0.3vh]">{label}</label>
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
