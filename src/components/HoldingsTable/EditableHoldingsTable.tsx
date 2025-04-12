import React, { useState } from 'react';
import { useHoldingsData } from '../../hooks/useHoldingsData';
import IconButton  from '../Button/IconButton';
import CategoryColumn from './CategoryColumn';
import './HoldingsTable.css'; // Reuse the CSS from HoldingsTable

interface EditableHoldingsTableProps {
  accountId: string | null;
}

const EditableHoldingsTable: React.FC<EditableHoldingsTableProps> = ({ accountId }) => {
  const { holdings, marketData, loading } = useHoldingsData(accountId);
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[][]>([]); // Array of subcategories for each category
  const [editMode, setEditMode] = useState<number | null>(null); // Track which category is being edited
  const [confirmedCategories, setConfirmedCategories] = useState<Set<number>>(new Set()); // Track confirmed categories

  const handleAddCategory = () => {
    if (categories.length < 3) {
      setCategories([...categories, '']); // Add an empty category for inline editing
      setSubcategories([...subcategories, Array(holdings.length).fill('')]); // Add empty subcategories for each asset
      setEditMode(categories.length); // Automatically enter edit mode for the new category
    }
  };

  const handleRemoveCategory = (index: number) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    const updatedSubcategories = subcategories.filter((_, i) => i !== index);
    setCategories(updatedCategories);
    setSubcategories(updatedSubcategories);

    const updatedConfirmedCategories = new Set(confirmedCategories);
    updatedConfirmedCategories.delete(index); // Remove the category from confirmed state
    setConfirmedCategories(updatedConfirmedCategories);

    if (editMode === index) {
      setEditMode(null); // Exit edit mode if the removed category was being edited
    }
  };

  const handleCategoryNameChange = (index: number, newName: string) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = newName; // Update the category name directly
    setCategories(updatedCategories);
  };

  const handleEditCategory = (index: number) => {
    setEditMode(index); // Enable edit mode for the selected category
    const updatedConfirmedCategories = new Set(confirmedCategories);
    updatedConfirmedCategories.delete(index); // Allow editing for subcategories
    setConfirmedCategories(updatedConfirmedCategories);
  };

  const handleConfirmCategory = (index: number) => {
    setEditMode(null); // Exit edit mode
    const updatedConfirmedCategories = new Set(confirmedCategories);
    updatedConfirmedCategories.add(index); // Mark the category as confirmed
    setConfirmedCategories(updatedConfirmedCategories);
  };

  const handleSubcategoryChange = (categoryIndex: number, assetIndex: number, value: string) => {
    const updatedSubcategories = [...subcategories];
    updatedSubcategories[categoryIndex][assetIndex] = value; // Update the subcategory value
    setSubcategories(updatedSubcategories);
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
              <CategoryColumn
                key={index}
                categoryName={category}
                subcategories={subcategories[index]}
                isEditing={editMode === index}
                onCategoryNameChange={(newName) => handleCategoryNameChange(index, newName)}
                onConfirm={() => handleConfirmCategory(index)}
                onEdit={() => handleEditCategory(index)}
                onRemove={() => handleRemoveCategory(index)}
              />
            ))}
            {categories.length < 3 && (
              <th>
                <IconButton type="add" onClick={handleAddCategory} label="Add Category" />
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding, assetIndex) => {
            const assetData = marketData.find((data) => data.assetName === holding.assetName);
            const totalValue = assetData
              ? (assetData.price * holding.totalBalance).toFixed(2)
              : 'Loading...';

            return (
              <tr key={assetIndex}>
                <td>{holding.assetName}</td>
                <td>{holding.totalBalance.toLocaleString()}</td>
                <td>{holding.unit}</td>
                <td>{assetData?.price?.toLocaleString() || 'Loading...'}</td>
                <td>{totalValue}</td>
                {categories.map((_, categoryIndex) => (
                  <td key={`${assetIndex}-${categoryIndex}`}>
                    <input
                      type="text"
                      value={subcategories[categoryIndex][assetIndex]}
                      onChange={(e) =>
                        handleSubcategoryChange(categoryIndex, assetIndex, e.target.value)
                      }
                      placeholder={`Enter ${categories[categoryIndex]}`}
                      readOnly={confirmedCategories.has(categoryIndex)} // Disable editing if the category is confirmed
                    />
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