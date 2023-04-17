import React from 'react';
import classNames from 'classnames';

interface CheckIconProps {
  className?: string;
  strokeWidth?: string;
}

const CheckIcon: React.FC<CheckIconProps> = ({ className, strokeWidth }) => {
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
      <path stroke="none" d="M0 0h24v24H0z" /> <path d="M5 12l5 5l10 -10" />
    </svg>
  );
};

export default CheckIcon;
