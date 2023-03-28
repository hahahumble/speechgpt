import SettingSubtitle from './SettingSubtitle';
import Input from '../../base/Input';

interface SettingInputProps {
  text: string;
  helpText?: string;
  id: string;
  type: string;
  className?: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

function SettingInput({
  text,
  helpText,
  id,
  type,
  className,
  value,
  placeholder,
  onChange,
}: SettingInputProps) {
  return (
    <div className={'flex flex-col space-y-2'}>
      <SettingSubtitle text={text} helpText={helpText} />
      <Input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`h-9 mx-0.5 ${className}`}
        placeholder={placeholder}
      />
    </div>
  );
}

export default SettingInput;
