import React from 'react';

interface SettingTitleProps {
  text: string;
}

function SettingTitle({ text }: SettingTitleProps) {
  return <div className="text-left text-gray-700 font-medium text-lg">{text}</div>;
}

export default SettingTitle;
