import React from 'react';
import IconButton from '../Button/IconButton';
import './CategoryCell.css'; // Optional: Add styles for the cell

interface CategoryCellProps {
  value: string; // The current value of the category or subcategory
  isEditing: boolean; // Whether the cell is in edit mode
  onChange: (newValue: string) => void; // Handler for input changes
  onConfirm: () => void; // Handler for confirming the value
  onEdit: () => void; // Handler for entering edit mode
  onRemove: () => void; // Handler for removing the category or subcategory
  placeholder?: string; // Placeholder text for the input field
}

const CategoryCell: React.FC<CategoryCellProps> = ({
  value,
  isEditing,
  onChange,
  onConfirm,
  onEdit,
  onRemove,
  placeholder = 'Enter value',
}) => {
  return (
    <div className="category-cell">
      {isEditing ? (
        <div className="category-cell-edit">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
          <div className="actions">
            <IconButton type="confirm" onClick={onConfirm} label="Confirm" size="small" />
            <IconButton type="delete" onClick={onRemove} label="Remove" size="small" />
          </div>
        </div>
      ) : (
        <div className="category-cell-view">
          <span>{value || 'Unnamed'}</span>
          <div className="actions">
            <IconButton type="edit" onClick={onEdit} label="Edit" size="small" />
            <IconButton type="delete" onClick={onRemove} label="Remove" size="small" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryCell;