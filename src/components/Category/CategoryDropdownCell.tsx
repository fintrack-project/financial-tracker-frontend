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
}

const CategoryDropdownCell: React.FC<CategoryDropdownCellProps> = ({
  value,
  isEditing,
  options,
  onChange,
  onConfirm,
  onEdit,
  onRemove,
}) => {
  return (
    <CategoryCell
      value={value}
      isEditing={isEditing}
      onConfirm={onConfirm}
      onEdit={onEdit}
      onRemove={onRemove}
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