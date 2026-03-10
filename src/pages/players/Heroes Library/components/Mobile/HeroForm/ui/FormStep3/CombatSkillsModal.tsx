import type { CombatAbility } from '../../../../../types/combatSkills.types';

interface CombatAbilityModalProps {
  ability: CombatAbility;
  onClose: () => void;
  mode: 'view' | 'edit';
  onSave?: () => void;
  onChange?: (updated: CombatAbility) => void;
}

export function CombatSkillsModal({
  ability,
  onClose,
  mode,
  onSave,
  onChange,
}: CombatAbilityModalProps) {
  if (mode === 'view') {
    return (
      <div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-stone-800 border-4 border-amber-600 rounded-lg w-[80vw]"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="flex items-center justify-between"
            style={{ marginLeft: '1vw', marginTop: '0.5vh' }}
          >
            <h3 className="text-[2.5vh] text-center font-bold text-amber-100">{ability.name}</h3>
            <button
              type="button"
              onClick={onClose}
              className=" text-red-500 hover:text-red-400 transition-colors"
              style={{ marginRight: '0.5vw' }}
            >
              <svg
                className="w-[3vh] h-[3vh]"
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

          <div
            className="grid grid-cols-2 gap-[2vw] bg-stone-900 rounded-lg border-2 border-amber-600"
            style={{
              marginLeft: '0.5vw',
              marginRight: '0.5vw',
              marginTop: '1vh',
              paddingLeft: '0.5vw',
              paddingRight: '0.5vw',
              paddingTop: '0.5vh',
              paddingBottom: '0.5vh',
            }}
          >
            <div>
              <span className="text-[1.4vh] text-amber-500">Бонус атаки:</span>
              <span className="text-[1.8vh] text-amber-100 font-bold"> +{ability.bonus}</span>
            </div>
            <div>
              <span className="text-[1.4vh] text-amber-500">Урон:</span>
              <span className="text-[1.8vh] text-amber-100 font-bold"> {ability.damage}</span>
            </div>
          </div>

          <div
            style={{
              paddingLeft: '0.5vw',
              paddingRight: '0.5vw',
              paddingTop: '1vh',
              paddingBottom: '1vh',
            }}
          >
            <h4 className="text-[1.8vh] text-center font-bold text-amber-100">Описание эффекта</h4>
            <p
              style={{ marginLeft: '0.5vw' }}
              className="text-[1.6vh] text-amber-100 leading-relaxed whitespace-pre-wrap"
            >
              {ability.description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-stone-800 border-4 border-amber-600 rounded-lg w-[80vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between"
          style={{ marginLeft: '0.5vw', marginTop: '0.5vh' }}
        >
          <h3 className="text-[2.5vh] font-bold text-amber-100">
            Редактирование: {ability.type === 'equipment' ? 'Снаряжение' : 'Заговор'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-red-500 hover:text-red-400 transition-colors"
            style={{ marginRight: '0.5vw' }}
          >
            <svg className="w-[3vh] h-[3vh]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div
          className="flex flex-col gap-[2vh]"
          style={{
            paddingLeft: '0.5vw',
            paddingRight: '0.5vw',
            paddingTop: '1vh',
          }}
        >
          <div>
            <label className="block text-[1.4vh] text-amber-500 ">Название</label>
            <input
              type="text"
              value={ability.name}
              onChange={(e) => onChange?.({ ...ability, name: e.target.value })}
              style={{ paddingLeft: '0.5vw' }}
              className="w-full py-[1vh] bg-stone-900 border-2 border-amber-600 rounded-lg text-[1.6vh] text-amber-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-[2vw]">
            <div>
              <label className="block text-[1.4vh] text-amber-500">Бонус атаки</label>
              <input
                type="number"
                value={ability.bonus}
                onChange={(e) => onChange?.({ ...ability, bonus: parseInt(e.target.value) || 0 })}
                style={{ paddingLeft: '0.5vw' }}
                className="w-full bg-stone-900 border-2 border-amber-600 rounded-lg text-[1.6vh] text-amber-100 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-[1.4vh] text-amber-500">Урон</label>
              <input
                type="text"
                value={ability.damage}
                onChange={(e) => onChange?.({ ...ability, damage: e.target.value })}
                style={{ paddingLeft: '0.5vw' }}
                className="w-full bg-stone-900 border-2 border-amber-600 rounded-lg text-[1.6vh] text-amber-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {ability.type === 'spell' && (
            <div>
              <label className="block text-[1.4vh] text-amber-500">Описание эффекта</label>
              <textarea
                value={ability.description || ''}
                onChange={(e) => onChange?.({ ...ability, description: e.target.value })}
                rows={4}
                style={{ paddingLeft: '0.5vw' }}
                className="w-full bg-stone-900 border-2 border-amber-600 rounded-lg text-[1.6vh] text-amber-100 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>
          )}

          <div className="flex gap-[1vw]" style={{ marginBottom: '1vh' }}>
            <button
              type="button"
              onClick={onSave}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white rounded-lg text-[1.6vh] font-bold transition-colors"
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-stone-600 hover:bg-stone-500 text-white rounded-lg text-[1.6vh] font-bold transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
