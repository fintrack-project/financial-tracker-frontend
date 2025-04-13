import React from 'react';
import './IconButton.css';

interface IconButtonProps {
  type: 'delete' | 'add' | 'remove' | 'confirm' | 'edit' | 'save' ; // Button type
  onClick: () => void; // Click handler
  label?: string; // Optional label for accessibility
  size?: 'small' | 'regular'; // Button size (default is 'regular')
}

const IconButton: React.FC<IconButtonProps> = ({ type, onClick, label, size = 'regular' }) => {
  return (
    <button 
      className={`icon-button ${type}-button ${size === 'small' ? 'icon-button-small' : ''}`}
      onClick={onClick}
      aria-label={label}
    >
      {type === 'delete' && 'x'}
      {type === 'add' && '+'}
      {type === 'remove' && '-'}
      {type === 'confirm' && '✅'}
      {type === 'edit' && '✏️'}
      {type === 'save' && '💾'}
    </button>
  );
};

export default IconButton;