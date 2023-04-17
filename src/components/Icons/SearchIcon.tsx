import React from 'react';
import classNames from 'classnames';

interface SearchIconProps {
  className?: string;
  strokeWidth?: string;
}

const SearchIcon: React.FC<SearchIconProps> = ({ className, strokeWidth }) => {
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
      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
};

export default SearchIcon;
