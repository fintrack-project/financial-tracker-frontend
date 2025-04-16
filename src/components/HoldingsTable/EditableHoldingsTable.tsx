import React, { useState, useEffect } from 'react';
import { useHoldingsData } from '../../hooks/useHoldingsData';
import IconButton  from '../Button/IconButton';
import CategoryDropdownCell from '../Category/CategoryDropdownCell';
import { createCategoryService } from '../../services/categoryService';
import './HoldingsTable.css'; // Reuse the CSS from HoldingsTable

interface EditableHoldingsTableProps {
  accountId: string | null;
  categories: string[];
  subcategories: {[category: string]: string[]};
  categoryService: ReturnType<typeof createCategoryService>;
  confirmedHoldingsCategories: {
    [category: string]: {
      [assetName: string]: string | null;
    };
  };
  resetHasFetched: () => void;
}

const EditableHoldingsTable: React.FC<EditableHoldingsTableProps> = ({ 
  accountId,
  categories,
  subcategories,
  categoryService,
  confirmedHoldingsCategories,
  resetHasFetched
}) => {
  const { holdings, marketData, loading } = useHoldingsData(accountId);
  const [categoryColumns, setCategoryColumns] = useState<string[]>([]); // Manage categories as state
  const [subcategoryColumns, setSubcategoryColumns] = useState<string[][]>([]); // Manage subcategories as state
   const [editingColumns, setEditingColumns] = useState<Set<number>>(new Set()); // Track which columns are in edit mode

  // Synchronize categoryColumns and subcategoryColumns with the categories prop
  useEffect(() => {
    console.log('Confirmed Holdings Categories:', confirmedHoldingsCategories);

    const confirmedCategoryColumns = Object.keys(confirmedHoldingsCategories); // Extract categories
    const confirmedSubcategoryColumns = confirmedCategoryColumns.map((category) =>
      Object.values(confirmedHoldingsCategories[category]).map((subcategory) => subcategory || '') // Extract subcategories for each category
    );
  
    console.log('Initial Category Columns:', confirmedCategoryColumns);
    console.log('Initial Subcategory Columns:', confirmedSubcategoryColumns);

    setCategoryColumns(confirmedCategoryColumns);
    setSubcategoryColumns(confirmedSubcategoryColumns);
  }, [confirmedHoldingsCategories]);

  const handleAddCategoryColumns = () => {
    if (categoryColumns.length < categories.length) {
      setCategoryColumns([...categoryColumns, '']); // Add an empty category
      setSubcategoryColumns([...subcategoryColumns, Array(holdings.length).fill('')]); // Add empty subcategories for each row
    }
  };

  const handleCategoryColumnChange = async (index: number, newCategoryColumn: string) => {
    const updatedCategoriesColumns = [...categoryColumns];
    updatedCategoriesColumns[index] = newCategoryColumn;
    setCategoryColumns(updatedCategoriesColumns);

    // Reset subcategories for the column when the category changes
    const updatedSubcategoryColumns = [...subcategoryColumns];
    updatedSubcategoryColumns[index] = Array(holdings.length).fill(''); // Reset all subcategories for this column
    setSubcategoryColumns(updatedSubcategoryColumns);
  };

  const handleSubcategoryColumnChange = async (
    categoryColumnIndex: number, 
    rowIndex: number, 
    newSubcategoryColumn: string
  ) => {
    const category = categoryColumns[categoryColumnIndex];

    // Update the subcategory locally
    const updatedSubcategoryColumns = [...subcategoryColumns];
    updatedSubcategoryColumns[categoryColumnIndex][rowIndex] = newSubcategoryColumn;
    setSubcategoryColumns(updatedSubcategoryColumns);
  };

  const handleConfirmCategoryColumn = async (index: number) => {
    if (!accountId) {
      alert('Account ID is required to confirm holdings categories.');
      return;
    }
  
    const category = categoryColumns[index];
    const formattedHoldingsCategories = holdings.map((holding, rowIndex) => ({
      asset_name: holding.assetName,
      category,
      subcategory: subcategoryColumns[index]?.[rowIndex] || null,
    }));
  
    try {
      await categoryService.updateHoldingsCategories(accountId, formattedHoldingsCategories); // Sync with backend
      alert(`Category "${category}" confirmed successfully.`);
  
      const updatedEditingColumns = new Set(editingColumns);
      updatedEditingColumns.delete(index); // Exit edit mode for the column
      setEditingColumns(updatedEditingColumns);
      resetHasFetched(); // Reset the fetched state
    } catch (error) {
      console.error('Error confirming category column:', error);
      alert(`Failed to confirm category "${category}".`);
    }
  };

  const handleEditCategoryColumn = (index: number) => {
    const updatedEditingColumns = new Set(editingColumns);
    updatedEditingColumns.add(index); // Enable edit mode for the column
    setEditingColumns(updatedEditingColumns);
  };

  const handleDeleteCategoryColumn = (index: number) => {
    const updatedCategoryColumns = [...categoryColumns];
    const updatedSubcategoryColumns = [...subcategoryColumns];

    updatedCategoryColumns.splice(index, 1); // Remove the category
    updatedSubcategoryColumns.splice(index, 1); // Remove the associated subcategories

    setCategoryColumns(updatedCategoryColumns);
    setSubcategoryColumns(updatedSubcategoryColumns);

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
            {categoryColumns.map((category, categoryIndex) => {
              // Filter categories to exclude already confirmed ones
              const availableCategories = categories.filter(
                (cat) => !categoryColumns.includes(cat) || cat === category
              );

              return (
                <th key={categoryIndex}>
                  <CategoryDropdownCell
                    value={category}
                    isEditing={editingColumns.has(categoryIndex)} // Editable for the header
                    options={availableCategories} // Filtered categories
                    onChange={(newValue) => handleCategoryColumnChange(categoryIndex, newValue)}
                    onConfirm={() => handleConfirmCategoryColumn(categoryIndex)}
                    onEdit={() => handleEditCategoryColumn(categoryIndex)}
                    onRemove={() => handleDeleteCategoryColumn(categoryIndex)}
                    showActions={true} // Show actions in the header
                  />
                </th>
              );
            })}
            {categoryColumns.length < categories.length && (
              <th>
                <IconButton type="add" onClick={handleAddCategoryColumns} label="Add Column" />
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
                {categoryColumns.map((category, categoryIndex) => (
                  <td key={`${rowIndex}-${categoryIndex}`}>
                  <CategoryDropdownCell
                    value={subcategoryColumns[categoryIndex]?.[rowIndex] || ''}
                    isEditing={editingColumns.has(categoryIndex)} // Always editable for subcategory cells
                    options={subcategories[category] || []}
                    onChange={(newValue) =>
                      handleSubcategoryColumnChange(categoryIndex, rowIndex, newValue)
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