import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue,
  UseFormGetValues,
  Control,
} from 'react-hook-form';
import type { HeroFormData } from '../../../../../../features/heroes/schemas/heroSchema';
import { Input } from '../HeroForm/ui/Input';
import { CircularInput } from '../HeroForm/ui/CircularInputProps';
import { Select } from '../HeroForm/ui/Select';
import { SelectOrInput } from '../HeroForm/ui/SelectOrInput';
import { SquareInput } from '../HeroForm/ui/SquareInput';
import { StatsPanel } from './ui/StatsPanel';
import { ArmorClassShield } from '../HeroForm/ui/Shield';
import { ExperienceInfoModal } from '../../../components/Mobile/HeroForm/ui/FormStep1/ExperienceInfoModal';
import { ClassModal, type ClassEntry } from './ui/FormStep1/ClassModal';
import { SubClassModal } from './ui/FormStep1/SubClassModal';
import { ConfirmDialog } from '../../../components/Mobile/HeroForm/ui/FormStep5/ConfirmDialog';
import type { ConfirmDialogConfig } from '../../../components/Mobile/HeroForm/ui/FormStep5/ConfirmDialog';
import { getAbilityModifier } from '../../../../../../features/heroes/constants/dndData';
import {
  DND_RACES,
  DND_SIZES,
  DND_BACKGROUNDS,
  DND_ALIGNMENTS,
  EXPERIENCE_TABLE,
} from '../../../../../../features/heroes/constants/dndData';
import raceData from '../../../../../../../public/data/charactersPerson.json';
import { GameImage } from '@/components/GameImage';

interface FormStep1BasicProps {
  register: UseFormRegister<HeroFormData>;
  errors: FieldErrors<HeroFormData>;
  watch: UseFormWatch<HeroFormData>;
  setValue: UseFormSetValue<HeroFormData>;
  getValues: UseFormGetValues<HeroFormData>;
  control: Control<HeroFormData>;
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

export function FormStep1Basic({
  register,
  errors,
  watch,
  setValue,
  getValues,
  control,
}: FormStep1BasicProps) {
  const selectedRace = watch('race');
  const classesWatch = watch('classes') || [];
  const constitution = watch('abilityScores.constitution') || 10;
  const level = watch('level', 1);
  const formDeathSaveSuccesses = watch('deathSaves.successes') || 0;
  const formDeathSaveFailures = watch('deathSaves.failures') || 0;
  const formHitDiceType = watch('hitDice.type') || 'd8';
  const experience = watch('experience') ?? 0;
  const exhaustionLevel = watch('exhaustionLevel') ?? 0;
  const conditions = watch('conditions') ?? [];
  const localAvatar = watch('avatar');

  const [raceImages, setRaceImages] = useState<{ figure: string; logo: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastAutoAvatarRef = useRef<string>('');

  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [displayLevel, setDisplayLevel] = useState(1);
  const [displayHitDice, setDisplayHitDice] = useState('d8');
  const [displayDeathSaveSuccesses, setDisplayDeathSaveSuccesses] = useState(0);
  const [displayDeathSaveFailures, setDisplayDeathSaveFailures] = useState(0);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isSubclassModalOpen, setIsSubclassModalOpen] = useState(false);

  const [deathModalOpen, setDeathModalOpen] = useState(false);
  const [deathModalConfig] = useState<ConfirmDialogConfig>({
    title: 'Персонаж мёртв',
    message: 'Персонаж получил 3 провала спасброска от смерти.\nСпасброски будут сброшены.',
    type: 'error',
    confirmText: 'Понятно',
  });

  const conModifier = getAbilityModifier(constitution);
  const suggestedMaxHP = 10 + conModifier + (level - 1) * (6 + conModifier);

  useEffect(() => {
    setDisplayHitDice(formHitDiceType);
  }, [formHitDiceType]);

  useEffect(() => {
    setDisplayDeathSaveSuccesses(formDeathSaveSuccesses);
    setDisplayDeathSaveFailures(formDeathSaveFailures);
  }, [formDeathSaveSuccesses, formDeathSaveFailures]);

  const updateRaceImages = useCallback(
    (race: string) => {
      const currentAvatar = getValues('avatar');
      const isAutoAvatar = !currentAvatar || currentAvatar === lastAutoAvatarRef.current;

      if (race && race.trim() !== '') {
        const englishRaceName = RACE_NAME_MAPPING[race];
        if (englishRaceName) {
          const raceInfo = raceData.find((r) => r.name === englishRaceName && r.side === 'allies');
          if (raceInfo) {
            setRaceImages({ figure: raceInfo.img, logo: raceInfo.logo });
            if (isAutoAvatar) {
              setValue('avatar', raceInfo.logo, { shouldDirty: false });
              lastAutoAvatarRef.current = raceInfo.logo;
            }
            return;
          }
        }
      }

      setRaceImages(null);
      if (isAutoAvatar) {
        setValue('avatar', '', { shouldDirty: false });
        lastAutoAvatarRef.current = '';
      }
    },
    [getValues, setValue]
  );

  useEffect(() => {
    if (displayDeathSaveSuccesses >= 3) {
      setValue('deathSaves.successes', 0, { shouldDirty: true });
      setValue('deathSaves.failures', 0, { shouldDirty: true });
      setDisplayDeathSaveSuccesses(0);
      setDisplayDeathSaveFailures(0);
    }
  }, [displayDeathSaveSuccesses, setValue]);

  useEffect(() => {
    updateRaceImages(selectedRace);
  }, [selectedRace, updateRaceImages]);

  useEffect(() => {
    setDisplayLevel(level);
  }, [level]);

  const handleRaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRace = e.target.value;
    setValue('race', newRace, { shouldValidate: true, shouldDirty: true });
    updateRaceImages(newRace);
  };

