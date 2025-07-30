import React from 'react';
// import axios from 'axios';
import {
  fetchCategoryNamesApi,
  fetchCategoriesAndSubcategoriesNamesMapApi,
  addCategoryApi,
  updateCategoryNameApi,
  removeCategoryApi,
  updateCategoryColorApi,
  fetchCategoryColorMapApi,
  cleanupOrphanedHoldingsCategoriesApi,
  cleanupOrphanedHoldingsCategoriesForAssetsApi,
} from '../api/categoryApi';
import { Category, CategoryAndSubcategoriesNamesMap, CategoryColor } from '../types/CategoryTypes';

export interface CategoryService {
  categories: string[];
  confirmedCategories: string[];
  selectedColors: { [index: number]: CategoryColor };
  addCategory: () => void;
  removeCategory: (accountId: string, category: string) => Promise<void>;
  editCategory: (index: number, newName: string) => void;
  setSelectedColor: (index: number, color: CategoryColor) => void;
  confirmCategory: (accountId: string, index: number) => void;
}

export const createCategoryService = (
  categories: string[],
  setCategories: React.Dispatch<React.SetStateAction<string[]>>,
  confirmedCategories: string[],
  selectedColors: { [index: number]: CategoryColor },
  setSelectedColors: React.Dispatch<React.SetStateAction<{ [index: number]: CategoryColor }>>,
  showNotification?: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void
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

  const setSelectedColor = (index: number, color: CategoryColor) => {
    setSelectedColors(prev => ({
      ...prev,
      [index]: color
    }));
  };

  const confirmCategory = async (accountId: string, index: number) => {
    const categoryName = categories[index];
  
    if (!categoryName.trim()) {
      showNotification?.('error', 'Category name cannot be empty.');
      return;
    }
  
    try {
      // Check if the category is newly added
      const isNewCategory = index + 1 > confirmedCategories.length;
  
      if (isNewCategory) {
          // Get the selected color if it exists
          const selectedColor = selectedColors[index];
          
          // Send the new category with color to the backend
          console.log(`Adding new category "${categoryName}" with color ${selectedColor || 'default'}.`);
          await addCategoryApi(accountId, categoryName, selectedColor);
          
          // Clear the selected color
          if (selectedColor) {
            setSelectedColors(prev => {
              const newColors = { ...prev };
              delete newColors[index];
              return newColors;
            });
          }
      } else {
          // Check if the name has changed
          const oldCategoryName = confirmedCategories[index]; // Use the confirmed index
          const nameChanged = oldCategoryName !== categoryName;
          
          // Check if the color has changed
          const selectedColor = selectedColors[index];
          const colorChanged = selectedColor !== undefined;
          
          if (!nameChanged && !colorChanged) {
            console.log(`Category "${categoryName}" is unchanged. No request sent.`);
            return;
          }

          // Update the category name if it changed
          if (nameChanged) {
            console.log(`Renaming category "${oldCategoryName}" to "${categoryName}".`);
            await updateCategoryNameApi(accountId, oldCategoryName, categoryName);
          }
          
          // Update the category color if it changed
          if (colorChanged) {
            console.log(`Updating category "${categoryName}" color.`);
            await updateCategoryColorApi(accountId, categoryName, selectedColor);
            
            // Clear the selected color
            setSelectedColors(prev => {
              const newColors = { ...prev };
              delete newColors[index];
              return newColors;
            });
          }
      }
      
      console.log(`Confirmed Categories after marking:"${Array.from(categories)}"`);
    } catch (error) {
      console.error(`Error confirming category "${categoryName}":`, error);
      showNotification?.('error', `Failed to confirm category "${categoryName}".`);
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
    selectedColors,
    addCategory,
    removeCategory,
    editCategory,
    setSelectedColor,
    confirmCategory,
  };
};

export const fetchCategoryNames = async (accountId: string): Promise<string[]> => {
  try {
    const response = await fetchCategoryNamesApi(accountId);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch category names');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching category names:', error);
    throw error;
  }
};

export const fetchCategoriesAndSubcategoriesNamesMap = async (accountId: string): Promise<CategoryAndSubcategoriesNamesMap> => {
  try {
    const response = await fetchCategoriesAndSubcategoriesNamesMapApi(accountId);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch categories and subcategories');
    }

    // The response data is already in the correct format
    return response.data;
  } catch (error) {
    console.error('Error fetching categories and subcategories:', error);
    throw error;
  }
};

export const addCategory = async (accountId: string, categoryName: string, color?: CategoryColor): Promise<Category> => {
  try {
    const response = await addCategoryApi(accountId, categoryName, color);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to add category');
    }
    return response.data;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const updateCategoryName = async (
  accountId: string,
  oldCategoryName: string,
  newCategoryName: string
): Promise<Category> => {
  try {
    const response = await updateCategoryNameApi(accountId, oldCategoryName, newCategoryName);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update category name');
    }
    return response.data;
  } catch (error) {
    console.error('Error updating category name:', error);
    throw error;
  }
};

export const removeCategory = async (accountId: string, category: string): Promise<void> => {
  try {
    const response = await removeCategoryApi(accountId, category);
    if (!response.success) {
      throw new Error(response.message || 'Failed to remove category');
    }
  } catch (error) {
    console.error('Error removing category:', error);
    throw error;
  }
};

export const updateCategoryColor = async (
  accountId: string,
  categoryName: string,
  color: CategoryColor
): Promise<Category> => {
  try {
    const response = await updateCategoryColorApi(accountId, categoryName, color);
    if (!response.success) {
      throw new Error(response.message || 'Failed to update category color');
    }
    // If we have data, return it, otherwise return a minimal Category object
    return response.data || { id: '', name: categoryName, subcategories: [] };
  } catch (error) {
    console.error('Error updating category color:', error);
    throw error;
  }
};

export const cleanupOrphanedHoldingsCategories = async (
  accountId: string
): Promise<void> => {
  try {
    const response = await cleanupOrphanedHoldingsCategoriesApi(accountId);
    if (!response.success) {
      throw new Error(response.message || 'Failed to cleanup orphaned holdings categories');
    }
  } catch (error) {
    console.error('Error cleaning up orphaned holdings categories:', error);
    throw error;
  }
};

export const cleanupOrphanedHoldingsCategoriesForAssets = async (
  accountId: string,
  assetNames: string[]
): Promise<void> => {
  try {
    const response = await cleanupOrphanedHoldingsCategoriesForAssetsApi(accountId, assetNames);
    if (!response.success) {
      throw new Error(response.message || 'Failed to cleanup orphaned holdings categories for assets');
    }
  } catch (error) {
    console.error('Error cleaning up orphaned holdings categories for assets:', error);
    throw error;
  }
};

export const fetchCategoryColorMap = async (
  accountId: string
): Promise<{ [category: string]: CategoryColor }> => {
  try {
    const response = await fetchCategoryColorMapApi(accountId);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch category color map');
    }
    return response.data.categoryColors;
  } catch (error) {
    console.error('Error fetching category color map:', error);
    throw error;
  }
};