import React from 'react';
import IconButton from '../../Button/IconButton';
import './CategoryCell.css'; // Optional: Add styles for the cell

interface CategoryDisplayCellProps {
  value: string; // The current value of the category or subcategory
  isEditing: boolean; // Whether the cell is in edit mode
  onConfirm: () => void; // Handler for confirming the value
  onEdit: () => void; // Handler for entering edit mode
  onRemove: () => void; // Handler for removing the category or subcategory
  showActions?: boolean; // Optional prop to control action button visibility
}

const CategoryCell: React.FC<CategoryDisplayCellProps> = ({
  value,
  isEditing,
  onConfirm,
  onEdit,
  onRemove,
  showActions = true, // Default to true if not provided
}) => {
  return (
    <div className="category-cell">
      <span>{value}</span>
      {isEditing ? (
        <div className="category-cell-edit">
          {showActions && (
            <div className="actions">
              <IconButton type="confirm" onClick={onConfirm} label="Confirm" size="small" />
              <IconButton type="delete" onClick={onRemove} label="Remove" size="small" />
            </div>
          )}
        </div>
      ) : (
        <div className="category-cell-view">
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

export default CategoryCell;