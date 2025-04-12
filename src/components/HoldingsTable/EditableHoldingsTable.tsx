import React, { useState } from 'react';
import { useHoldingsData } from '../../hooks/useHoldingsData';
import './HoldingsTable.css'; // Reuse the CSS from HoldingsTable

interface EditableHoldingsTableProps {
  accountId: string | null;
}

const EditableHoldingsTable: React.FC<EditableHoldingsTableProps> = ({ accountId }) => {
  const { holdings, marketData, loading } = useHoldingsData(accountId);
  const [categories, setCategories] = useState<string[]>([]);

  const handleAddCategory = () => {
    if (categories.length < 3) {
      const newCategory = prompt('Enter category name:');
      if (newCategory) {
        setCategories([...categories, newCategory]);
      }
    }
  };

  const handleRemoveCategory = (category: string) => {
    setCategories(categories.filter((cat) => cat !== category));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="holdings-table-container">
      <div className="controls">
        <button onClick={handleAddCategory}>Add Category</button>
      </div>
      <table className="holdings-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Asset Unit</th>
            <th>Price (USD)</th>
            <th>Total Value (USD)</th>
            {categories.map((category) => (
              <th key={category}>
                {category} <button onClick={() => handleRemoveCategory(category)}>X</button>
              </th>
            ))}
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