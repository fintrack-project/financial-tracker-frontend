import React, { useState } from 'react';
import IconButton from '../Button/IconButton';
import CategoryCell from './CategoryCell';
import { createCategoryService } from '../../services/categoryService';
import { createSubCategoryService } from '../../services/SubCategoryService';
import './CategoriesTable.css'; // Add styles for the table

const CategoriesTable: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[][]>([]);

  const categoryService = createCategoryService(categories, setCategories);
  const subCategoryService = createSubCategoryService(subcategories, setSubcategories);

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
  //   categoryService.confirmCategory(index); // Confirm the category
  // };

  // const handleAddSubcategory = (categoryIndex: number) => {
  //   const updatedSubcategories = [...subcategories];
  //   updatedSubcategories[categoryIndex].push(''); // Add an empty subcategory
  //   setSubcategories(updatedSubcategories);

  //   // Enable edit mode for the new subcategory
  //   setSubcategoryEditMode((prev) => ({
  //     ...prev,
  //     [categoryIndex]: new Set([...(prev[categoryIndex] || []), updatedSubcategories[categoryIndex].length - 1]),
  //   }));
  // };

  // const handleSubcategoryChange = (categoryIndex: number, subIndex: number, value: string) => {
  //   const updatedSubcategories = [...subcategories];
  //   updatedSubcategories[categoryIndex][subIndex] = value; // Update the subcategory value
  //   setSubcategories(updatedSubcategories);
  // };

  // const handleRemoveSubcategory = (categoryIndex: number, subIndex: number) => {
  //   const updatedSubcategories = [...subcategories];
  //   updatedSubcategories[categoryIndex].splice(subIndex, 1); // Remove the subcategory
  //   setSubcategories(updatedSubcategories);

  //   // Update edit mode for subcategories
  //   setSubcategoryEditMode((prev) => {
  //     const updatedSet = new Set(prev[categoryIndex]);
  //     updatedSet.delete(subIndex);
  //     return { ...prev, [categoryIndex]: updatedSet };
  //   });
  // };

  // const handleEditSubcategory = (categoryIndex: number, subIndex: number) => {
  //   setSubcategoryEditMode((prev) => ({
  //     ...prev,
  //     [categoryIndex]: new Set([...(prev[categoryIndex] || []), subIndex]),
  //   }));
  // };

  // const handleConfirmSubcategory = (categoryIndex: number, subIndex: number) => {
  //   setSubcategoryEditMode((prev) => {
  //     const updatedSet = new Set(prev[categoryIndex]);
  //     updatedSet.delete(subIndex); // Remove subIndex from edit mode
  //     return { ...prev, [categoryIndex]: updatedSet };
  //   });
  // };

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
                  isEditing={false}
                  onChange={(newValue) => categoryService.editCategory(index, newValue)}
                  onConfirm={() => {categoryService.confirmCategory(index);}}
                  onEdit={() => console.log('Edit category')}
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
                        isEditing={false}
                        onChange={(newValue) =>
                          subCategoryService.editSubcategory(index, subIndex, newValue)
                        }
                        onConfirm={() =>
                          subCategoryService.confirmSubcategory(index, subIndex)
                        }
                        onEdit={() => console.log('Edit subcategory')} // Add edit logic
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