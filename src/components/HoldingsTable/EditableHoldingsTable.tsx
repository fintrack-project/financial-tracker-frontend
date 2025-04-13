import React, { useState } from 'react';
import { useHoldingsData } from '../../hooks/useHoldingsData';
import IconButton  from '../Button/IconButton';
import CategoryColumn from '../Category/CategoryColumn';
import { createCategoryService } from '../../services/categoryService';
import './HoldingsTable.css'; // Reuse the CSS from HoldingsTable

interface EditableHoldingsTableProps {
  accountId: string | null;
}

const EditableHoldingsTable: React.FC<EditableHoldingsTableProps> = ({ accountId }) => {
  const { holdings, marketData, loading } = useHoldingsData(accountId);
  const [categories, setCategories] = useState<string[]>([]); // Manage categories as state
  const [subcategories, setSubcategories] = useState<string[][]>([]); // Manage subcategories as state
  const [editMode, setEditMode] = useState<number | null>(null); // Track which category is being edited

  // // Initialize the category service
  // const categoryService = createCategoryService(categories, subcategories, setCategories, setSubcategories);

  // const handleAddCategory = () => {
  //   categoryService.addCategory();
  //   setEditMode(categories.length); // Automatically enter edit mode for the new category
  // };

  // const handleRemoveCategory = (index: number) => {
  //   categoryService.removeCategory(index);
  //   if (editMode === index) {
  //     setEditMode(null); // Exit edit mode if the removed category was being edited
  //   }
  // };

  // const handleCategoryNameChange = (index: number, newName: string) => {
  //   categoryService.editCategory(index, newName);
  // };

  // const handleEditCategory = (index: number) => {
  //   setEditMode(index); // Enable edit mode for the selected category
  //   categoryService.confirmedCategories.delete(index); // Allow editing for subcategories
  // };

  // const handleConfirmCategory = (index: number) => {
  //   setEditMode(null); // Exit edit mode
  //   categoryService.confirmCategory(index); // Mark the category as confirmed
  // };

  // const handleSubcategoryChange = (categoryIndex: number, assetIndex: number, value: string) => {
  //   categoryService.updateSubcategory(categoryIndex, assetIndex, value);
  // };

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
            {/* {categoryService.categories.map((category, index) => (
              <CategoryColumn
                key={index}
                categoryName={category}
                isEditing={editMode === index}
                onCategoryNameChange={(newName) => handleCategoryNameChange(index, newName)}
                onConfirm={() => handleConfirmCategory(index)}
                onEdit={() => handleEditCategory(index)}
                onRemove={() => handleRemoveCategory(index)}
              />
            ))}
            {categoryService.categories.length < 3 && (
              <th>
                <IconButton type="add" onClick={handleAddCategory} label="Add Category" />
              </th>
            )} */}
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
                {/* {categories.map((_, categoryIndex) => (
                  <td key={`${assetIndex}-${categoryIndex}`}>
                    {editMode === categoryIndex ? (
                      <input
                        type="text"
                        value={subcategories[categoryIndex][assetIndex]}
                        onChange={(e) =>
                          handleSubcategoryChange(categoryIndex, assetIndex, e.target.value)
                        }
                        placeholder={`Enter ${categories[categoryIndex]}`}
                      />
                    ) : (
                      <span>{subcategories[categoryIndex][assetIndex] || '—'}</span>
                    )}
                  </td>
                ))} */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EditableHoldingsTable;