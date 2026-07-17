import { useState, useEffect } from 'react';
import type { TeamMember } from '../../../../../../../../features/heroes/schemas/heroSchema';
import raceData from '../../../../../../../../../public/data/charactersPerson.json';
import { GameImage } from '@/components/GameImage';


interface TeamMemberCardProps {
  member: TeamMember;
  onEdit: () => void;
  onRemove: () => void;
}

const RACE_NAME_MAPPING: Record<string, string> = {
  Ааракокра: 'Aarakocra',
  Гном: 'Gnome',
  Гоблин: 'Goblin',
  Кенку: 'Kenku',
  Кобольд: 'Kobold',
  Людоящер: 'Lizard-man',
  Тритон: 'Triton',
  Фирболг: 'Firbolg',
  'Юань-ти': 'Yuan-ti',
  Человек: 'Human',
  Эльф: 'Elf',
  Дварф: 'Dwarf',
  Полурослик: 'Halfling',
  Драконорожденный: 'DragonBorn',
  Полуэльф: 'Elf',
  Полуорк: 'Orc',
  Орк: 'Orc',
  Тифлинг: 'Tiffling',
  Голиаф: 'Goliaf',
  Калаштар: 'Kalashtar',
  Минотавр: 'Minotaur',
  Шифтер: 'Shifter',
  Аасимар: 'Aasimar',
  Кентавр: 'Centaur',
  Леонин: 'Leonin',
  Табакси: 'Tabaxi',
  Дженази: 'Genasi',
  Грунг: 'Grung',
};

export function TeamMemberCard({ member, onEdit, onRemove }: TeamMemberCardProps) {
  const [raceLogo, setRaceLogo] = useState<string | null>(null);

  useEffect(() => {
    if (member.race && member.race.trim() !== '') {
      const englishRaceName = RACE_NAME_MAPPING[member.race];
      if (englishRaceName) {
        const raceInfo = raceData.find((r) => r.name === englishRaceName && r.side === 'allies');
        if (raceInfo) {
          setRaceLogo(raceInfo.logo);
          return;
        }
      }
    }
    setRaceLogo(null);
  }, [member.race]);

  const displayAvatar = member.customAvatar || raceLogo;

  return (
    <div
      style={{ margin: '0.5vw' }}
      className="relative w-[12vw] h-[18vh] border-2 border-amber-600 bg-stone-800 rounded-lg p-[0.5vw] flex flex-col items-center gap-[0.5vw] hover:border-amber-500 transition-colors group"
    >
      <div
        style={{ margin: '0.5vh 0' }}
        className="w-[4.5vw] h-[4.5vw] rounded-full border-2 border-amber-600 bg-stone-900 overflow-hidden flex items-center justify-center"
      >
        {displayAvatar ? (
          <GameImage
            src={displayAvatar}
            alt={member.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-amber-600/50 text-[1.2vh]">Нет фото</span>
        )}
      </div>

      {/* Информация */}
      <div className="relative bottom-[1vh] flex flex-col text-center w-full">
        <div>
          <h3 className="text-[1.6vh] font-bold text-amber-100 truncate">
            {member.name || 'Без имени'}
          </h3>
        </div>
        <div style={{ marginRight: '0.2vw' }} className="w-[98%] grid grid-cols-2 gap-[1vh]">
          <p className="text-[1.1vh] text-amber-100/80 truncate">Раса: {member.race}</p>
          <p className="text-[1.1vh] text-amber-100/80 truncate">Класс: {member.class}</p>
          <p className="text-[1.1vh] text-amber-100/80 truncate">
            Уровень: {''}
            <span className="text-[1.1vh]">{member.level}</span>
          </p>
          {member.subclass && (
            <p className="text-[1.1vh] text-amber-100/80 truncate">Подкласс: {member.subclass}</p>
          )}
        </div>
      </div>

      {/* Кнопки */}
      <div className="absolute top-[0.5vh] right-[0.5vh] flex gap-[0.3vw] opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={onEdit}
          className="w-[2.5vh] h-[2.5vh] bg-amber-600 hover:bg-amber-500 rounded-full flex items-center justify-center transition-colors"
          title="Редактировать"
        >
          <svg
            className="w-[1.3vh] h-[1.3vh] text-stone-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="w-[2.5vh] h-[2.5vh] bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
          title="Удалить"
        >
          <svg
            className="w-[1.3vh] h-[1.3vh] text-white"
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
  );
}
