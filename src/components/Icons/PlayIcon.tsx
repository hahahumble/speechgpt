import React from 'react';
import classNames from 'classnames';

interface PlayIconProps {
  className?: string;
  strokeWidth?: string;
}

const PlayIcon: React.FC<PlayIconProps> = ({ className, strokeWidth }) => {
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
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
};

export default PlayIcon;
