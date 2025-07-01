import React from 'react';
import Category from './Category';
import { CategoryDropdownCellProps } from '../../types/CategoryTypes';

const CategoryDropdownCell: React.FC<CategoryDropdownCellProps> = ({
  options,
  onChange,
  value,
  ...props
}) => {
  return (
    <Category value={value} {...props}>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select an option</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Category>
  );
};

export default CategoryDropdownCell;