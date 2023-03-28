import SettingSubtitle from './SettingSubtitle';
import Select from '../../base/Select';

interface SettingSelectProps {
  text: string;
  helpText?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  selectClassName?: string;
}

function SettingSelect({
  text,
  helpText,
  options,
  value,
  onChange,
  className,
  selectClassName,
}: SettingSelectProps) {
  return (
    <div className={`flex flex-row justify-between ${selectClassName}`}>
      <SettingSubtitle text={text} helpText={helpText} />
      <Select
        options={options}
        value={value}
        onChange={onChange}
        className={`w-40 mr-0.5 ${className}`}
      />
    </div>
  );
}

export default SettingSelect;
