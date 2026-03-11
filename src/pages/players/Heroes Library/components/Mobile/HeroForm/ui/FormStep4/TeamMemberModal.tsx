import { useState, useEffect, useRef } from 'react';
import type { TeamMember } from '../../../../../../../../features/heroes/schemas/heroSchema';
import { teamMemberSchema } from '../../../../../../../../features/heroes/schemas/heroSchema';
import { Input } from '../Input';
import { Select } from '../Select';
import { SelectOrInput } from '../SelectOrInput';
import {
  DND_RACES,
  DND_CLASSES,
  getSubclassesForClass,
  hasSubclasses,
} from '../../../../../../../../features/heroes/constants/dndData';
import { TextareaWithFontControl } from '../TextareaFontControl';
import raceData from '../../../../../../../../../public/data/charactersPerson.json';
import { GameImage } from '@/components/GameImage';

interface TeamMemberModalProps {
  member: TeamMember;
  onSave: (member: TeamMember) => void;
  onClose: () => void;
}

const RACE_NAME_MAPPING: Record<string, string> = {
  Человек: 'Human',
  Эльф: 'Elf',
  Дварф: 'Dwarf',
  Полурослик: 'Halfling',
  Драконорожденный: 'DragonBorn',
  Гном: 'Gnome',
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

export function TeamMemberModal({ member, onSave, onClose }: TeamMemberModalProps) {
  const [editedMember, setEditedMember] = useState<TeamMember>(member);
  const [customAvatar, setCustomAvatar] = useState<string | null>(member.customAvatar || null);
  const [raceFigure, setRaceFigure] = useState<string | null>(null);
  const [raceLogo, setRaceLogo] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [availableSubclasses, setAvailableSubclasses] = useState<string[]>([]);
  const [isSubclassDisabled, setIsSubclassDisabled] = useState(true);

  useEffect(() => {
    if (editedMember.race && editedMember.race.trim() !== '') {
      const englishRaceName = RACE_NAME_MAPPING[editedMember.race];
      if (englishRaceName) {
        const raceInfo = raceData.find((r) => r.name === englishRaceName && r.side === 'allies');
        if (raceInfo) {
          setRaceFigure(raceInfo.img);
          setRaceLogo(raceInfo.logo);

          if (!customAvatar) {
            setEditedMember((prev) => ({ ...prev, customAvatar: raceInfo.logo }));
          }
          return;
        }
      }
    }
    setRaceFigure(null);
    setRaceLogo(null);
  }, [editedMember.race, customAvatar]);

  useEffect(() => {
    if (
      editedMember.class &&
      editedMember.class.trim() !== '' &&
      hasSubclasses(editedMember.class)
    ) {
      const subclasses = getSubclassesForClass(editedMember.class);
      setAvailableSubclasses(subclasses);
      setIsSubclassDisabled(false);
    } else {
      setAvailableSubclasses([]);
      setIsSubclassDisabled(true);
      if (!hasSubclasses(editedMember.class)) {
        setEditedMember((prev) => ({ ...prev, subclass: '' }));
      }
    }
  }, [editedMember.class]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCustomAvatar(base64String);
        setEditedMember({ ...editedMember, customAvatar: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setCustomAvatar(null);
    setEditedMember({ ...editedMember, customAvatar: raceLogo || '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClass = e.target.value;

    setEditedMember({ ...editedMember, class: newClass, subclass: '' });

    if (newClass && newClass.trim() !== '' && hasSubclasses(newClass)) {
      const subclasses = getSubclassesForClass(newClass);
      setAvailableSubclasses(subclasses);
      setIsSubclassDisabled(false);
    } else {
      setAvailableSubclasses([]);
      setIsSubclassDisabled(true);
    }
  };

  const handleSave = () => {
    const result = teamMemberSchema.safeParse(editedMember);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSave(editedMember);
  };

  const displayAvatar = customAvatar || raceLogo;

  return (
    <div className="fixed top-[13vh] inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-screen h-[60vh] bg-stone-900 border-4 border-amber-600 rounded-2xl overflow-y-auto">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <h2
            style={{ marginLeft: '0.5vw', paddingTop: '0.5vh' }}
            className="text-[2vh] font-bold text-amber-100 uppercase"
          >
            {member.name ? 'Редактирование члена команды' : 'Добавление члена команды'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="relative top-[0.5vh] right-[0.5vw] w-[4vh] h-[4vh] bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
          >
            <svg
              className="w-[2vh] h-[2vh] text-white"
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

        {/* Контент */}
        <div className="flex gap-[2vw]">
          <div className="flex flex-col items-center gap-[2vh]">
            {/* Фигурка */}
            <div className="w-[44vw] h-[32vh] overflow-hidden flex items-end justify-center">
              {raceFigure ? (
                <GameImage
                  src={raceFigure}
                  alt="Фигурка расы"
                  className="w-[50vw] h-[25vh] drop-shadow-lg"
                />
              ) : (
                ''
              )}
            </div>
          </div>

          {/* Информация */}
          <div style={{ marginRight: '1vw' }} className="flex-1 flex flex-col gap-[2vh]">
            <div  className="flex items-center gap-[1vw] ">
              <div className="relative">
                <div className="w-[20vw] h-[20vw] rounded-full border-2 border-amber-600 bg-stone-800 overflow-hidden flex items-center justify-center">
                  {displayAvatar ? (
                    <GameImage
                      src={displayAvatar}
                      alt="Аватар"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-amber-600/50 text-[1.2vh]">Фото</span>
                  )}
                </div>

                <div className="absolute bottom-[-0.5vh] right-[-0.5vh] flex gap-[0.3vh]">
                  {customAvatar && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="w-[2.5vh] h-[2.5vh] bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                      title="Удалить кастомное фото"
                    >
                      <svg
                        className="w-[1.2vh] h-[1.2vh] text-amber-100"
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
                  )}

                  <label className="w-[2.5vh] h-[2.5vh] bg-amber-600 hover:bg-amber-500 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <svg
                      className="w-[1.2vh] h-[1.2vh] text-stone-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={
                          customAvatar
                            ? 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                            : 'M12 4v16m8-8H4'
                        }
                      />
                    </svg>
                  </label>
                </div>
              </div>

              <div className="flex-1">
                <Input
                  label="Имя союзника"
                  placeholder="Введите имя..."
                  value={editedMember.name}
                  onChange={(e) => setEditedMember({ ...editedMember, name: e.target.value })}
                  style={{ paddingLeft: '0.2vw' }}
                  error={errors.name}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-[1vw]">
              <Select
                label="Раса"
                options={DND_RACES}
                value={editedMember.race}
                placeholder="Выберите расу..."
                onChange={(e) => setEditedMember({ ...editedMember, race: e.target.value })}
                error={errors.race}
              />

              <Select
                label="Класс"
                options={DND_CLASSES}
                value={editedMember.class}
                placeholder="Выберите класс..."
                onChange={handleClassChange}
                error={errors.class}
              />
              <div className="col-span-2">
                <SelectOrInput
                  key={`subclass-${editedMember.class || 'empty'}-${availableSubclasses.length}`}
                  label="Подкласс"
                  placeholder="Выберите или введите подкласс..."
                  options={availableSubclasses}
                  value={editedMember.subclass}
                  onChange={(e) => setEditedMember({ ...editedMember, subclass: e.target.value })}
                  disabled={isSubclassDisabled}
                />
                {isSubclassDisabled && (
                  <p className="text-[1.2vh] text-amber-100/60 mt-[0.5vh]">
                    Сначала выберите класс
                  </p>
                )}
              </div>

              <Input
                label="Уровень"
                type="number"
                min={1}
                max={20}
                value={editedMember.level}
                onChange={(e) =>
                  setEditedMember({ ...editedMember, level: parseInt(e.target.value) || 1 })
                }
                style={{ paddingLeft: '0.2vw' }}
                error={errors.level}
              />
            </div>

            {/* Заметки */}
            <div className="border-2 border-amber-600 bg-stone-800 rounded-lg">
              <TextareaWithFontControl
                label="История и заметки"
                value={editedMember.notes}
                onChange={(e) => setEditedMember({ ...editedMember, notes: e.target.value })}
                placeholder="Введите историю персонажа, его поступки, важные события..."
                style={{ paddingLeft: '0.2vw' }}
                className="h-[16vh]"
                defaultFontSize={14}
                minFontSize={10}
                maxFontSize={24}
              />
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div
          style={{ marginRight: '1vw', marginTop: '1vh' }}
          className="flex justify-end gap-[1vw]"
        >
          <button
            type="button"
            onClick={onClose}
            style={{ padding: '0.5vh 1vw' }}
            className="w-[25vw] bg-gray-600 hover:bg-gray-500 text-[1.6vh] text-white rounded-lg font-bold transition-colors"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={handleSave}
            style={{ padding: '0.5vh 1vw' }}
            className="w-[25vw] bg-amber-600 hover:bg-amber-500 text-[1.6vh] text-stone-900 rounded-lg font-bold transition-colors"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