  const handleToggleClass = (className: string) => {
    const exists = classesWatch.some((c) => c.className === className);
    const currentSum = classesWatch.reduce((sum, c) => sum + (c.level || 0), 0);

    if (!exists) {
      const remaining = Math.max(0, level - currentSum);
      const startingLevel = remaining > 0 ? 1 : 0;
      const updated = [...classesWatch, { className, subclass: '', level: startingLevel }];
      setValue('classes', updated, { shouldDirty: true, shouldValidate: true });
    } else {
      const updated = classesWatch.filter((c) => c.className !== className);
      setValue('classes', updated, { shouldDirty: true, shouldValidate: true });
    }
  };

  // Возвращает true при успехе, false при ошибке (превышен бюджет уровней)
  const handleClassLevelChange = (className: string, newLevel: number): boolean => {
    const otherClassesSum = classesWatch
      .filter((c) => c.className !== className)
      .reduce((sum, c) => sum + (c.level || 0), 0);

    if (otherClassesSum + newLevel > level) {
      return false;
    }

    const updated = classesWatch.map((c) =>
      c.className === className ? { ...c, level: Math.max(0, newLevel) } : c
    );
    setValue('classes', updated, { shouldDirty: true, shouldValidate: true });
    return true;
  };

  const handleClassSubclassChange = (className: string, subclass: string) => {
    const updated = classesWatch.map((c) => (c.className === className ? { ...c, subclass } : c));
    setValue('classes', updated, { shouldDirty: true, shouldValidate: true });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setValue('avatar', base64, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCustomAvatar = () => {
    const fallback = raceImages?.logo || '';
    setValue('avatar', fallback, { shouldDirty: true });
    lastAutoAvatarRef.current = fallback;
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const displayAvatar = localAvatar || raceImages?.logo;
  const hasCustomAvatar = !!localAvatar && localAvatar !== raceImages?.logo;

  const handleDeathSaveSuccess = (index: number) => {
    const newSuccesses = displayDeathSaveSuccesses === index + 1 ? index : index + 1;
    setValue('deathSaves.successes', newSuccesses, { shouldDirty: true });
    setDisplayDeathSaveSuccesses(newSuccesses);
  };

  const resetDeathSaves = useCallback(() => {
    setValue('deathSaves.successes', 0, { shouldDirty: true });
    setValue('deathSaves.failures', 0, { shouldDirty: true });
    setDisplayDeathSaveSuccesses(0);
    setDisplayDeathSaveFailures(0);
  }, [setValue]);

  const handleDeathSaveFailure = (index: number) => {
    const newFailures = displayDeathSaveFailures === index + 1 ? index : index + 1;
    setValue('deathSaves.failures', newFailures, { shouldDirty: true });
    setDisplayDeathSaveFailures(newFailures);
    if (newFailures >= 3) {
      setDeathModalOpen(true);
    }
  };

  const calculateLevelFromExperience = useCallback((exp: number): number => {
    if (exp < 300) return 1;
    let calculatedLevel = 1;
    for (const [lvl, requiredExp] of Object.entries(EXPERIENCE_TABLE)) {
      if (exp >= requiredExp) {
        calculatedLevel = parseInt(lvl);
      } else {
        break;
      }
    }
    return Math.min(calculatedLevel, 20);
  }, []);

  const getExpForLevel = (lvl: number): number =>
    (EXPERIENCE_TABLE as Record<number, number>)[lvl] ?? 0;

  const currentLevelExp = getExpForLevel(displayLevel);
  const nextLevelExp = displayLevel >= 20 ? null : getExpForLevel(displayLevel + 1);
  const expIntoLevel = Math.max(0, experience - currentLevelExp);
  const expNeededForNext = nextLevelExp !== null ? Math.max(1, nextLevelExp - currentLevelExp) : 1;
  const expPercent =
    nextLevelExp !== null
      ? Math.min(100, Math.max(0, Math.floor((expIntoLevel / expNeededForNext) * 100)))
      : 100;
  const expRemaining = nextLevelExp !== null ? Math.max(0, nextLevelExp - experience) : 0;

  return (
    <div className="relative left-[0.5vw] top-[1vh] flex flex-col gap-[1.5vh] uppercase">
      <h2 className="text-center text-[2.5vh] font-bold text-amber-100">Основная информация</h2>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarUpload}
        style={{ display: 'none' }}
      />

      <div className="w-[75vw] flex items-start">
        <div className="flex items-center gap-[2vw]">
          <div className="relative">
            <div className="w-[25vw] h-[25vw] rounded-full border-2 border-amber-600 bg-stone-800 overflow-hidden flex items-center justify-center">
              {displayAvatar ? (
                <GameImage
                  key={displayAvatar}
                  src={displayAvatar}
                  alt="Аватар персонажа"
                  className="w-full h-full object-contain"
                  loading="eager"
                />
              ) : (
                <span className="text-amber-600/50 text-[1.5vh]">Нет фото</span>
              )}
            </div>

            <div className="absolute bottom-[-1vh] right-[-1vh] flex gap-[0.5vh]">
              {hasCustomAvatar && (
                <button
                  type="button"
                  onClick={handleRemoveCustomAvatar}
                  className="w-[3vh] h-[3vh] bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-lg"
                  title="Удалить фото"
                >
                  <svg
                    className="w-[1.5vh] h-[1.5vh] text-white"
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
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-[3vh] h-[3vh] bg-amber-600 hover:bg-amber-500 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-lg"
              >
                <svg
                  className="w-[1.5vh] h-[1.5vh] text-stone-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      hasCustomAvatar
                        ? 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                        : 'M12 4v16m8-8H4'
                    }
                  />
                </svg>
              </button>
            </div>
          </div>

          {raceImages?.figure ? (
            <div
              key={raceImages.figure}
              className="w-[20vw] h-[20vw] overflow-hidden flex items-end justify-center"
            >
              <GameImage
                src={raceImages.figure}
                alt="Фигурка расы"
                className="max-w-full max-h-full object-contain drop-shadow-lg"
                loading="eager"
              />
            </div>
          ) : (
            <div className="w-[20vw] h-[20vw] flex items-center justify-center">
              <span className="text-amber-600/50 text-[1.5vh]">Нет фигурки</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-[2vh] w-[50vw]">
          <div className="w-[50vw] text-center">
            <Input
              label="Имя персонажа"
              placeholder="Введите имя персонажа..."
              style={{ paddingLeft: '0.2vw' }}
              {...register('name')}
              error={errors.name?.message}
            />
          </div>
          <div className="w-[50vw] grid grid-cols-2 gap-y-[2vh] gap-x-[1vw]">
            <Select
              label="Раса"
              options={DND_RACES}
              placeholder="Выберите расу..."
              {...register('race')}
              value={watch('race')}
              onChange={handleRaceChange}
              error={errors.race?.message}
            />

            <div className="flex flex-col">
              <label className="text-[1.1vh] font-medium text-amber-100">Классы</label>
              <button
                type="button"
                onClick={() => setIsClassModalOpen(true)}
                className="w-full h-[2.9vh] bg-neutral-900/80 rounded-lg border-2 border-amber-600/50 hover:border-amber-500 px-[0.5vw] flex items-center transition-all overflow-hidden"
              >
                <span className="block w-full truncate whitespace-nowrap text-left text-amber-100 text-[1.6vh]">
                  {classesWatch.length > 0
                    ? classesWatch.map((c) => c.className).join(', ')
                    : 'Выбрать классы...'}
                </span>
              </button>
            </div>
            <SelectOrInput
              label="Предыстория"
              options={DND_BACKGROUNDS}
              placeholder="Введите свою предысторию..."
              {...register('background')}
              value={watch('background')}
              error={errors.background?.message}
            />
            <Select
              label="Размер"
              options={DND_SIZES}
              placeholder="Выберите размер..."
              {...register('size')}
              value={watch('size')}
              error={errors.size?.message}
            />
            <div className="flex flex-col">
              <label className="text-[1.1vh] font-medium text-amber-100">Подклассы</label>
              <button
                type="button"
                onClick={() => setIsSubclassModalOpen(true)}
                disabled={classesWatch.length === 0}
                className="w-full h-[2.9vh] bg-neutral-900/80 rounded-lg border-2 border-amber-600/50 hover:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed px-[0.5vw] flex items-center transition-all overflow-hidden"
              >
                <span className="block w-full truncate whitespace-nowrap text-left text-amber-100 text-[1.6vh]">
                  {classesWatch.length > 0
                    ? classesWatch
                        .map(
                          (c) =>
                            `${c.className} (ур. ${c.level}${c.subclass ? `, ${c.subclass}` : ''})`
                        )
                        .join(' · ')
                    : 'Сначала выберите классы'}
                </span>
              </button>
            </div>
            <Select
              label="Мировоззрение"
              options={DND_ALIGNMENTS}
              placeholder="Выберите мировоззрение..."
              {...register('alignment')}
              value={watch('alignment')}
              error={errors.alignment?.message}
            />
          </div>
        </div>
      </div>
      <div className="absolute top-[18vh] w-[40vw] flex flex-col gap-[0.5vh]">
        <div className="flex flex-row items-center gap-[6vw] relative">
          <CircularInput
            label="Уровень"
            type="number"
            min={1}
            max={20}
            value={displayLevel}
            readOnly={true}
          />
          <input type="hidden" {...register('level', { valueAsNumber: true })} />

          <SquareInput
            label="Опыт"
            type="number"
            min={0}
            placeholder="0"
            {...register('experience', { valueAsNumber: true })}
            onChange={(e) => {
              register('experience', { valueAsNumber: true }).onChange(e);
              const exp = Number(e.target.value) || 0;
              const newLevel = calculateLevelFromExperience(exp);
              setDisplayLevel(newLevel);
              setValue('level', newLevel, { shouldValidate: true });
            }}
            error={errors.experience?.message}
          />
          <button
            type="button"
            onClick={() => setIsExpModalOpen(true)}
            className="absolute top-[-1vh] right-[-5vw] w-[2.5vh] h-[2.5vh] bg-amber-600/80 hover:bg-amber-500 rounded-full flex items-center justify-center transition-colors shadow-lg"
            title="Таблица опыта"
          >
            <svg
              className="w-[1.3vh] h-[1.3vh] text-stone-900"
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
        </div>
        <div className="flex flex-col items-center gap-[0.3vh] w-[45vw]">
          <div className="relative w-full h-[3vh] bg-stone-700 rounded-full overflow-hidden border-2 border-amber-600">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${expPercent}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[2vh] font-bold text-stone-900 mix-blend-multiply">
              {expPercent}%
            </span>
          </div>
          <span className="text-[1.4vh] text-amber-100/60 normal-case tracking-normal">
            {displayLevel >= 20 ? 'Максимальный уровень' : `До след. уровня: ${expRemaining} оп.`}
          </span>
        </div>
      </div>
      <div style={{ marginTop: '1vh' }} className="flex flex-col gap-[1vw]">
        <div className="flex flex-row items-start">
          <ArmorClassShield control={control} fieldName="armorClass" errors={errors} />
          <div className="h-[21vh] w-[70vw] border-2 border-amber-600 text-amber-100">
            <div className="flex flex-row gap-[10vw] text-[1.8vh]">
              <div className="flex flex-col gap-8">
                <div>
                  <h2 className="relative left-[3.8vw] w-[8vw] font-bold">Хиты</h2>
                </div>
                <div className="w-[15vw] flex flex-row items-center gap-[5vw]">
                  <div className="relative left-[1vw] bottom-[3vh] w-[20vw] flex flex-col">
                    <Input
                      style={{ paddingLeft: '0.2vw' }}
                      label="Текущий"
                      type="number"
                      min={0}
                      {...register('hitPoints.current', { valueAsNumber: true })}
                      error={errors.hitPoints?.current?.message}
                    />
                    <Input
                      label="Временные"
                      style={{ paddingLeft: '0.2vw' }}
                      type="number"
                      min={0}
                      {...register('hitPoints.temporary', { valueAsNumber: true })}
                    />
                    <Input
                      label="Макс"
                      style={{ paddingLeft: '0.2vw' }}
                      type="number"
                      min={1}
                      placeholder={`Рек: ${suggestedMaxHP}`}
                      {...register('hitPoints.max', { valueAsNumber: true })}
                      error={errors.hitPoints?.max?.message}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className=" relative left-[2vw] text-center w-[10vw] font-bold">Кости хитов</h3>
                <div className="flex flex-col">
                  <label className="text-[1.4vh] text-center">Потрачено</label>
                  <Input
                    type="number"
                    style={{ paddingLeft: '0.2vw' }}
                    min={0}
                    max={20}
                    {...register('hitDice.spent', { valueAsNumber: true })}
                  />
                  <div className="flex flex-col">
                    <label className="text-[2vh] text-center">Кость</label>
                    <div className="text-[2vh] font-bold text-center">{displayHitDice}</div>
                    <input type="hidden" {...register('hitDice.type')} />
                    <input type="hidden" {...register('hitDice.total')} value={level} />
                  </div>
                </div>
              </div>
              <div className="relative right-[4vw] flex flex-col gap-2">
                <div>
                  <h3 className="relative right-[5vw] w-[25vw] text-[1.4vh] text-center  font-bold">
                    Спасброски от смерти
                  </h3>
                </div>
                <div className="relative right-[5vw] flex flex-col gap-[2vh]">
                  <div>
                    <label className="text-[1.6vh] text-center block">Успехи</label>
                    <div className="flex justify-center gap-[1vw]">
                      {[0, 1, 2].map((index) => (
                        <button
                          key={`success-${index}`}
                          type="button"
                          onClick={() => handleDeathSaveSuccess(index)}
                          className={`w-[3vh] h-[3vh] rounded-full border-2 transition-all ${
                            displayDeathSaveSuccesses > index
                              ? 'bg-green-500 border-green-400'
                              : 'bg-stone-800 border-green-600 hover:border-green-400'
                          }`}
                        />
                      ))}
                    </div>
                    <input
                      type="hidden"
                      {...register('deathSaves.successes', { valueAsNumber: true })}
                    />
                  </div>

                  <div>
                    <label className="text-[1.6vh] text-center block">Провалы</label>
                    <div className="flex justify-center gap-[1vw]">
                      {[0, 1, 2].map((index) => (
                        <button
                          key={`failure-${index}`}
                          type="button"
                          onClick={() => handleDeathSaveFailure(index)}
                          className={`w-[3vh] h-[3vh] rounded-full border-2 transition-all ${
                            displayDeathSaveFailures > index
                              ? 'bg-red-500 border-red-400'
                              : 'bg-stone-800 border-red-600 hover:border-red-400'
                          }`}
                        />
                      ))}
                    </div>
                    <input
                      type="hidden"
                      {...register('deathSaves.failures', { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '1vh' }}>
          <StatsPanel
            register={register}
            watch={watch}
            setValue={setValue}
            exhaustionLevel={exhaustionLevel}
            conditions={conditions}
          />
        </div>
      </div>

      <ExperienceInfoModal isOpen={isExpModalOpen} onClose={() => setIsExpModalOpen(false)} />
      <ClassModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        classes={classesWatch}
        onToggleClass={handleToggleClass}
      />

      <SubClassModal
        isOpen={isSubclassModalOpen}
        onClose={() => setIsSubclassModalOpen(false)}
        classes={classesWatch}
        totalLevel={level}
        onChangeLevel={handleClassLevelChange}
        onChangeSubclass={handleClassSubclassChange}
      />
      <ConfirmDialog
        isOpen={deathModalOpen}
        config={{
          ...deathModalConfig,
          onConfirm: resetDeathSaves,
        }}
        onClose={() => setDeathModalOpen(false)}
      />
    </div>
  );
}
