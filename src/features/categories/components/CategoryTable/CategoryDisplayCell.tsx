import React from 'react';
import Category from './Category';
import { CategoryDisplayCellProps } from '../../types/CategoryTypes';

const CategoryDisplayCell: React.FC<CategoryDisplayCellProps> = (props) => {
  return (
    <Category {...props}>
      <span>{props.value}</span>
    </Category>
  );
};

export default CategoryDisplayCell;