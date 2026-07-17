import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHeroes } from '../../Context/HeroesContext';
import {
  parseImportFile,
  diffImport,
  type ConflictAction,
} from '../../../../../pages/players/Heroes Library/lib/ExportImport';
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-100"
            onClick={handleClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 right-0 bottom-0 max-h-[88vh] bg-stone-900 border-t-4 border-amber-600 rounded-t-2xl shadow-2xl z-101 flex flex-col"
          >
            <div
              style={{ padding: '3vw' }}
              className="flex items-center justify-between border-b border-amber-700/40"
            >
              <h2 className="text-[2.2vh] font-bold text-amber-100 uppercase">Импорт персонажей</h2>
              <button
                type="button"
                onClick={handleClose}
                className="w-[8vw] h-[8vw] bg-amber-600 hover:bg-amber-500 rounded-full flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-[4vw] h-[4vw] text-white"
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

            <div className="overflow-y-auto flex-1" style={{ padding: '4vw' }}>
              {/* ШАГ 1: инструкция + предупреждение + выбор файла */}
              {step === 'intro' && (
                <div className="flex flex-col gap-[2.5vh]">
                  <div
                    className="bg-stone-800 border-2 border-amber-600/50 rounded-lg"
                    style={{ padding: '3vw' }}
                  >
                    <h3 className="text-[2vh] font-bold text-amber-100 mb-[1.5vh]">
                      Как это работает
                    </h3>
                    <ol className="list-decimal list-inside text-[1.7vh] text-amber-100/80 flex flex-col gap-[1vh]">
                      <li>Выберите файл экспорта, ранее скачанный с любого устройства</li>
                      <li>Приложение проверит файл и покажет предпросмотр изменений</li>
                      <li>Вы решаете, что делать с совпадающими персонажами</li>
                      <li>Изменения применяются только после вашего подтверждения</li>
                    </ol>
                  </div>

                  <div
                    className="bg-red-950/50 border-2 border-red-600/50 rounded-lg"
                    style={{ padding: '3vw' }}
                  >
                    <p className="text-[1.6vh] text-red-200">
                      ⚠ Импорт может изменить или заменить уже сохранённых персонажей. Ничего не
                      применится без вашего явного подтверждения — вы сможете отменить операцию в
                      любой момент до конца.
                    </p>
                  </div>

                  <label
                    className="w-full bg-amber-600 active:bg-amber-500 text-stone-900 font-bold text-[2vh] uppercase rounded-lg text-center transition-colors"
                    style={{ padding: '2.5vh 0' }}
                  >
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
                <div className="flex items-center justify-center" style={{ padding: '6vh 0' }}>
                  <p className="text-[2vh] text-amber-100">Проверяем файл...</p>
                </div>
              )}

              {/* ШАГ: ошибка валидации */}
              {step === 'error' && (
                <div className="flex flex-col gap-[2.5vh]">
                  <div
                    className="bg-red-950/50 border-2 border-red-600 rounded-lg"
                    style={{ padding: '3vw' }}
                  >
                    <p className="text-[2vh] text-red-200 font-bold mb-[1vh]">
                      Не удалось импортировать файл
                    </p>
                    <p className="text-[1.7vh] text-red-300">{errorMessage}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('intro')}
                    className="w-full bg-stone-700 active:bg-stone-600 text-amber-100 font-bold text-[1.8vh] uppercase rounded-lg transition-colors"
                    style={{ padding: '2vh 0' }}
                  >
                    Попробовать другой файл
                  </button>
                </div>
              )}

              {/* ШАГ: предпросмотр */}
              {step === 'preview' && (
                <div className="flex flex-col gap-[2.5vh]">
                  <div className="grid grid-cols-2 gap-[3vw]">
                    <div
                      className="bg-stone-800 border-2 border-green-600/50 rounded-lg text-center"
                      style={{ padding: '2.5vh 0' }}
                    >
                      <p className="text-[3.5vh] font-bold text-green-400">{newHeroes.length}</p>
                      <p className="text-[1.5vh] text-amber-100/70 uppercase">Новых</p>
                    </div>
                    <div
                      className="bg-stone-800 border-2 border-amber-600/50 rounded-lg text-center"
                      style={{ padding: '2.5vh 0' }}
                    >
                      <p className="text-[3.5vh] font-bold text-amber-400">{conflicts.length}</p>
                      <p className="text-[1.5vh] text-amber-100/70 uppercase">Совпадений</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[1.5vh]">
                    <button
                      type="button"
                      onClick={() => (conflicts.length > 0 ? setStep('conflicts') : applyMerge())}
                      className="w-full bg-amber-600 active:bg-amber-500 text-stone-900 font-bold text-[1.9vh] uppercase rounded-lg transition-colors"
                      style={{ padding: '2vh 0' }}
                    >
                      {conflicts.length > 0 ? 'Обработать совпадения →' : 'Добавить всех новых'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep('confirm-replace')}
                      className="w-full bg-red-800/80 active:bg-red-700 text-white font-bold text-[1.8vh] uppercase rounded-lg transition-colors"
                      style={{ padding: '1.8vh 0' }}
                    >
                      Полностью заменить библиотеку
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep('intro')}
                      className="w-full bg-stone-700 active:bg-stone-600 text-amber-100 font-bold text-[1.7vh] uppercase rounded-lg transition-colors"
                      style={{ padding: '1.5vh 0' }}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}

              {/* ШАГ: подтверждение полной замены */}
              {step === 'confirm-replace' && (
                <div className="flex flex-col gap-[2.5vh]">
                  <div
                    className="bg-red-950/50 border-2 border-red-600 rounded-lg"
                    style={{ padding: '3vw' }}
                  >
                    <p className="text-[2vh] text-red-200 font-bold mb-[1vh]">Это необратимо</p>
                    <p className="text-[1.7vh] text-red-300">
                      Все {heroes.length} сохранённых сейчас персонажей будут удалены и заменены на{' '}
                      {importedHeroes.length} персонажей из файла. Отменить это действие после
                      подтверждения будет нельзя.
                    </p>
                  </div>
                  <div className="flex flex-col gap-[1.5vh]">
                    <button
                      type="button"
                      onClick={applyFullReplace}
                      className="w-full bg-red-700 active:bg-red-600 text-white font-bold text-[1.8vh] uppercase rounded-lg transition-colors"
                      style={{ padding: '2vh 0' }}
                    >
                      Да, заменить всё
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep('preview')}
                      className="w-full bg-stone-700 active:bg-stone-600 text-amber-100 font-bold text-[1.7vh] uppercase rounded-lg transition-colors"
                      style={{ padding: '1.8vh 0' }}
                    >
                      Назад
                    </button>
                  </div>
                </div>
              )}

              {/* ШАГ: разрешение конфликтов */}
              {step === 'conflicts' && (
                <div className="flex flex-col gap-[2vh]">
                  <div className="flex flex-col gap-[1vh]">
                    <button
                      type="button"
                      onClick={() => setActionForAll('use-incoming')}
                      className="w-full bg-stone-800 border-2 border-amber-600/50 active:border-amber-500 text-amber-100 text-[1.6vh] rounded-lg"
                      style={{ padding: '1.5vh 0' }}
                    >
                      Заменить все
                    </button>
                    <button
                      type="button"
                      onClick={() => setActionForAll('keep-existing')}
                      className="w-full bg-stone-800 border-2 border-amber-600/50 active:border-amber-500 text-amber-100 text-[1.6vh] rounded-lg"
                      style={{ padding: '1.5vh 0' }}
                    >
                      Оставить текущие
                    </button>
                    <button
                      type="button"
                      onClick={() => setActionForAll('skip')}
                      className="w-full bg-stone-800 border-2 border-amber-600/50 active:border-amber-500 text-amber-100 text-[1.6vh] rounded-lg"
                      style={{ padding: '1.5vh 0' }}
                    >
                      Пропустить все
                    </button>
                  </div>

                  <div className="flex flex-col gap-[1.5vh] max-h-[38vh] overflow-y-auto">
                    {conflicts.map(({ incoming, existing }) => (
                      <div
                        key={incoming.id}
                        className="bg-stone-800 border-2 border-amber-600/50 rounded-lg"
                        style={{ padding: '3vw' }}
                      >
                        <p className="text-[1.9vh] font-bold text-amber-100">{existing.name}</p>
                        <p className="text-[1.5vh] text-amber-100/60 mb-[1.5vh]">
                          Текущий: ур. {existing.level} · Импортируемый: ур. {incoming.level}
                        </p>
                        <div className="flex flex-col gap-[0.8vh]">
                          {(['use-incoming', 'keep-existing', 'skip'] as ConflictAction[]).map(
                            (action) => (
                              <button
                                key={action}
                                type="button"
                                onClick={() =>
                                  setConflictActions((prev) => ({ ...prev, [incoming.id]: action }))
                                }
                                className={`w-full text-[1.6vh] rounded transition-colors ${
                                  conflictActions[incoming.id] === action
                                    ? 'bg-amber-500 text-stone-900 font-bold'
                                    : 'bg-stone-700 text-amber-100/70'
                                }`}
                                style={{ padding: '1.2vh 0' }}
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
                    className="w-full bg-amber-600 active:bg-amber-500 text-stone-900 font-bold text-[1.9vh] uppercase rounded-lg transition-colors"
                    style={{ padding: '2vh 0' }}
                  >
                    Применить изменения
                  </button>
                </div>
              )}

              {/* ШАГ: результат */}
              {step === 'result' && result && (
                <div className="flex flex-col gap-[2.5vh]">
                  <div
                    className="bg-green-950/50 border-2 border-green-600 rounded-lg text-center"
                    style={{ padding: '2.5vh 0' }}
                  >
                    <p className="text-[2.2vh] font-bold text-green-300">Импорт завершён</p>
                  </div>
                  <div className="grid grid-cols-3 gap-[2vw] text-center">
                    <div>
                      <p className="text-[3vh] font-bold text-green-400">{result.added}</p>
                      <p className="text-[1.4vh] text-amber-100/70 uppercase">Добавлено</p>
                    </div>
                    <div>
                      <p className="text-[3vh] font-bold text-amber-400">{result.updated}</p>
                      <p className="text-[1.4vh] text-amber-100/70 uppercase">Обновлено</p>
                    </div>
                    <div>
                      <p className="text-[3vh] font-bold text-gray-400">{result.skipped}</p>
                      <p className="text-[1.4vh] text-amber-100/70 uppercase">Пропущено</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full bg-amber-600 active:bg-amber-500 text-stone-900 font-bold text-[1.9vh] uppercase rounded-lg transition-colors"
                    style={{ padding: '2vh 0' }}
                  >
                    Готово
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
