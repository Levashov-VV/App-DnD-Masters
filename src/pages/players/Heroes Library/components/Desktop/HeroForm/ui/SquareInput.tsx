import React from 'react';

interface SquareInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const SquareInput = React.forwardRef<HTMLInputElement, SquareInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col items-center w-full">
        {label && (
          <label className="block text-[1.6vh] font-medium text-amber-100 mb-[0.5vh]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-[8vw] h-[6vh] rounded-lg text-center text-[2.5vh] font-bold
            bg-neutral-900/80 text-amber-100 border-2
            focus:outline-none focus:ring-2 focus:ring-amber-500
            ${error ? 'border-red-500' : 'border-amber-600'}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-[1.2vh] text-red-400">{error}</p>}
      </div>
    );
  }
);

SquareInput.displayName = 'SquareInput';
