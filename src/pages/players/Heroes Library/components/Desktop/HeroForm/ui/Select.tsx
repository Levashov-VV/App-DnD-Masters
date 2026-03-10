interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: string[];
  placeholder: string;
  ref?: React.Ref<HTMLSelectElement>;
}

export const Select = ({
  label,
  error,
  options,
  placeholder,
  className = '',
  ref,
  onChange,
  ...props
}: SelectProps) => {
  return (
    <div className="w-full">
      {label && <label className="block text-[1.6vh] font-medium text-amber-100">{label}</label>}
      <select
        ref={ref}
        {...props}
        onChange={onChange}
        className={`
          w-full bg-neutral-900/80 rounded-lg text-amber-100 text-[1.6vh]
          focus:outline-none focus:ring-2 focus:ring-amber-500
          ${error ? 'border-red-500' : 'border-amber-600'}
          ${className}
        `}
        {...props}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="text-[1.4vh] text-red-400">{error}</p>}
    </div>
  );
};
