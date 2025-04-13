import React, { useState } from 'react';
import { useHoldingsData } from '../../hooks/useHoldingsData';
import IconButton  from '../Button/IconButton';
import './HoldingsTable.css'; // Reuse the CSS from HoldingsTable

interface EditableHoldingsTableProps {
  accountId: string | null;
}

const EditableHoldingsTable: React.FC<EditableHoldingsTableProps> = ({ accountId }) => {
  const { holdings, marketData, loading } = useHoldingsData(accountId);
  const [categories, setCategories] = useState<string[]>([]); // Manage categories as state
  const [subcategories, setSubcategories] = useState<string[][]>([]); // Manage subcategories as state

  const handleAddCategory = () => {
    if (categories.length < 3) {
      setCategories([...categories, '']); // Add an empty category
      setSubcategories([...subcategories, Array(holdings.length).fill('')]); // Add empty subcategories for each row
    }
  };

  const handleCategoryChange = (index: number, newCategory: string) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = newCategory;
    setCategories(updatedCategories);
  };

  const handleSubcategoryChange = (categoryIndex: number, rowIndex: number, newSubcategory: string) => {
    const updatedSubcategories = [...subcategories];
    updatedSubcategories[categoryIndex][rowIndex] = newSubcategory;
    setSubcategories(updatedSubcategories);
  };

  return (
    <div className="holdings-table-container">
      <table className="holdings-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Asset Unit</th>
            <th>Price (USD)</th>
            <th>Total Value (USD)</th>
            {categories.map((category, categoryIndex) => (
              <th key={categoryIndex}>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(categoryIndex, e.target.value)}
                >
                  <option value="">Select Category</option>
                  <option value="Category 1">Category 1</option>
                  <option value="Category 2">Category 2</option>
                  <option value="Category 3">Category 3</option>
                </select>
              </th>
            ))}
            {categories.length < 3 && (
              <th>
                <IconButton type="add" onClick={handleAddCategory} label="Add Column" />
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding, rowIndex) => {
            const assetData = marketData.find((data) => data.assetName === holding.assetName);
            const totalValue = assetData
              ? (assetData.price * holding.totalBalance).toFixed(2)
              : 'Loading...';

            return (
              <tr key={rowIndex}>
                <td>{holding.assetName}</td>
                <td>{holding.totalBalance.toLocaleString()}</td>
                <td>{holding.unit}</td>
                <td>{assetData?.price?.toLocaleString() || 'Loading...'}</td>
                <td>{totalValue}</td>
                {categories.map((_, categoryIndex) => (
                  <td key={`${rowIndex}-${categoryIndex}`}>
                    <select
                      value={subcategories[categoryIndex]?.[rowIndex] || ''}
                      onChange={(e) =>
                        handleSubcategoryChange(categoryIndex, rowIndex, e.target.value)
                      }
                    >
                      <option value="">Select Subcategory</option>
                      <option value="Subcategory 1">Subcategory 1</option>
                      <option value="Subcategory 2">Subcategory 2</option>
                      <option value="Subcategory 3">Subcategory 3</option>
                    </select>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EditableHoldingsTable;