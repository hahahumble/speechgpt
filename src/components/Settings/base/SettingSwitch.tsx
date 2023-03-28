import SettingSubtitle from './SettingSubtitle';
import Toggle from '../../base/Toggle';

interface SettingSwitchProps {
  text: string;
  helpText?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

function SettingSwitch({ text, helpText, checked, onChange, className }: SettingSwitchProps) {
  return (
    <div className="flex flex-row justify-between items-center">
      <SettingSubtitle text={text} helpText={helpText} />
      <Toggle checked={checked} onChange={onChange} className={className} />
    </div>
  );
}

export default SettingSwitch;
