import React, { useState } from 'react';
import IconButton from '../Button/IconButton';
import CategoryCell from './CategoryCell';
import { createCategoryService } from '../../services/categoryService';
import { createSubCategoryService } from '../../services/subCategoryService';
import './CategoriesTable.css'; // Add styles for the table

const CategoriesTable: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[][]>([]);
  const [editCategoryIndex, setEditCategoryIndex] = useState<number | null>(null); // Tracks which category is being edited
  const [subcategoryEditMode, setSubcategoryEditMode] = useState<{ [categoryIndex: number]: { [subIndex: number]: boolean } }>({}); // Tracks which subcategories are being edited

  const categoryService = createCategoryService(categories, setCategories);
  const subCategoryService = createSubCategoryService(subcategories, setSubcategories);

  const handleEditCategory = (index: number) => {
    setEditCategoryIndex(index); // Enable edit mode for the selected category
  };

  const handleConfirmCategory = (index: number) => {
    setEditCategoryIndex(null); // Exit edit mode
    categoryService.confirmCategory(index);
  };

  const isSubcategoryEditing = (categoryIndex: number, subIndex: number): boolean => {
    return subcategoryEditMode[categoryIndex]?.[subIndex] || false;
  };

  const handleEditSubcategory = (categoryIndex: number, subIndex: number) => {
    setSubcategoryEditMode((prev) => ({
      ...prev,
      [categoryIndex]: {
        ...(prev[categoryIndex] || {}),
        [subIndex]: true, // Set the specific subcategory to edit mode
      },
    }));
  };

  const handleConfirmSubcategory = (categoryIndex: number, subIndex: number) => {
    setSubcategoryEditMode((prev) => {
      const updatedCategory = { ...(prev[categoryIndex] || {}) };
      delete updatedCategory[subIndex]; // Remove the specific subcategory from edit mode

      return {
        ...prev,
        [categoryIndex]: updatedCategory,
      };
    });
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
                <CategoryCell
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
                  {subcategories[index]?.map((subcategory, subIndex) => (
                    <li key={subIndex}>
                      <CategoryCell
                        value={subcategory}
                        isEditing={isSubcategoryEditing(index, subIndex)}
                        onChange={(newValue) =>
                          subCategoryService.editSubcategory(index, subIndex, newValue)
                        }
                        onConfirm={() => handleConfirmSubcategory(index, subIndex)}
                        onEdit={() => handleEditSubcategory(index, subIndex)}
                        onRemove={() =>
                          subCategoryService.removeSubcategory(index, subIndex)
                        }
                        placeholder="Enter subcategory"
                      />
                    </li>
                  ))}
                </ul>
                <IconButton
                  type="add"
                  onClick={() => subCategoryService.addSubcategory(index)}
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