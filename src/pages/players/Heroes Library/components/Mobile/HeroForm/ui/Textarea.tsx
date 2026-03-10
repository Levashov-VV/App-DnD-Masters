interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  ref?: React.Ref<HTMLTextAreaElement>;
}

export const Textarea = ({ label, error, className = '', ref, ...props }: TextareaProps) => {
  return (
    <div className="w-full">
      {label && <label className="block text-[1.6vh] font-medium text-amber-100 ">{label}</label>}
      <textarea
        ref={ref}
        className={`
          w-full bg-neutral-900/80 rounded-lg text-amber-100
          focus:outline-none focus:ring-2 focus:ring-purple-500
          resize-none
          ${error ? 'border-red-500' : 'border-gray-600'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-[1.4vh] text-red-400">{error}</p>}
    </div>
  );
};
