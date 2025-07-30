import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CategoryColor } from '../../types/CategoryTypes';
import './CategoryColorDropdown.css';

interface CategoryColorDropdownProps {
  selectedColor: CategoryColor;
  onColorSelect: (color: CategoryColor) => void;
}

const CategoryColorDropdown: React.FC<CategoryColorDropdownProps> = ({
  selectedColor,
  onColorSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Position the dropdown menu fixed in the viewport
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      console.log('Dropdown rect:', rect);
      const style = {
        position: 'fixed' as const,
        top: rect.bottom + 4, // 4px gap
        left: rect.left,
        minWidth: rect.width,
        zIndex: 9999,
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      };
      console.log('Menu style:', style);
      setMenuStyle(style);
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      // Don't close if clicking on the selector or menu
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  const handleColorSelectorClick = (e: React.MouseEvent) => {
    console.log('Color selector clicked');
    e.preventDefault();
    e.stopPropagation();
    const newState = !isOpen;
    setIsOpen(newState);
    console.log('Dropdown is now:', newState ? 'open' : 'closed');
  };

  const colorOptions = Object.values(CategoryColor);

  // Dropdown menu content
  const menu = (
    <div style={menuStyle} ref={menuRef}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
        {colorOptions.map((color) => (
          <div
            key={color}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: color,
              border: '1px solid #ccc',
              cursor: 'pointer'
            }}
            onClick={() => {
              console.log('Color option clicked:', color);
              onColorSelect(color);
              setIsOpen(false);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                console.log('Color option key pressed:', e.key, 'for color:', color);
                e.preventDefault();
                onColorSelect(color);
                setIsOpen(false);
              }
            }}
            aria-label={`Select ${color} color`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="category-color-dropdown" ref={dropdownRef}>
      <div
        className="color-selector"
        onClick={handleColorSelectorClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            console.log('Color selector key pressed:', e.key);
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        aria-label="Select color"
      >
        <div className="selected-color">
          <div 
            className="color-circle" 
            style={{ backgroundColor: selectedColor }}
          />
        </div>
      </div>
      {isOpen && (
        <>
          {console.log('Rendering Portal with menu:', menu)}
          {ReactDOM.createPortal(menu, document.body)}
        </>
      )}
    </div>
  );
};

export default CategoryColorDropdown; 