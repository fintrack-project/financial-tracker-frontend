import React, { useState } from 'react';
import IconButton from '../../../../shared/components/Button/IconButton';
import CategoryColorDropdown from '../../components/DropDown/CategoryColorDropdown';
import { CategoryProps, CategoryColor } from '../../types/CategoryTypes';
import { updateCategoryColor } from '../../services/categoryService';
import { updateSubcategoryColor } from '../../services/subCategoryService';
import { useNotification } from '../../../../shared/contexts/NotificationContext';
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
  selectedColor,
  onSelectedColorChange,
}) => {
  const [currentColor, setCurrentColor] = useState(color || selectedColor || CategoryColor.BLUE);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const { showNotification } = useNotification();

  // Update currentColor when color prop or selected color changes
  React.useEffect(() => {
    if (selectedColor) {
      setCurrentColor(selectedColor);
    } else if (color) {
      setCurrentColor(color);
    }
  }, [color, selectedColor]);

  const handleColorSelect = async (newColor: CategoryColor) => {
    try {
      // If we have a selected color change handler, use it (for new categories)
      if (onSelectedColorChange) {
        onSelectedColorChange(newColor);
        setCurrentColor(newColor);
        return;
      }

      // Otherwise, update the color in the backend (for existing categories)
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
      showNotification('error', 'Failed to update color. Please try again.', 5000);
    }
  };

  const handleMobileToggle = (e: React.MouseEvent) => {
    // Prevent triggering other click handlers
    e.stopPropagation();
    setIsMobileExpanded(!isMobileExpanded);
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
          className={`category-cell-view ${isMobileExpanded ? 'mobile-expanded' : 'mobile-collapsed'}`}
          style={{ backgroundColor: currentColor }}
          onClick={handleMobileToggle}
        >
          <span>{value || 'Unnamed'}</span>
          {showActions && (
            <div className={`actions ${isMobileExpanded ? 'mobile-expanded' : 'mobile-collapsed'}`}>
              <IconButton type="edit" onClick={onEdit} label="Edit" size="small" />
              <CategoryColorDropdown
                selectedColor={currentColor}
                onColorSelect={handleColorSelect}
              />
              <IconButton type="delete" onClick={onRemove} label="Remove" size="small" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Category;