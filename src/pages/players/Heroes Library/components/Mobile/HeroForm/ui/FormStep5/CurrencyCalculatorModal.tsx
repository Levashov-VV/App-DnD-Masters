import { useState } from 'react';
import {
  COIN_CONVERSION,
  COIN_TYPES,
  type CoinType,
} from '../../../../../../../../features/heroes/constants/inventoryData';
import type { Currency } from '../../../../../../../../features/heroes/schemas/heroSchema';
import { Select } from '../Select';
import { Input } from '../Input';

interface CurrencyCalculatorModalProps {
  currentCurrency: Currency;
  onApply: (newCurrency: Currency) => void;
  onClose: () => void;
}

export function CurrencyCalculatorModal({
  currentCurrency,
  onApply,
  onClose,
}: CurrencyCalculatorModalProps) {
  const [fromAmount, setFromAmount] = useState(0);
  const [fromType, setFromType] = useState<CoinType>('ЗМ');
  const [toType, setToType] = useState<CoinType>('СМ');

  const coinTypesArray = [...COIN_TYPES];

  // Конвертация валют
  const calculateConversion = (): number => {
    if (fromAmount === 0) return 0;

    // Переводим в медные монеты
    const inCopper = fromAmount * COIN_CONVERSION[fromType];
    // Переводим из медных в целевую валюту
    const result = inCopper / COIN_CONVERSION[toType];

    return Math.floor(result);
  };

  const convertedAmount = calculateConversion();

  const handleApply = () => {
    if (fromAmount === 0 || convertedAmount === 0) {
      alert('Введите корректное количество для конвертации');
      return;
    }

    // Проверяем, достаточно ли монет для конвертации
    const coinKey = getCoinKey(fromType);
    if (currentCurrency[coinKey] < fromAmount) {
      alert(`Недостаточно монет! У вас есть только ${currentCurrency[coinKey]} ${fromType}`);
      return;
    }

    // Вычитаем
    const newCurrency = { ...currentCurrency };
    newCurrency[getCoinKey(fromType)] -= fromAmount;

    // Добавляем
    newCurrency[getCoinKey(toType)] += convertedAmount;

    onApply(newCurrency);
    onClose();
  };

  const getCoinKey = (coinType: CoinType): keyof Currency => {
    const mapping: Record<CoinType, keyof Currency> = {
      ММ: 'copper',
      СМ: 'silver',
      ЗМ: 'gold',
      ЭМ: 'electrum',
      ПМ: 'platinum',
    };
    return mapping[coinType];
  };

  return (
    <div
      style={{ margin: '0.5vw' }}
      className="fixed inset-0 z-50 flex items-center justify-center gap-[1vw] bg-black/70"
    >
      <div
        style={{ padding: '0.5vw' }}
        className="relative w-[95vw] flex flex-col gap-[1vw] bg-stone-900 border-4 border-amber-600 rounded-2xl"
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <h2 className="text-[2.5vh] font-bold text-amber-100 uppercase">Калькулятор Валют</h2>
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

        {/* Текущий баланс */}
        <div className=" bg-stone-800 border-2 border-amber-600 rounded-lg">
          <h3 className="text-[1.6vh] font-bold text-center text-amber-100 mb-[1vh]">
            Текущий баланс:
          </h3>
          <div className="grid grid-cols-5 gap-[0.5vw] text-center">
            {coinTypesArray.map((coin) => (
              <div style={{ paddingBottom: '0.5vh' }} key={coin}>
                <div className="text-[1.4vh] font-semibold text-amber-100">{coin}</div>
                <div className="text-[1.6vh] font-bold text-amber-100">
                  {currentCurrency[getCoinKey(coin)]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Конвертация */}
        <div className="flex flex-col gap-[1.5vh]">
          {/* Из */}
          <div>
            <label className="block text-[1.6vh] font-semibold text-amber-100">Из:</label>
            <div className="grid grid-cols-2 gap-[1vw]">
              <Input
                type="number"
                min={0}
                placeholder="Количество"
                value={fromAmount}
                className="bg-stone-900 border-2 border-amber-600 rounded-lg text-[1.8vh] text-amber-100 focus:outline-none focus:border-amber-400 placeholder:text-amber-600/50"
                onChange={(e) => setFromAmount(parseInt(e.target.value) || 0)}
                style={{ paddingLeft: '0.2vw' }}
              />
              <Select
                options={coinTypesArray}
                value={fromType}
                onChange={(e) => setFromType(e.target.value as CoinType)}
                placeholder=''
                className="bg-stone-900 border-2 border-amber-400 focus:border-none rounded-lg text-[2vh] text-amber-100"
              />
            </div>
          </div>

          {/* Стрелка */}
          <div className="flex justify-center">
            <svg
              className="w-[3vh] h-[3vh] text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>

          {/* В */}
          <div>
            <label className="block text-[1.6vh] font-semibold text-amber-100">В:</label>
            <div className="grid grid-cols-2 gap-[1vw]">
              <div className="bg-stone-800 border-2 border-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-[1.8vh] font-bold text-green-400">{convertedAmount}</span>
              </div>
              <Select
                options={coinTypesArray}
                value={toType}
                onChange={(e) => setToType(e.target.value as CoinType)}
                placeholder=''
                className="bg-stone-900 border-2 border-amber-400 focus:border-none rounded-lg text-[2vh] text-amber-100"
              />
            </div>
          </div>

          {/* Результат */}
          <div className="bg-amber-600/10 border-2 border-amber-600 rounded-lg">
            <p className="text-[1.6vh] text-amber-100 text-center">
              <strong>Результат:</strong> {fromAmount} {fromType} = {convertedAmount} {toType}
            </p>
          </div>

          {/* Таблица конвертации */}
          <div className=" bg-stone-800 border-2 border-amber-600 rounded-lg">
            <h4 className="text-[1.4vh] font-bold text-center text-amber-100">
              Курсы обмена (в медных монетах):
            </h4>
            <div className="grid grid-cols-5 gap-[0.5vw] text-[1.2vh] text-amber-100/80">
              {coinTypesArray.map((coin) => (
                <div key={coin} className="text-center">
                  <strong>{coin}</strong> = {COIN_CONVERSION[coin]}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex justify-end gap-[1vw]">
          <button
            type="button"
            onClick={onClose}
            style={{ padding: '0.5vw' }}
            className="bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-bold transition-colors text-[1.6vh]"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={handleApply}
            style={{ padding: '0.5vw' }}
            className="bg-amber-600 hover:bg-amber-500 text-stone-900 rounded-lg font-bold transition-colors text-[1.6vh]"
          >
            Обменять
          </button>
        </div>
      </div>
    </div>
  );
}
