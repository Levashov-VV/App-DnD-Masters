import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { HeroFormData } from '../../../../../../../features/heroes/schemas/heroSchema';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface ArmorClassShieldProps {
  control: Control<HeroFormData>;
  fieldName: keyof Pick<HeroFormData, 'armorClass'>;
  errors: FieldErrors<HeroFormData>;
  label?: string;
  sublabel?: string;
  className?: string;
}

export const ArmorClassShield = ({
  control,
  fieldName,
  errors,
  label = 'КЛАСС ЗАЩИТЫ',
  sublabel = 'ЩИТ',
  className = '',
}: ArmorClassShieldProps) => {
  const error = errors[fieldName]?.message as string | undefined;


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
        <path
          d="M82 1H6V80C6 86 40 115 44 115C48 115 82 86 82 80V1Z"
          fill="none"
          stroke={error ? '#EF4444' : '#D97706'}
          strokeWidth="2.5"
        />
        <g transform="translate(44, 115)">
          <path
            d="M 0,-8 L 6,0 L 0,8 L -6,0 Z"
            fill="none"
            stroke={error ? '#EF4444' : '#D97706'}
            strokeWidth="2.5"
          />
        </g>
      </svg>

      <div className="absolute top-[1.2vh] left-0 right-0 flex justify-center">
        <span className={`text-[1vh] font-bold ${error ? 'text-red-400' : 'text-amber-100'}`}>
          {label}
        </span>
      </div>

      <div className="absolute top-[3vh] left-0 right-0 flex justify-center">
        <Controller
          name={fieldName}
          control={control}
          rules={{
            min: { value: 0, message: 'Минимум 0' },
            max: { value: 30, message: 'Максимум 30' },
          }}
          render={({ field }) => (
            <input
              type="number"
              min={0}
              max={30}
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
              onBlur={field.onBlur}
              ref={field.ref}
              className={`relative bottom-[1vh] w-[5vh] text-center text-[4.5vh] font-bold ${
                error ? 'text-red-400' : 'text-amber-100'
              } bg-transparent border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            />
          )}
        />
      </div>

      <div className="absolute bottom-[4vh] left-0 right-0 flex flex-col items-center justify-center gap-[0.5vh]">
        <span
          className={`text-[1.3vh] font-bold ${error ? 'text-red-400' : 'text-amber-100'} tracking-wider`}
        >
          {sublabel}
        </span>
        <Controller
          name="inspiration"
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              onBlur={field.onBlur}
              ref={field.ref}
              className="w-[1.5vh] h-[1.5vh] rotate-45 appearance-none bg-transparent border-2 border-amber-600 checked:bg-black cursor-pointer hover:border-amber-500 transition-colors"
            />
          )}
        />
      </div>

      {error && (
        <div className="absolute top-[16vh] left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <span className="text-[1.2vh] text-red-400 font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};
