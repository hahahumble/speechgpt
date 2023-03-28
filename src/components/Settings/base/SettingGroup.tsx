import React from 'react';

interface SettingGroupProps {
  children: React.ReactNode;
}
function SettingGroup({ children }: SettingGroupProps) {
  return <div className="flex flex-col space-y-2">{children}</div>;
}

export default SettingGroup;
