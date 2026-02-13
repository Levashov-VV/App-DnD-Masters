import type { CombatAbility, CombatAbilityType } from '../../../../../types/combatSkills.types';
import { CombatSkillsModal } from './CombatSkillsModal';

export interface CombatSkillsSectionProps {
  combatAbilityType: CombatAbilityType;
  setCombatAbilityType: (type: CombatAbilityType) => void;
  combatSkills: CombatAbility[];
  newEquipment: { name: string; bonus: number; damage: string };
  setNewEquipment: React.Dispatch<React.SetStateAction<{ name: string; bonus: number; damage: string }>>;
  newSpell: { name: string; bonus: number; damage: string; description: string };
  setNewSpell: React.Dispatch<React.SetStateAction<{ name: string; bonus: number; damage: string; description: string }>>;
  addEquipment: () => void;
  addSpell: () => void;
  removeCombatAbility: (index: number) => void;
  setEditingAbility: (val: { ability: CombatAbility; index: number } | null) => void;
  setSelectedSpell: (val: CombatAbility | null) => void;
  selectedSpell: CombatAbility | null;
  editingAbility: { ability: CombatAbility; index: number } | null;
  saveEditedAbility: () => void;
}

interface SkillsListProps {
  combatSkills: CombatAbility[];
  removeCombatAbility: (index: number) => void;
  setEditingAbility: (val: { ability: CombatAbility; index: number } | null) => void;
  setSelectedSpell: (val: CombatAbility | null) => void;
}

interface EquipmentFormProps {
  newEquipment: { name: string; bonus: number; damage: string };
  setNewEquipment: React.Dispatch<React.SetStateAction<{ name: string; bonus: number; damage: string }>>;
  addEquipment: () => void;
}

interface SpellFormProps {
  newSpell: { name: string; bonus: number; damage: string; description: string };
  setNewSpell: React.Dispatch<React.SetStateAction<{ name: string; bonus: number; damage: string; description: string }>>;
  addSpell: () => void;
}

export function CombatSkillsSection({
  combatAbilityType,
  setCombatAbilityType,
  combatSkills,
  newEquipment,
  setNewEquipment,
  newSpell,
  setNewSpell,
  addEquipment,
  addSpell,
  removeCombatAbility,
  setEditingAbility,
  setSelectedSpell,
  selectedSpell,
  editingAbility,
  saveEditedAbility,
}: CombatSkillsSectionProps) {
  return (
    <div className="w-[28vw] col-span-2 border-2 border-amber-600 bg-stone-800 rounded-lg">
      <h3 className="text-[2vh] text-center font-bold text-amber-100">Боевые способности</h3>

      {/* ПЕРЕКЛЮЧАТЕЛЬ ТИПА */}
      <div className="flex gap-[1vw]" style={{ paddingLeft: '0.2vw', paddingRight: '0.2vw' }}>
        <button
          type="button"
          onClick={() => setCombatAbilityType('equipment')}
          className={`flex-1 rounded-lg text-[1.6vh] font-bold transition-colors ${
            combatAbilityType === 'equipment'
              ? 'bg-amber-600 text-stone-900'
              : 'bg-stone-900 text-amber-600 border-2 border-amber-600'
          }`}
        >
          Снаряжение
        </button>
        <button
          type="button"
          onClick={() => setCombatAbilityType('spell')}
          className={`flex-1 rounded-lg text-[1.6vh] font-bold transition-colors ${
            combatAbilityType === 'spell'
              ? 'bg-amber-600 text-stone-900'
              : 'bg-stone-900 text-amber-600 border-2 border-amber-600'
          }`}
        >
          Магия/Заговоры
        </button>
      </div>

      {/* ФОРМА ДОБАВЛЕНИЯ */}
      {combatAbilityType === 'equipment' ? (
        <EquipmentForm
          newEquipment={newEquipment}
          setNewEquipment={setNewEquipment}
          addEquipment={addEquipment}
        />
      ) : (
        <SpellForm newSpell={newSpell} setNewSpell={setNewSpell} addSpell={addSpell} />
      )}

      {/* СПИСОК СПОСОБНОСТЕЙ */}
      <SkillsList
        combatSkills={combatSkills}
        removeCombatAbility={removeCombatAbility}
        setEditingAbility={setEditingAbility}
        setSelectedSpell={setSelectedSpell}
      />

      {/* МОДАЛЬНЫЕ ОКНА */}
      {selectedSpell && (
        <CombatSkillsModal
          ability={selectedSpell}
          onClose={() => setSelectedSpell(null)}
          mode="view"
        />
      )}

      {editingAbility && (
        <CombatSkillsModal
          ability={editingAbility.ability}
          onClose={() => setEditingAbility(null)}
          onSave={saveEditedAbility}
          onChange={(updated) =>
            setEditingAbility({ ...editingAbility, ability: updated })
          }
          mode="edit"
        />
      )}
    </div>
  );
}

