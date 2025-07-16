import React, { useState, useEffect, ReactNode } from 'react';
import { FaChartLine } from 'react-icons/fa';
import { CategoryColor } from '../../../categories/types/CategoryTypes';
import { createCategoryService } from '../../../categories/services/categoryService';
import { createHoldingsCategoriesService } from '../../services/holdingsCategoriesService';
import { useHoldingsData } from '../../hooks/useHoldingsData';
import { useBaseCurrency } from '../../../../shared/hooks/useBaseCurrency';
import { formatNumber } from '../../../../shared/utils/FormatNumber';
import CategoryDisplayCell from '../../../categories/components/CategoryTable/CategoryDisplayCell';
import CategoryDropdownCell from '../../../categories/components/CategoryTable/CategoryDropdownCell';
import ResetCategoryPopup from '../../../categories/components/Popup/ResetCategoryPopup';
import Icon from '../../../../shared/components/Card/Icon';
import { useNotification } from '../../../../shared/contexts/NotificationContext';
import './HoldingsTable.css'; // Reuse the CSS from HoldingsTable

interface EmptyStateProps {
  icon: ReactNode;
  text: string;
  subtext: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, text, subtext }) => (
  <div className="empty-state">
    {icon}
    <div className="empty-state-text">{text}</div>
    <div className="empty-state-subtext">{subtext}</div>
  </div>
);

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
  const { portfolioData, loading } = useHoldingsData(accountId);
  const [categoryColumns, setCategoryColumns] = useState<string[]>([]);
  const [subcategoryColumns, setSubcategoryColumns] = useState<string[][]>([]);
  const [editingColumns, setEditingColumns] = useState<Set<number>>(new Set());
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [categoryToReset, setCategoryToReset] = useState<string | null>(null);
  const { baseCurrency } = useBaseCurrency(accountId);
  const { showNotification } = useNotification();

  // Update category columns when holdings or confirmedHoldingsCategories change
  useEffect(() => {
    const confirmedCategoryColumns = Object.keys(confirmedHoldingsCategories); // Extract categories
    const confirmedSubcategoryColumns = confirmedCategoryColumns.map((category) =>
      portfolioData.map((holding) => confirmedHoldingsCategories[category]?.[holding.assetName] || '') // Extract subcategories for each category
    );
    
    setCategoryColumns(confirmedCategoryColumns);
    setSubcategoryColumns(confirmedSubcategoryColumns);
  }, [portfolioData, confirmedHoldingsCategories]);

  const handleConfirmCategoryColumn = async (index: number) => {
    if (!accountId) {
      showNotification('error', 'Account ID is required to confirm holdings categories.', 5000);
      return;
    }
  
    const category = categoryColumns[index];
    
    // Construct the payload for the new column only
    const payload = {
      [category]: portfolioData.reduce((assetAcc: { [assetName: string]: string | null }, holding, rowIndex) => {
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
              showNotification('error', `Failed to confirm category "${category}".`, 5000);
    }
  };

  const handleEditCategoryColumn = (index: number) => {
    const updatedEditingColumns = new Set(editingColumns);
    updatedEditingColumns.add(index); // Enable edit mode for the column
    setEditingColumns(updatedEditingColumns);
  };

  const handleResetCategoryColumn = async (index: number) => {
    if (!accountId) {
      showNotification('error', 'Account ID is required to reset holdings categories.', 5000);
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
        [categoryToReset]: portfolioData.reduce((assetAcc: { [assetName: string]: string | null }, holding) => {
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
        updatedSubcategoryColumns[categoryIndex] = portfolioData.map(() => ''); // Reset all subcategories to empty string
        setSubcategoryColumns(updatedSubcategoryColumns);
      }
  
      console.log(`Subcategories for category "${categoryToReset}" reset successfully.`);
      setShowResetPopup(false);
      setCategoryToReset(null);
    } catch (error) {
      console.error('Error resetting category subcategories:', error);
              showNotification('error', `Failed to reset subcategories for category "${categoryToReset}".`, 5000);
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
                  <td colSpan={6 + categoryColumns.length}>
                    <EmptyState
                      icon={<Icon icon={FaChartLine} className="empty-state-icon" aria-hidden={true} />}
                      text="No Holdings Found"
                      subtext="Add holdings to start tracking your portfolio"
                    />
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