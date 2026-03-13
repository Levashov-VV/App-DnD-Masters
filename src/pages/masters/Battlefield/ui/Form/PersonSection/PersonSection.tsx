import { useEffect } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { UserItem } from './UserItem';
import type { BattleFormData } from '../types';

export function PersonSection() {
  const { control } = useFormContext<BattleFormData>();

  const {
    fields: characterFields,
    append: appendCharacter,
    remove: removeCharacter,
  } = useFieldArray({ control, name: 'users' });

  const {
    fields: enemyFields,
    append: appendEnemy,
    remove: removeEnemy,
  } = useFieldArray({ control, name: 'enemies' });

  useEffect(() => {
    const handleRemove = (e: Event) => {
      const event = e as CustomEvent<{ arrayName: 'users' | 'enemies'; index: number }>;
      if (event.detail.arrayName === 'users') {
        removeCharacter(event.detail.index);
      } else {
        removeEnemy(event.detail.index);
      }
    };

    window.addEventListener('removeCharacter', handleRemove);
    return () => window.removeEventListener('removeCharacter', handleRemove);
  }, [removeCharacter, removeEnemy]);

  const addCharacter = (e: React.MouseEvent) => {
    e.preventDefault();
    appendCharacter({
      id: Date.now(),
      name: `Игрок ${characterFields.length + 1}`,
      className: '',
      img: '',
      logo: '',
      initiative: 10,
      hp: 30,
      size: 'medium',
    });
  };

  const addEnemy = (e: React.MouseEvent) => {
    e.preventDefault();
    appendEnemy({
      id: Date.now(),
      name: `Враг ${enemyFields.length + 1}`,
      className: '',
      img: '',
      logo: '',
      initiative: 8,
      size: 'medium',
    });
  };

  return (
    <section className="w-full flex flex-col gap-[2vh] h-[60vh]">
      {/* Заголовок */}
      <div className="flex flex-col items-center text-center">
        <h2 className="text-[3vh] font-bold text-amber-100">Состав битвы ⚔️</h2>
        <div className="flex items-center relative top-[2vh] right-[1vw] justify-center gap-[4vw] text-amber-200 text-[2vh]">
          <span>👥 Игроки: {characterFields.length}</span>
          <span className="text-red-400 ">💀 Враги: {enemyFields.length}</span>
        </div>
      </div>

      {/* Управление */}
      <div className="grid grid-cols-3 gap-[2vw]">
        {/* Игроки */}
        <div className="relative left-[1vw] bg-gradient-to-br from-blue-700/70 to-blue-600/70 rounded-2xl border-2 border-blue-500/50">
          <h3 className="flex items-center justify-center text-[2vh] font-bold text-blue-200">
            👥 Игроки
          </h3>
          <div className="flex flex-col gap-[2vh]">
            <button
              onClick={addCharacter}
              type="button"
              disabled={characterFields.length >= 8}
              className="w-full bg-blue-300 text-neutral-900 font-black rounded-xl hover:bg-blue-400 disabled:opacity-50 transition-all shadow-lg text-[1.6vh]"
            >
              + Добавить ({characterFields.length}/8)
            </button>
            {characterFields.length > 0 && (
              <button
                onClick={() => removeCharacter(characterFields.length - 1)}
                type="button"
                className="w-full bg-red-600/70 text-white font-bold rounded-xl hover:bg-red-600 transition-all text-[1.6vh]"
              >
                - Удалить последнего
              </button>
            )}
          </div>
        </div>
        {/* Разделитель */}
        <div className="flex items-center justify-center">
          <div className="w-px h-[12vh] bg-gradient-to-b from-amber-400 to-red-500" />
        </div>

        {/* Враги */}
        <div className=" relative right-[1vw] bg-gradient-to-br from-red-700/70 to-red-600/70 p-6 rounded-2xl border-2 border-red-500/50">
          <h3 className="flex items-center justify-center text-[2vh] font-bold text-red-200">
            💀 Враги
          </h3>
          <div className="flex flex-col gap-[2vh]">
            <button
              onClick={addEnemy}
              type="button"
              disabled={enemyFields.length >= 30}
              className="w-full bg-red-500 text-neutral-900 font-bold rounded-xl hover:bg-red-600 disabled:opacity-50 transition-all shadow-lg text-[1.6vh]"
            >
              + Добавить ({enemyFields.length}/30)
            </button>
            {enemyFields.length > 0 && (
              <button
                onClick={() => removeEnemy(enemyFields.length - 1)}
                type="button"
                className="w-full bg-blue-500 text-neutral-900 font-bold rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-all shadow-lg text-[1.6vh]"
              >
                - Удалить последнего
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-[2vw]">
        {/* Игроки */}
        <div>
          <h4 className="text-center text-[2vh] font-bold text-blue-300 bg-neutral-800/80 rounded-t-lg">
            Игроки ({characterFields.length})
          </h4>
          <div className="flex flex-row justify-between text-[1.5vh] font-bold text-blue-300 bg-neutral-800/80 py-2 px-3 ">
            <div className="relative left-[0.3vw]">Лого</div>
            <div className="relative right-[3vw]">Имя игрока</div>
            <div className="relative right-[3vw]">Вид</div>
            <div>Размер</div>
            <div className="relative right-[1.8vw]">HP</div>
            <div className="relative right-[3.5vw]">Инициатива</div>
          </div>
          <ul className="h-[40vh] overflow-y-auto">
            {characterFields.map((field, index) => (
              <UserItem key={field.id} index={index} arrayName="users" />
            ))}
            {characterFields.length === 0 && (
              <div className="h-[30vh] flex items-center justify-center bg-blue-900/50 rounded-lg border-2 border-dashed border-blue-500/50">
                <span className="text-blue-400">Нет игроков</span>
              </div>
            )}
          </ul>
          <div></div>
        </div>
        {/* Враги */}
        <div>
          <h4 className="text-[2vh] font-bold text-red-300 bg-neutral-800/80 py-2 px-3 rounded-t-lg text-center">
            Враги ({enemyFields.length})
          </h4>
          <div className="flex flex-row justify-between text-[1.5vh] font-bold text-red-300 bg-neutral-800/80">
            <div className="relative left-[0.3vw]">Лого</div>
            <div className="relative right-[5vw]">Имя игрока</div>
            <div className="relative right-[6vw]">Вид</div>
            <div className="relative right-[4.3vw]">Размер</div>
            <div className="relative right-[7.5vw]">Инициатива</div>
          </div>
          <ul className="h-[40vh] overflow-y-auto">
            {enemyFields.map((field, index) => (
              <UserItem key={field.id} index={index} arrayName="enemies" />
            ))}
            {enemyFields.length === 0 && (
              <div className="h-[30vh] flex items-center justify-center bg-red-900/50 rounded-lg border-2 border-dashed border-red-500/50">
                <span className="text-red-400">Нет врагов</span>
              </div>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
