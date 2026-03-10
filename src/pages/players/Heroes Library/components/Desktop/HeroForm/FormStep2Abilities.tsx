import { useState, useEffect } from 'react';
import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { HeroFormData } from '../../../../../../features/heroes/schemas/heroSchema';
import { AbilityScoresGuideModal } from '../HeroForm/ui/FormStep2/AbilityScoresGuideModal';
import {
  getAbilityModifier,
  formatModifier,
  DND_LANGUAGES,
  getProficiencyBonus,
} from '../../../../../../features/heroes/constants/dndData';

interface FormStep2AbilitiesAndSkillsProps {
  register: UseFormRegister<HeroFormData>;
  errors: FieldErrors<HeroFormData>;
  watch: UseFormWatch<HeroFormData>;
  setValue: UseFormSetValue<HeroFormData>;
}

const ABILITIES = [
  { key: 'strength', label: 'СИЛА', skills: ['Атлетика'], savingThrow: 'Сила' },
  {
    key: 'dexterity',
    label: 'ЛОВКОСТЬ',
    skills: ['Акробатика', 'Ловкость рук', 'Скрытность'],
    savingThrow: 'Ловкость',
  },
  { key: 'constitution', label: 'ТЕЛОСЛОЖЕНИЕ', skills: [], savingThrow: 'Телосложение' },
  {
    key: 'intelligence',
    label: 'ИНТЕЛЛЕКТ',
    skills: ['Анализ', 'История', 'Магия', 'Природа', 'Религия'],
    savingThrow: 'Интеллект',
  },
  {
    key: 'wisdom',
    label: 'МУДРОСТЬ',
    skills: ['Внимательность', 'Выживание', 'Медицина', 'Проницательность', 'Уход за животными'],
    savingThrow: 'Мудрость',
  },
  {
    key: 'charisma',
    label: 'ХАРИЗМА',
    skills: ['Выступление', 'Запугивание', 'Обман', 'Убеждение'],
    savingThrow: 'Харизма',
  },
] as const;

type AbilityKey =
  | 'strength'
  | 'dexterity'
  | 'constitution'
  | 'intelligence'
  | 'wisdom'
  | 'charisma';

