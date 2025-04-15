import React, { useState, useEffect } from 'react';
import IconButton from '../Button/IconButton';
import CategoryInputCell from './CategoryInputCell';
import { createCategoryService } from '../../services/categoryService';
import { createSubcategoryService } from '../../services/subcategoryService';
import './CategoriesTable.css'; // Add styles for the table

interface CategoriesTableProps {
  accountId: string | null;
  categories: string[];
  subcategories: {[category: string]: string[]};
  categoryService: ReturnType<typeof createCategoryService>;
  subcategoryService: ReturnType<typeof createSubcategoryService>;
  onUpdateCategories: (categories: string[], subcategories: {[category: string]: string[]}) => void;
  resetHasFetched: () => void;
}

const CategoriesTable: React.FC<CategoriesTableProps> = ({
  accountId,
  categories,
  subcategories,
  categoryService,
  subcategoryService,
  onUpdateCategories,
  resetHasFetched,
}) => {
  const [editCategoryIndex, setEditCategoryIndex] = useState<number | null>(null); // Tracks which category is being edited
  const [subcategoryEditMode, setSubcategoryEditMode] = useState<{ [category: string]: { [subIndex: number]: boolean } }>({}); // Tracks which subcategories are being edited

  const handleEditCategory = (index: number) => {
    setEditCategoryIndex(index); // Enable edit mode for the selected category
  };

  const handleConfirmCategory = async (index: number) => {
    if (!accountId) {
      alert('Account ID is required to confirm categories.');
      return;
    }
  
    const category = categories[index];
    const formattedCategory = {
      category_name: category,
      subcategories: subcategories[category] || [],
    };
  
    try {
      await categoryService.updateCategories(accountId, [formattedCategory]); // Sync with backend
      console.log(`Category "${category}" updated successfully.`);
      resetHasFetched(); // Reset the fetched state
    } catch (error) {
      alert(`Failed to update category "${category}".`);
    }

    setEditCategoryIndex(null); // Exit edit mode
    categoryService.confirmCategory(index);
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
      alert('Account ID is required to confirm subcategories.');
      return;
    }
  
    const allSubcategories = subcategories[category];
    const formattedSubcategory = {
      category_name: category,
      subcategories: allSubcategories, // Send only the confirmed subcategory
    };
  
    try {
      await subcategoryService.updateSubcategory(accountId, formattedSubcategory); // Sync with backend
      console.log(`Subcategory for category "${category}" updated successfully.`);
      resetHasFetched(); // Reset the fetched state
    } catch (error) {
      alert(`Failed to update subcategories for category "${category}".`);
    }

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
      alert('Account ID is required to remove categories.');
      return;
    }

    const categoryToRemove = categories[index]; // Get the category to remove

    try {
      // Send the category to be removed to the backend
      await categoryService.removeCategory(accountId, categoryToRemove);
      console.log(`Category "${categoryToRemove}" removed successfully.`);
  
      // Fetch updated categories and subcategories from the backend
      const { categories: updatedCategories, subcategories: updatedSubcategories } =
        await categoryService.fetchCategoriesAndSubcategories(accountId);
  
      // Update the state with the fetched data
      onUpdateCategories(updatedCategories, updatedSubcategories);
      resetHasFetched(); // Reset the fetched state
    } catch (error) {
      console.error(`Failed to remove category "${categoryToRemove}".`, error);
      alert(`Failed to remove category "${categoryToRemove}".`);
    }
  };

  const handleRemoveSubcategory = async (category: string, subIndex: number) => {
    if (!accountId) {
      alert('Account ID is required to remove subcategories.');
      return;
    }

    const subcategoryToRemove = subcategories[category]?.[subIndex]; // Get the subcategory to remove

    try {
      // Send the subcategory to be removed to the backend
      await subcategoryService.removeSubcategory(accountId, category, subcategoryToRemove);
      console.log(`Subcategory "${subcategoryToRemove}" removed successfully from category "${category}".`);

      // Fetch updated categories and subcategories from the backend
      const { categories: updatedCategories, subcategories: updatedSubcategories } =
        await categoryService.fetchCategoriesAndSubcategories(accountId);

      // Update the state with the fetched data
      onUpdateCategories(updatedCategories, updatedSubcategories);
      resetHasFetched(); // Reset the fetched state
    } catch (error) {
      console.error(`Failed to remove subcategory "${subcategoryToRemove}" from category "${category}".`, error);
      alert(`Failed to remove subcategory "${subcategoryToRemove}" from category "${category}".`);
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
                        onRemove={() =>
                          handleRemoveSubcategory(category, subIndex)
                        }
                        placeholder="Enter subcategory"
                      />
                    </li>
                  ))}
                </ul>
                <IconButton
                  type="add"
                  onClick={() => subcategoryService.addSubcategory(category)}
                  label="Add Subcategory"
                  size="small"
                />
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