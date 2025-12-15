interface NavigationHeaderProps {
  stepForm: number;
  setStepForm: (step: number) => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({ stepForm, setStepForm }) => {
  const steps = ['Персонажи', 'Карты', 'Клетки', 'Отправка'];

  return (
    <nav className="flex flex-row items-center justify-center gap-[3vw] relative top-[5vh] h-[5vh] w-[35vw] bg-neutral-700 text-amber-100 rounded-2xl text-[1.8vh]">
      {steps.map((step, index) => (
        <button
          key={index}
          type="button"
          onClick={() => setStepForm(index)}
          className={`flex-1 h-[5vh] py-2 px-4 rounded-xl transition-all duration-300 font-medium ${
            index === stepForm
              ? 'bg-amber-600 text-neutral-900 shadow-amber-500/50 scale-105'
              : index < stepForm
                ? 'bg-amber-500/80 text-amber-100 hover:bg-amber-500'
                : 'bg-neutral-900/50 hover:bg-neutral-700 hover:scale-105 text-amber-200'
          }`}
        >
          {step}
        </button>
      ))}
    </nav>
  );
};
