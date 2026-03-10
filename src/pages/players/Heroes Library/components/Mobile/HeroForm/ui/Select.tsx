import { useState, useRef, useEffect, useCallback } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface SelectProps {
  label?: string;
  error?: string;
  options: string[];
  placeholder: string;
  className?: string;
  register?: UseFormRegisterReturn;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  name?: string;
}

export const Select = ({
  label,
  error,
  options,
  placeholder,
  className = '',
  register,
  value: propValue,
  onChange,
  name,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (propValue !== undefined && propValue !== internalValue) {
      setInternalValue(propValue);
    }
  }, [propValue]);

  useEffect(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = internalValue;
    }
  }, [internalValue]);

  const handleSelectOption = useCallback(
    (option: string) => {
      setInternalValue(option);
      setIsOpen(false);

      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = option;
        hiddenInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
      }

      if (onChange) {
        const syntheticEvent = {
          target: { value: option, name: name || '' },
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(syntheticEvent);
      }
    },
    [onChange, name]
  );

  const displayValue = internalValue || placeholder;

  return (
    <div className="w-full">
      {label && <label className="block text-[1.1vh] font-medium text-amber-100">{label}</label>}

      <input {...register} ref={hiddenInputRef} type="hidden" value={internalValue} />

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`
          w-full bg-neutral-900/80 rounded-lg text-amber-100 text-[1.6vh]
          border-2 ${error ? 'border-red-500' : 'border-amber-600/50'} 
          hover:border-amber-500 active:bg-neutral-800/50
          flex items-center justify-between text-left transition-all
          focus:outline-none focus:ring-2 focus:ring-amber-500
          ${className}
        `}
      >
        <span className="w-[85%] truncate">{displayValue}</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {error && <p className="text-[1.4vh] text-red-400">{error}</p>}

      {/* Модальное окно */}
      {isOpen && (
        <div
          ref={modalRef}
          style={{ padding: '5vw' }}
          className="fixed inset-0 z-150 flex items-center bg-black/50"
          onClick={() => setIsOpen(false)}
        >
          <div className="w-full max-w-[90vw] max-h-[70vh] bg-gray-900 rounded-t-2xl shadow-2xl border-t-4 border-amber-500">
            <div style={{ padding: '2vw' }} className="border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-[2vh] font-bold text-amber-100">{label || 'Выберите'}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-12 h-12 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="max-h-[50vh] overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  style={{ paddingLeft: '2vw' }}
                  onClick={() => handleSelectOption(option)}
                  className={`
                    w-full text-left border-b border-gray-800 last:border-b-0
                    hover:bg-amber-500/20 active:bg-amber-600/30 transition-all h-[8vh]
                    flex items-center ${internalValue === option ? 'bg-amber-500/20 border-l-4 border-amber-500' : ''}
                  `}
                >
                  <span className="text-[1.8vh] text-amber-100">{option}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
