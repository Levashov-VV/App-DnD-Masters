import { useNavigate, useParams } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { HeroFormData } from '../../../../../features/heroes/schemas/heroSchema';
import { heroSchema } from '../../../../../features/heroes/schemas/heroSchema';
import { useHeroes } from '../../Context/HeroesContext';
import { useFormWizard } from '../../../../../shared/hooks/auth/useFormWizard';
import { FormStepper } from '../../components/Mobile/HeroForm/FormStepper';
import { FormStep1Basic } from '../../components/Mobile/HeroForm/FormStep1Basic';
import { FormStep2AbilitiesAndSkills } from '../../components/Mobile/HeroForm/FormStep2Abilities';
import { FormStep3Skills } from '../../components/Mobile/HeroForm/FormStep3Skills';
import { FormStep4TeamAndCampaignInfo } from '../../components/Mobile/HeroForm/FormStep4Team&CampaineInfo';
import { FormStep5Inventory } from '../../components/Mobile/HeroForm/FormStep5Equipment';
import { FormStep6Treasure } from '../../components/Mobile/HeroForm/FormStep6Treasure';
import { FormStep7Notes } from '../../components/Mobile/HeroForm/FormStep7Notes';
import { FormStep8Spells } from '../../components/Mobile/HeroForm/FormStep8Spells';
import { ConfirmDialog } from '../../components/Mobile/HeroForm/ui/FormStep5/ConfirmDialog';
import { getProficiencyBonus } from '../../../../../features/heroes/constants/dndData';
import { useGenerateCharacterPdf } from '../../components/Character Sheet PDF/Usegeneratecharacterpdf';

interface HeroFormProps {
  mode: 'create' | 'edit';
}

