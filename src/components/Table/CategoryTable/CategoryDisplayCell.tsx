import React from 'react';
import CategoryCell from './CategoryCell';

interface CategoryDisplayCellProps {
  value: string;
  isEditing: boolean;
  onConfirm: () => void;
  onEdit: () => void;
  onRemove: () => void;
  showActions?: boolean;
  isSubcategory?: boolean;
}

const CategoryDisplayCell: React.FC<CategoryDisplayCellProps> = ({
  value,
  isEditing,
  onConfirm,
  onEdit,
  onRemove,
  showActions = true,
  isSubcategory = false,
}) => {
  return (
    <CategoryCell
      value={value}
      isEditing={isEditing}
      onConfirm={onConfirm}
      onEdit={onEdit}
      onRemove={onRemove}
      showActions={showActions}
      isSubcategory={isSubcategory}
    >
      <span>{value}</span>
    </CategoryCell>
  );
};

export default CategoryDisplayCell;