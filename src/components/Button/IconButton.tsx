import React from 'react';
import './IconButton.css';

interface IconButtonProps {
  type: 'delete' | 'add' | 'remove'; // Button type
  onClick: () => void; // Click handler
  label?: string; // Optional label for accessibility
}

const IconButton: React.FC<IconButtonProps> = ({ type, onClick, label }) => {
  return (
    <button className={`icon-button ${type}-button`} onClick={onClick} aria-label={label}>
      {type === 'delete' && 'x'}
      {type === 'add' && '+'}
      {type === 'remove' && '-'}
    </button>
  );
};

export default IconButton;