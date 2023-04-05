import React from 'react';
import WarningIcon from '../../Icons/WarningIcon';

interface SettingWarningTextProps {
  text: string;
}

function SettingWarningText({ text }: SettingWarningTextProps) {
  return (
    <div className="flex flex-row items-center">
      <WarningIcon className="inline-block shrink-0 w-5 h-5 mr-3 text-gray-600" />
      <div className="text-gray-600 text-left">{text}</div>
    </div>
  );
}

export default SettingWarningText;