// Список способностей
function SkillsList({
  combatSkills,
  removeCombatAbility,
  setEditingAbility,
  setSelectedSpell,
}: SkillsListProps) {
  return (
    <div className="w-[98%] max-h-[15vh] relative top-[1vh] left-[0.2vw] grid grid-cols-4 gap-[1vh] overflow-y-auto overflow-x-hidden">
      {combatSkills.map((ability, index) => (
        <div
          key={index}
          className="flex flex-col bg-stone-900 border-2 border-amber-600 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <span className="relative left-[0.5vw] text-[1.5vh] text-center text-amber-100 font-bold truncate flex-1">
              {ability.name}
            </span>
            <div className="relative top-[4vh] left-[0.8vw] flex gap-[0.25vw]">
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
                className="relative bottom-[4vh] right-[1vw] text-red-500 hover:text-red-400 transition-colors"
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

// Форма снаряжения
function EquipmentForm({ newEquipment, setNewEquipment, addEquipment }: EquipmentFormProps) {
  return (
    <>
      <div className="h-[9.6vh] flex flex-col">
        <div
          className="relative top-[0.5vh] left-[0.2vw] grid grid-cols-4 gap-[1vw]"
          style={{ paddingLeft: '0.2vw', paddingRight: '0.2vw' }}
        >
          <div className="col-span-2">Название</div>
          <div>Бонус</div>
          <div>Урон</div>
        </div>
        <div
          className="relative top-[1vh] grid grid-cols-4 gap-[1vw]"
          style={{ paddingLeft: '0.2vw', paddingRight: '0.2vw' }}
        >
          <input
            type="text"
            value={newEquipment.name}
            onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
            placeholder="Название (меч, броня, щит)..."
            style={{ paddingLeft: '0.2vw' }}
            className="col-span-2 bg-stone-900 border-2 border-amber-600 rounded-lg text-[1.4vh] text-amber-100 focus:outline-none focus:border-amber-400 placeholder:text-amber-600/50"
          />
          <input
            type="number"
            value={newEquipment.bonus || ''}
            onChange={(e) =>
              setNewEquipment({ ...newEquipment, bonus: parseInt(e.target.value) || 0 })
            }
            placeholder="Бонус (+3)..."
            style={{ paddingLeft: '0.2vw' }}
            className="bg-stone-900 border-2 border-amber-600 rounded-lg text-[1.4vh] text-amber-100 focus:outline-none focus:border-amber-400 placeholder:text-amber-600/50"
          />
          <input
            type="text"
            value={newEquipment.damage}
            onChange={(e) => setNewEquipment({ ...newEquipment, damage: e.target.value })}
            placeholder="Урон (1d8)..."
            style={{ paddingLeft: '0.2vw' }}
            className="bg-stone-900 border-2 border-amber-600 rounded-lg text-[1.4vh] text-amber-100 focus:outline-none focus:border-amber-400 placeholder:text-amber-600/50"
          />
        </div>
      </div>
      <button
        type="button"
        onClick={addEquipment}
        disabled={!newEquipment.name || !newEquipment.bonus || !newEquipment.damage}
        style={{ marginTop: '2vh', marginLeft: '0.2vw', marginRight: '0.2vw' }}
        className="w-[98%] bg-amber-600 hover:bg-amber-500 text-stone-900 rounded-lg text-[1.4vh] font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Добавить снаряжение
      </button>
    </>
  );
}

// Форма заклинаний
function SpellForm({ newSpell, setNewSpell, addSpell }: SpellFormProps) {
  return (
    <>
      <div
        className="flex flex-col gap-[1vh]"
        style={{ paddingLeft: '0.2vw', paddingRight: '0.2vw' }}
      >
        <div className="relative top-[0.5vh] left-[0.2vw] grid grid-cols-4 gap-[1vw]">
          <div className="col-span-2">Название</div>
          <div>Бонус</div>
          <div>Урон</div>
        </div>
        <div className="grid grid-cols-4 gap-[1vw]">
          <input
            type="text"
            value={newSpell.name}
            onChange={(e) => setNewSpell({ ...newSpell, name: e.target.value })}
            placeholder="Название заговора..."
            style={{ paddingLeft: '0.2vw' }}
            className="col-span-2 bg-stone-900 border-2 border-amber-600 rounded-lg text-[1.4vh] text-amber-100 focus:outline-none focus:border-amber-400 placeholder:text-amber-600/50"
          />
          <input
            type="number"
            value={newSpell.bonus || ''}
            onChange={(e) =>
              setNewSpell({ ...newSpell, bonus: parseInt(e.target.value) || 0 })
            }
            placeholder="Бонус атаки..."
            style={{ paddingLeft: '0.2vw' }}
            className="bg-stone-900 border-2 border-amber-600 rounded-lg text-[1.4vh] text-amber-100 focus:outline-none focus:border-amber-400 placeholder:text-amber-600/50"
          />
          <input
            type="text"
            value={newSpell.damage}
            onChange={(e) => setNewSpell({ ...newSpell, damage: e.target.value })}
            placeholder="Урон (1d10)..."
            style={{ paddingLeft: '0.2vw' }}
            className="bg-stone-900 border-2 border-amber-600 rounded-lg text-[1.4vh] text-amber-100 focus:outline-none focus:border-amber-400 placeholder:text-amber-600/50"
          />
        </div>
        <input
          type="text"
          value={newSpell.description}
          onChange={(e) => setNewSpell({ ...newSpell, description: e.target.value })}
          placeholder="Описание эффекта..."
          style={{ paddingLeft: '0.2vw' }}
          className="w-full relative top-[1vh] bg-stone-900 border-2 border-amber-600 rounded-lg text-[1.4vh] text-amber-100 focus:outline-none focus:border-amber-400 placeholder:text-amber-600/50"
        />
      </div>
      <button
        type="button"
        onClick={addSpell}
        disabled={!newSpell.name || !newSpell.damage}
        style={{ marginTop: '2vh', marginLeft: '0.2vw', marginRight: '0.2vw' }}
        className="w-[98%] bg-amber-600 hover:bg-amber-500 text-stone-900 rounded-lg text-[1.4vh] font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Добавить заговор
      </button>
    </>
  );
}