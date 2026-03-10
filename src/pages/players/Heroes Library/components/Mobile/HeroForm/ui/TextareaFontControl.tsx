import { useState } from 'react';

interface TextareaWithFontControlProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  ref?: React.Ref<HTMLTextAreaElement>;
  defaultFontSize?: number;
  minFontSize?: number;
  maxFontSize?: number;
}

export const TextareaWithFontControl = ({
  label,
  error,
  style = {},
  className = '',
  ref,
  defaultFontSize = 14,
  minFontSize = 10,
  maxFontSize = 24,
  ...props
}: TextareaWithFontControlProps) => {
  const [fontSize, setFontSize] = useState(defaultFontSize);

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, maxFontSize));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, minFontSize));
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {label && (
          <label className="relative left-[0.2vw] block text-[2vh] font-medium text-amber-100">
            {label}
          </label>
        )}
        <div className="relative right-[0.5vw] flex items-center gap-[0.5vw]">
          <button
            type="button"
            onClick={decreaseFontSize}
            className="w-[2vh] h-[2vh] flex items-center justify-center bg-amber-600 hover:bg-amber-500 text-stone-900 rounded font-bold transition-colors"
            title="Уменьшить шрифт"
          >
            −
          </button>
          <button
            type="button"
            onClick={increaseFontSize}
            className="w-[2vh] h-[2vh] flex items-center justify-center bg-amber-600 hover:bg-amber-500 text-stone-900 rounded font-bold transition-colors"
            title="Увеличить шрифт"
          >
            +
          </button>
        </div>
      </div>
      <textarea
        ref={ref}
        style={{ ...style, fontSize: `${fontSize}px` }}
        className={`
          w-full bg-neutral-900/80 rounded-lg text-amber-100
          focus:outline-none 
          resize-none
          ${error ? 'border-red-500' : 'border-none'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-[1.4vh] text-red-400">{error}</p>}
    </div>
  );
};
