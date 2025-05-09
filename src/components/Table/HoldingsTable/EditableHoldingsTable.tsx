import React, { useState, useEffect } from 'react';
import { useHoldingsData } from '../../../hooks/useHoldingsData';
import { useBaseCurrency } from '../../../hooks/useBaseCurrency';
import { formatNumber } from '../../../utils/FormatNumber';
import CategoryDropdownCell from '../../Table/CategoryTable/CategoryDropdownCell';
import CategoryDisplayCell from '../../Table/CategoryTable/CategoryDisplayCell';
import { createCategoryService } from '../../../services/categoryService';
import { createHoldingsCategoriesService } from 'services/holdingsCategoriesService';
import './HoldingsTable.css'; // Reuse the CSS from HoldingsTable

interface EditableHoldingsTableProps {
  accountId: string | null;
  categories: string[];
  subcategories: {[category: string]: string[]};
  categoryService: ReturnType<typeof createCategoryService>;
  holdingsCategoriesService: ReturnType<typeof createHoldingsCategoriesService>;
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
  holdingsCategoriesService,
  confirmedHoldingsCategories,
  resetHasFetched
}) => {
  const { holdings, portfolioData, loading } = useHoldingsData(accountId);
  const { baseCurrency, usdToBaseCurrencyRate, loading: baseCurrencyLoading, error: baseCurrencyError } = useBaseCurrency(accountId);
  const [categoryColumns, setCategoryColumns] = useState<string[]>([]); // Manage categories as state
  const [subcategoryColumns, setSubcategoryColumns] = useState<string[][]>([]); // Manage subcategories as state
   const [editingColumns, setEditingColumns] = useState<Set<number>>(new Set()); // Track which columns are in edit mode

  // Synchronize categoryColumns and subcategoryColumns with the categories prop
  useEffect(() => {

    const confirmedCategoryColumns = Object.keys(confirmedHoldingsCategories); // Extract categories
    const confirmedSubcategoryColumns = confirmedCategoryColumns.map((category) =>
      holdings.map((holding) => confirmedHoldingsCategories[category]?.[holding.assetName] || '') // Extract subcategories for each category
    );
    
    setCategoryColumns(confirmedCategoryColumns);
    setSubcategoryColumns(confirmedSubcategoryColumns);
  }, [holdings, confirmedHoldingsCategories]);

  const handleConfirmCategoryColumn = async (index: number) => {
    if (!accountId) {
      alert('Account ID is required to confirm holdings categories.');
      return;
    }
  
    const category = categoryColumns[index];
    
    // Construct the payload for the new column only
    const payload = {
      [category]: holdings.reduce((assetAcc: { [assetName: string]: string | null }, holding, rowIndex) => {
        assetAcc[holding.assetName] = subcategoryColumns[index]?.[rowIndex] || null; // Use null if no subcategory is selected
        return assetAcc;
      }, {}),
    };
  
    try {
      const isNewColumn = !confirmedHoldingsCategories[category]; // Check if this is a new column
  
      if (isNewColumn) {
        await holdingsCategoriesService.addHoldingsCategory(accountId, payload); // POST to add API
        console.log(`New category "${category}" added successfully.`);
      } else {
        await holdingsCategoriesService.updateHoldingsCategories(accountId, payload); // POST to update API
        console.log(`Category "${category}" updated successfully.`);
      }
  
      // Exit edit mode for the column
      const updatedEditingColumns = new Set(editingColumns);
      updatedEditingColumns.delete(index);
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

  const handleRemoveCategoryColumn = async (index: number) => {
    if (!accountId) {
      alert('Account ID is required to remove holdings categories.');
      return;
    }
  
    const category = categoryColumns[index];
  
    try {
      // Call the service to remove the holdings category
      await holdingsCategoriesService.removeHoldingsCategory(accountId, category);
  
      // Update the state to remove the category and its subcategories
      const updatedCategoryColumns = [...categoryColumns];
      const updatedSubcategoryColumns = [...subcategoryColumns];
  
      updatedCategoryColumns.splice(index, 1); // Remove the category
      updatedSubcategoryColumns.splice(index, 1); // Remove the associated subcategories
  
      setCategoryColumns(updatedCategoryColumns);
      setSubcategoryColumns(updatedSubcategoryColumns);
  
      console.log(`Category "${category}" removed successfully.`);
    } catch (error) {
      console.error('Error removing category column:', error);
      alert(`Failed to remove category "${category}".`);
    }
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
            <th>Symbol</th>
            <th>Quantity</th>
            <th>Asset Unit</th>
            <th>Price ({baseCurrency || 'N/A'})</th>
            <th>Total Value ({baseCurrency || 'N/A'})</th>
            {categoryColumns.map((category, categoryIndex) => {
              return (
                <th key={categoryIndex}>
                  <CategoryDisplayCell
                    value={category}
                    isEditing={editingColumns.has(categoryIndex)} // Editable for the header
                    onConfirm={() => handleConfirmCategoryColumn(categoryIndex)}
                    onEdit={() => handleEditCategoryColumn(categoryIndex)}
                    onRemove={() => handleRemoveCategoryColumn(categoryIndex)}
                    showActions={true} // Show actions in the header
                  />
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {portfolioData.length === 0 ? (
            <tr>
              <td colSpan={6} className="no-holdings-row">
                No holdings
              </td>
            </tr>
          ) : (
            portfolioData.map((holding, rowIndex) => (
              <tr key={rowIndex}>
                <td>{holding.assetName}</td>
                <td>{holding.symbol}</td>
                <td>{formatNumber(holding.quantity)}</td>
                <td>{holding.assetType}</td>
                <td>{formatNumber(holding.priceInBaseCurrency)}</td>
                <td>{formatNumber(holding.totalValueInBaseCurrency)}</td>
                {categoryColumns.map((category, categoryIndex) => (
                  <td key={`${rowIndex}-${categoryIndex}`}>
                    <CategoryDropdownCell
                      value={subcategoryColumns[categoryIndex]?.[rowIndex] || ''}
                      isEditing={editingColumns.has(categoryIndex)}
                      options={subcategories[category] || []}
                      onChange={(newValue) =>
                        setSubcategoryColumns((prev) => {
                          const updated = [...prev];
                          updated[categoryIndex][rowIndex] = newValue;
                          return updated;
                        })
                      }
                      onConfirm={() => {}}
                      onEdit={() => {}}
                      onRemove={() => {}}
                      showActions={false}
                    />
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EditableHoldingsTable;