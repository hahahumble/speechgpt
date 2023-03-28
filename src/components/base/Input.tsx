interface InputProps {
  id: string;
  type: string;
  className?: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  step?: string;
}

function Input({ id, type, className, value, placeholder, onChange, step }: InputProps) {
  return (
    <input
      id={id}
      type={type}
      className={`focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-base text-gray-700 py-1 px-3 border-2 shadow-sm block border-gray-200 rounded-md ${className}`}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      step={step}
      spellCheck={false}
    ></input>
  );
}

export default Input;
