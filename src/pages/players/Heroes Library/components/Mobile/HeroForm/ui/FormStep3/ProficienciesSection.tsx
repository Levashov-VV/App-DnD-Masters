import { motion } from 'framer-motion';
import {
  WEAPON_TYPES,
  ARMOR_TYPES,
} from '../../../../../../../../features/heroes/constants/formStep3';

interface ProficienciesSectionProps {
  weaponProficiencies: string[];
  armorProficiencies: string[];
  toolProficiencies: string[];
  newToolName: string;
  setNewToolName: (val: string) => void;
  toggleProficiency: (type: 'weapon' | 'armor' | 'tool', value: string) => void;
  addTool: () => void;
  removeTool: (tool: string) => void;
  handleToolInputKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function ProficienciesSection({
  weaponProficiencies,
  armorProficiencies,
  toolProficiencies,
  newToolName,
  setNewToolName,
  toggleProficiency,
  addTool,
  removeTool,
  handleToolInputKeyPress,
}: ProficienciesSectionProps) {
  return (
    <div
      className="w-[98vw] border-2 border-amber-600 bg-stone-800 rounded-lg"
      style={{ padding: '0vh 0.3vw' }}
    >
      <h3 className="text-[1.6vh] text-center font-bold text-amber-100">Владение снаряжением</h3>

      {/* ОРУЖИЕ */}
      <div>
        <h4 className="text-[1.4vh] font-bold text-amber-100">Оружие</h4>
        <div className="grid grid-cols-4 gap-[0.5vw]">
          {WEAPON_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => toggleProficiency('weapon', type)}
              className={`rounded-lg text-[1.1vh] transition-all border-2 ${
                weaponProficiencies.includes(type)
                  ? 'bg-amber-600 border-amber-500 text-stone-900 font-bold'
                  : 'bg-stone-900 border-amber-600 text-amber-100 hover:border-amber-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* ДОСПЕХИ */}
      <div>
        <h4 style={{ marginTop: '0.5vh' }} className="text-[1.6vh] font-bold text-amber-100">
          Доспехи
        </h4>
        <div className="grid grid-cols-4 gap-[0.5vw]">
          {ARMOR_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => toggleProficiency('armor', type)}
              className={`rounded-lg text-[1.1vh] transition-all border-2 ${
                armorProficiencies.includes(type)
                  ? 'bg-amber-600 border-amber-500 text-stone-900 font-bold'
                  : 'bg-stone-900 border-amber-600 text-amber-100 hover:border-amber-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* ИНСТРУМЕНТЫ */}
      <div>
        <h4 style={{ marginTop: '0.5vh' }} className="text-[1.4vh] font-bold text-amber-100">
          Инструменты
        </h4>

        {/* Форма добавления инструмента */}
        <div className="flex gap-[0.5vw]">
          <input
            type="text"
            value={newToolName}
            onChange={(e) => setNewToolName(e.target.value)}
            onKeyPress={handleToolInputKeyPress}
            placeholder="Введите название инструмента..."
            style={{ marginBottom: '1vh', paddingLeft: '0.2vw' }}
            className="flex-1 bg-stone-900 border-2 border-amber-600 rounded-lg text-[1.2vh] text-amber-100 placeholder-amber-600/50 focus:outline-none focus:border-amber-400 transition-colors uppercase"
          />
          <button
            type="button"
            onClick={addTool}
            disabled={!newToolName.trim()}
            style={{ marginBottom: '1vh', padding: '0.5vh 1vh' }}
            className="bg-amber-600 hover:bg-amber-500 text-stone-900 rounded-lg text-[1.2vh] font-bold uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Добавить
          </button>
        </div>

        {/* Список добавленных инструментов */}
        {toolProficiencies.length > 0 && (
          <div className="grid grid-cols-4 gap-[0.5vw] max-h-[3vh] overflow-y-auto overflow-x-hidden">
            {toolProficiencies.map((tool) => (
              <motion.div
                key={tool}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{ padding: '0.2vw' }}
                className="flex items-center justify-between bg-amber-600 rounded-lg group"
              >
                <span className="text-[1.6vh] text-stone-900 font-bold truncate flex-1">
                  {tool}
                </span>
                <button
                  type="button"
                  onClick={() => removeTool(tool)}
                  className="text-stone-900 hover:text-red-600 transition-colors"
                  title="Удалить"
                >
                  <svg
                    className="w-[1.5vh] h-[1.5vh]"
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
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
