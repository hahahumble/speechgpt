import TextareaAutosize from 'react-textarea-autosize';
import { useState } from 'react';

type TextareaProps = {
  value?: string;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  onKeyDown?: any;
  maxRows?: number;
};

export default function Textarea({
  value,
  className,
  onChange,
  placeholder,
  onKeyDown,
  maxRows,
}: TextareaProps) {
  const [inputValue, setInputValue] = useState(value || '');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);

    if (onChange) {
      onChange(event);
    }
  };

  return (
    <TextareaAutosize
      className={`focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 border-2 shadow-sm block text-base text-gray-700 py-1 px-3 border-gray-200 rounded-md ${className}`}
      placeholder={placeholder}
      maxRows={maxRows}
      value={inputValue}
      onChange={handleChange}
      onKeyDown={onKeyDown}
    />
  );
}
