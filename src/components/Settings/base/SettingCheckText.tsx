import React from 'react';
import OKCircleIcon from '../../Icons/OKCircleIcon';

interface SettingCheckTextProps {
  text: string;
}

function SettingCheckText({ text }: SettingCheckTextProps) {
  return (
    <div className="flex flex-row items-center">
      <OKCircleIcon className="inline-block shrink-0 w-5 h-5 mr-3 text-gray-600" />
      <div className="text-gray-600 text-left">{text}</div>
    </div>
  );
}

export default SettingCheckText;
