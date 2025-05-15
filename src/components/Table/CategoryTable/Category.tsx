import React from 'react';
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
  color = CategoryColor.DARK_OLIVE_GREEN,
}) => {
  const handleColorSelect = (newColor: CategoryColor) => {
    // Apply the color change immediately
    if (onChange) {
      onChange(value); // Keep the same value but trigger a re-render
    }
    // Update the background color of the category cell
    const categoryCell = document.querySelector('.category-cell-edit');
    if (categoryCell) {
      (categoryCell as HTMLElement).style.backgroundColor = newColor;
    }
  };

  return (
    <div className={`category-cell ${isSubcategory ? 'subcategory' : ''}`}>
      {isEditing ? (
        <div 
          className="category-cell-edit"
          style={{ backgroundColor: color }}
        >
          {children}
          {showActions && (
            <div className="actions">
              <IconButton type="confirm" onClick={onConfirm} label="Confirm" size="small" />
              <CategoryColorDropdown
                selectedColor={color}
                onColorSelect={handleColorSelect}
              />
              <IconButton type="delete" onClick={onRemove} label="Remove" size="small" />
            </div>
          )}
        </div>
      ) : (
        <div 
          className="category-cell-view"
          style={{ backgroundColor: color }}
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