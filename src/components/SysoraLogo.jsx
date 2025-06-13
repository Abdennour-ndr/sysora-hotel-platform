import React from 'react';
import sysoraIcon from '../assets/sysora-icon.svg';

const SysoraLogo = ({ 
  size = 'md', 
  showText = true, 
  className = '', 
  textColor = 'text-gray-900',
  iconOnly = false 
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  };

  const textSizeClasses = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
    '2xl': 'text-3xl'
  };

  if (iconOnly) {
    return (
      <img 
        src={sysoraIcon} 
        alt="Sysora" 
        className={`${sizeClasses[size]} ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <img 
        src={sysoraIcon} 
        alt="Sysora" 
        className={sizeClasses[size]}
      />
      {showText && (
        <span className={`font-bold ${textSizeClasses[size]} ${textColor}`}>
          Sysora
        </span>
      )}
    </div>
  );
};

export default SysoraLogo;
