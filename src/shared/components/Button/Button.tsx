import React from 'react';
import './Button.css';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string; // Optional additional class names
}

const Button: React.FC<ButtonProps> = ({ onClick, children, type = 'button', className = '' }) => {
  return (
    <button className={`button ${className}`} onClick={onClick} type={type}>
      {children}
    </button>
  );
};

export default Button;