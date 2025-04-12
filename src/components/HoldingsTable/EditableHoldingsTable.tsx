import React, { useState } from 'react';
import { useHoldingsData } from '../../hooks/useHoldingsData';
import IconButton  from '../Button/IconButton';
import './HoldingsTable.css'; // Reuse the CSS from HoldingsTable

interface EditableHoldingsTableProps {
  accountId: string | null;
}

const EditableHoldingsTable: React.FC<EditableHoldingsTableProps> = ({ accountId }) => {
  const { holdings, marketData, loading } = useHoldingsData(accountId);
  const [categories, setCategories] = useState<string[]>([]);

  const handleAddCategory = () => {
    if (categories.length < 3) {
      setCategories([...categories, '']); // Add an empty category for inline editing
    }
  };

  const handleRemoveCategory = (index: number) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    setCategories(updatedCategories);
  };

  const handleCategoryNameChange = (index: number, newName: string) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = newName;
    setCategories(updatedCategories);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

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
            {categories.map((category, index) => (
              <th key={index}>
                <div className="category-header">
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => handleCategoryNameChange(index, e.target.value)}
                    placeholder="Category Name"
                  />
                  <IconButton
                    type="remove"
                    onClick={() => handleRemoveCategory(index)}
                    label="Remove Category"
                  />
                </div>
              </th>
            ))}
            {categories.length < 3 && (
              <th>
                <IconButton type="add" onClick={handleAddCategory} label="Add Category" />
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding, index) => {
            const assetData = marketData.find((data) => data.assetName === holding.assetName);
            const totalValue = assetData
              ? (assetData.price * holding.totalBalance).toFixed(2)
              : 'Loading...';

            return (
              <tr key={index}>
                <td>{holding.assetName}</td>
                <td>{holding.totalBalance.toLocaleString()}</td>
                <td>{holding.unit}</td>
                <td>{assetData?.price?.toLocaleString() || 'Loading...'}</td>
                <td>{totalValue}</td>
                {categories.map((category) => (
                  <td key={category}>
                    <input type="text" placeholder={`Enter ${category}`} />
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