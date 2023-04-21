import React from 'react';
import classNames from 'classnames';

interface PlusIconProps {
  className?: string;
  strokeWidth?: string;
}

const PlusIcon: React.FC<PlusIconProps> = ({ className, strokeWidth }) => {
  return (
    <svg
      className={classNames('', className)}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth || '2'}
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" /> <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
};

export default PlusIcon;
