// import axios from 'axios';
import {
  fetchCategoryNamesApi,
  fetchCategoriesAndSubcategoriesApi,
  addCategoryApi,
  updateCategoryNameApi,
  removeCategoryApi,
} from '../api/categoryApi';

export interface CategoryService {
  categories: string[];
  confirmedCategories: string[];
  addCategory: () => void;
  removeCategory: (accountId: string, category: string) => Promise<void>;
  editCategory: (index: number, newName: string) => void;
  confirmCategory: (accountId: string, index: number) => void;
}

export const createCategoryService = (
  categories: string[],
  setCategories: React.Dispatch<React.SetStateAction<string[]>>,
  confirmedCategories: string[]
): CategoryService => {

  const addCategory = () => {
    if (categories.length < 3) {
      setCategories([...categories, '']); // Add an empty category for inline editing
    }
  };

  const editCategory = (index: number, newName: string) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = newName;
    setCategories(updatedCategories);
  };

  const confirmCategory = async (accountId: string, index: number) => {
    const categoryName = categories[index];
  
    if (!categoryName.trim()) {
      alert('Category name cannot be empty.');
      return;
    }
  
    try {
      // Check if the category is newly added
      const isNewCategory = index + 1 > confirmedCategories.length;
  
      if (isNewCategory) {
          // Send the new category with priority to the backend
          console.log(`Adding new category "${categoryName}".`);
          await addCategoryApi(accountId, categoryName);
      } else {
          // Check if the name has changed
          const oldCategoryName = confirmedCategories[index]; // Use the confirmed index
          if (oldCategoryName === categoryName) {
            console.log(`Category "${categoryName}" is unchanged. No request sent.`);
            return;
          }

          // Update the category name while keeping its priority and subcategories
          console.log(`Renaming category "${oldCategoryName}" to "${categoryName}".`);
          await updateCategoryNameApi(accountId, oldCategoryName, categoryName);
      }
      
      console.log(`Confirmed Categories after marking:"${Array.from(categories)}"`);
    } catch (error) {
      console.error(`Error confirming category "${categoryName}":`, error);
      alert(`Failed to confirm category "${categoryName}".`);
    }
  };

  const removeCategory = async (accountId: string, category: string) => {
    if (!category.trim()) {
      console.log(`Ignoring empty category removal.`);
      return;
    }

    try {
      await removeCategoryApi(accountId, category);
    } catch (error) {
      console.error(`Error removing category "${category}":`, error);
      throw error;
    }
  };

  return {
    categories,
    confirmedCategories,
    addCategory,
    removeCategory,
    editCategory,
    confirmCategory,
  };
};

export const fetchCategories = async (
  accountId: string
): Promise<string[]> => {
  if (!accountId ) {
    throw new Error('Account ID is required');
  }

  try {
    const response = await fetchCategoryNamesApi(accountId);

    // Extract the data property to return the array of category names
    const categoryNames = response.data;
    if (!Array.isArray(categoryNames)) {
      throw new Error('Invalid response format: categoryNames is not an array');
    }

    return categoryNames;
  } catch (error) {
    console.error('Error fetching category names:', error);
    throw error;
  }
};

export const fetchCategoriesAndSubcategories = async (
  accountId: string
) => {
  try {
    const response = await fetchCategoriesAndSubcategoriesApi(accountId);

    const fetchedCategories = response.data.categories || [];
    const fetchedSubcategories = response.data.subcategories || {};

    return { categories: fetchedCategories, subcategories: fetchedSubcategories };
  } catch (error) {
    console.error('Error fetching categories and subcategories:', error);
    throw error;
  }
};