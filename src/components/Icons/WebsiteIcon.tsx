import React from 'react';
import classNames from 'classnames';

interface WebsiteIconProps {
  className?: string;
  strokeWidth?: string;
}

const WebsiteIcon: React.FC<WebsiteIconProps> = ({ className, strokeWidth }) => {
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
      <circle cx="12" cy="12" r="10" /> <line x1="2" y1="12" x2="22" y2="12" />{' '}
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
};

export default WebsiteIcon;
