import React from 'react';

export const Card = ({
  children,
  accent = 'none', // 'red', 'green', 'amber', 'none'
  hover = true,
  className = '',
  ...props
}) => {
  const accentClasses = {
    red: 'border-l-4 border-l-gov-red',
    green: 'border-l-4 border-l-gov-green',
    amber: 'border-l-4 border-l-gov-amber',
    none: '',
  };

  const hoverClass = hover ? 'card-hover-elevate' : 'shadow-xs';

  return (
    <div
      className={`bg-white p-6 rounded-2xl border border-gov-border ${accentClasses[accent] || ''} ${hoverClass} overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
