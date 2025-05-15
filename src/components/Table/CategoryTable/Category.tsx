import React from 'react';
import IconButton from '../../Button/IconButton';
import './Category.css'; // Optional: Add styles for the cell

interface CategoryProps {
  value: string; // The current value of the category or subcategory
  isEditing: boolean; // Whether the cell is in edit mode
  onChange?: (newValue: string) => void; // Handle value changes
  onConfirm: () => void; // Handle confirm action
  onEdit: () => void; // Handle edit action
  onRemove: () => void; // Handle remove action
  children?: React.ReactNode; // Optional children components
  showActions?: boolean; // Control action button visibility
  isSubcategory?: boolean; // Whether this is a subcategory cell
}

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
}) => {
  return (
    <div className={`category-cell ${isSubcategory ? 'subcategory' : ''}`}>
      {isEditing ? (
        <div className="category-cell-edit">
          {children}
          {showActions && (
            <div className="actions">
              <IconButton type="confirm" onClick={onConfirm} label="Confirm" size="small" />
              <IconButton type="delete" onClick={onRemove} label="Remove" size="small" />
            </div>
          )}
        </div>
      ) : (
        <div className="category-cell-view">
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