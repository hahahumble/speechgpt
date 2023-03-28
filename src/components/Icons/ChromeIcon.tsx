import React from 'react';
import classNames from 'classnames';

interface ChromeIconProps {
  className?: string;
  strokeWidth?: string;
}

const ChromeIcon: React.FC<ChromeIconProps> = ({ className, strokeWidth }) => {
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
      <path stroke="none" d="M0 0h24v24H0z" />
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="9" x2="20.4" y2="9" />
      <line x1="12" y1="9" x2="20.4" y2="9" transform="rotate(120 12 12)" />
      <line x1="12" y1="9" x2="20.4" y2="9" transform="rotate(240 12 12)" />
    </svg>
  );
};

export default ChromeIcon;
