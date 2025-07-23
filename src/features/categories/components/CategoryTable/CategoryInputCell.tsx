import React from 'react';
import Category from './Category';
import { CategoryInputCellProps } from '../../types/CategoryTypes';

const CategoryInputCell: React.FC<CategoryInputCellProps> = ({
  value,
  onChange,
  placeholder = 'Enter value',
  color,
  selectedColor,
  onSelectedColorChange,
  ...props
}) => {
  return (
    <Category 
      value={value} 
      color={color} 
      selectedColor={selectedColor}
      onSelectedColorChange={onSelectedColorChange}
      {...props}
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