import React from 'react';
import classNames from 'classnames';

interface ArrowUpIconProps {
  className?: string;
  strokeWidth?: string;
}

const ArrowUpIcon: React.FC<ArrowUpIconProps> = ({ className, strokeWidth }) => {
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
      <path stroke="none" d="M0 0h24v24H0z" /> <line x1="12" y1="5" x2="12" y2="19" />{' '}
      <line x1="18" y1="11" x2="12" y2="5" /> <line x1="6" y1="11" x2="12" y2="5" />
    </svg>
  );
};

export default ArrowUpIcon;
