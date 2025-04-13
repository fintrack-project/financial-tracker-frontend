import React from 'react';
import './IconButton.css';

// Import the icon PNG files
import deleteIcon from '../../assets/icons/delete.png';
import addIcon from '../../assets/icons/add.png';
import removeIcon from '../../assets/icons/remove.png';
import confirmIcon from '../../assets/icons/confirm.png';
import editIcon from '../../assets/icons/edit.png';
import saveIcon from '../../assets/icons/save.png';

interface IconButtonProps {
  type: 'delete' | 'add' | 'remove' | 'confirm' | 'edit' | 'save' ; // Button type
  onClick: () => void; // Click handler
  label?: string; // Optional label for accessibility
  size?: 'small' | 'regular' | 'large'; // Button size (default is 'regular')
}

const IconButton: React.FC<IconButtonProps> = ({ type, onClick, label, size = 'regular' }) => {
  // Map button types to their corresponding icons
  const iconMap: { [key: string]: string } = {
    delete: deleteIcon,
    add: addIcon,
    remove: removeIcon,
    confirm: confirmIcon,
    edit: editIcon,
    save: saveIcon,
  };

  return (
    <button 
      className={`icon-button ${size === 'small' ? 'icon-button-small' : ''} ${
        size === 'large' ? 'icon-button-large' : ''
      }`}
      onClick={onClick}
      aria-label={label}
    >
      <img src={iconMap[type]} alt={label || type} className="icon-image" />
    </button>
  );
};

export default IconButton;