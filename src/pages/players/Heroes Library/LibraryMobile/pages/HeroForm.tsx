import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { HeroFormData } from '../../../../../features/heroes/schemas/heroSchema';
import { heroSchema } from '../../../../../features/heroes/schemas/heroSchema';
import { useHeroes } from '../../Context/HeroesContext';
import { useFormWizard } from '../../../../../shared/hooks/auth/useFormWizard';
import { FormStepper } from '../../components/Desktop/HeroForm/FormStepper';
import { FormStep1Basic } from '../../components/Desktop/HeroForm/FormStep1Basic';
import { FormStep2Abilities } from '../../components/Desktop/HeroForm/FormStep2Abilities';
import { FormStep3Skills } from '../../components/Desktop/HeroForm/FormStep3Skills';
import { FormStep4Equipment } from '../../components/Desktop/HeroForm/FormStep5Equipment';
import { FormStep5Details } from '../../components/Desktop/HeroForm/FormStep8Details';
import { useEffect } from 'react';
import { getProficiencyBonus } from '../../../../../features/heroes/constants/dndData';

interface HeroFormProps {
  mode: 'create' | 'edit';
}

export default function HeroForm({ mode }: HeroFormProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addHero, updateHero, getHero } = useHeroes();
  const { currentStep, nextStep, prevStep, goToStep, isFirstStep, isLastStep, steps } =
    useFormWizard();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
    reset,
  } = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      level: 1,
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
      },
      armorClass: 10,
      initiative: 0,
      speed: 30,
      proficiencyBonus: 2,
      skills: [],
      savingThrows: [],
      languages: [],
      equipment: {
        weapons: [],
        armor: '',
        items: [],
      },
      personality: {
        traits: '',
        ideals: '',
        bonds: '',
        flaws: '',
      },
    },
  });

  // Load hero data for edit mode
  useEffect(() => {
    if (mode === 'edit' && id) {
      const hero = getHero(id);
      if (hero) {
        reset(hero);
      } else {
        navigate('/heroes');
      }
    }
  }, [mode, id, getHero, reset, navigate]);

  // Auto-update proficiency bonus when level changes
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'level' && value.level) {
        setValue('proficiencyBonus', getProficiencyBonus(value.level));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const onSubmit = (data: HeroFormData) => {
    if (mode === 'create') {
      addHero(data);
    } else if (mode === 'edit' && id) {
      updateHero(id, data);
    }
    navigate('/heroes');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <FormStep1Basic register={register} errors={errors} />;
      case 2:
        return <FormStep2Abilities register={register} errors={errors} watch={watch} />;
      case 3:
        return (
          <FormStep3Skills register={register} errors={errors} watch={watch} setValue={setValue} />
        );
      case 4:
        return (
          <FormStep4Equipment register={register} errors={errors} watch={watch} control={control} />
        );
      case 5:
        return <FormStep5Details register={register} errors={errors} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/heroes')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Назад к библиотеке
        </button>

        <h1 className="text-3xl font-bold text-white mb-8">
          {mode === 'create' ? 'Создание героя' : 'Редактирование героя'}
        </h1>

        {/* Form Layout */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Stepper */}
            <div className="lg:col-span-1">
              <FormStepper currentStep={currentStep} onStepClick={goToStep} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 min-h-[600px]">
                {renderStep()}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={isFirstStep}
                  className={`
                    px-6 py-3 rounded-lg font-medium transition-colors
                    ${
                      isFirstStep
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }
                  `}
                >
                  ← Назад
                </button>

                {!isLastStep ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Далее →
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    ✓ Сохранить героя
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
