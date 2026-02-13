// components/Desktop/HeroForm/ui/FormStep5/ConsumableModal.tsx
import { useState } from 'react';
import type { Consumable } from '../../../../../../../../features/heroes/schemas/heroSchema';
import { Input } from '../Input';

interface ConsumableModalProps {
  onSave: (consumable: Consumable) => void;
  onClose: () => void;
}

export function ConsumableModal({ onSave, onClose }: ConsumableModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      setError('Название обязательно');
      return;
    }

    const newConsumable: Consumable = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim() || '',
      quantity: quantity,
    };

    onSave(newConsumable);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-[40vw] bg-stone-900 border-4 border-amber-600 rounded-2xl p-[2vh]">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-[2vh]">
          <h2 className="text-[2.5vh] font-bold text-amber-100 uppercase">Добавить расходник</h2>
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

        {/* Форма */}
        <div className="flex flex-col gap-[1.5vh]">
          <Input
            label="Название расходника"
            placeholder="Например: Зелье лечения, Стрелы..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            error={error}
            style={{ paddingLeft: '0.2vw' }}
          />

          {/* Описание */}
          <div>
            <label className="block text-[1.6vh] font-semibold text-amber-100 mb-[0.5vh]">
              Описание (опционально)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Эффект, использование..."
              className="w-full h-[8vh] bg-stone-900 border-2 border-amber-600 rounded-lg px-[0.5vw] py-[0.5vh] text-[1.4vh] text-amber-100 focus:outline-none focus:border-amber-400 resize-none"
              style={{ paddingLeft: '0.2vw' }}
            />
          </div>

          <Input
            label="Начальное количество"
            type="number"
            min={0}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            style={{ paddingLeft: '0.2vw' }}
          />
        </div>

        {/* Кнопки */}
        <div className="flex justify-end gap-[1vw] mt-[2vh]">
          <button
            type="button"
            onClick={onClose}
            className="px-[2vw] py-[1vh] bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-bold transition-colors text-[1.6vh]"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-[2vw] py-[1vh] bg-amber-600 hover:bg-amber-500 text-stone-900 rounded-lg font-bold transition-colors text-[1.6vh]"
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
}