export default function HeroForm({ mode }: HeroFormProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addHero, updateHero, getHero } = useHeroes();
  const { currentStep, nextStep, prevStep, goToStep, isFirstStep, isLastStep } = useFormWizard();
  const heroToEdit = mode === 'edit' && id ? getHero(id) : undefined;
  const { generateFilled, isGenerating, error: pdfError } = useGenerateCharacterPdf();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
    getValues,
    control,
    reset,
  } = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema) as Resolver<HeroFormData>,
    mode: 'onChange',
    values: heroToEdit,
    defaultValues: {
      name: '',
      race: '',
      classes: [],
      size: '',
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
      hitPoints: { current: 10, max: 10, temporary: 0 },
      hitDice: { total: 1, spent: 0, type: 'd8' },
      deathSaves: { successes: 0, failures: 0 },
      initiative: 0,
      speed: 30,
      proficiencyBonus: 2,
      inspiration: false,
      skills: [],
      skillOverrides: {},
      savingThrows: [],
      languages: [],
      weaponProficiencies: [],
      armorProficiencies: [],
      toolProficiencies: [],
      classFeatures: '',
      raceFeatures: '',
      combatAbilities: [],
      feats: [],
      teamMembers: [],
      backstory: '',
      appearance: '',
      additionalFeatures: '',
      campaignGoals: '',
      equipment: { weapons: [], armor: '', items: [] },
      inventory: {
        equipped: [],
        inventory: [],
        consumables: [],
        treasures: '',
        magicItems: { maxSlots: 3, items: [] },
        currency: { copper: 0, silver: 0, gold: 0, electrum: 0, platinum: 0 },
        carryCapacity: { current: 0, max: 0 },
      },
      personality: { traits: '', ideals: '', bonds: '', flaws: '' },
      notes: {
        plotNotes: '',
        npcNotes: '',
        locationNotes: '',
        questNotes: '',
        secretNotes: '',
        combatNotes: '',
        contactNotes: '',
        rumorNotes: '',
        miscNotes: '',
      },
      spellcastingAbility: 'none',
      spellSlots: {
        level1: { max: 0, used: 0 },
        level2: { max: 0, used: 0 },
        level3: { max: 0, used: 0 },
        level4: { max: 0, used: 0 },
        level5: { max: 0, used: 0 },
        level6: { max: 0, used: 0 },
        level7: { max: 0, used: 0 },
        level8: { max: 0, used: 0 },
        level9: { max: 0, used: 0 },
      },
      restFlags: { arcaneRecoveryUsed: false, naturalRecoveryUsed: false },
      cantrips: [],
      preparedSpells: [],
      knownSpells: [],
      recommendedPreparedCount: 0,
      avatar: '',
    },
  });

  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const pendingNavigationRef = useRef<(() => void) | null>(null);
  const allowNavigationRef = useRef(false);
  const isDirtyRef = useRef(false);
  const hasPushedGuardRef = useRef(false);

  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  useEffect(() => {
    if (isDirty && !hasPushedGuardRef.current && !allowNavigationRef.current) {
      window.history.pushState({ __formGuard: true }, '', window.location.href);
      hasPushedGuardRef.current = true;
    }
  }, [isDirty]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !allowNavigationRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (mode === 'edit' && id && !getHero(id)) {
      navigate('/player/heroes');
    }
  }, [mode, id, getHero, navigate]);

  useEffect(() => {
    const handlePopState = () => {
      if (allowNavigationRef.current) return;
      if (!isDirtyRef.current) return;

      window.history.pushState({ __formGuard: true }, '', window.location.href);

      pendingNavigationRef.current = () => {
        allowNavigationRef.current = true;
        window.history.go(-2);
      };

      setShowLeaveConfirm(true);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const attemptLeave = (targetPath: string) => {
    if (isDirty) {
      pendingNavigationRef.current = () => navigate(targetPath);
      setShowLeaveConfirm(true);
    } else {
      navigate(targetPath);
    }
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'level' && value.level) {
        setValue('proficiencyBonus', getProficiencyBonus(value.level));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleNext = () => {
    nextStep();
    scrollTop();
  };
  const handlePrev = () => {
    prevStep();
    scrollTop();
  };
  const handleGoToStep = (step: number) => {
    goToStep(step);
    scrollTop();
  };

  const onSubmit = (data: HeroFormData) => {
    const heroData = { ...data, avatar: data.avatar };
    try {
      allowNavigationRef.current = true;
      if (mode === 'create') addHero(heroData);
      else if (mode === 'edit' && id) updateHero(id, heroData);
      navigate('/player/heroes', { replace: true });
    } catch (error) {
      console.error('Ошибка сохранения героя:', error);
      allowNavigationRef.current = false;
    }
  };

  const handleStay = () => {
    setShowLeaveConfirm(false);
    pendingNavigationRef.current = null;
  };

  const handleDiscardAndLeave = () => {
    setShowLeaveConfirm(false);
    allowNavigationRef.current = true;
    pendingNavigationRef.current?.();
  };

  const handleSaveAndLeave = () => {
    setShowLeaveConfirm(false);
    handleSubmit(onSubmit, onValidationError)();
  };

  const onValidationError = (validationErrors: typeof errors) => {
    console.error('Поля с ошибками:', Object.keys(validationErrors));
    console.error('Детали:', JSON.stringify(validationErrors, null, 2));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormStep1Basic
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            getValues={getValues}
            control={control}
          />
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
          <FormStep6Treasure
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        );
      case 7:
        return (
          <FormStep7Notes register={register} errors={errors} watch={watch} control={control} />
        );
      case 8:
        return (
          <FormStep8Spells
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            control={control}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{ marginBottom: '50vh' }}
      className="relative top-[18vh] flex flex-col items-center h-screen"
    >
      <div className="w-[98vw]">
        <header className="flex flex-row gap-[20vw]">
          <button
            type="button"
            onClick={() => attemptLeave('/player/heroes')}
            className="flex items-center gap-[1vw] text-gray-400 hover:text-white transition-colors text-[1.6vh]"
          >
            <svg className="w-[4vw] h-[4vw]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Назад к библиотеке
          </button>
          <h1 className="text-[1.6vh] text-center font-bold text-amber-100">
            {mode === 'create' ? 'Создание героя' : 'Редактирование героя'}
          </h1>
        </header>

        <div style={{ marginTop: '2vh' }}>
          <FormStepper currentStep={currentStep} onStepClick={handleGoToStep} />
        </div>

        <form style={{ marginTop: '2vw' }} onSubmit={handleSubmit(onSubmit, onValidationError)}>
          <div className="bg-neutral-700/70 rounded-2xl h-[80vh]">{renderStep()}</div>

          {isLastStep && (
            <div className="relative top-[6vh] flex justify-end">
              <button
                type="submit"
                className="z-10 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[1.6vh] transition-colors w-[30vw] h-[4vh]"
              >
                Сохранить героя
              </button>
            </div>
          )}
        </form>

        <div className="relative top-[3vh] flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFirstStep}
            className={`
      z-10 rounded-lg text-[1.6vh] transition-colors w-[30vw] h-[4vh]
      ${
        isFirstStep
          ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
          : 'bg-amber-500/90 text-neutral-900 hover:bg-amber-500 hover:scale-105'
      }
    `}
          >
            ← Назад
          </button>

          {pdfError && (
            <span className="absolute left-1/2 top-[-2.2vh] -translate-x-1/2 text-red-400 text-[1.4vh] whitespace-nowrap">
              {pdfError}
            </span>
          )}

          <button
            type="button"
            onClick={() => generateFilled(getValues())}
            disabled={isGenerating}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[25vw] h-[4vh] bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg text-[1.6vh] transition-colors"
          >
            {isGenerating ? 'Формируем PDF…' : 'Скачать PDF'}
          </button>

          {!isLastStep && (
            <button
              type="button"
              onClick={handleNext}
              className="z-10 bg-amber-600 text-neutral-900 text-[1.6vh] hover:bg-amber-500 hover:scale-105 rounded-lg w-[30vw] h-[4vh]"
            >
              Далее →
            </button>
          )}
        </div>
      </div>
      <ConfirmDialog
        isOpen={showLeaveConfirm}
        config={{
          title: 'Несохранённые изменения',
          message: 'У вас есть несохранённые изменения.\nЧто сделать перед выходом?',
          type: 'confirm',
          confirmText: 'Сохранить и выйти',
          cancelText: 'Остаться',
          showCancel: true,
          extraButtonText: 'Выйти без сохранения',
          onConfirm: handleSaveAndLeave,
          onCancel: handleStay,
          onExtra: handleDiscardAndLeave,
        }}
        onClose={() => setShowLeaveConfirm(false)}
      />
    </div>
  );
}
