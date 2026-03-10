import { useState } from 'react';

interface SelectOrInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  options: string[];
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLSelectElement>;
  ref?: React.Ref<HTMLInputElement | HTMLSelectElement>;
}

export const SelectOrInput = ({
  label,
  error,
  options,
  placeholder = 'Выберите...',
  name,
  onChange,
  onBlur,
  value,
  defaultValue,
  ref,
  ...props
}: SelectOrInputProps) => {
  const [isCustomMode, setIsCustomMode] = useState(false);

  const toggleMode = () => setIsCustomMode(!isCustomMode);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {label && <label className="block text-[1.6vh] font-medium text-amber-100">{label}</label>}
        <button
          type="button"
          onClick={toggleMode}
          className="text-[1.4vh] text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-[0.5vh]"
          title={isCustomMode ? 'Выбрать из списка' : 'Введите своё значение'}
        >
          {isCustomMode ? (
            <svg
              className="w-[1.5vh] h-[1.5vh]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          ) : (
            <svg
              className="w-[1.5vh] h-[1.5vh]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          )}
        </button>
      </div>

      {isCustomMode ? (
        <input
          type="text"
          name={name}
          ref={ref as React.Ref<HTMLInputElement>}
          onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
          onBlur={onBlur as React.FocusEventHandler<HTMLInputElement>}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          className={`
            w-full bg-neutral-900/80 rounded-lg text-amber-100
            focus:outline-none
            ${error ? 'border-2 border-red-500' : ''}
          `}
          {...props}
        />
      ) : (
        <select
          key={options.join(',')}
          name={name}
          ref={ref as React.Ref<HTMLSelectElement>}
          onChange={onChange as React.ChangeEventHandler<HTMLSelectElement>}
          onBlur={onBlur as React.FocusEventHandler<HTMLSelectElement>}
          value={value as string}
          defaultValue={defaultValue as string}
          className={`
            w-full bg-neutral-900/80 rounded-lg text-amber-100 text-[1.6vh]
            focus:outline-none
            ${error ? 'border-2 border-red-500' : ''}
          `}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}

      {error && <p className="text-[1.4vh] text-red-400">{error}</p>}
    </div>
  );
};
