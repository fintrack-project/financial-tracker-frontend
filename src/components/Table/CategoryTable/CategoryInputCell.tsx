import React from 'react';
import Category from './Category';

interface CategoryInputCellProps {
  value: string;
  isEditing: boolean;
  onChange: (newValue: string) => void;
  onConfirm: () => void;
  onEdit: () => void;
  onRemove: () => void;
  placeholder?: string;
  showActions?: boolean; // Optional prop to control action button visibility
  isSubcategory?: boolean; // Whether this is a subcategory cell
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
  isSubcategory = false, // Default to false if not provided
}) => {
  return (
    <Category
      value={value}
      isEditing={isEditing}
      onConfirm={onConfirm}
      onEdit={onEdit}
      onRemove={onRemove}
      showActions={showActions}
      isSubcategory={isSubcategory}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </Category>
  );
};

export default CategoryInputCell;