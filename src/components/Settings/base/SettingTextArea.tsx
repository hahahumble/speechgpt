import Textarea from '../../base/Textarea';
import SettingSubtitle from './SettingSubtitle';

interface SettingTextAreaProps {
  text: string;
  helpText?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  maxRows?: number;
}

function SettingTextArea({
  text,
  helpText,
  value,
  onChange,
  className,
  placeholder,
  maxRows,
}: SettingTextAreaProps) {
  return (
    <div className={'flex flex-col space-y-2'}>
      <SettingSubtitle text={text} helpText={helpText} />
      <Textarea
        value={value}
        className={`h-9 ml-0.5 resize-none ${className}`}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        maxRows={maxRows}
      />
    </div>
  );
}

export default SettingTextArea;
