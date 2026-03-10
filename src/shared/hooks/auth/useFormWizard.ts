import { useState } from 'react';

export const FORM_STEPS = [
  { id: 1, title: 'Основы', description: 'Базовая информация' },
  { id: 2, title: 'Характеристики', description: 'Значения характеристик' },
  { id: 3, title: 'Навыки', description: 'Умения, черты и навыки' },
  { id: 4, title: 'Информация о кампании', description: 'Информация о кампании и команде' },
  { id: 5, title: 'Снаряжение', description: 'Предметы с боевым бонусом и оружие' },
  { id: 6, title: 'Инвентарь', description: 'Сокровища и расходники' },
  { id: 7, title: 'Записи', description: 'Информация о происходящем' },
  { id: 8, title: 'Заклинания', description: 'Информация о заклинаниях' },
] as const;

export function useFormWizard() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    if (currentStep < FORM_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= FORM_STEPS.length) {
      setCurrentStep(step);
    }
  };

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === FORM_STEPS.length;

  return {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    isFirstStep,
    isLastStep,
    steps: FORM_STEPS,
  };
}
