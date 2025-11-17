
import React from 'react';
import Loader from './Loader';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  isLoading = false,
  children,
  variant = 'primary',
  icon,
  ...props
}) => {
  const baseClasses = "flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60";
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500/50 shadow-lg shadow-blue-500/20',
    secondary: 'bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-gray-600/50',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader size="sm" />
          <span>جاري التحميل...</span>
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
