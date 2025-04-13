import React from 'react';
import IconButton from '../Button/IconButton';

interface CategoryColumnProps {
  categoryName: string
  isEditing: boolean;
  onCategoryNameChange: (newName: string) => void;
  onConfirm: () => void;
  onEdit: () => void;
  onRemove: () => void;
}

const CategoryColumn: React.FC<CategoryColumnProps> = ({
  categoryName,
  isEditing,
  onCategoryNameChange,
  onConfirm,
  onEdit,
  onRemove,
}) => {
  return (
    <>
      <th>
        <div className="category-header">
          {isEditing ? (
            <>
              <span>
                <input
                type="text"
                value={categoryName}
                onChange={(e) => onCategoryNameChange(e.target.value)}
                placeholder="Category Name"
                />
                <IconButton type="confirm" onClick={onConfirm} label="Confirm Category" size="small"/>
                <IconButton type="delete" onClick={onRemove} label="Remove Category" size="small"/>
              </span>
            </>
          ) : (
            <>
              <span>
                {categoryName || 'Unnamed Category'}
                <IconButton type="edit" onClick={onEdit} label="Edit Category" size="small"/>
                <IconButton type="delete" onClick={onRemove} label="Remove Category" size="small"/>
              </span>
            </>
          )}
          
        </div>
      </th>
    </>
  );
};

export default CategoryColumn;