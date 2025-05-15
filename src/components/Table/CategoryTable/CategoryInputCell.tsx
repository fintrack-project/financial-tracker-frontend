import React from 'react';
import Category from './Category';
import { CategoryInputCellProps } from '../../../types/CategoryTypes';

const CategoryInputCell: React.FC<CategoryInputCellProps> = ({
  value,
  onChange,
  placeholder = 'Enter value',
  ...props
}) => {
  return (
    <Category value={value} {...props}>
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