export function FormStep2AbilitiesAndSkills({
  register,
  errors,
  watch,
  setValue,
}: FormStep2AbilitiesAndSkillsProps) {
  const level = watch('level') || 1;
  const proficiencyBonus = getProficiencyBonus(level);

  const formSkills = watch('skills') || [];
  const formLanguages = watch('languages') || [];
  const formSavingThrows = watch('savingThrows') || [];
  const formInspiration = watch('inspiration') || false;
  const formAbilities = watch('abilityScores');

  const [displaySkills, setDisplaySkills] = useState<string[]>(formSkills);
  const [displayLanguages, setDisplayLanguages] = useState<string[]>(formLanguages);
  const [displaySavingThrows, setDisplaySavingThrows] = useState<string[]>(formSavingThrows);
  const [displayInspiration, setDisplayInspiration] = useState<boolean>(formInspiration);
  const [displayAbilities, setDisplayAbilities] = useState<Record<AbilityKey, number>>({
    strength: formAbilities?.strength || 10,
    dexterity: formAbilities?.dexterity || 10,
    constitution: formAbilities?.constitution || 10,
    intelligence: formAbilities?.intelligence || 10,
    wisdom: formAbilities?.wisdom || 10,
    charisma: formAbilities?.charisma || 10,
  });

  const [customLanguageInput, setCustomLanguageInput] = useState<string>('');
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  useEffect(() => {
    if (formAbilities) {
      setDisplayAbilities({
        strength: formAbilities.strength || 10,
        dexterity: formAbilities.dexterity || 10,
        constitution: formAbilities.constitution || 10,
        intelligence: formAbilities.intelligence || 10,
        wisdom: formAbilities.wisdom || 10,
        charisma: formAbilities.charisma || 10,
      });
    }
  }, [
    formAbilities?.strength,
    formAbilities?.dexterity,
    formAbilities?.constitution,
    formAbilities?.intelligence,
    formAbilities?.wisdom,
    formAbilities?.charisma,
  ]);

  useEffect(() => {
    setDisplaySkills(formSkills);
  }, [JSON.stringify(formSkills)]);

  useEffect(() => {
    setDisplayLanguages(formLanguages);
  }, [JSON.stringify(formLanguages)]);

  useEffect(() => {
    setDisplaySavingThrows(formSavingThrows);
  }, [JSON.stringify(formSavingThrows)]);

  useEffect(() => {
    setDisplayInspiration(formInspiration);
  }, [formInspiration]);

  const handleAddCustomLanguage = () => {
    const trimmedInput = customLanguageInput.trim();

    if (trimmedInput === '') return;

    if (displayLanguages.includes(trimmedInput)) {
      alert('Этот язык уже добавлен!');
      setCustomLanguageInput('');
      return;
    }

    const newLanguages = [...displayLanguages, trimmedInput];
    setDisplayLanguages(newLanguages);

    setValue('languages', newLanguages, { shouldDirty: true, shouldValidate: true });
    setCustomLanguageInput('');
  };

  const handleAbilityChange = (key: AbilityKey, value: number) => {
    setDisplayAbilities((prev) => ({
      ...prev,
      [key]: value,
    }));
    setValue(`abilityScores.${key}`, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const toggleSkill = (skill: string) => {
    const newSkills = displaySkills.includes(skill)
      ? displaySkills.filter((s) => s !== skill)
      : [...displaySkills, skill];

    setDisplaySkills(newSkills);
    setValue('skills', newSkills, { shouldDirty: true, shouldValidate: true });
  };

  const toggleLanguage = (language: string) => {
    const newLanguages = displayLanguages.includes(language)
      ? displayLanguages.filter((l) => l !== language)
      : [...displayLanguages, language];

    setDisplayLanguages(newLanguages);
    setValue('languages', newLanguages, { shouldDirty: true, shouldValidate: true });
  };

  const toggleSavingThrow = (save: string) => {
    const newSavingThrows = displaySavingThrows.includes(save)
      ? displaySavingThrows.filter((s) => s !== save)
      : [...displaySavingThrows, save];

    setDisplaySavingThrows(newSavingThrows);
    setValue('savingThrows', newSavingThrows, { shouldDirty: true, shouldValidate: true });
  };

  const toggleInspiration = () => {
    const newValue = !displayInspiration;
    setDisplayInspiration(newValue);
    setValue('inspiration', newValue, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="relative left-[0.5vw] top-[1vh] w-[74vw] flex flex-col gap-[2vh] uppercase">
      <div className="flex items-center justify-between">
        <h2 className="text-left text-[2.5vh] font-bold text-amber-100">Характеристики и навыки</h2>

        <button
          type="button"
          onClick={() => setIsGuideModalOpen(true)}
          style={{ padding: '0.5vh 0.5vw' }}
          className="flex items-center gap-[0.5vw] bg-amber-600 hover:bg-amber-500 border-2 border-amber-600 hover:border-amber-500 rounded-lg transition-colors shadow-lg group"
          title="Открыть памятку"
        >
          <svg className="w-[2vh] h-[2vh] text-stone-900" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-[1.6vh] font-bold text-stone-900">Памятка</span>
        </button>
      </div>

      <div className="flex justify-between gap-[2vw]">
        {/* Бонус владения */}
        <div className="w-[10vw] border-2 border-amber-600 bg-stone-800 rounded-lg">
          <h3 className="text-center text-[2vh] font-bold text-amber-100">БОНУС ВЛАДЕНИЯ</h3>
          <div className="text-center text-[4vh] font-bold text-amber-100">+{proficiencyBonus}</div>
          <input type="hidden" {...register('proficiencyBonus')} value={proficiencyBonus} />
        </div>

        {/* Героическое вдохновение */}
        <div className="w-[12vw] border-2 border-amber-600 bg-stone-800 rounded-lg flex flex-col items-center justify-center">
          <h3 className="text-center text-[1.6vh] font-bold text-amber-100">
            ГЕРОИЧЕСКОЕ ВДОХНОВЕНИЕ
          </h3>
          <button
            type="button"
            onClick={toggleInspiration}
            className={`w-[6vh] h-[6vh] rounded-full border-4 flex items-center justify-center transition-all ${
              displayInspiration
                ? 'border-amber-600 bg-amber-600 shadow-lg shadow-amber-600/50 animate-pulse'
                : 'border-amber-600 bg-stone-900 hover:border-amber-500'
            }`}
          >
            {displayInspiration && (
              <svg
                className="w-[4vh] h-[4vh] text-stone-900"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-[1vw]">
        {ABILITIES.map(({ key, label, skills, savingThrow }) => {
          const value = displayAbilities[key as AbilityKey];
          const modifier = getAbilityModifier(value);
          const isSavingThrowSelected = displaySavingThrows.includes(savingThrow);

          return (
            <div
              key={key}
              className="border-2 border-amber-600 bg-stone-800 rounded-lg flex flex-col gap-[1vh]"
            >
              <h3 className="text-center text-[2vh] font-bold text-amber-100 border-b-2 border-amber-600">
                {label}
              </h3>

              <div className="flex items-center justify-center gap-[1vw]">
                <div className="flex flex-col items-center gap-[1vh]">
                  <div className="w-[5vh] h-[5vh] rounded-full border-2 border-amber-600 bg-stone-900 flex items-center justify-center">
                    <span className="text-[2.5vh] font-bold text-amber-100">
                      {formatModifier(modifier)}
                    </span>
                  </div>

                  <div className="text-center text-[1.2vh] text-amber-100">МОДИФИКАТОР</div>
                </div>

                <div className="flex flex-col items-center">
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={value}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value) || 10;
                      handleAbilityChange(key as AbilityKey, newValue);
                    }}
                    className="w-[6vh] h-[6vh] bg-stone-900 border-2 border-amber-600 rounded text-center text-[3vh] font-bold text-amber-100 focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[1.2vh] text-amber-100">ЗНАЧЕНИЕ</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleSavingThrow(savingThrow)}
                className="relative left-[0.5vw] flex items-center gap-[0.5vw] text-left transition-colors hover:text-amber-100"
              >
                <div
                  className={`w-[2vh] h-[2vh] rounded-full border-2 flex items-center justify-center transition-all ${
                    isSavingThrowSelected
                      ? 'border-amber-500 bg-amber-500'
                      : 'border-amber-600 bg-stone-900'
                  }`}
                >
                  {isSavingThrowSelected && (
                    <svg
                      className="w-[1.5vh] h-[1.5vh] text-stone-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-[1.6vh] ${isSavingThrowSelected ? 'text-amber-100 font-semibold' : 'text-amber-100/80'}`}
                >
                  {formatModifier(isSavingThrowSelected ? modifier + proficiencyBonus : modifier)}{' '}
                  Спасбросок
                </span>
              </button>

              {/* Список навыков */}
              <div className="flex flex-col gap-[0.5vh]">
                {skills.map((skill) => {
                  const isSelected = displaySkills.includes(skill);
                  const totalBonus = isSelected ? modifier + proficiencyBonus : modifier;

                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className="relative left-[0.5vw] bottom-[0.5vh] flex items-center gap-[0.5vw] text-left transition-colors hover:text-amber-100"
                    >
                      <div
                        className={`w-[2vh] h-[2vh] rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500'
                            : 'border-amber-600 bg-stone-900'
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="w-[1.5vh] h-[1.5vh] text-stone-900"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`text-[1.4vh] ${isSelected ? 'text-amber-100 font-semibold' : 'text-amber-100/80'}`}
                      >
                        {formatModifier(totalBonus)} {skill}
                      </span>
                    </button>
                  );
                })}
              </div>

              {errors.abilityScores?.[key as AbilityKey] && (
                <p className="text-red-400 text-[1.2vh]">
                  {errors.abilityScores[key as AbilityKey]?.message}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Секция языков */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-[2vh] font-bold text-amber-100">ЯЗЫКИ</h3>

          <div className="flex items-center gap-[0.5vw]">
            <input
              type="text"
              placeholder="Напишите ваш язык..."
              value={customLanguageInput}
              onChange={(e) => setCustomLanguageInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomLanguage();
                }
              }}
              style={{ paddingLeft: '0.2vw' }}
              className="w-[15vw] h-[3vh] uppercase bg-stone-900 border-2 border-amber-600 rounded-lg text-[1.4vh] text-amber-100 focus:outline-none focus:border-amber-400 placeholder:text-amber-600/50"
            />
            <button
              type="button"
              onClick={handleAddCustomLanguage}
              className="w-[5vh] h-[3vh] bg-amber-600 border-2 border-amber-600 hover:bg-amber-500 hover:border-amber-500 text-stone-900 rounded-lg text-[1.4vh] font-bold transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-row justify-between">
          <div
            style={{ padding: '0 0.2vw' }}
            className="relative w-[30vw] h-[10vh] border-2 border-amber-600 bg-stone-800 rounded-lg"
          >
            <button
              type="button"
              onClick={() => {
                const container = document.getElementById('languages-scroll');
                if (container) container.scrollLeft -= 300;
              }}
              className="absolute left-[0.5vw] top-1/2 -translate-y-1/2 z-10 w-[2vh] h-[2vh] bg-stone-900/90 border-2 border-amber-600 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors"
            >
              <svg
                className="w-[1vh] h-[1vh] text-amber-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => {
                const container = document.getElementById('languages-scroll');
                if (container) container.scrollLeft += 300;
              }}
              className="absolute right-[0.5vw] top-1/2 -translate-y-1/2 z-10 w-[2vh] h-[2vh] bg-stone-900/90 border-2 border-amber-600 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors"
            >
              <svg
                className="w-[1vh] h-[1vh] text-amber-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div
              id="languages-scroll"
              className="relative top-[0.7vh] overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="inline-grid grid-rows-2 grid-flow-col gap-x-[1vw] gap-y-[2.5vh] auto-cols-max">
                {DND_LANGUAGES.map((language) => {
                  const isSelected = displayLanguages.includes(language);
                  return (
                    <button
                      key={language}
                      type="button"
                      onClick={() => toggleLanguage(language)}
                      className={`w-[7vw] h-[2.8vh] rounded-lg text-[1.4vh] transition-all border-2 whitespace-nowrap ${
                        isSelected
                          ? 'bg-amber-600 border-amber-600 text-stone-900 font-bold'
                          : 'bg-stone-900 border-amber-600 text-amber-100 hover:border-amber-400'
                      }`}
                    >
                      {language}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {displayLanguages.length > 0 && (
            <div className="relative top-[2vh] max-w-[40vw] h-[10vh] flex flex-col flex-wrap gap-[0.5vw] overflow-y-auto">
              {displayLanguages.map((language) => (
                <div
                  key={language}
                  className="w-[7vw] h-[3vh] flex items-center justify-center gap-[0.3vw] bg-amber-600 text-stone-900 rounded text-[1.3vh] font-bold"
                >
                  <span>{language}</span>
                  <button
                    type="button"
                    onClick={() => toggleLanguage(language)}
                    className="hover:scale-110 transition-transform"
                    title="Удалить"
                  >
                    <svg
                      className="w-[1.2vh] h-[1.2vh]"
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
              ))}
            </div>
          )}
        </div>
      </div>

      <AbilityScoresGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
