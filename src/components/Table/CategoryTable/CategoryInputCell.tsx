import React from 'react';
import CategoryCell from './CategoryCell';

interface CategoryInputCellProps {
  value: string;
  isEditing: boolean;
  onChange: (newValue: string) => void;
  onConfirm: () => void;
  onEdit: () => void;
  onRemove: () => void;
  placeholder?: string;
  showActions?: boolean; // Optional prop to control action button visibility
  isSubcategory?: boolean;
}

const CategoryInputCell: React.FC<CategoryInputCellProps> = ({
  value,
  isEditing,
  onChange,
  onConfirm,
  onEdit,
  onRemove,
  placeholder = 'Enter value',
  showActions = true, // Default to true if not provided
  isSubcategory = false,
}) => {
  return (
    <CategoryCell
      value={value}
      isEditing={isEditing}
      onConfirm={onConfirm}
      onEdit={onEdit}
      onRemove={onRemove}
      showActions={showActions} // Pass showActions prop to CategoryCell
      isSubcategory={isSubcategory}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </CategoryCell>
  );
};

export default CategoryInputCell;