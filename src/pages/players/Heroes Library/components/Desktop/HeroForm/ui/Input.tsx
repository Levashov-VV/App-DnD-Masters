interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export const Input = ({ label, error, className = '', ref, ...props }: InputProps) => {
  return (
    <div className="w-full">
      {label && <label className="block text-[1.6vh] font-medium text-amber-100">{label}</label>}
      <input
        ref={ref}
        className={`
          w-full bg-neutral-900/80 rounded-lg text-amber-100 text-[1.6vh]
          focus:outline-none focus:ring-2 focus:ring-amber-500
          ${error ? 'border-red-500' : 'border-amber-600'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-[1vh] text-red-400">{error}</p>}
    </div>
  );
};
