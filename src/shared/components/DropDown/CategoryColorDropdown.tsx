import React, { useState, useRef, useEffect } from 'react';
import { CategoryColor } from '../../../features/categories/types/CategoryTypes';
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      console.log('Click outside detected');
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        console.log('Closing dropdown');
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleColorSelectorClick = (e: React.MouseEvent) => {
    console.log('Color selector clicked');
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
    console.log('Dropdown is now:', !isOpen ? 'open' : 'closed');
  };

  const colorOptions = Object.values(CategoryColor);

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
        <div className="color-options">
          {colorOptions.map((color) => (
            <div
              key={color}
              className="color-option"
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
            >
              <div 
                className="color-circle" 
                style={{ backgroundColor: color }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryColorDropdown; 