import type { HeroSpell } from '../../../../../../../../features/heroes/schemas/heroSchema';

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
  variable: 'Выбор',
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

interface HeroSpellCardProps {
  spell: HeroSpell;
  section: 'cantrip' | 'prepared' | 'known';
  onMoveUp?: (spell: HeroSpell) => void;
  onMoveDown?: (spell: HeroSpell) => void;
  onRemove?: (spell: HeroSpell) => void;
  onInfo?: (spellId: string) => void;
}

export function HeroSpellCard({
  spell,
  section,
  onMoveUp,
  onMoveDown,
  onRemove,
  onInfo,
}: HeroSpellCardProps) {
  const isCantrip = spell.level === 0;
  const school = SCHOOL_LABELS[spell.school] ?? spell.school;
  const castingTime = CASTING_TIME_LABELS[spell.castingTime] ?? spell.castingTime;
  const damageType = spell.damage
    ? (DAMAGE_TYPE_LABELS[spell.damage.type] ?? spell.damage.type)
    : null;

  return (
    <div
      style={{ padding: '0.6vh 0.6vw' }}
      className={`relative border-2 rounded-lg transition-all ${
        isCantrip
          ? 'border-indigo-500 bg-indigo-950/40'
          : section === 'prepared'
            ? 'border-amber-500 bg-stone-900'
            : 'border-amber-700/60 bg-stone-900/60'
      }`}
    >
      {/* Верхняя строка: название + школа */}
      <div
        style={{ padding: '0.4vh 0vw' }}
        className="flex justify-between items-start gap-[0.5vw]"
      >
        <span className="text-[1.2vh] font-bold text-amber-100 leading-tight">{spell.name}</span>
        <div className="flex flex-row gap-[1vw]">
          <span
            style={{ padding: '0.3vh 0.8vw' }}
            className={`shrink-0 text-[1.1vh] rounded border-2 ${
              isCantrip
                ? 'border-indigo-400 text-indigo-300'
                : 'border-amber-600/60 text-amber-400/80'
            }`}
          >
            {isCantrip ? 'Заговор' : `${spell.level} ур.`}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onInfo?.(spell.id);
            }}
            style={{ padding: '0.2vh 0.3vw' }}
            className="shrink-0 flex items-center justify-center transition-all text-blue-100 hover:text-blue-50 hover:scale-120 active:scale-95"
            title="Информация о заклинании"
          >
            <svg
              className="w-[2vh] h-[2vh] text-indigo-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(spell)}
              className=" flex justify-center items-center w-[3vh] h-[2vh] text-[1.2vh] font-bold bg-red-900/50 hover:bg-red-800/70 text-red-300 rounded-4xl transition-colors"
              title="Удалить заклинание"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Средняя строка: школа + время */}
      <div className="flex flex-wrap gap-[0.4vw]">
        <span className="text-[1.1vh] text-amber-100/60">{school}</span>
        <span className="text-[1.1vh] text-amber-100/60">·</span>
        <span className="text-[1.1vh] text-amber-100/60">{castingTime}</span>
        <span className="text-[1.1vh] text-amber-100/60">·</span>
        <span className="text-[1.1vh] text-amber-100/60">{spell.range}</span>
      </div>

      {/* Теги: урон, концентрация, ритуал */}
      {spell.isDamageSpell || spell.isConcentration || spell.isRitual ? (
        <div className="flex flex-col justify-between">
          <div
            style={{ margin: '0.3vh 0', padding: '0.3vh 0.3vw' }}
            className="w-[45%] flex flex-col gap-[0.5vh]"
          >
            {spell.isDamageSpell && damageType && (
              <span
                style={{ padding: '0.1vh 0.3vw' }}
                className="text-[1vh] bg-red-900/50 border-red-700/60 text-red-300 rounded"
              >
                {spell.damage?.dice} {damageType}
              </span>
            )}
            {spell.isConcentration && (
              <span
                style={{ padding: '0.1vh 0.3vw' }}
                className="text-[1vh] bg-blue-900/50 border-blue-700/60 text-blue-300 rounded"
              >
                Концентрация
              </span>
            )}
            {spell.isRitual && (
              <span
                style={{ padding: '0.1vh 0.3vw' }}
                className="text-[1vh] bg-green-900/50 border-green-700/60 text-green-300 rounded"
              >
                Ритуал
              </span>
            )}
          </div>
          {/* Кнопки управления */}
          <div className="absolute bottom-1 right-1 flex gap-[0.5vw]">
            {section === 'known' && onMoveUp && (
              <button
                type="button"
                onClick={() => onMoveUp(spell)}
                style={{ padding: '0.4vh 0.8vw' }}
                className="flex-1 text-[1.1vh] font-bold bg-amber-600/80 hover:bg-amber-500 text-stone-900 rounded transition-colors"
              >
                ↑ Подготовить
              </button>
            )}
            {section === 'prepared' && onMoveDown && (
              <button
                type="button"
                onClick={() => onMoveDown(spell)}
                style={{ padding: '0.5vh 0.8vw' }}
                className="flex-1 text-[1.1vh] font-bold bg-stone-700 hover:bg-stone-600 text-amber-100/80 rounded transition-colors"
              >
                ↓ В известные
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
