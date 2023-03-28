import SettingSubtitle from './SettingSubtitle';
import Input from '../../base/Input';
import RangeSlider from '../../base/RangeSlider';
import { useEffect } from 'react';

interface SettingSliderProps {
  text: string;
  helpText?: string;
  value: number;
  id: string;
  min: string;
  max: string;
  step: string;
  inputClassName?: string;
  sliderClassName?: string;
  onChange: (value: number) => void;
}

function SettingSlider({
  text,
  helpText,
  value,
  id,
  min,
  max,
  step,
  inputClassName,
  sliderClassName,
  onChange,
}: SettingSliderProps) {
  useEffect(() => {
    if (value < parseFloat(min)) {
      onChange(parseFloat(min));
    } else if (value > parseFloat(max)) {
      onChange(parseFloat(max));
    }
  }, [value, min, max, onChange]);

  return (
    <div className="flex sm:flex-row flex-col sm:justify-between items-start sm:items-center space-y-2 sm:space-y-0">
      <SettingSubtitle text={text} helpText={helpText} />
      <div className="self-start flex flex-row items-center space-x-4">
        <Input
          id={id}
          type={'number'}
          className={`ml-0.5 w-20 ${inputClassName}`}
          value={value.toString()}
          placeholder={value.toString()}
          onChange={e => onChange(parseFloat(e.target.value))}
          step={step}
        />
        <RangeSlider
          id={id}
          value={value}
          onChange={onChange}
          className={`w-36 ml-0.5 ${sliderClassName}`}
          min={min}
          max={max}
          step={step}
        />
      </div>
    </div>
  );
}

export default SettingSlider;
