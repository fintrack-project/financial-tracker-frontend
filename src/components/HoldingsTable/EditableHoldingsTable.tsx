import React, { useState } from 'react';
import { useHoldingsData } from '../../hooks/useHoldingsData';
import IconButton  from '../Button/IconButton';
import CategoryDropdownCell from '../Category/CategoryDropdownCell';
import './HoldingsTable.css'; // Reuse the CSS from HoldingsTable

interface EditableHoldingsTableProps {
  accountId: string | null;
  categories: string[];
  subcategories: {[category: string]: string[]};
}

const EditableHoldingsTable: React.FC<EditableHoldingsTableProps> = ({ 
  accountId,
  categories,
  subcategories,
}) => {
  const { holdings, marketData, loading } = useHoldingsData(accountId);
  const [categoryColumns, setCategoryColumns] = useState<string[]>([]); // Manage categories as state
  const [subcategoryColumns, setSubcategoryColumns] = useState<string[][]>([]); // Manage subcategories as state
   const [editingColumns, setEditingColumns] = useState<Set<number>>(new Set()); // Track which columns are in edit mode


  const handleAddCategoryColumns = () => {
    if (categoryColumns.length < 3) {
      setCategoryColumns([...categoryColumns, '']); // Add an empty category
      setSubcategoryColumns([...subcategoryColumns, Array(holdings.length).fill('')]); // Add empty subcategories for each row
    }
  };

  const handleCategoryColumnChange = (index: number, newCategoryColumn: string) => {
    const updatedCategoriesColumns = [...categoryColumns];
    updatedCategoriesColumns[index] = newCategoryColumn;
    setCategoryColumns(updatedCategoriesColumns);

    // Reset subcategories for the column when the category changes
    const updatedSubcategoryColumns = [...subcategoryColumns];
    updatedSubcategoryColumns[index] = Array(holdings.length).fill(''); // Reset all subcategories for this column
    setSubcategoryColumns(updatedSubcategoryColumns);
  };

  const handleSubcategoryColumnChange = (categoryColumnIndex: number, rowIndex: number, newSubcategoryColumn: string) => {
    const updatedSubcategoryColumns = [...subcategoryColumns];
    updatedSubcategoryColumns[categoryColumnIndex][rowIndex] = newSubcategoryColumn;
    setSubcategoryColumns(updatedSubcategoryColumns);
  };

  const handleConfirmCategoryColumn = (index: number) => {
    const updatedEditingColumns = new Set(editingColumns);
    updatedEditingColumns.delete(index); // Exit edit mode for the column
    setEditingColumns(updatedEditingColumns);
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
            {categoryColumns.map((category, categoryIndex) => (
              <th key={categoryIndex}>
                <CategoryDropdownCell
                  value={category}
                  isEditing={editingColumns.has(categoryIndex)} // Always editable for the header
                  options={categories}
                  onChange={(newValue) => handleCategoryColumnChange(categoryIndex, newValue)}
                  onConfirm={() => handleConfirmCategoryColumn(categoryIndex)}
                  onEdit={() => handleEditCategoryColumn(categoryIndex)}
                  onRemove={() => handleDeleteCategoryColumn(categoryIndex)}
                  showActions={true} // Hide actions in the header
                />
              </th>
            ))}
            {categories.length < 3 && (
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