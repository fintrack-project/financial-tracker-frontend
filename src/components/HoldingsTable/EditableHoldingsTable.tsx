import React, { useState } from 'react';
import { useHoldingsData } from '../../hooks/useHoldingsData';
import IconButton  from '../Button/IconButton';
import CategoryDropdownCell from '../Category/CategoryDropdownCell';
import './HoldingsTable.css'; // Reuse the CSS from HoldingsTable

interface EditableHoldingsTableProps {
  accountId: string | null;
}

const EditableHoldingsTable: React.FC<EditableHoldingsTableProps> = ({ accountId }) => {
  const { holdings, marketData, loading } = useHoldingsData(accountId);
  const [categories, setCategories] = useState<string[]>([]); // Manage categories as state
  const [subcategories, setSubcategories] = useState<string[][]>([]); // Manage subcategories as state
  const [editingColumns, setEditingColumns] = useState<Set<number>>(new Set()); // Track which columns are in edit mode


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

  const handleConfirmCategory = (index: number) => {
    const updatedEditingColumns = new Set(editingColumns);
    updatedEditingColumns.delete(index); // Exit edit mode for the column
    setEditingColumns(updatedEditingColumns);
  };

  const handleEditCategory = (index: number) => {
    const updatedEditingColumns = new Set(editingColumns);
    updatedEditingColumns.add(index); // Enable edit mode for the column
    setEditingColumns(updatedEditingColumns);
  };

  const handleDeleteCategory = (index: number) => {
    const updatedCategories = [...categories];
    const updatedSubcategories = [...subcategories];

    updatedCategories.splice(index, 1); // Remove the category
    updatedSubcategories.splice(index, 1); // Remove the associated subcategories

    setCategories(updatedCategories);
    setSubcategories(updatedSubcategories);

    const updatedEditingColumns = new Set(editingColumns);
    updatedEditingColumns.delete(index); // Remove the column from editing state
    setEditingColumns(updatedEditingColumns);
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
            {categories.map((category, categoryIndex) => (
              <th key={categoryIndex}>
                <CategoryDropdownCell
                  value={category}
                  isEditing={editingColumns.has(categoryIndex)} // Always editable for the header
                  options={['Category 1', 'Category 2', 'Category 3']}
                  onChange={(newValue) => handleCategoryChange(categoryIndex, newValue)}
                  onConfirm={() => handleConfirmCategory(categoryIndex)}
                  onEdit={() => handleEditCategory(categoryIndex)}
                  onRemove={() => handleDeleteCategory(categoryIndex)}
                  showActions={true} // Hide actions in the header
                />
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
              ? parseFloat((assetData.price * holding.totalBalance).toFixed(2)).toLocaleString()
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
                  <CategoryDropdownCell
                    value={subcategories[categoryIndex]?.[rowIndex] || ''}
                    isEditing={editingColumns.has(categoryIndex)} // Always editable for subcategory cells
                    options={['Subcategory 1', 'Subcategory 2', 'Subcategory 3']}
                    onChange={(newValue) =>
                      handleSubcategoryChange(categoryIndex, rowIndex, newValue)
                    }
                    onConfirm={() => {}}
                    onEdit={() => {}}
                    onRemove={() => {}}
                    showActions={false} // Hide actions in subcategory cells
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