import { useMemo, useState, useCallback, useRef } from 'react';
import { DicesSection } from './DicesSection/MulipleDicesSection/DicesSection';
import { SelectShot } from './SelectShot/SelectShot';
import { PhysicsWorld } from './PhysicalWorld/PhysicalWorld';
import { RollingDice } from './RollingDice/RollingDice';
import { History } from './History/History';

import type { RollMode, DiceCounts, DiceType, DiceSetColor } from './types/rollTypes';
import {
  ROLL_HISTORY_KEY,
  type StorageSchema,
  type RollHistoryItem,
  validateRollHistory,
} from './types/rollTypes';

import { createTypedStorage } from '../../../../../shared/hooks/auth/typedStorage';

import './style.css';
import { assetUrl } from '@/shared/utils/assetUrl';

type RollItem = {
  id: string;
  type: DiceType;
  colorSet: DiceSetColor;
  rotation: [number, number, number];
  spawn: [number, number, number];
  indexInType: number;
};

type DiceResult = {
  id: string;
  type: DiceType;
  value: number;
  doubled: boolean;
  indexInType: number;
};

type OverlayKind = 'hit' | 'miss' | 'value';

type OverlayState = {
  kind: OverlayKind;
  text: string;
};

const CHUNK_SIZE = 3;
const OVERLAY_MS = 2400;

const storage = createTypedStorage<StorageSchema>();

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function randRot(): [number, number, number] {
  return [Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2];
}

const SPAWNS: Array<[number, number, number]> = [
  [-1.0, 6, -0.5],
  [0, 6, -0.5],
  [1.0, 6, -0.5],
  [-0.5, 6, 0.5],
  [0.5, 6, 0.5],
];

function expandDiceCounts(
  diceCounts: DiceCounts,
  colorSet: DiceSetColor,
  seed: number
): RollItem[] {
  const items: RollItem[] = [];
  let spawnIndex = 0;

  (Object.keys(diceCounts) as DiceType[]).forEach((type) => {
    const n = diceCounts[type] ?? 0;

    for (let k = 0; k < n; k++) {
      const spawn = SPAWNS[spawnIndex % SPAWNS.length];
      spawnIndex++;

      items.push({
        id: `${seed}-${type}-${k}-${Math.random().toString(16).slice(2)}`,
        type,
        colorSet,
        rotation: randRot(),
        spawn,
        indexInType: k + 1,
      });
    }
  });

  return items;
}

