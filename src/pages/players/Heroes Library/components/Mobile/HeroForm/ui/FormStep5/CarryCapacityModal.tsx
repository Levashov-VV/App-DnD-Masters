import { useState, useEffect } from 'react';

interface CarryCapacityModalProps {
  currentSize: string;
  currentStrength: number;
  currentWeight: number;
  maxWeight: number;
  onApply: (newCurrentWeight: number, newMaxWeight: number) => void;
  onClose: () => void;
}

type SizeType = 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'gargantuan';

const SIZE_MULTIPLIERS: Record<SizeType, { carry: number; push: number }> = {
  tiny: { carry: 7.5, push: 15 },
  small: { carry: 15, push: 30 },
  medium: { carry: 15, push: 30 },
  large: { carry: 30, push: 60 },
  huge: { carry: 60, push: 120 },
  gargantuan: { carry: 120, push: 240 },
};

const SIZE_LABELS: Record<SizeType, string> = {
  tiny: 'Крошечный',
  small: 'Маленький',
  medium: 'Средний',
  large: 'Большой',
  huge: 'Огромный',
  gargantuan: 'Гигантский',
};

type AccordionSection = 'tables' | 'armor' | 'weapons' | 'misc' | 'examples';

export function CarryCapacityModal({
  currentSize,
  currentStrength,
  currentWeight,
  maxWeight,
  onApply,
  onClose,
}: CarryCapacityModalProps) {
  const normalizeSize = (size: string): SizeType => {
    if (!size) return 'medium';

    const cleaned = size.toLowerCase().trim();

    const sizeMap: Record<string, SizeType> = {
      'крошечный (tiny)': 'tiny',
      'маленький (small)': 'small',
      'средний (medium)': 'medium',
      'большой (large)': 'large',
      'огромный (huge)': 'huge',
      'гигантский (gargantuan)': 'gargantuan',
      крошечный: 'tiny',
      маленький: 'small',
      средний: 'medium',
      большой: 'large',
      огромный: 'huge',
      гигантский: 'gargantuan',
      tiny: 'tiny',
      small: 'small',
      medium: 'medium',
      large: 'large',
      huge: 'huge',
      gargantuan: 'gargantuan',
    };

    return sizeMap[cleaned] || 'medium';
  };
  const size = normalizeSize(currentSize);
  const strength = currentStrength || 10;

  const calculateMaxWeight = () => {
    const multiplier = SIZE_MULTIPLIERS[size]?.carry || 15;
    return strength * multiplier;
  };

  const calculatedWeight = calculateMaxWeight();

  const [customCurrentWeight, setCustomCurrentWeight] = useState(currentWeight || 0);
  const [customMaxWeight, setCustomMaxWeight] = useState(
    maxWeight > 0 ? maxWeight : calculatedWeight
  );
  const [unit, setUnit] = useState<'фнт' | 'кг'>('фнт');
  const [openSection, setOpenSection] = useState<AccordionSection | null>('tables');

  useEffect(() => {
    setCustomCurrentWeight(currentWeight || 0);
  }, [currentWeight]);

  useEffect(() => {
    setCustomMaxWeight(maxWeight > 0 ? maxWeight : calculatedWeight);
  }, [maxWeight, calculatedWeight]);

  const convertWeight = (weight: number) => {
    return unit === 'кг' ? (weight * 0.453592).toFixed(1) : weight.toFixed(1);
  };

  const handleMaxWeightChange = (value: number) => {
    setCustomMaxWeight(value);
  };

  const handleReset = () => {
    setCustomMaxWeight(calculatedWeight);
  };

  const handleApply = () => {
    const currentWeightToApply =
      unit === 'кг' ? customCurrentWeight / 0.453592 : customCurrentWeight;
    const maxWeightToApply = unit === 'кг' ? customMaxWeight / 0.453592 : customMaxWeight;
    onApply(currentWeightToApply, maxWeightToApply);
  };

  const displayMaxWeight = unit === 'кг' ? customMaxWeight * 0.453592 : customMaxWeight;
  const displayCurrent = unit === 'кг' ? customCurrentWeight * 0.453592 : customCurrentWeight;
  const percentage = customMaxWeight > 0 ? (customCurrentWeight / customMaxWeight) * 100 : 0;

  const isCustom = Math.abs(customMaxWeight - calculatedWeight) > 0.1;

  const toggleSection = (section: AccordionSection) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative top-[8vh] w-[95vw] max-h-[82vh] bg-stone-900 border-4 border-amber-600 rounded-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-center bg-amber-600 rounded-t-xl">
          <h2 className="text-[2.5vh] font-bold text-stone-900 uppercase">
            Памятка по грузоподъёмности
          </h2>
        </div>

        {/* Контент с прокруткой */}
        <div style={{ padding: '0.5vw' }} className="flex-1 overflow-y-auto">
          {/* Калькулятор */}
          <div
            style={{ padding: '0.5vw', marginBottom: '1vh' }}
            className="bg-stone-800 border-2 border-amber-600 rounded-lg"
          >
            <h3 className="text-[2vh] font-bold text-amber-100">Калькулятор</h3>

            <div className="grid grid-cols-2 gap-[2vw]">
              {/* Размер */}
              <div>
                <label className="text-[1.4vh] text-amber-100 block">Размер персонажа</label>
                <select
                  value={size}
                  className="w-full bg-stone-900/50 text-amber-100/60 border-amber-600/50 rounded text-[1.4vh] cursor-not-allowed"
                  disabled
                >
                  {Object.entries(SIZE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Сила */}
              <div>
                <label className="text-[1.4vh] text-amber-100 block">Показатель Силы</label>
                <input
                  type="number"
                  value={strength}
                  readOnly
                  style={{ paddingLeft: '0.2vw' }}
                  className="w-full bg-stone-900/50 text-amber-100/60 border-amber-600/50 rounded text-[1.4vh] cursor-not-allowed"
                />
              </div>
            </div>

            {/* Переключатель единиц */}
            <div className="flex items-center gap-[1vw]">
              <span className="text-[1.4vh] text-amber-100">Единицы:</span>
              <button
                type="button"
                onClick={() => setUnit('фнт')}
                style={{ padding: '0.5vh 1vw', margin: '0.5vh 0' }}
                className={`rounded text-[1.3vh] font-bold transition-colors ${
                  unit === 'фнт'
                    ? 'bg-amber-600 text-stone-900'
                    : 'bg-stone-700 text-amber-100 hover:bg-stone-600'
                }`}
              >
                Фунты (фнт)
              </button>
              <button
                type="button"
                onClick={() => setUnit('кг')}
                style={{ padding: '0.5vh 1vw', margin: '0.5vh 0' }}
                className={`rounded text-[1.3vh] font-bold transition-colors ${
                  unit === 'кг'
                    ? 'bg-amber-600 text-stone-900'
                    : 'bg-stone-700 text-amber-100 hover:bg-stone-600'
                }`}
              >
                Килограммы (кг)
              </button>
            </div>

            {/* Текущий вес */}
            <div>
              <label className="text-[1.4vh] text-amber-100 block">Текущий вес</label>
              <input
                type="number"
                min={0}
                max={unit === 'кг' ? displayMaxWeight : customMaxWeight}
                step={unit === 'кг' ? 0.5 : 1}
                value={Number(displayCurrent).toFixed(1)}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  const lbs = unit === 'кг' ? value / 0.453592 : value;
                  const clampedWeight = Math.min(lbs, customMaxWeight);
                  setCustomCurrentWeight(clampedWeight);
                }}
                style={{ padding: '0.5vh 1vw', margin: '0.5vh 0' }}
                className="w-[10vw] bg-stone-900 text-amber-100 border-amber-600 rounded text-[1.6vh] font-bold"
              />
            </div>

            {/* Максимальный вес */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-[1.4vh] text-amber-100">Максимальный вес</label>
                {isCustom && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-[1.2vh] text-amber-400 hover:text-amber-300 underline"
                  >
                    Сбросить к рассчитанному ({convertWeight(calculatedWeight)} {unit})
                  </button>
                )}
              </div>
              <input
                type="number"
                min={0}
                step={unit === 'кг' ? 0.5 : 1}
                value={Number(displayMaxWeight).toFixed(1)}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  const lbs = unit === 'кг' ? value / 0.453592 : value;
                  handleMaxWeightChange(lbs);

                  if (customCurrentWeight > lbs) {
                    setCustomCurrentWeight(lbs);
                  }
                }}
                style={{ padding: '0.5vh 1vw', margin: '0.5vh 0' }}
                className="w-[10vw] bg-stone-900 text-amber-100 border-amber-600 rounded text-[1.6vh] font-bold"
              />
            </div>

            {/* Прогресс-бар */}
            <div className="rounded-lg border-amber-600">
              <div className="flex items-center justify-between">
                <span className="text-[1.3vh] text-amber-100">Загруженность:</span>
                <span className="text-[1.5vh] font-bold text-amber-100">
                  {Number(displayCurrent).toFixed(1)} / {Number(displayMaxWeight).toFixed(1)} {unit}
                </span>
              </div>

              {/* Прогресс-бар */}
              <div className="w-full h-[2vh] bg-stone-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    percentage >= 100
                      ? 'bg-red-600'
                      : percentage > 75
                        ? 'bg-orange-500'
                        : percentage > 50
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="text-center text-[1.2vh] text-amber-100/60">
                {percentage.toFixed(0)}% загруженности
                {percentage >= 100 && ' (Максимум!)'}
              </div>
            </div>

            {/* Формула расчёта */}
            <div className="text-[1.2vh] text-amber-100/70 text-center">
              Формула: Сила ({strength}) × {SIZE_MULTIPLIERS[size].carry} ={' '}
              {convertWeight(calculatedWeight)} {unit}
            </div>
          </div>

          {/* Справочник (Аккордеон) */}
          <div className="flex flex-col gap-[1vh]">
            {/* Таблицы */}
            <AccordionItem
              title="Таблицы грузоподъёмности"
              isOpen={openSection === 'tables'}
              onToggle={() => toggleSection('tables')}
            >
              <div className="text-center">
                {/* Таблица 1 */}
                <div style={{ margin: '0.5vh 0' }}>
                  <h4 className="text-[1.5vh] font-bold text-amber-100">
                    Грузоподъёмность по размеру
                  </h4>
                  <table className="w-full text-[1.2vh] text-amber-100">
                    <thead className="bg-amber-600">
                      <tr>
                        <th className="border-amber-600">Размер</th>
                        <th className="border-amber-600">Грузоподъёмность</th>
                        <th className="border-amber-600">Толкать/Тащить/Поднять</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(SIZE_LABELS).map(([key, label]) => (
                        <tr key={key} className="hover:bg-stone-700/50">
                          <td className="border-amber-600">{label}</td>
                          <td className="border-amber-600 text-center">
                            Сила × {SIZE_MULTIPLIERS[key as SizeType].carry}
                          </td>
                          <td className="border-amber-600 text-center">
                            Сила × {SIZE_MULTIPLIERS[key as SizeType].push}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Таблица 2 */}
                <div>
                  <h4 className="text-[1.5vh] font-bold text-amber-100">
                    Детальная система нагрузки
                  </h4>
                  <table className="w-full text-[1.2vh] text-amber-100">
                    <thead className="bg-amber-600">
                      <tr>
                        <th className="border-amber-600 ">Тип нагрузки</th>
                        <th className="border-amber-600 ">Формула</th>
                        <th className="border-amber-600 ">Эффект</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-stone-700/50">
                        <td className="border-amber-600">Лёгкая</td>
                        <td className="border-amber-600 text-center">Сила × 5</td>
                        <td className="border-amber-600">Без штрафов</td>
                      </tr>
                      <tr className="hover:bg-stone-700/50">
                        <td className="border-amber-600">Средняя</td>
                        <td className="border-amber-600 text-center">Сила × 10</td>
                        <td className="border-amber-600">
                          Скорость снижается на 10 футов, Помеха на проверки характеристик, броски
                          атаки и спасброски, использующие Силу, Ловкость или Телосложение
                        </td>
                      </tr>
                      <tr className="hover:bg-stone-700/50">
                        <td className="border-amber-600">Тяжёлая</td>
                        <td className="border-amber-600 text-center">Сила × 15</td>
                        <td className="border-amber-600">
                          Скорость снижается на 20 футов, Помеха на все проверки, атаки и спасброски
                          Силы, Ловкости и Телосложения
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </AccordionItem>

            {/* Доспехи */}
            <AccordionItem
              title="Доспехи и щиты"
              isOpen={openSection === 'armor'}
              onToggle={() => toggleSection('armor')}
            >
              <div style={{ margin: '0.5vh' }} className="grid grid-cols-4 gap-[1vw]">
                <EquipmentCategory
                  title="Лёгкие доспехи"
                  items={[
                    { name: 'Стёганый доспех', weight: 8 },
                    { name: 'Кожаный доспех', weight: 10 },
                    { name: 'Проклёпанный кожаный доспех', weight: 13 },
                  ]}
                  unit={unit}
                />

                <EquipmentCategory
                  title="Средние доспехи"
                  items={[
                    { name: 'Шкурный доспех', weight: 12 },
                    { name: 'Кольчужная рубаха', weight: 20 },
                    { name: 'Кираса', weight: 20 },
                    { name: 'Чешуйчатый доспех', weight: 45 },
                    { name: 'Полулаты', weight: 40 },
                  ]}
                  unit={unit}
                />

                <EquipmentCategory
                  title="Тяжёлые доспехи"
                  items={[
                    { name: 'Колечный доспех', weight: 40 },
                    { name: 'Пластинчатый доспех', weight: 60 },
                    { name: 'Кольчуга', weight: 55 },
                    { name: 'Латы', weight: 65 },
                  ]}
                  unit={unit}
                />

                <EquipmentCategory title="Щиты" items={[{ name: 'Щит', weight: 6 }]} unit={unit} />
              </div>
            </AccordionItem>

            {/* Оружие */}
            <AccordionItem
              title="Оружие и боеприпасы"
              isOpen={openSection === 'weapons'}
              onToggle={() => toggleSection('weapons')}
            >
              <div style={{ paddingLeft: '0.2vw' }} className="grid grid-cols-4 gap-[1vw]">
                <EquipmentCategory
                  title="Лёгкое оружие"
                  items={[
                    { name: 'Кинжал, дротик', weight: 1 },
                    {
                      name: 'Короткий меч, ручной топор, дубинка, лёгкий молот, метательное копьё, серп, короткий лук, боевая кирка, боевой молот, рапира, цеп, длинный лук',
                      weight: 2,
                    },
                  ]}
                  unit={unit}
                />

                <EquipmentCategory
                  title="Одноручное оружие"
                  items={[
                    { name: 'Длинный меч, кнут, копьё, скимитар, арбалет ручной, сеть', weight: 3 },
                    { name: 'Булава, рапира', weight: 2.5 },
                  ]}
                  unit={unit}
                />

                <EquipmentCategory
                  title="Двуручное оружие"
                  items={[
                    { name: 'Боевой посох', weight: 4 },
                    { name: 'Двуручный меч', weight: 3 },
                    { name: 'Секира', weight: 7 },
                    { name: 'Молот', weight: 10 },
                    { name: 'Пика', weight: 18 },
                    { name: 'Глефа, алебарда', weight: 6 },
                    { name: 'Длинный лук', weight: 2 },
                    { name: 'Палица', weight: 10 },
                    { name: 'Длинный лук', weight: 2 },
                    { name: 'Арбалет тяжелый', weight: 18 },
                  ]}
                  unit={unit}
                />

                <EquipmentCategory
                  title="Боеприпасы"
                  items={[
                    { name: 'Колчан с 20 стрелами', weight: 1 },
                    { name: 'Болты для арбалета (20 шт)', weight: 1.5 },
                  ]}
                  unit={unit}
                />
              </div>
            </AccordionItem>

            {/* Снаряжение */}
            <AccordionItem
              title="Снаряжение и припасы"
              isOpen={openSection === 'misc'}
              onToggle={() => toggleSection('misc')}
            >
              <div style={{ paddingLeft: '0.2vw' }} className="grid grid-cols-5 gap-[1vw]">
                <EquipmentCategory
                  title="Монеты и ценности"
                  items={[
                    { name: '50 монет любого типа', weight: 1 },
                    { name: '100 золотых', weight: 2 },
                    { name: '500 серебряных', weight: 10 },
                  ]}
                  unit={unit}
                />

                <EquipmentCategory
                  title="Зелья и свитки"
                  items={[
                    { name: 'Зелье', weight: 0.5 },
                    { name: 'Свиток', weight: 0.1 },
                  ]}
                  unit={unit}
                />

                <EquipmentCategory
                  title="Еда и напитки"
                  items={[
                    { name: 'Рацион на 1 день', weight: 2 },
                    { name: 'Бурдюк (полный)', weight: 5 },
                    { name: 'Бочонок', weight: 70 },
                  ]}
                  unit={unit}
                />

                <EquipmentCategory
                  title="Свет и инструменты"
                  items={[
                    { name: 'Факел', weight: 1 },
                    { name: 'Фонарь', weight: 2 },
                    { name: 'Верёвка (50 футов)', weight: 10 },
                    { name: 'Ломик', weight: 5 },
                    { name: 'Воровские инструменты', weight: 1 },
                  ]}
                  unit={unit}
                />

                <EquipmentCategory
                  title="Контейнеры и хранилища"
                  items={[
                    { name: 'Рюкзак (пустой)', weight: 5, note: 'вмещает 30 фунтов' },
                    { name: 'Мешок', weight: 0.5, note: 'вмещает 30 фунтов' },
                    { name: 'Сундук', weight: 25, note: 'вмещает 300 фунтов' },
                  ]}
                  unit={unit}
                />
              </div>
            </AccordionItem>

            {/* Примеры */}
            <AccordionItem
              title="Примеры типичной загрузки"
              isOpen={openSection === 'examples'}
              onToggle={() => toggleSection('examples')}
            >
              <div
                style={{ paddingLeft: '0.2vw' }}
                className="grid grid-cols-3 text-[1.3vh] text-amber-100"
              >
                <ExampleLoadout
                  title="Лёгкий персонаж (маг/плут)"
                  totalWeight="30-50"
                  items={[
                    'Кожаный доспех (10 фунтов)',
                    'Кинжал (1 фунт)',
                    'Компонентный мешок (3 фунта)',
                    'Книга заклинаний (3 фунта)',
                    'Рюкзак с припасами (20-30 фунтов)',
                  ]}
                  unit={unit}
                />

                <ExampleLoadout
                  title="Средний персонаж (клерик/следопыт)"
                  totalWeight="70-100"
                  items={[
                    'Кольчужная рубаха (20 фунтов)',
                    'Щит (6 фунтов)',
                    'Булава (4 фунта)',
                    'Священный символ (1 фунт)',
                    'Рюкзак с припасами (40-60 фунтов)',
                  ]}
                  unit={unit}
                />

                <ExampleLoadout
                  title="Тяжёлый персонаж (воин/паладин)"
                  totalWeight="120-150"
                  items={[
                    'Латы (65 фунтов)',
                    'Щит (6 фунтов)',
                    'Длинный меч (3 фунта)',
                    'Копьё (3 фунта)',
                    'Рюкзак с полным снаряжением (40-70 фунтов)',
                  ]}
                  unit={unit}
                />
              </div>
            </AccordionItem>
          </div>
        </div>

        {/* Кнопки */}
        <div
          style={{ padding: '0.5vw' }}
          className="flex justify-center gap-[2vw] border-t-2 border-amber-600"
        >
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white w-[25vw] h-[4vh] rounded-lg font-bold transition-colors text-[1.6vh]"
          >
            Закрыть
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="bg-amber-600 hover:bg-amber-500 text-stone-900 w-[25vw] h-[4vh] rounded-lg font-bold transition-colors text-[1.6vh]"
          >
            Применить
          </button>
        </div>
      </div>
    </div>
  );
}

