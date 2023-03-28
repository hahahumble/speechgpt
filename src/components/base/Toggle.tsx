import { Switch } from '@headlessui/react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  description?: string;
}

function Toggle({ checked, onChange, className, description }: ToggleProps) {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      className={`${
        checked ? 'bg-indigo-500' : 'bg-gray-200'
      } relative inline-flex h-6 w-11 items-center rounded-full ${className}`}
    >
      <span className="sr-only">{description}</span>
      <span
        className={`${
          checked ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </Switch>
  );
}

export default Toggle;