export function DiceTrayMobile() {
  const [rollMode, setRollMode] = useState<RollMode>('single');
  const [diceCounts, setDiceCounts] = useState<DiceCounts>({});
  const [colorSet, setColorSet] = useState<DiceSetColor>('blue');

  // Одиночный бросок
  const [throwId, setThrowId] = useState(0);
  const [currentRoll, setCurrentRoll] = useState<{
    type: DiceType;
    colorSet: DiceSetColor;
    rotation: [number, number, number];
  } | null>(null);
  const [rollResult, setRollResult] = useState<number | null>(null);

  // Оверлей
  const [overlay, setOverlay] = useState<OverlayState | null>(null);
  const [overlayKey, setOverlayKey] = useState(0);
  const overlayTimeoutRef = useRef<number | null>(null);

  // Множественный бросок
  const [multiSeed, setMultiSeed] = useState(0);
  const [batchQueue, setBatchQueue] = useState<RollItem[][]>([]);
  const [activeBatch, setActiveBatch] = useState<RollItem[]>([]);
  const [, setPendingIds] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<DiceResult[]>([]);
  const [isCharacteristic, setIsCharacteristic] = useState<string>('0');

  const totalSum = useMemo(
    () =>
      results.reduce((acc, r) => acc + r.value * (r.doubled ? 2 : 1), 0) + Number(isCharacteristic),
    [results, isCharacteristic]
  );

  const toggleDouble = useCallback((id: string) => {
    setResults((prev) => prev.map((r) => (r.id === id ? { ...r, doubled: !r.doubled } : r)));
  }, []);

  const clearOverlayTimer = useCallback(() => {
    if (overlayTimeoutRef.current) {
      window.clearTimeout(overlayTimeoutRef.current);
      overlayTimeoutRef.current = null;
    }
  }, []);

  const showOverlay = useCallback(
    (next: OverlayState) => {
      setOverlay(next);
      setOverlayKey((k) => k + 1);
      clearOverlayTimer();
      overlayTimeoutRef.current = window.setTimeout(() => {
        setOverlay(null);
        overlayTimeoutRef.current = null;
      }, OVERLAY_MS);
    },
    [clearOverlayTimer]
  );

  const handleSingleThrow = useCallback(
    (type: DiceType, cs: DiceSetColor) => {
      setThrowId((prev) => prev + 1);
      setCurrentRoll({ type, colorSet: cs, rotation: randRot() });
      setRollResult(null);
      setOverlay(null);
      clearOverlayTimer();
    },
    [clearOverlayTimer]
  );

  const handleRollResult = useCallback(
    (value: number) => {
      setRollResult(value);

      if (rollMode === 'single' && currentRoll?.type === 'd20') {
        if (value === 20) showOverlay({ kind: 'hit', text: 'Критическая удача' });
        else if (value === 1) showOverlay({ kind: 'miss', text: 'Критическая неудача' });
        else showOverlay({ kind: 'value', text: String(value) });
      }

      if (rollMode === 'single' && currentRoll) {
        const prev =
          storage.get(ROLL_HISTORY_KEY, { defaultValue: [], validate: validateRollHistory }) ?? [];

        const nextItem: RollHistoryItem = {
          id: `roll-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          type: currentRoll.type,
          value,
          timestamp: new Date().toISOString(),
        };

        const next = [nextItem, ...prev].slice(0, 10);
        storage.set(ROLL_HISTORY_KEY, next, { validate: validateRollHistory });
      }

      setCurrentRoll(null);
    },
    [rollMode, currentRoll, showOverlay]
  );

  const startNextBatch = useCallback((queue: RollItem[][]) => {
    const [next, ...rest] = queue;
    setBatchQueue(rest);
    setActiveBatch(next ?? []);
    setPendingIds(new Set());
  }, []);

  const handleMultiThrow = useCallback(() => {
    setMultiSeed((s) => s + 1);
    const seed = multiSeed + 1;

    setResults([]);
    setRollResult(null);
    setCurrentRoll(null);

    const items = expandDiceCounts(diceCounts, colorSet, seed);
    const chunks = chunk(items, CHUNK_SIZE);

    startNextBatch(chunks);
  }, [diceCounts, colorSet, multiSeed, startNextBatch]);

  const onDiceResult = useCallback(
    (id: string, type: DiceType, indexInType: number, value: number) => {
      setResults((prev) => {
        if (prev.some((r) => r.id === id)) return prev;
        return [...prev, { id, type, indexInType, value, doubled: false }];
      });

      setPendingIds((prev) => {
        const next = new Set(prev);
        next.add(id);

        if (activeBatch.length > 0 && next.size >= activeBatch.length) {
          setTimeout(() => {
            setActiveBatch([]);
            if (batchQueue.length > 0) startNextBatch(batchQueue);
          }, 2000);
        }

        return next;
      });
    },
    [activeBatch.length, batchQueue, startNextBatch]
  );

  const resultsSorted = useMemo(() => {
    return [...results].sort((a, b) => {
      if (a.type === b.type) return a.indexInType - b.indexInType;
      return a.type.localeCompare(b.type);
    });
  }, [results]);

  return (
    <div className="flex flex-col justify-center items-center w-screen h-[150vh]">
      <PhysicsWorld
        trayCenter={[0, 0, -2]}
        traySize={{ width: 10, depth: 10 }}
        wallHeight={15}
        wallThickness={1.2}
        floorY={-8}
        debug={false}
      >
        {rollMode === 'single' && currentRoll && (
          <RollingDice
            key={throwId}
            type={currentRoll.type}
            colorSet={currentRoll.colorSet}
            rotation={currentRoll.rotation}
            onResult={handleRollResult}
          />
        )}

        {rollMode === 'sum' &&
          activeBatch.map((die) => (
            <RollingDice
              key={die.id}
              type={die.type}
              colorSet={die.colorSet}
              rotation={die.rotation}
              onResult={(value) => onDiceResult(die.id, die.type, die.indexInType, value)}
            />
          ))}
      </PhysicsWorld>

      {/* Левая панель */}
      <div className="absolute top-[13vh] flex flex-col z-100 w-[92.5vw]">
        <SelectShot rollMode={rollMode} onChangeRollMode={setRollMode} />
      </div>

      {/* Правая панель */}
      <div className="relative bottom-[17vh] flex flex-col items-center z-100">
        <DicesSection
          rollMode={rollMode}
          diceCounts={diceCounts}
          setDiceCounts={setDiceCounts}
          colorSet={colorSet}
          onColorSetChange={setColorSet}
          onSingleThrow={handleSingleThrow}
          onMultiThrow={handleMultiThrow}
        />
      </div>

      {/* Tray */}
      <div className="relative bottom-[19vh] z-30 pointer-events-none">
        <img
          className="w-screen h-[50vh] pointer-events-none object-cover"
          src={assetUrl('/img/masters/home/DiceTray/DiceTray.png')}
          alt="dice tray"
        />
      </div>
      {/* Временный оверлей */}
      {rollMode === 'single' && overlay && (
        <div
          key={overlayKey}
          className={`critOverlay ${
            overlay.kind === 'hit'
              ? 'critOverlay--hit'
              : overlay.kind === 'miss'
                ? 'critOverlay--miss'
                : 'critOverlay--value'
          }`}
        >
          <div className="critOverlay__fog" />
          <div
            className={`critOverlay__label ${
              overlay.kind === 'value' ? 'critOverlay__label--value' : 'critOverlay__label--crit'
            }`}
          >
            {overlay.text}
          </div>
        </div>
      )}
      {/* Одиночный результат */}
      {rollMode === 'single' && rollResult !== null && (
        <div className="absolute bottom-[1vh] right-[5vw] w-[90vw] h-[10vh] flex flex-col items-center justify-center bg-gradient-to-b from-black/95 to-black/50 backdrop-blur-sm text-white rounded-2xl z-[100] shadow-2xl shadow-amber-500/30 pointer-events-auto animate-fade-in-scale">
          <div
            className={`text-[4.5vh] font-black transition-all duration-500 ${
              rollResult === 20
                ? 'text-emerald-400 drop-shadow-lg [text-shadow:0_0_1rem_currentColor]'
                : rollResult === 1
                  ? 'text-red-400 drop-shadow-lg [text-shadow:0_0_1rem_currentColor]'
                  : 'text-amber-400'
            }`}
          >
            {rollResult === 0 ? '—' : rollResult}
          </div>
          <div className="text-[1.8vh] font-medium text-slate-300 mt-1 tracking-wide">
            {rollResult === 0 ? 'Нет калибровки' : 'Выпало!'}
          </div>
        </div>
      )}

      {/* История бросков */}
      {rollMode === 'single' && (
        <div className="absolute bottom-[-34vh] left-[5vw] w-[90vw] h-[30vh] flex flex-col-reverse items-center justify-start z-100">
          <History />
        </div>
      )}
      {rollMode === 'sum' ? (
        <div className="absolute bottom-[1vh] w-screen text-[3vh] text-center uppercase text-slate-400">
          Результат множественного броска
        </div>
      ) : null}
      {rollMode === 'sum' && resultsSorted.length > 0 && (
        <div
          className="absolute bottom-[-35vh] left-[5vw] w-[90vw] max-h-[35vh] overflow-auto bg-black/90 text-white rounded-xl z-100 shadow-2xl pointer-events-auto"
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
          }}
        >
          <div className="flex flex-row justify-between items-center text-[2vh] font-bold text-amber-400">
            <div>Сумма: {totalSum}</div>
            <div className="relative">
              Характеристика:{' '}
              <input
                className="display-block w-[8vw] h-[5vh] text-center"
                value={isCharacteristic}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setIsCharacteristic(value);
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex flex-col gap-[1vh]">
            {resultsSorted.map((r) => {
              const displayValue = r.doubled ? r.value * 2 : r.value;

              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between bg-slate-900/70 rounded-lg"
                >
                  <div className="relative left-[2vw] text-[1.6vh] font-mono">
                    Куб {r.indexInType} {r.type}: {displayValue}
                  </div>

                  <button
                    onClick={() => toggleDouble(r.id)}
                    className={
                      r.doubled
                        ? 'min-w-[8vw] min-h-[8vw] rounded-md bg-emerald-400 text-neutral-900 text-[1.8vh]'
                        : 'min-w-[8vw] min-h-[8vw] rounded-md bg-amber-500 text-neutral-900 text-[1.8vh]'
                    }
                  >
                    {r.doubled ? '×1' : '×2'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
