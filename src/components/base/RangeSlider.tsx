interface RangeSliderProps {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  className?: string;
  min?: number | string;
  max?: number | string;
  step?: string | number;
}

function RangeSlider({ id, value, onChange, className, min, max, step }: RangeSliderProps) {
  return (
    <input
      id={id}
      name={id}
      type="range"
      value={value}
      onChange={e => onChange(parseFloat(e.target.value))}
      className={`h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-500 hover:accent-indigo-500 active:accent-indigo-800 ${className}`}
      min={min}
      max={max}
      step={step}
    />
  );
}

export default RangeSlider;
