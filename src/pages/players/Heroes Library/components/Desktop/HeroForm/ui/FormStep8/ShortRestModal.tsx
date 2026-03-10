import { useState, useMemo } from 'react';
import type {
  ShortRestContext,
  SpellSlotAvailable,
} from '../../../../../../../../shared/utils/shortRestUtils';

interface ShortRestModalProps {
  context: ShortRestContext;
  allSlotsFull: boolean;
  onConfirm: (selected: Record<string, number>) => void;
  onCancel: () => void;
}

const ABILITY_DESCRIPTIONS: Record<string, { title: string; description: string }> = {
  'wizard-manual': {
    title: 'Магическое восстановление',
    description:
      'Изучая книгу заклинаний, вы восстанавливаете часть магической энергии. Суммарный уровень восстанавливаемых ячеек не превышает половины вашего уровня волшебника (округление вверх). Ни одна из ячеек не может быть выше 5-го уровня.',
  },
  'druid-land-manual': {
    title: 'Естественное восстановление',
    description:
      'Черпая силу из природы, вы восстанавливаете часть магической энергии. Суммарный уровень восстанавливаемых ячеек не превышает половины вашего уровня друида (округление вверх). Ни одна из ячеек не может быть выше 5-го уровня.',
  },
};

export function ShortRestModal({
  context,
  allSlotsFull,
  onConfirm,
  onCancel,
}: ShortRestModalProps) {
  const [selected, setSelected] = useState<Record<string, number>>({});

  const selectedTotal = useMemo(
    () =>
      Object.entries(selected).reduce((sum, [key, count]) => {
        const levelNum = parseInt(key.replace('level', ''));
        return sum + levelNum * count;
      }, 0),
    [selected]
  );

  const remaining = context.recoveryLimit - selectedTotal;
  const isUnderLimit = selectedTotal < context.recoveryLimit && selectedTotal > 0;
  const canConfirm = selectedTotal > 0 && selectedTotal <= context.recoveryLimit;

  const handleChange = (slot: SpellSlotAvailable, value: number) => {
    const clamped = Math.max(0, Math.min(value, slot.spent));
    setSelected((prev) => ({ ...prev, [slot.levelKey]: clamped }));
  };

  // КОЛДУН
  if (context.type === 'warlock-auto') {
    return (
      <ModalWrapper onCancel={onCancel}>
        <h3 className="text-[2.2vh] font-bold text-amber-100 text-center">Короткий отдых</h3>
        <p className="text-[1.8vh] text-amber-100/80 ">
          Короткий отдых завершён. Все ячейки заклинаний колдуна восстановлены.
        </p>
        <ModalButtons onCancel={onCancel} onConfirm={() => onConfirm({})} confirmLabel="Отлично" />
      </ModalWrapper>
    );
  }

  // ИНФО: нет доступа / уже использовано / заблокировано уровнем
  if (['none', 'druid-no-subclass', 'druid-level-locked', 'already-used'].includes(context.type)) {
    return (
      <ModalWrapper onCancel={onCancel}>
        <h3 className="text-[2.2vh] font-bold text-center text-amber-100">Короткий отдых</h3>
        <p className="text-[1.8vh] text-amber-100/80">{context.message}</p>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onCancel}
            style={{ padding: '0.4vh 0.8vw' }}
            className="bg-amber-600 hover:bg-amber-500 text-stone-900 rounded-lg text-[1.6vh] font-bold transition-colors"
          >
            Закрыть
          </button>
        </div>
      </ModalWrapper>
    );
  }

  // ВСЕ ЯЧЕЙКИ ПОЛНЫ
  if (allSlotsFull) {
    return (
      <ModalWrapper onCancel={onCancel}>
        <h3 className="text-[2.2vh] font-bold text-amber-100 text-center">Короткий отдых</h3>
        <p className="text-[1.8vh] text-amber-100/80">
          Все ячейки заклинаний уже восстановлены. Вы всё равно хотите провести короткий отдых?
        </p>
        <ModalButtons
          onCancel={onCancel}
          onConfirm={() => onConfirm({})}
          confirmLabel="Подтвердить"
        />
      </ModalWrapper>
    );
  }

  // волшебник / друид Круга земли
  const ability = ABILITY_DESCRIPTIONS[context.type];

  return (
    <ModalWrapper onCancel={onCancel}>
      <h3 className="text-[2.2vh] font-bold text-amber-100">{ability.title}</h3>
      <p style={{ marginBottom: '0.5vh' }} className="text-[1.5vh] text-amber-100/60">
        {ability.description}
      </p>

      {/* Лимит */}
      <div className="flex items-center gap-[0.5vw]">
        <span className="text-[1.6vh] text-amber-100/80">Доступно уровней:</span>
        <span
          className={`text-[1.8vh] font-bold ${remaining < 0 ? 'text-red-400' : 'text-amber-400'}`}
        >
          {selectedTotal} / {context.recoveryLimit}
        </span>
      </div>

      {/* Список ячеек для восстановления */}
      <div style={{ marginBottom: '1vh' }} className="flex flex-col gap-[0.8vh]">
        {context.availableSlots.map((slot) => (
          <div key={slot.levelKey} className="flex items-center justify-between">
            <span className="text-[1.6vh] text-amber-100">
              {slot.label}
              <span style={{ marginLeft: '0.5vw' }} className="text-amber-100/50">
                (потрачено: {slot.spent})
              </span>
            </span>
            <div className="flex items-center gap-[0.5vw]">
              <button
                type="button"
                onClick={() => handleChange(slot, (selected[slot.levelKey] || 0) - 1)}
                disabled={(selected[slot.levelKey] || 0) === 0}
                className="w-[2.2vh] h-[2.2vh] bg-stone-700 hover:bg-stone-600 disabled:opacity-30 border-amber-600 rounded text-amber-100 text-[1.4vh] font-bold transition-colors"
              >
                −
              </button>
              <span className="w-[2vw] text-center text-[1.6vh] font-bold text-amber-100">
                {selected[slot.levelKey] || 0}
              </span>
              <button
                type="button"
                onClick={() => handleChange(slot, (selected[slot.levelKey] || 0) + 1)}
                disabled={(selected[slot.levelKey] || 0) >= slot.spent || remaining < slot.levelNum}
                className="w-[2.2vh] h-[2.2vh] bg-stone-700 hover:bg-stone-600 disabled:opacity-30 border-amber-600 rounded text-amber-100 text-[1.4vh] font-bold transition-colors"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Предупреждение о неполном использовании */}
      {isUnderLimit && (
        <p className="text-[1.4vh] text-yellow-400">
          Вы используете {selectedTotal} из {context.recoveryLimit} доступных уровней. Остаток будет
          потерян.
        </p>
      )}

      <ModalButtons
        onCancel={onCancel}
        onConfirm={() => onConfirm(selected)}
        confirmLabel="Восстановить"
        confirmDisabled={!canConfirm}
      />
    </ModalWrapper>
  );
}

//Вспомогательные компоненты

function ModalWrapper({ children, onCancel }: { children: React.ReactNode; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div
        style={{ padding: '2vh 1.5vw' }}
        className="bg-stone-800 border-4 border-amber-600 rounded-xl w-[32vw] max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function ModalButtons({
  onCancel,
  onConfirm,
  confirmLabel,
  confirmDisabled = false,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  confirmDisabled?: boolean;
}) {
  return (
    <div className="flex gap-[1vw] justify-end">
      <button
        type="button"
        onClick={onCancel}
        style={{ padding: '0.4vh 0.8vw' }}
        className="bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-[1.6vh] font-bold transition-colors"
      >
        Отмена
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={confirmDisabled}
        style={{ padding: '0.4vh 0.8vw' }}
        className="bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-stone-900 rounded-lg text-[1.6vh] font-bold transition-colors"
      >
        {confirmLabel}
      </button>
    </div>
  );
}
