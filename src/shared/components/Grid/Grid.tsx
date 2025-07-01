import React from 'react';
import './Grid.css';

interface GridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Grid: React.FC<GridProps> = ({
  children,
  columns = 3,
  gap = 'md',
  className = ''
}) => {
  return (
    <div 
      className={`grid grid-cols-${columns} gap-${gap} ${className}`}
    >
      {children}
    </div>
  );
}; 