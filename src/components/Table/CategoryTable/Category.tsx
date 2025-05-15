import React from 'react';
import IconButton from '../../Button/IconButton';
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
  color = CategoryColor.SIENNA,
}) => {
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