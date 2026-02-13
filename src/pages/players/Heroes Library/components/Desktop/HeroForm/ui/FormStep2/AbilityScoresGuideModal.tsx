interface AbilityScoresGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AbilityScoresGuideModal({ isOpen, onClose }: AbilityScoresGuideModalProps) {
  if (!isOpen) return null;

  const standardArray = [15, 14, 13, 12, 10, 8];

  const abilityGuides = [
    {
      name: 'СИЛА',
      scores: '15-16',
      description: 'Атаки и урон рукопашным оружием, грузоподъёмность',
      classes: 'Варвар, Воин, Паладин',
      color: 'text-red-400',
    },
    {
      name: 'ЛОВКОСТЬ',
      scores: '15-16',
      description: 'Класс Доспеха, инициатива, атаки дальнобойным оружием',
      classes: 'Плут, Следопыт, Монах',
      color: 'text-green-400',
    },
    {
      name: 'ТЕЛОСЛОЖЕНИЕ',
      scores: '14-16',
      description: 'Хиты, выносливость, концентрация на заклинаниях',
      classes: 'Важно для всех классов',
      color: 'text-orange-400',
    },
    {
      name: 'ИНТЕЛЛЕКТ',
      scores: '15-16',
      description: 'Сила заклинаний, количество заклинаний, анализ',
      classes: 'Волшебник, Артефактор',
      color: 'text-blue-400',
    },
    {
      name: 'МУДРОСТЬ',
      scores: '15-16',
      description: 'Сила заклинаний, внимательность, проницательность',
      classes: 'Жрец, Друид, Следопыт, Монах',
      color: 'text-purple-400',
    },
    {
      name: 'ХАРИЗМА',
      scores: '15-16',
      description: 'Сила заклинаний, социальные взаимодействия',
      classes: 'Бард, Колдун, Чародей, Паладин',
      color: 'text-pink-400',
    },
  ];

  return (
    <div
      style={{ padding: '0.5vw' }}
      className="fixed top-[15vh] inset-0 z-50 flex items-center justify-center"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        style={{ padding: '1vw' }}
        className="relative bg-stone-800 border-2 border-amber-600 rounded-lg w-[60vw] max-h-[85vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-center">
          <h2 className="text-[2.5vh] font-bold text-amber-100 uppercase">
            Распределение Характеристик
          </h2>
        </div>
        <div className="flex flex-col gap-[1vh] max-h-[70vh]">
          {/* Набор очков на старте */}
          <div className="flex flex-col items-center bg-amber-600/10 border-2 border-amber-600 rounded-lg">
            <h3 className="text-[2vh] font-bold text-amber-100">Стандартный набор очков</h3>
            <div className="flex items-center gap-[1vw]">
              {standardArray.map((score, index) => (
                <div
                  key={index}
                  className="w-[5vh] h-[5vh] rounded-full border-2 border-amber-600 bg-stone-900 flex items-center justify-center"
                >
                  <span className="text-[2.5vh] font-bold text-amber-100">{score}</span>
                </div>
              ))}
            </div>
            <p style={{ margin: '1vh 0' }} className="text-[1.6vh] text-center text-amber-100/80">
              <strong>Совет:</strong> Распределите эти значения между шестью характеристиками. Самые
              высокие значения (15-16) отдайте основным характеристикам вашего класса.
            </p>
          </div>

          {/* Модификаторы */}
          <div className="bg-stone-900/50 border-2 border-amber-600 rounded-lg">
            <h3 className="text-[2vh] text-center font-bold text-amber-100">
              Модификаторы характеристик
            </h3>
            <div className="grid grid-cols-2 gap-[1vw]">
              <div style={{ paddingLeft: '0.5vw' }} className="">
                <div className="grid grid-cols-2 gap-[0.5vh] text-[1.6h]">
                  <span className="text-amber-100 font-semibold">Значение</span>
                  <span className="text-amber-100 font-semibold">Модификатор</span>
                  {[
                    ['8-9', '-1'],
                    ['10-11', '+0'],
                    ['12-13', '+1'],
                    ['14-15', '+2'],
                  ].map(([score, mod], i) => (
                    <>
                      <span key={`score-${i}`} className="text-amber-100/80">
                        {score}
                      </span>
                      <span key={`mod-${i}`} className="text-green-400 font-bold">
                        {mod}
                      </span>
                    </>
                  ))}
                </div>
              </div>
              <div>
                <div className="grid grid-cols-2 gap-[0.5vh] text-[1.6vh]">
                  <span className="text-amber-100 font-semibold">Значение</span>
                  <span className="text-amber-100 font-semibold">Модификатор</span>
                  {[
                    ['16-17', '+3'],
                    ['18-19', '+4'],
                    ['20-21', '+5'],
                    ['22-23', '+6'],
                  ].map(([score, mod], i) => (
                    <>
                      <span key={`score-${i}`} className="text-amber-100/80">
                        {score}
                      </span>
                      <span key={`mod-${i}`} className="text-green-400 font-bold">
                        {mod}
                      </span>
                    </>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Рекомендации */}
          <div>
            <h3 className="text-[2vh] text-center font-bold text-amber-100 ">
              Рекомендации по характеристикам
            </h3>
            <div className="grid grid-cols-3 gap-[1vw]">
              {abilityGuides.map((ability) => (
                <div
                  key={ability.name}
                  style={{ paddingLeft: '0.5vw' }}
                  className="bg-stone-900/50 border-2 border-amber-600/50 rounded-lg hover:border-amber-600 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className={`text-[1.8vh] font-bold ${ability.color}`}>
                        {ability.name}
                        <span className="ml-[1vw] text-amber-100/60 text-[1.4vh]">
                          {''} (Рекомендуется: {ability.scores})
                        </span>
                      </h4>
                      <p className="text-[1.4vh] text-amber-100/80">
                        <strong>Влияет на:</strong> {ability.description}
                      </p>
                      <p className="text-[1.4vh] text-amber-100/60">
                        <strong>Важно для:</strong> {ability.classes}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Полезные советы */}
          <div
            style={{ paddingLeft: '0.5vw' }}
            className="bg-stone-900/50 border-2 border-amber-600 rounded-lg"
          >
            <h3 className="text-[1.6vh] font-bold text-amber-400"> Полезные советы</h3>
            <ul className="text-[1.4vh] text-amber-100/80 list-disc list-inside">
              <li>
                <strong>Основная характеристика:</strong> Поставьте 15 или 16 в характеристику,
                которая определяет силу ваших основных способностей
              </li>
              <li>
                <strong>Телосложение:</strong> Поставьте 14+ для увеличения хитов и выживаемости
              </li>
              <li>
                <strong>Расовые бонусы:</strong> Некоторые расы дают бонусы к характеристикам -
                учитывайте это при распределении
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <button
            type="button"
            onClick={onClose}
            style={{ marginTop: '1vh' }}
            className="w-[10vw] bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold rounded-lg transition-colors text-[2vh]"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
