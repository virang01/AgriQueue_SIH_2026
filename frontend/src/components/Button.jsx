import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses =
    'font-bold font-heading rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-xs sm:text-sm',
    lg: 'px-7 py-3.5 text-sm sm:text-base',
  };

  const variantClasses = {
    primary: 'btn-primary-red shadow-xs',
    secondary: 'btn-secondary-red shadow-xs',
    success: 'bg-gov-green hover:bg-green-800 text-white shadow-xs',
    outline: 'bg-white border border-gov-border text-gov-text hover:bg-gov-gray shadow-xs',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
