import { useState, useEffect } from 'react';
import { useSpellById } from '../../../../../../../../shared/hooks/PersonForm/useSpellById';

const SCHOOL_LABELS: Record<string, string> = {
  abjuration: 'Ограждение',
  conjuration: 'Вызов',
  divination: 'Прорицание',
  enchantment: 'Очарование',
  evocation: 'Воплощение',
  illusion: 'Иллюзия',
  necromancy: 'Некромантия',
  transmutation: 'Преобразование',
};

const DAMAGE_TYPE_LABELS: Record<string, string> = {
  acid: 'Кислота',
  bludgeoning: 'Дробящий',
  cold: 'Холод',
  fire: 'Огонь',
  force: 'Силовое',
  lightning: 'Молния',
  necrotic: 'Некротич.',
  piercing: 'Колющий',
  poison: 'Яд',
  psychic: 'Психич.',
  radiant: 'Лучистый',
  slashing: 'Рубящий',
  thunder: 'Звук',
  varies: 'Разный',
};

const CASTING_TIME_LABELS: Record<string, string> = {
  action: 'Действие',
  bonus_action: 'Бонус. действие',
  reaction: 'Реакция',
  '1 minute': '1 минута',
  '10 minutes': '10 минут',
  '1 hour': '1 час',
  '12 hours': '12 часов',
};

interface SpellInfoModalProps {
  isOpen: boolean;
  spellId: string | null;
  onClose: () => void;
}

export function SpellInfoModal({ isOpen, spellId, onClose }: SpellInfoModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const spell = useSpellById(spellId);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setTimeout(() => setIsVisible(false), 200);
    }
  }, [isOpen]);

  if (!isOpen || !spell) return null;

  const isCantrip = spell.level === 0;
  const school = SCHOOL_LABELS[spell.school as any] ?? spell.school;
  const castingTime = CASTING_TIME_LABELS[spell.castingTime as any] ?? spell.castingTime;
  const damageType = spell.damage
    ? (DAMAGE_TYPE_LABELS[spell.damage.type as any] ?? spell.damage.type)
    : null;

  const componentsStr = spell.components
    ? [
        spell.components.verbal && 'В',
        spell.components.somatic && 'С',
        spell.components.material && 'М',
      ]
        .filter(Boolean)
        .join('') || '—'
    : '—';

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300 ${
        isVisible ? 'bg-black/80' : 'bg-black/0'
      }`}
      onClick={handleOverlayClick}
    >
      <div
        className={`relative w-[95vw] bg-stone-900 border-4 border-amber-600 rounded-2xl transition-all duration-300 transform overflow-hidden ${
          isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        {/* Заголовок */}
        <div
          style={{ padding: '1vh 0.5vw' }}
          className="flex items-center justify-between border-b-2 border-amber-500"
        >
          <div className="flex items-center gap-[1vw]">
            <h2 className="text-[2.5vh] font-bold text-amber-100 uppercase leading-tight">
              {spell.name}
            </h2>
            <span
              style={{ padding: '0.5vh 1vw' }}
              className={`text-[1.2vh] font-bold rounded-lg border-2 ${
                isCantrip
                  ? 'border-indigo-400 bg-indigo-900/50 text-indigo-200'
                  : 'border-amber-500 bg-amber-900/50 text-amber-200'
              }`}
            >
              {isCantrip ? 'Заговор' : `${spell.level} уровень`}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-[6vw] h-[6vw] text-[2vh] font-bold text-stone-900 hover:text-stone-900 bg-amber-600 hover:bg-amber-500 rounded-4xl transition-all border-amber-500/50 hover:border-amber-400"
          >
            ✕
          </button>
        </div>

        {/* Контент */}
        <div style={{ padding: '0 0.5vw' }} className="flex flex-1 overflow-hidden">
          {/* Левая панель - характеристики */}
          <div className="w-[30%] border-r-2 border-amber-600/40 shrink-0">
            <div>
              <div>
                <span className="text-[1.2vh] text-amber-300/70 block uppercase tracking-wide">
                  Школа
                </span>
                <span className="text-[1.6vh] font-bold text-amber-100">{school}</span>
              </div>
              <div>
                <span className="text-[1.2vh] text-amber-300/70 block uppercase tracking-wide">
                  Время
                </span>
                <span className="text-[1.6vh] font-bold text-amber-100">{castingTime}</span>
              </div>
              <div>
                <span className="text-[1.2vh] text-amber-300/70 block uppercase tracking-wide">
                  Дальность
                </span>
                <span className="text-[1.6vh] font-bold text-amber-100">{spell.range}</span>
              </div>
              <div>
                <span className="text-[1.2vh] text-amber-300/70 block uppercase tracking-wide">
                  Длительность
                </span>
                <span className="text-[1.6vh] font-bold text-amber-100">
                  {spell.duration || '—'}
                </span>
              </div>
              <div>
                <span className="text-[1.2vh] text-amber-300/70 block uppercase tracking-wide">
                  Компоненты
                </span>
                <span className="text-[1.6vh] font-bold text-amber-100">{componentsStr}</span>
              </div>
            </div>

            {/* Теги */}
            {(spell.isDamageSpell || spell.isConcentration || spell.isRitual) && (
              <div
                style={{ padding: '0.2vw 0', margin: '0.5vh 0' }}
                className="flex flex-wrap gap-[0.8vw] border-t border-amber-600/30"
              >
                {spell.isDamageSpell && damageType && spell.damage && (
                  <span
                    style={{ padding: '0.2vw' }}
                    className="text-[1.1vh] bg-red-900/60 border-2 border-red-600/70 text-red-200 font-bold rounded-lg"
                  >
                    {spell.damage.dice} {damageType}
                  </span>
                )}
                {spell.isConcentration && (
                  <span
                    style={{ padding: '0.2vw' }}
                    className="text-[1.1vh] bg-blue-900/60 border-2 border-blue-600/70 text-blue-200 font-bold rounded-lg"
                  >
                    Концентрация
                  </span>
                )}
                {spell.isRitual && (
                  <span
                    style={{ padding: '0.2vw' }}
                    className="text-[1.1vh] bg-green-900/60 border-2 border-green-600/70 text-green-200 font-bold rounded-lg"
                  >
                    Ритуал
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Правая панель */}
          <div
            style={{ padding: '0.2vh 0.5vw' }}
            className="flex-1 overflow-y-auto bg-stone-900/50"
          >
            <p className="text-[1.5vh] leading-relaxed text-amber-100/90 whitespace-pre-wrap">
              {spell.description}
            </p>

            {spell.atHigherLevels && (
              <div className="border-t border-amber-600/40">
                <h4 className="text-[1.4vh] font-bold text-amber-300/90 uppercase tracking-wide">
                  На высших уровнях:
                </h4>
                <p className="text-[1.4vh] text-amber-100/80 leading-relaxed whitespace-pre-wrap">
                  {spell.atHigherLevels}
                </p>
              </div>
            )}

            {spell.components.material && spell.components.materialDescription && (
              <div className="border-t border-amber-600/40">
                <h5 className="text-[1.3vh] font-bold text-amber-200/80 uppercase">
                  Материальный компонент:
                </h5>
                <p className="text-[1.4vh] text-amber-100/80 italic">
                  {spell.components.materialDescription}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
