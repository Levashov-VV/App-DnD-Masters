import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHeroes } from '../../Context/HeroesContext';
import { parseImportFile, diffImport, type ConflictAction } from '../../lib/ExportImport';
import type { Hero } from '../../types/hero';

type Step =
  | 'intro'
  | 'validating'
  | 'error'
  | 'preview'
  | 'conflicts'
  | 'confirm-replace'
  | 'result';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ImportResultSummary {
  added: number;
  updated: number;
  skipped: number;
}

export function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const { heroes, mergeHeroes, replaceAllHeroes } = useHeroes();

  const [step, setStep] = useState<Step>('intro');
  const [errorMessage, setErrorMessage] = useState('');
  const [importedHeroes, setImportedHeroes] = useState<Hero[]>([]);
  const [newHeroes, setNewHeroes] = useState<Hero[]>([]);
  const [conflicts, setConflicts] = useState<Array<{ incoming: Hero; existing: Hero }>>([]);
  const [conflictActions, setConflictActions] = useState<Record<string, ConflictAction>>({});
  const [result, setResult] = useState<ImportResultSummary | null>(null);

  const reset = () => {
    setStep('intro');
    setErrorMessage('');
    setImportedHeroes([]);
    setNewHeroes([]);
    setConflicts([]);
    setConflictActions({});
    setResult(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStep('validating');
    const parsed = await parseImportFile(file);

    if (!parsed.ok) {
      setErrorMessage(parsed.error);
      setStep('error');
      return;
    }

    const diff = diffImport(heroes, parsed.data.characters);
    setImportedHeroes(parsed.data.characters);
    setNewHeroes(diff.newHeroes);
    setConflicts(diff.conflicts);

    const defaultActions: Record<string, ConflictAction> = {};
    diff.conflicts.forEach((c) => {
      defaultActions[c.incoming.id] = 'keep-existing';
    });
    setConflictActions(defaultActions);

    setStep('preview');
  };

  const setActionForAll = (action: ConflictAction) => {
    const updated: Record<string, ConflictAction> = {};
    conflicts.forEach((c) => {
      updated[c.incoming.id] = action;
    });
    setConflictActions(updated);
  };

  const applyMerge = () => {
    const toUpdate = conflicts
      .filter((c) => conflictActions[c.incoming.id] === 'use-incoming')
      .map((c) => c.incoming);

    mergeHeroes(newHeroes, toUpdate);

    setResult({
      added: newHeroes.length,
      updated: toUpdate.length,
      skipped: conflicts.length - toUpdate.length,
    });
    setStep('result');
  };

  const applyFullReplace = () => {
    replaceAllHeroes(importedHeroes);
    setResult({
      added: importedHeroes.length,
      updated: 0,
      skipped: 0,
    });
    setStep('result');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-100 flex items-center justify-center"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-[80vw] max-w-[700px] max-h-[85vh] bg-stone-900 border-4 border-amber-600 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Заголовок */}
          <div
            className="flex items-center justify-between bg-amber-600"
            style={{ padding: '1vh 0.5vw' }}
          >
            <h2 className="text-[2.2vh] font-bold text-stone-900 uppercase">Импорт персонажей</h2>
            <button
              type="button"
              onClick={handleClose}
              className="text-stone-900 hover:text-stone-700"
            >
              <svg
                className="w-[2.5vh] h-[2.5vh]"
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

          <div className="overflow-y-auto flex-1">
            {step === 'intro' && (
              <div className="flex flex-col gap-[2vh] ">
                <div className="bg-stone-800" style={{ padding: '1vh' }}>
                  <h3 className="text-[1.8vh] font-bold text-amber-100">Как это работает</h3>
                  <ol className="list-decimal list-inside text-[1.6vh] text-amber-100/80 flex flex-col gap-[0.5vh]">
                    <li>Выберите файл экспорта, ранее скачанный с любого устройства</li>
                    <li>Приложение проверит файл и покажет предпросмотр изменений</li>
                    <li>Вы решаете, что делать с совпадающими персонажами</li>
                    <li>Изменения применяются только после вашего подтверждения</li>
                  </ol>
                </div>

                <div
                  className="bg-red-950/50 border-2 border-red-600/50 rounded-lg"
                  style={{ margin: '1vh 0.5vw', padding: '1vh' }}
                >
                  <p className="text-[1.5vh] text-red-200">
                    Импорт может изменить или заменить уже сохранённых персонажей. Ничего не
                    применится без вашего явного подтверждения на следующих шагах — вы сможете
                    отменить операцию в любой момент до конца.
                  </p>
                </div>

                <label className="relative flex items-center justify-center bottom-[1vh] left-[calc(50%-10vw)] w-[20vw] bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold text-[1.8vh] uppercase rounded-lg text-center cursor-pointer transition-colors">
                  Выбрать файл
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* ШАГ: проверка файла */}
            {step === 'validating' && (
              <div className="flex items-center justify-center py-[4vh]">
                <p className="text-[1.8vh] text-amber-100">Проверяем файл...</p>
              </div>
            )}

            {/* ШАГ: ошибка валидации */}
            {step === 'error' && (
              <div className="flex flex-col gap-[2vh]">
                <div
                  className="bg-red-950/50 border-2 border-red-600 rounded-lg"
                  style={{ margin: '1vh', padding: '1vh' }}
                >
                  <p className="text-[1.8vh] text-red-200 font-bold mb-[0.5vh]">
                    Не удалось импортировать файл
                  </p>
                  <p className="text-[1.6vh] text-red-300">{errorMessage}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('intro')}
                  className="relative bottom-[1vh] left-[calc(50%-10vw)] w-[20vw] bg-stone-700 hover:bg-stone-600 text-amber-100 font-bold text-[1.6vh] uppercase rounded-lg py-[1.2vh] transition-colors"
                >
                  Попробовать другой файл
                </button>
              </div>
            )}

            {/* ШАГ: предпросмотр (счётчики + выбор режима) */}
            {step === 'preview' && (
              <div className="flex flex-col gap-[2vh]">
                <div className="grid grid-cols-2 gap-[1vw]">
                  <div
                    className="bg-stone-800 border-2 border-green-600/50 rounded-lg text-center"
                    style={{ margin: '1.2vh' }}
                  >
                    <p className="text-[3vh] font-bold text-green-400">{newHeroes.length}</p>
                    <p className="text-[1.4vh] text-amber-100/70 uppercase">Новых персонажей</p>
                  </div>
                  <div
                    className="bg-stone-800 border-2 border-amber-600/50 rounded-lg text-center"
                    style={{ margin: '1.2vh' }}
                  >
                    <p className="text-[3vh] font-bold text-amber-400">{conflicts.length}</p>
                    <p className="text-[1.4vh] text-amber-100/70 uppercase">Совпадений</p>
                  </div>
                </div>

                <div
                  className="flex flex-row gap-[3vh] justify-center"
                  style={{ margin: '1vh 0.5vw' }}
                >
                  <button
                    type="button"
                    onClick={() => (conflicts.length > 0 ? setStep('conflicts') : applyMerge())}
                    className="w-[10vw] bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold text-[1.7vh] uppercase rounded-lg transition-colors"
                  >
                    {conflicts.length > 0
                      ? 'Обработать совпадения →'
                      : 'Добавить всех новых персонажей'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('confirm-replace')}
                    className="w-[10vw] bg-red-800/80 hover:bg-red-700 text-white font-bold text-[1.6vh] uppercase rounded-lg  transition-colors"
                  >
                    Полностью заменить библиотеку
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('intro')}
                    className="w-[10vw] bg-stone-700 hover:bg-stone-600 text-amber-100 font-bold text-[1.5vh] uppercase rounded-lg transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}

            {/* ШАГ: подтверждение полной замены */}
            {step === 'confirm-replace' && (
              <div className="flex flex-col gap-[2vh]">
                <div className="bg-red-950/50 border-2 border-red-600 rounded-lg p-[1.5vh]">
                  <p className="text-[1.8vh] text-red-200 font-bold mb-[0.5vh]">Это необратимо</p>
                  <p className="text-[1.6vh] text-red-300">
                    Все {heroes.length} сохранённых сейчас персонажей будут удалены и заменены на{' '}
                    {importedHeroes.length} персонажей из файла. Отменить это действие после
                    подтверждения будет нельзя.
                  </p>
                </div>
                <div className="flex gap-[1vw]">
                  <button
                    type="button"
                    onClick={() => setStep('preview')}
                    className="flex-1 bg-stone-700 hover:bg-stone-600 text-amber-100 font-bold text-[1.6vh] uppercase rounded-lg py-[1.2vh] transition-colors"
                  >
                    Назад
                  </button>
                  <button
                    type="button"
                    onClick={applyFullReplace}
                    className="flex-1 bg-red-700 hover:bg-red-600 text-white font-bold text-[1.6vh] uppercase rounded-lg py-[1.2vh] transition-colors"
                  >
                    Да, заменить всё
                  </button>
                </div>
              </div>
            )}

            {/* ШАГ: разрешение конфликтов */}
            {step === 'conflicts' && (
              <div className="flex flex-col ">
                <div className="flex gap-[0.8vw]" style={{ margin: '1.2vh' }}>
                  <button
                    type="button"
                    onClick={() => setActionForAll('use-incoming')}
                    className="flex-1 bg-stone-800 border-2 border-amber-600/50 hover:border-amber-500 text-amber-100 text-[1.4vh] rounded-lg py-[0.8vh]"
                  >
                    Заменить все
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionForAll('keep-existing')}
                    className="flex-1 bg-stone-800 border-2 border-amber-600/50 hover:border-amber-500 text-amber-100 text-[1.4vh] rounded-lg py-[0.8vh]"
                  >
                    Оставить текущие
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionForAll('skip')}
                    className="flex-1 bg-stone-800 border-2 border-amber-600/50 hover:border-amber-500 text-amber-100 text-[1.4vh] rounded-lg py-[0.8vh]"
                  >
                    Пропустить все
                  </button>
                </div>

                <div className="flex flex-col gap-[1vh] max-h-[35vh] overflow-y-auto">
                  {conflicts.map(({ incoming, existing }) => (
                    <div
                      key={incoming.id}
                      className="bg-stone-800 border-2 border-amber-600/50 rounded-lg"
                      style={{ margin: '1.2vh' }}
                    >
                      <p
                        className="text-[1.6vh] font-bold text-amber-100"
                        style={{ margin: '0.5vh' }}
                      >
                        {existing.name}
                      </p>
                      <p className="text-[1.3vh] text-amber-100/60 " style={{ margin: '0.5vh' }}>
                        Текущий: ур. {existing.level} · Импортируемый: ур. {incoming.level}
                      </p>
                      <div className="flex gap-[0.5vw]" style={{ margin: '0 0.6vh 1.2vh 0.6vh' }}>
                        {(['use-incoming', 'keep-existing', 'skip'] as ConflictAction[]).map(
                          (action) => (
                            <button
                              key={action}
                              type="button"
                              onClick={() =>
                                setConflictActions((prev) => ({ ...prev, [incoming.id]: action }))
                              }
                              className={`flex-1 text-[1.3vh] rounded py-[0.6vh] transition-colors ${
                                conflictActions[incoming.id] === action
                                  ? 'bg-amber-500 text-stone-900 font-bold'
                                  : 'bg-stone-700 text-amber-100/70'
                              }`}
                            >
                              {action === 'use-incoming' && 'Заменить'}
                              {action === 'keep-existing' && 'Оставить'}
                              {action === 'skip' && 'Пропустить'}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={applyMerge}
                  className="relative left-[calc(50%-10vw)] w-[20vw] bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold text-[1.7vh] uppercase rounded-lg transition-colors"
                  style={{ margin: '1.2vh' }}
                >
                  Применить изменения
                </button>
              </div>
            )}

            {/* ШАГ: результат */}
            {step === 'result' && result && (
              <div className="flex flex-col gap-[2vh]">
                <div className="bg-green-950/50 text-center">
                  <p className="text-[2vh] font-bold text-green-300">Импорт завершён</p>
                </div>
                <div className="grid grid-cols-3 gap-[1vw] text-center">
                  <div>
                    <p className="text-[2.5vh] font-bold text-green-400">{result.added}</p>
                    <p className="text-[1.3vh] text-amber-100/70 uppercase">Добавлено</p>
                  </div>
                  <div>
                    <p className="text-[2.5vh] font-bold text-amber-400">{result.updated}</p>
                    <p className="text-[1.3vh] text-amber-100/70 uppercase">Обновлено</p>
                  </div>
                  <div>
                    <p className="text-[2.5vh] font-bold text-gray-400">{result.skipped}</p>
                    <p className="text-[1.3vh] text-amber-100/70 uppercase">Пропущено</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="relative left-[calc(50%-10.5vw)] w-[20vw] bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold text-[1.7vh] uppercase rounded-lg transition-colors"
                  style={{ margin: '1.2vh' }}
                >
                  Готово
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
