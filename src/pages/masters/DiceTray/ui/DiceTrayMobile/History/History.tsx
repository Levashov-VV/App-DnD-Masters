import { createTypedStorage } from '../../../../../../shared/hooks/auth/typedStorage';
import { useTypedStorageItem } from '../../../../../../shared/hooks/auth/useTypedStorageItem';
import {
  ROLL_HISTORY_KEY,
  type StorageSchema,
  type RollHistoryItem,
  validateRollHistory,
} from '../types/rollTypes';

const storage = createTypedStorage<StorageSchema>();

export const History = () => {
  const historyHook = useTypedStorageItem<StorageSchema, typeof ROLL_HISTORY_KEY>(
    ROLL_HISTORY_KEY,
    {
      storage,
      defaultValue: [],
      validate: validateRollHistory,
    }
  );

  const history = historyHook.value ?? [];

  const clearHistory = () => {
    historyHook.remove();
  };

  if (history.length === 0) {
    return <div className="relative bottom-[10vh] text-[1.6vh] text-slate-400">Нет истории</div>;
  }

  return (
    <div className="w-[90vw] h-full flex flex-col gap-[0.4vh] overflow-auto text-[1.6vh]">
      <div className="flex justify-between text-amber-400 font-bold text-[2vh]">
        <span>История ({history.length})</span>
        <button
          type="button"
          onClick={clearHistory}
          className="w-[20vw] bg-red-500/50 rounded text-[1.6vh]"
        >
          Очистить
        </button>
      </div>
      {history.slice().map((roll: RollHistoryItem) => (
        <div
          key={roll.id}
          className="flex justify-between text-slate-200 bg-slate-800/50 rounded text-[1.4vh] transition-colors"
        >
          <span>{roll.type}:</span>
          <span className="font-mono">{roll.value}</span>
          <span className="text-slate-500">
            {new Date(roll.timestamp).toLocaleTimeString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      ))}
    </div>
  );
};
