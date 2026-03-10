interface CircularInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export const CircularInput = ({
  label,
  error,
  className = '',
  ref,
  onChange,
  ...props
}: CircularInputProps) => {
  return (
    <div className="flex flex-col items-center w-full">
      {label && <label className="block text-[1.4vh] font-medium text-amber-100">{label}</label>}
      <input
        ref={ref}
        style={{ paddingBottom: '1vh' }}
        className={`
          w-[13vw] h-[13vw] rounded-full text-center text-[3vh] font-bold
          bg-neutral-900/80 text-amber-100 border-2
          focus:outline-none focus:ring-2 focus:ring-amber-500
          ${error ? 'border-red-500' : 'border-amber-600'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-[1.4vh] text-red-400">{error}</p>}
    </div>
  );
};
