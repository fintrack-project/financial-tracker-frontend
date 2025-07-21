import React, { useState } from 'react';
import IconButton from '../../../../shared/components/Button/IconButton';
import CategoryInputCell from './CategoryInputCell';
import { createCategoryService, fetchCategoriesAndSubcategoriesNamesMap } from '../../services/categoryService';
import { createSubcategoryService } from '../../services/subCategoryService';
import { CategoryColor } from '../../types/CategoryTypes';
import { useNotification } from '../../../../shared/contexts/NotificationContext';
import './CategoriesTable.css'; // Add styles for the table

export interface CategoriesTableProps {
  accountId: string | null;
  categories: string[];
  subcategories: { [category: string]: string[] };
  categoryService: ReturnType<typeof createCategoryService>;
  subcategoryService: ReturnType<typeof createSubcategoryService>;
  onUpdateCategories: (updatedCategories: string[]) => void;
  resetHasFetched: () => void;
  categoryColors: { [category: string]: CategoryColor };
  subcategoryColors: { [category: string]: { [subcategory: string]: CategoryColor } };
}

const CategoriesTable: React.FC<CategoriesTableProps> = ({
  accountId,
  categories,
  subcategories,
  categoryService,
  subcategoryService,
  onUpdateCategories,
  resetHasFetched,
  categoryColors,
  subcategoryColors,
}) => {
  const [editCategoryIndex, setEditCategoryIndex] = useState<number | null>(null); // Tracks which category is being edited
  const [subcategoryEditMode, setSubcategoryEditMode] = useState<{ [category: string]: { [subIndex: number]: boolean } }>({}); // Tracks which subcategories are being edited
  const { showNotification } = useNotification();

  const handleEditCategory = (index: number) => {
    setEditCategoryIndex(index); // Enable edit mode for the selected category
  };

  const handleConfirmCategory = async (index: number) => {
    if (!accountId) {
      showNotification('error', 'Account ID is required to confirm categories.', 5000);
      return;
    }

    try {
      // Use confirmCategory to handle both adding and updating categories
      await categoryService.confirmCategory(accountId, index);
      console.log(`Category "${categories[index]}" confirmed successfully.`);
      resetHasFetched(); // Reset the fetched state
    } catch (error) {
      console.error(`Failed to confirm category "${categories[index]}".`, error);
              showNotification('error', `Failed to confirm category "${categories[index]}".`, 5000);
    }

    setEditCategoryIndex(null); // Exit edit mode
  };

  const isSubcategoryEditing = (category: string, subIndex: number): boolean => {
    return subcategoryEditMode[category]?.[subIndex] || false;
  };

  const handleEditSubcategory = (category: string, subIndex: number) => {
    setSubcategoryEditMode((prev) => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}),
        [subIndex]: true, // Set the specific subcategory to edit mode
      },
    }));
  };

  const handleConfirmSubcategory = async (category: string, subIndex: number) => {
    if (!accountId) {
      showNotification('error', 'Account ID is required to confirm subcategories.', 5000);
      return;
    }

    try {
      await subcategoryService.confirmSubcategory(accountId, category, subIndex);
      console.log(`Subcategory "${subcategories[category][subIndex]}" confirmed successfully in category "${category}".`);
      resetHasFetched(); // Reset the fetched state
    } catch (error) {
      console.error(`Failed to confirm subcategory "${subcategories[category][subIndex]}" in category "${category}".`, error);
              showNotification('error', `Failed to confirm subcategory "${subcategories[category][subIndex]}" in category "${category}".`, 5000);
    }
  
    // Exit edit mode for the subcategory
    setSubcategoryEditMode((prev) => {
      const updatedCategory = { ...(prev[category] || {}) };
      delete updatedCategory[subIndex]; // Remove the specific subcategory from edit mode
  
      return {
        ...prev,
        [category]: updatedCategory,
      };
    });
  };

  const handleRemoveCategory = async (index: number) => {
    if (!accountId) {
      showNotification('error', 'Account ID is required to remove categories.', 5000);
      return;
    }

    const categoryToRemove = categories[index]; // Get the category to remove

    try {
      // Send the category to be removed to the backend
      await categoryService.removeCategory(accountId, categoryToRemove);
      console.log(`Category "${categoryToRemove}" removed successfully.`);
  
      // Fetch the updated categories and subcategories
      const { categories: updatedCategories } =
        await fetchCategoriesAndSubcategoriesNamesMap(accountId);
  
      // Update the state with the fetched data
      onUpdateCategories(updatedCategories);
      resetHasFetched(); // Reset the fetched state
    } catch (error) {
      console.error(`Failed to remove category "${categoryToRemove}".`, error);
              showNotification('error', `Failed to remove category "${categoryToRemove}".`, 5000);
    }
  };

  const handleRemoveSubcategory = async (category: string, subIndex: number) => {
    if (!accountId) {
      showNotification('error', 'Account ID is required to remove subcategories.', 5000);
      return;
    }

    const subcategoryToRemove = subcategories[category]?.[subIndex]; // Get the subcategory to remove

    try {
      // Send the subcategory to be removed to the backend
      await subcategoryService.removeSubcategory(accountId, category, subcategoryToRemove);
      console.log(`Subcategory "${subcategoryToRemove}" removed successfully from category "${category}".`);

      // Fetch the updated categories and subcategories
      const { categories: updatedCategories } =
        await fetchCategoriesAndSubcategoriesNamesMap(accountId);

      // Update the state with the fetched data
      onUpdateCategories(updatedCategories);
      resetHasFetched(); // Reset the fetched state
    } catch (error) {
      console.error(`Failed to remove subcategory "${subcategoryToRemove}" from category "${category}".`, error);
              showNotification('error', `Failed to remove subcategory "${subcategoryToRemove}" from category "${category}".`, 5000);
    }
  };

  return (
    <div className="categories-table-container">
      <table className="categories-table">
        <thead>
          <tr>
            <th>Category Name</th>
            <th>Subcategories</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={index}>
              <td>
                <CategoryInputCell
                  value={category}
                  isEditing={editCategoryIndex === index}
                  onChange={(newValue) => categoryService.editCategory(index, newValue)}
                  onConfirm={() => handleConfirmCategory(index)}
                  onEdit={() => handleEditCategory(index)}
                  onRemove={() => handleRemoveCategory(index)}
                  placeholder="Enter category name"
                  accountId={accountId}
                  color={categoryColors[category]}
                  selectedColor={categoryService.selectedColors[index]}
                  onSelectedColorChange={(color) => categoryService.setSelectedColor(index, color)}
                  resetHasFetched={resetHasFetched}
                />
              </td>
              <td>
                <ul>
                  {subcategories[category]?.map((subcategory, subIndex) => (
                    <li key={subIndex}>
                      <CategoryInputCell
                        value={subcategory}
                        isEditing={isSubcategoryEditing(category, subIndex)}
                        onChange={(newValue) =>
                          subcategoryService.editSubcategory(category, subIndex, newValue)
                        }
                        onConfirm={() => handleConfirmSubcategory(category, subIndex)}
                        onEdit={() => handleEditSubcategory(category, subIndex)}
                        onRemove={() => handleRemoveSubcategory(category, subIndex)}
                        placeholder="Enter subcategory name"
                        isSubcategory={true}
                        accountId={accountId}
                        categoryName={category}
                        color={subcategoryColors[category]?.[subcategory]}
                        resetHasFetched={resetHasFetched}
                      />
                    </li>
                  ))}
                  <li className="add-subcategory-container">
                    <IconButton
                      type="add"
                      onClick={() => subcategoryService.addSubcategory(category)}
                      label="Add Subcategory"
                    />
                  </li>
                </ul>
              </td>
            </tr>
          ))}
          {categories.length < 3 && (
            <tr>
              <td colSpan={2}>
                <IconButton
                  type="add"
                  onClick={() => categoryService.addCategory()}
                  label="Add Category"
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesTable;