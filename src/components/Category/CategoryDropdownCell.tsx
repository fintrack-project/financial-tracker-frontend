import React from 'react';
import CategoryCell from './CategoryCell';

interface CategoryDropdownCellProps {
  value: string;
  isEditing: boolean;
  options: string[]; // Dropdown options
  onChange: (newValue: string) => void;
  onConfirm: () => void;
  onEdit: () => void;
  onRemove: () => void;
  showActions?: boolean; // Optional prop to control action button visibility
}

const CategoryDropdownCell: React.FC<CategoryDropdownCellProps> = ({
  value,
  isEditing,
  options,
  onChange,
  onConfirm,
  onEdit,
  onRemove,
  showActions = true, // Default to true if not provided
}) => {
  return (
    <CategoryCell
      value={value}
      isEditing={isEditing}
      onConfirm={onConfirm}
      onEdit={onEdit}
      onRemove={onRemove}
      showActions={showActions} // Pass showActions prop to CategoryCell
    >
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select an option</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </CategoryCell>
  );
};

export default CategoryDropdownCell;