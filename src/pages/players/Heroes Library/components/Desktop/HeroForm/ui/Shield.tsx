import type { UseFormRegister, FieldErrors } from 'react-hook-form';

interface ArmorClassShieldProps {
  register: UseFormRegister<any>;
  fieldName: string;
  errors?: FieldErrors;
  label?: string;
  sublabel?: string;
  className?: string;
}

export const ArmorClassShield = ({
  register,
  fieldName,
  errors,
  label = 'КЛАСС ЗАЩИТЫ',
  sublabel = 'ЩИТ',
  className = '',
}: ArmorClassShieldProps) => {
  const error = errors?.[fieldName]?.message as string | undefined;

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <svg className="w-[12vh] h-[16vh]" viewBox="0 0 88 130" fill="none">
        <path
          d="M9 0.5L2 0.5L5.5 2.5L9 0.5Z"
          fill="none"
          stroke="#D97706"
          strokeWidth="2"
          strokeMiterlimit="4.62751"
        />
        <path
          d="M86 0.5L79 0.5L82.5 2.5L86 0.5Z"
          fill="none"
          stroke="#D97706"
          strokeWidth="2"
          strokeMiterlimit="4.62751"
        />

        {/* Основной щит */}
        <path
          d="M82 1H6V80C6 86 40 115 44 115C48 115 82 86 82 80V1Z"
          fill="none"
          stroke={error ? '#EF4444' : '#D97706'}
          strokeWidth="2.5"
        />

        {/* Ромбик внизу */}
        <g transform="translate(44, 115)">
          <path
            d="M 0,-8 L 6,0 L 0,8 L -6,0 Z"
            fill="none"
            stroke={error ? '#EF4444' : '#D97706'}
            strokeWidth="2.5"
          />
        </g>
      </svg>

      {/* "КЛАСС ЗАЩИТЫ" */}
      <div className="absolute top-[1.2vh] left-0 right-0 flex justify-center">
        <span className={`text-[1vh] font-bold ${error ? 'text-red-400' : 'text-amber-100'}`}>
          {label}
        </span>
      </div>

      <div className="absolute top-[3vh] left-0 right-0 flex justify-center">
        <input
          type="number"
          min={0}
          max={30}
          {...register(fieldName, {
            valueAsNumber: true,
          })}
          className={`relative bottom-[1vh] w-[5vh] text-center text-[4.5vh] font-bold ${
            error ? 'text-red-400' : 'text-amber-100'
          } bg-transparent border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
        />
      </div>

      {/* Текст */}
      <div className="absolute bottom-[4vh] left-0 right-0 flex flex-col items-center justify-center gap-[0.5vh]">
        <span
          className={`text-[1.3vh] font-bold ${
            error ? 'text-red-400' : 'text-amber-100'
          } tracking-wider`}
        >
          {sublabel}
        </span>
        <input
          type="checkbox"
          className="w-[1.5vh] h-[1.5vh] rotate-45 appearance-none bg-transparent border-2 border-amber-600 checked:bg-black cursor-pointer hover:border-amber-500 transition-colors"
        />
      </div>

      {/* Ошибка */}
      {error && (
        <div className="absolute top-[16vh] left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <span className="text-[1.2vh] text-red-400 font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};
