import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import type { HeroFormData } from '../../../../../features/heroes/schemas/heroSchema';
import { heroSchema } from '../../../../../features/heroes/schemas/heroSchema';
import { useHeroes } from '../../Context/HeroesContext';
import { useFormWizard } from '../../../../../shared/hooks/auth/useFormWizard';
import { FormStepper } from '../../components/Desktop/HeroForm/FormStepper';
import { FormStep1Basic } from '../../components/Desktop/HeroForm/FormStep1Basic';
import { FormStep2AbilitiesAndSkills } from '../../components/Desktop/HeroForm/FormStep2Abilities';
import { FormStep3Skills } from '../../components/Desktop/HeroForm/FormStep3Skills';
import { FormStep4TeamAndCampaignInfo } from '../../components/Desktop/HeroForm/FormStep4Team&CampaineInfo';
import { FormStep5Inventory } from '../../components/Desktop/HeroForm/FormStep5Equipment';
import { FormStep6Treasure } from '../../components/Desktop/HeroForm/FormStep6Treasure';
import { FormStep7Notes } from '../../components/Desktop/HeroForm/FormStep7Notes';
import { FormStep8Details } from '../../components/Desktop/HeroForm/FormStep8Details';
import { getProficiencyBonus } from '../../../../../features/heroes/constants/dndData';

interface HeroFormProps {
  mode: 'create' | 'edit';
}

export default function HeroForm({ mode }: HeroFormProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addHero, updateHero, getHero } = useHeroes();
  const { currentStep, nextStep, prevStep, goToStep, isFirstStep, isLastStep } = useFormWizard();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
    reset,
  } = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema) as Resolver<HeroFormData>,
    mode: 'onChange',
    defaultValues: {
      // Основная информация
      name: '',
      race: '',
      class: '',
      subclass: '',
      level: 1,
      experience: 0,
      background: '',
      alignment: '',
      armorClass: 10,
      exhaustionLevel: 0,
      abilityScores: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      hitPoints: {
        current: 10,
        max: 10,
        temporary: 0,
      },
      hitDice: {
        total: 1,
        spent: 0,
        type: 'd8',
      },
      deathSaves: {
        successes: 0,
        failures: 0,
      },
      initiative: 0,
      speed: 30,
      proficiencyBonus: 2,
      inspiration: false,

      // Характеристики
      skills: [],
      savingThrows: [],
      languages: [],

      // Навыки
      weaponProficiencies: [],
      armorProficiencies: [],
      toolProficiencies: [],
      classFeatures: '',
      raceFeatures: '',
      combatAbilities: [],
      feats: [],

      // Кампания и команда
      teamMembers: [],
      backstory: '',
      appearance: '',
      additionalFeatures: '',
      campaignGoals: '',

      // Снаряжение
      equipment: {
        weapons: [],
        armor: '',
        items: [],
      },

      // Личность
      personality: {
        traits: '',
        ideals: '',
        bonds: '',
        flaws: '',
      },

      avatar: '',
      customAvatar: '',
    },
  });

  useEffect(() => {
    if (mode === 'edit' && id) {
      const hero = getHero(id);
      if (hero) {
        reset(hero);
      } else {
        navigate('/player/heroes');
      }
    }
  }, [mode, id, getHero, reset, navigate]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'level' && value.level) {
        setValue('proficiencyBonus', getProficiencyBonus(value.level));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  // Отправка формы
  const onSubmit = (data: HeroFormData) => {
    try {
      if (mode === 'create') {
        addHero(data);
      } else if (mode === 'edit' && id) {
        updateHero(id, data);
      }
      navigate('/player/heroes');
    } catch (error) {
      console.error('Ошибка сохранения героя:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormStep1Basic register={register} errors={errors} watch={watch} setValue={setValue} />
        );
      case 2:
        return (
          <FormStep2AbilitiesAndSkills
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        );
      case 3:
        return (
          <FormStep3Skills register={register} errors={errors} watch={watch} setValue={setValue} />
        );
      case 4:
        return (
          <FormStep4TeamAndCampaignInfo
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        );
      case 5:
        return (
          <FormStep5Inventory
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        );
        case 6:
        return (
          <FormStep6Treasure register={register} errors={errors} watch={watch} setValue={setValue} />
        )
      case 7:
        return (
          <FormStep7Notes register={register} errors={errors} watch={watch} control={control} />
        );
      case 8:
        return <FormStep8Details register={register} errors={errors} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative top-[20vh] flex flex-col items-center h-screen">
      <div className="w-[95vw]">
        {/* Header */}
        <header className="flex flex-row gap-[30vw]">
          <button
            onClick={() => navigate('/player/heroes')}
            className="flex items-center gap-[1vw] text-gray-400 hover:text-white transition-colors text-[1.6vh]"
          >
            <svg className="w-[1vw] h-[1vw]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Назад к библиотеке
          </button>

          <h1 className="text-[2vw] text-center font-bold text-amber-100">
            {mode === 'create' ? 'Создание героя' : 'Редактирование героя'}
          </h1>
        </header>

        {/* Форма */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-5 gap-[2vw]">
            <div className="col-span-4">
              <div className="bg-neutral-700/70 rounded-2xl h-[65vh] max-h-[65vh]">
                {renderStep()}
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={isFirstStep}
                  className={`
                    relative top-[2vh] z-10 rounded-lg text-[1.6vh] transition-colors w-[8vw] h-[4vh]
                    ${
                      isFirstStep
                        ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                        : 'bg-amber-500/90 text-neutral-900 hover:bg-amber-500 hover:scale-105'
                    }
                  `}
                >
                  ← Назад
                </button>

                {!isLastStep ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="relative top-[2vh] z-10 bg-amber-600 text-neutral-900  text-[1.6vh] shadow-amber-500/50 scale-105 hover:bg-amber-500 hover:scale-105 rounded-lg w-[8vw] h-[4vh]"
                  >
                    Далее →
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="relative top-[2vh] z-10 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[1.6vh] transition-colors w-[8vw] h-[4vh]"
                  >
                    Сохранить героя
                  </button>
                )}
              </div>
            </div>
            {/* Sidebar */}
            <div className="col-span-1">
              <FormStepper currentStep={currentStep} onStepClick={goToStep} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
