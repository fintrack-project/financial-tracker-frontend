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
}

const CategoryInputCell: React.FC<CategoryInputCellProps> = ({
  value,
  isEditing,
  onChange,
  onConfirm,
  onEdit,
  onRemove,
  placeholder = 'Enter value',
}) => {
  return (
    <CategoryCell
      value={value}
      isEditing={isEditing}
      onConfirm={onConfirm}
      onEdit={onEdit}
      onRemove={onRemove}
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