// Вспомогательные компоненты
interface AccordionItemProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function AccordionItem({ title, isOpen, onToggle, children }: AccordionItemProps) {
  return (
    <div className="bg-stone-800 border-2 border-amber-600 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        type="button"
        className="w-full flex items-center justify-between hover:bg-stone-700 transition-colors"
      >
        <span style={{ paddingLeft: '0.2vw' }} className="text-[2vh] font-bold text-amber-100">
          {title}
        </span>
        <span className="text-[2vh] text-amber-100">{isOpen ? '▼' : '▶'}</span>
      </button>
      {isOpen && <div className=" border-amber-600">{children}</div>}
    </div>
  );
}

interface EquipmentCategoryProps {
  title: string;
  items: Array<{ name: string; weight: number; note?: string }>;
  unit: 'фнт' | 'кг';
}

function EquipmentCategory({ title, items, unit }: EquipmentCategoryProps) {
  return (
    <div>
      <h5 className="text-[1.6vh] font-bold text-amber-200">{title}</h5>
      <ul className="text-[1.4vh] text-amber-100">
        {items.map((item, idx) => (
          <li key={idx}>
            • {item.name}:{' '}
            <span className="font-bold">
              {unit === 'кг' ? (item.weight * 0.453592).toFixed(1) : item.weight} {unit}
            </span>
            {item.note && <span className="text-amber-100/70"> ({item.note})</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface ExampleLoadoutProps {
  title: string;
  totalWeight: string;
  items: string[];
  unit: 'фнт' | 'кг';
}

function ExampleLoadout({ title, totalWeight, items, unit }: ExampleLoadoutProps) {
  const [min, max] = totalWeight.split('-').map(Number);
  const convertedMin = unit === 'кг' ? (min * 0.453592).toFixed(0) : min;
  const convertedMax = unit === 'кг' ? (max * 0.453592).toFixed(0) : max;

  return (
    <div>
      <h5 className="font-bold text-amber-200">
        {title}: {convertedMin}-{convertedMax} {unit}
      </h5>
      <ul className="text-amber-100/80">
        {items.map((item, idx) => (
          <li key={idx}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
