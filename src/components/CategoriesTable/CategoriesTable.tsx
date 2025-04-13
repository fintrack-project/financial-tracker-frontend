import React, { useState } from 'react';
import IconButton from '../Button/IconButton';
import { createCategoryService } from '../../services/categoryService';
import './CategoriesTable.css'; // Add styles for the table

const CategoriesTable: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[][]>([]);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [subcategoryEditMode, setSubcategoryEditMode] = useState<{ [key: number]: Set<number> }>({});

  const categoryService = createCategoryService(categories, subcategories, setCategories, setSubcategories);

  const handleAddCategory = () => {
    categoryService.addCategory();
    setEditMode(categories.length); // Automatically enter edit mode for the new category
  };

  const handleRemoveCategory = (index: number) => {
    categoryService.removeCategory(index);
    if (editMode === index) {
      setEditMode(null); // Exit edit mode if the removed category was being edited
    }
  };

  const handleCategoryNameChange = (index: number, newName: string) => {
    categoryService.editCategory(index, newName);
  };

  const handleEditCategory = (index: number) => {
    setEditMode(index); // Enable edit mode for the selected category
    categoryService.confirmedCategories.delete(index); // Allow editing for subcategories
  };

  const handleConfirmCategory = (index: number) => {
    setEditMode(null); // Exit edit mode
    categoryService.confirmCategory(index); // Confirm the category
  };

  const handleAddSubcategory = (categoryIndex: number) => {
    const updatedSubcategories = [...subcategories];
    updatedSubcategories[categoryIndex].push(''); // Add an empty subcategory
    setSubcategories(updatedSubcategories);

    // Enable edit mode for the new subcategory
    setSubcategoryEditMode((prev) => ({
      ...prev,
      [categoryIndex]: new Set([...(prev[categoryIndex] || []), updatedSubcategories[categoryIndex].length - 1]),
    }));
  };

  const handleSubcategoryChange = (categoryIndex: number, subIndex: number, value: string) => {
    const updatedSubcategories = [...subcategories];
    updatedSubcategories[categoryIndex][subIndex] = value; // Update the subcategory value
    setSubcategories(updatedSubcategories);
  };

  const handleRemoveSubcategory = (categoryIndex: number, subIndex: number) => {
    const updatedSubcategories = [...subcategories];
    updatedSubcategories[categoryIndex].splice(subIndex, 1); // Remove the subcategory
    setSubcategories(updatedSubcategories);

    // Update edit mode for subcategories
    setSubcategoryEditMode((prev) => {
      const updatedSet = new Set(prev[categoryIndex]);
      updatedSet.delete(subIndex);
      return { ...prev, [categoryIndex]: updatedSet };
    });
  };

  const handleEditSubcategory = (categoryIndex: number, subIndex: number) => {
    setSubcategoryEditMode((prev) => ({
      ...prev,
      [categoryIndex]: new Set([...(prev[categoryIndex] || []), subIndex]),
    }));
  };

  const handleConfirmSubcategory = (categoryIndex: number, subIndex: number) => {
    setSubcategoryEditMode((prev) => {
      const updatedSet = new Set(prev[categoryIndex]);
      updatedSet.delete(subIndex); // Remove subIndex from edit mode
      return { ...prev, [categoryIndex]: updatedSet };
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
                {editMode === index ? (
                  <span>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => handleCategoryNameChange(index, e.target.value)}
                      placeholder="Enter category name"
                    />
                    <IconButton type="confirm" onClick={() => handleConfirmCategory(index)} label="Confirm" size="small"/>
                    <IconButton type="delete" onClick={() => handleRemoveCategory(index)} label="Remove" size="small"/>
                  </span>
                ) : (
                  <span>
                    {category || 'Unnamed Category'}
                    <IconButton type="edit" onClick={() => handleEditCategory(index)} label="Edit"  size="small"/>
                    <IconButton type="delete" onClick={() => handleRemoveCategory(index)} label="Remove" size="small"/>
                  </span>
                )}
              </td>
              <td>
                <ul>
                  {subcategories[index]?.map((subcategory, subIndex) => (
                    <li key={subIndex}>
                      {subcategoryEditMode[index]?.has(subIndex) ? (
                        <>
                          <span>
                            <input
                              type="text"
                              value={subcategory}
                              onChange={(e) => handleSubcategoryChange(index, subIndex, e.target.value)}
                              placeholder="Enter subcategory"
                            />
                            <IconButton
                              type="confirm"
                              onClick={() => handleConfirmSubcategory(index, subIndex)}
                              label="Confirm Subcategory"
                              size="small"
                            />
                            <IconButton
                              type="delete"
                              onClick={() => handleRemoveSubcategory(index, subIndex)}
                              label="Remove Subcategory"
                              size="small"
                            />
                          </span>
                        </>
                      ) : (
                        <>
                          <span>
                            {subcategory || 'Unnamed Subcategory'}
                            <IconButton
                              type="edit"
                              onClick={() => handleEditSubcategory(index, subIndex)}
                              label="Edit Subcategory"
                              size="small"
                            />
                            <IconButton
                              type="delete"
                              onClick={() => handleRemoveSubcategory(index, subIndex)}
                              label="Remove Subcategory"
                              size="small"
                            />
                          </span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
                <IconButton
                  type="add"
                  onClick={() => handleAddSubcategory(index)}
                  label="Add Subcategory"
                  size="small"
                />
              </td>
            </tr>
          ))}
          {categories.length < 3 && (
            <tr>
              <td colSpan={2}>
                <IconButton type="add" onClick={handleAddCategory} label="Add Category" />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesTable;