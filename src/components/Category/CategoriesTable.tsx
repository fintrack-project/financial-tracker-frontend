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
}

const CategoriesTable: React.FC<CategoriesTableProps> = ({
  accountId,
  categories,
  subcategories,
  categoryService,
  subcategoryService,
  onUpdateCategories
}) => {
  const [editCategoryIndex, setEditCategoryIndex] = useState<number | null>(null); // Tracks which category is being edited
  const [subcategoryEditMode, setSubcategoryEditMode] = useState<{ [category: string]: { [subIndex: number]: boolean } }>({}); // Tracks which subcategories are being edited

  // Fetch categories and subcategories when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (!accountId) {
        console.warn('Account ID is required to fetch categories.');
        return;
      }

      try {
        const { categories: fetchedCategories, subcategories: fetchedSubcategories } =
          await categoryService.fetchCategoriesAndSubcategories(accountId);

        // Use the onUpdateCategories callback to update the parent state
        onUpdateCategories(fetchedCategories, fetchedSubcategories);

        console.log('Fetched categories:', fetchedCategories);
        console.log('Fetched subcategories:', fetchedSubcategories);
      } catch (error) {
        alert('Failed to fetch categories. Please try again.');
      }
    };

    fetchData();
  }, [accountId, categoryService]);

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

  const handleRemoveSubcategory = async (category: string, subIndex: number) => {
    if (!accountId) {
      alert('Account ID is required to remove subcategories.');
      return;
    }
  
    // Remove the subcategory locally
    const updatedSubcategories = [...(subcategories[category] || [])];
    updatedSubcategories.splice(subIndex, 1); // Remove the subcategory at the given index
  
    const formattedSubcategory = {
      category_name: category,
      subcategories: updatedSubcategories, // Send the updated list of subcategories
    };
  
    try {
      await subcategoryService.updateSubcategory(accountId, formattedSubcategory); // Sync with backend
      console.log(`Subcategory removed and updated for category "${category}".`);
    } catch (error) {
      alert(`Failed to remove subcategory for category "${category}".`);
    }
  
    // Update the local state
    const updatedSubcategoriesState = {
      ...subcategories,
      [category]: updatedSubcategories,
    };

    onUpdateCategories(categories, updatedSubcategoriesState); // Update the parent state
    console.log(`Updated subcategories for category "${category}":`, updatedSubcategoriesState[category]);
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
                  onRemove={() => categoryService.removeCategory(index)}
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