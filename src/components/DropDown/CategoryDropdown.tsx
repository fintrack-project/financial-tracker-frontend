import React from 'react';
import './CategoryDropdown.css'; // Optional CSS for styling

interface CategoryDropdownProps {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  value,
  onChange,
  categories,
}) => {
  return (
    <div className="category-dropdown-container">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="category-dropdown"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryDropdown;