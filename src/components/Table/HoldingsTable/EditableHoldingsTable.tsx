import React, { useState, useEffect } from 'react';
import { useHoldingsData } from '../../../hooks/useHoldingsData';
import { useBaseCurrency } from '../../../hooks/useBaseCurrency';
import { formatNumber } from '../../../utils/FormatNumber';
import CategoryDropdownCell from '../../Table/CategoryTable/CategoryDropdownCell';
import CategoryDisplayCell from '../../Table/CategoryTable/CategoryDisplayCell';
import { createCategoryService } from '../../../services/categoryService';
import { createHoldingsCategoriesService } from 'services/holdingsCategoriesService';
import ResetCategoryPopup from '../../Popup/ResetCategoryPopup';
import './HoldingsTable.css'; // Reuse the CSS from HoldingsTable
import { CategoryColor } from '../../../types/CategoryTypes';

export interface EditableHoldingsTableProps {
  accountId: string | null;
  categories: string[];
  subcategories: { [category: string]: string[] };
  categoryService: ReturnType<typeof createCategoryService>;
  holdingsCategoriesService: ReturnType<typeof createHoldingsCategoriesService>;
  confirmedHoldingsCategories: {
    [category: string]: {
      [assetName: string]: string | null;
    };
  };
  resetHasFetched: () => void;
  categoryColors: { [category: string]: CategoryColor };
  subcategoryColors: { [category: string]: { [subcategory: string]: CategoryColor } };
}

const EditableHoldingsTable: React.FC<EditableHoldingsTableProps> = ({ 
  accountId,
  categories,
  subcategories,
  categoryService,
  holdingsCategoriesService,
  confirmedHoldingsCategories,
  resetHasFetched,
  categoryColors,
  subcategoryColors
}) => {
  const { holdings, portfolioData, loading } = useHoldingsData(accountId);
  const { baseCurrency, usdToBaseCurrencyRate, loading: baseCurrencyLoading, error: baseCurrencyError } = useBaseCurrency(accountId);
  const [categoryColumns, setCategoryColumns] = useState<string[]>([]); // Manage categories as state
  const [subcategoryColumns, setSubcategoryColumns] = useState<string[][]>([]); // Manage subcategories as state
  const [editingColumns, setEditingColumns] = useState<Set<number>>(new Set()); // Track which columns are in edit mode
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [categoryToReset, setCategoryToReset] = useState<string | null>(null);

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

  const handleResetCategoryColumn = async (index: number) => {
    if (!accountId) {
      alert('Account ID is required to reset holdings categories.');
      return;
    }
  
    const category = categoryColumns[index];
    setCategoryToReset(category);
    setShowResetPopup(true);
  };

  const confirmResetCategory = async () => {
    if (!accountId || !categoryToReset) return;

    try {
      // Reset all subcategories for this category to null
      const payload = {
        [categoryToReset]: holdings.reduce((assetAcc: { [assetName: string]: string | null }, holding) => {
          assetAcc[holding.assetName] = null;
          return assetAcc;
        }, {}),
      };

      // Update the holdings categories with null values
      await holdingsCategoriesService.updateHoldingsCategories(accountId, payload);
  
      // Update the state to reset subcategories for this category
      const categoryIndex = categoryColumns.indexOf(categoryToReset);
      if (categoryIndex !== -1) {
        const updatedSubcategoryColumns = [...subcategoryColumns];
        updatedSubcategoryColumns[categoryIndex] = holdings.map(() => ''); // Reset all subcategories to empty string
        setSubcategoryColumns(updatedSubcategoryColumns);
      }
  
      console.log(`Subcategories for category "${categoryToReset}" reset successfully.`);
      setShowResetPopup(false);
      setCategoryToReset(null);
    } catch (error) {
      console.error('Error resetting category subcategories:', error);
      alert(`Failed to reset subcategories for category "${categoryToReset}".`);
    }
  };

  const cancelResetCategory = () => {
    setShowResetPopup(false);
    setCategoryToReset(null);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="holdings-table-container">
        <div className="scrollable-content">
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
                        isEditing={editingColumns.has(categoryIndex)}
                        onConfirm={() => handleConfirmCategoryColumn(categoryIndex)}
                        onEdit={() => handleEditCategoryColumn(categoryIndex)}
                        onRemove={() => handleResetCategoryColumn(categoryIndex)}
                        showActions={true}
                        color={categoryColors[category]}
                        resetHasFetched={resetHasFetched}
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
                    <td>{formatNumber(holding.priceInBaseCurrency, holding.assetType === 'FOREX' ? 6 : 2)}</td>
                    <td>{formatNumber(holding.totalValueInBaseCurrency)}</td>
                    {categoryColumns.map((category, categoryIndex) => {
                      const selectedSubcategory = subcategoryColumns[categoryIndex]?.[rowIndex] || '';
                      return (
                        <td key={`${rowIndex}-${categoryIndex}`}>
                          <CategoryDropdownCell
                            value={selectedSubcategory}
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
                            color={selectedSubcategory ? subcategoryColors[category]?.[selectedSubcategory] : undefined}
                            resetHasFetched={resetHasFetched}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ResetCategoryPopup
        isOpen={showResetPopup}
        onConfirm={confirmResetCategory}
        onClose={cancelResetCategory}
        categoryName={categoryToReset || ''}
      />
    </>
  );
};

export default EditableHoldingsTable;