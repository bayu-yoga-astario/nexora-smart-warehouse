import React from 'react';

export const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex items-center justify-center p-6">
      <div className={`animate-spin border-cyan-500 border-t-transparent rounded-full ${sizes[size]}`}></div>
    </div>
  );
};
