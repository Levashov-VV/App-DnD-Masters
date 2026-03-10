import { FORM_STEPS } from '../../../../../../shared/hooks/auth/useFormWizard';

interface FormStepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function FormStepper({ currentStep, onStepClick }: FormStepperProps) {
  return (
    <div>
      <nav>
        {FORM_STEPS.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepClick(step.id)}
              className={`
                w-full text-left rounded-lg  transition-all
                ${isActive ? 'bg-amber-600/90 text-neutral-900 hover:bg-amber-600 hover:scale-105' : ''}
                ${isCompleted ? ' text-amber-200 hover:text-amber-100' : ''}
                ${!isActive && !isCompleted ? 'text-amber-200' : ''}
              `}
            >
              <div className="relative left-[0.5vw] flex items-center gap-[1vw]">
                <div
                  className={`
                  w-[1.5vw] h-[1.5vw] rounded-full flex items-center justify-center font-bold text-[1.6vh]
                  ${isActive ? 'bg-amber-500/90 text-neutral-900 hover:bg-amber-500 hover:scale-105' : ''}
                  ${isCompleted ? 'bg-green-600' : ''}
                  ${!isActive && !isCompleted ? 'bg-gray-700' : ''}
                `}
                >
                  {isCompleted ? (
                    <svg
                      className="w-[0.8vw] h-[0.8vw]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <div>
                  <div className="text-[1.6vh]">{step.title}</div>
                  <div className={`text-[1.4vh] ${isActive ? 'text-amber-100' : 'text-gray-400'}`}>
                    {step.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
