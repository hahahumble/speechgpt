interface SelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function Select({ options, value, onChange, className }: SelectProps) {
  return (
    <select
      className={`text-gray-700 bg-white border-2 border-gray-200 rounded-md shadow-sm py-1 pl-3 pr-5 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${className}`}
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export default Select;
