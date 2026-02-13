import type { CombatAbility } from '../../../../../types/combatSkills.types';

interface AbilitiesListProps {
  combatAbilities: CombatAbility[];
  removeCombatAbility: (index: number) => void;
  setEditingAbility: (val: any) => void;
  setSelectedSpell: (val: CombatAbility | null) => void;
}

export function SkillsList({
  combatAbilities,
  removeCombatAbility,
  setEditingAbility,
  setSelectedSpell,
}: AbilitiesListProps) {
  return (
    <div className="w-[98%] max-h-[15vh] relative top-[1vh] left-[0.2vw] grid grid-cols-4 gap-[1vh] overflow-y-auto">
      {combatAbilities.map((ability, index) => (
        <div
          key={index}
          className="flex flex-col bg-stone-900 border-2 border-amber-600 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <span className="relative left-[0.5vw] text-[1.5vh] text-center text-amber-100 font-bold truncate flex-1">
              {ability.name}
            </span>
            <div className="relative top-[4vh] left-[0.8vw] flex gap-[0.3vw]">
              <button
                type="button"
                onClick={() => setEditingAbility({ ability: { ...ability }, index })}
                className="text-blue-400 hover:text-blue-300 transition-colors"
                title="Редактировать"
              >
                <svg
                  className="w-[1.6vh] h-[1.6vh]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>

              {ability.type === 'spell' && ability.description && (
                <button
                  type="button"
                  onClick={() => setSelectedSpell(ability)}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                  title="Показать описание"
                >
                  <svg
                    className="w-[1.6vh] h-[1.6vh]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              )}

              <button
                type="button"
                onClick={() => removeCombatAbility(index)}
                style={{ paddingRight: '0.2vw' }}
                className="text-red-500 hover:text-red-400 transition-colors"
              >
                <svg
                  className="w-[1.6vh] h-[1.6vh]"
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

          <div className="flex flex-col text-[1.4vh]" style={{ paddingLeft: '0.2vw' }}>
            <span className="text-amber-400">
              <span className="text-amber-500">Бонус:</span> +{ability.bonus}
            </span>
            <span className="text-amber-400">
              <span className="text-amber-500">Урон:</span> {ability.damage}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
