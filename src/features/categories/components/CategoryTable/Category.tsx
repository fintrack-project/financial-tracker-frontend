import React, { useState } from 'react';
import IconButton from '../../../../shared/components/Button/IconButton';
import CategoryColorDropdown from '../../../../shared/components/DropDown/CategoryColorDropdown';
import { CategoryProps, CategoryColor } from '../../types/CategoryTypes';
import { updateCategoryColor } from '../../services/categoryService';
import { updateSubcategoryColor } from '../../services/subCategoryService';
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
  color,
  accountId,
  categoryName,
  resetHasFetched,
}) => {
  const [currentColor, setCurrentColor] = useState(color || CategoryColor.BLUE);

  // Update currentColor when color prop changes
  React.useEffect(() => {
    if (color) {
      setCurrentColor(color);
    }
  }, [color]);

  const handleColorSelect = async (newColor: CategoryColor) => {
    try {
      if (accountId && value) {
        if (isSubcategory && categoryName) {
          // Update subcategory color
          await updateSubcategoryColor(accountId, categoryName, value, newColor);
        } else {
          // Update category color
          await updateCategoryColor(accountId, value, newColor);
        }
        setCurrentColor(newColor);
        
        // Call resetHasFetched to trigger a refresh of the data
        if (resetHasFetched) {
          resetHasFetched();
        }

        // Call onChange with the current value to trigger a re-render
        if (onChange) {
          onChange(value);
        }
      }
    } catch (error) {
      console.error('Error updating color:', error);
      alert('Failed to update color. Please try again.');
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