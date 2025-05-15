import React, { useState } from 'react';
import IconButton from '../../Button/IconButton';
import CategoryColorDropdown from '../../DropDown/CategoryColorDropdown';
import { CategoryProps, CategoryColor } from '../../../types/CategoryTypes';
import './Category.css'; // Optional: Add styles for the cell

const Category: React.FC<CategoryProps> = ({
  value,
  isEditing,
  onChange,
  onConfirm,
  onEdit,
  onRemove,
  children,
  showActions = true, // Default to true if not provided
  isSubcategory = false, // Default to false if not provided
  color: initialColor = CategoryColor.DARK_OLIVE_GREEN,
}) => {
  const [currentColor, setCurrentColor] = useState(initialColor);

  const handleColorSelect = (newColor: CategoryColor) => {
    setCurrentColor(newColor);
    // Update the background color of the category cell
    const categoryCell = document.querySelector('.category-cell-edit');
    if (categoryCell) {
      (categoryCell as HTMLElement).style.backgroundColor = newColor;
    }
    // Call onChange with the current value to trigger a re-render
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className={`category-cell ${isSubcategory ? 'subcategory' : ''}`}>
      {isEditing ? (
        <div 
          className="category-cell-edit"
          style={{ backgroundColor: currentColor }}
        >
          {children}
          {showActions && (
            <div className="actions">
              <IconButton type="confirm" onClick={onConfirm} label="Confirm" size="small" />
              <CategoryColorDropdown
                selectedColor={currentColor}
                onColorSelect={handleColorSelect}
              />
              <IconButton type="delete" onClick={onRemove} label="Remove" size="small" />
            </div>
          )}
        </div>
      ) : (
        <div 
          className="category-cell-view"
          style={{ backgroundColor: currentColor }}
        >
          <span>{value || 'Unnamed'}</span>
          {showActions && (
            <div className="actions">
              <IconButton type="edit" onClick={onEdit} label="Edit" size="small" />
              <IconButton type="delete" onClick={onRemove} label="Remove" size="small" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Category;