import { EXPERIENCE_TABLE } from '../../../../../../../../features/heroes/constants/dndData';

interface ExperienceInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExperienceInfoModal({ isOpen, onClose }: ExperienceInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{ paddingLeft: '5vw' }} className="fixed inset-0 z-50 flex items-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-stone-800 border-2 border-amber-600 rounded-lg w-[90vw] max-h-[70vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-center">
          <h2
            style={{ marginLeft: '0.2vw' }}
            className="text-[2.5vh] font-bold text-amber-100 uppercase"
          >
            Таблица Опыта и Уровней
          </h2>
        </div>
        <div style={{ padding: '0.5vw' }} className="overflow-y-auto max-h-[55vh]">
          <div className="overflow-hidden ">
            <table className="w-full text-amber-100">
              <thead>
                <tr>
                  <th className="text-left text-[1.8vh] font-bold">Уровень</th>
                  <th className="text-right text-[1.8vh] font-bold">Требуемый опыт</th>
                  <th className="text-center text-[1.8vh] font-bold">Бонус мастерства</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(EXPERIENCE_TABLE).map(([level, experience], index) => {
                  const lvl = parseInt(level);
                  const profBonus =
                    lvl <= 4 ? '+2' : lvl <= 8 ? '+3' : lvl <= 12 ? '+4' : lvl <= 16 ? '+5' : '+6';

                  return (
                    <tr
                      key={level}
                      className={`
                        ${index % 2 === 0 ? 'bg-stone-900/30' : 'bg-stone-900/10'}
                        hover:bg-amber-600/10 transition-colors
                      `}
                    >
                      <td className="text-[1.6vh] font-semibold">{level}</td>
                      <td className="text-right text-[1.6vh] font-mono">
                        {experience.toLocaleString('ru-RU')}
                      </td>
                      <td className="text-center text-[1.6vh] font-bold text-green-400">
                        {profBonus}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <button
            type="button"
            onClick={onClose}
            style={{ marginBottom: '1vh' }}
            className="w-[50%] bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold rounded-lg transition-colors text-[1.6vh]"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
