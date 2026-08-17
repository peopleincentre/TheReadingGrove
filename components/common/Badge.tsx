import React, { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, className }) => {
  const defaultClasses = 'inline-block px-2 py-1 text-xs font-semibold rounded-full';
  const combinedClasses = `${defaultClasses} ${className || 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'}`;
  
  return (
    <span className={combinedClasses}>
      {children}
    </span>
  );
};

export default Badge;