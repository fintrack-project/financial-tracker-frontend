import { apiClient } from '../../../shared/utils/apiClient';
import { ApiResponse } from '../../../shared/types/ApiTypes';
import { Category, CategoryAndSubcategoriesNamesMap, CategoryColor } from '../types/CategoryTypes';

// Fetch category names
export const fetchCategoryNamesApi = async (accountId: string): Promise<ApiResponse<string[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<string[]>>('/api/categories/fetch/category-names', {
      params: { accountId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching category names:', error);
    throw error;
  }
};

// Fetch categories and subcategories
export const fetchCategoriesAndSubcategoriesNamesMapApi = async (accountId: string): Promise<ApiResponse<CategoryAndSubcategoriesNamesMap>> => {
  try {
    const response = await apiClient.get<ApiResponse<CategoryAndSubcategoriesNamesMap>>(`/api/categories/fetch/names-map`, {
      params: { accountId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories and subcategories:', error);
    throw error;
  }
};

// Add a new category
export const addCategoryApi = async (
  accountId: string,
  categoryName: string,
  color?: CategoryColor
): Promise<ApiResponse<Category>> => {
  try {
    const response = await apiClient.post<ApiResponse<Category>>('/api/categories/add', {
      accountId,
      category_name: categoryName,
      color: color,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

// Update category name
export const updateCategoryNameApi = async (
  accountId: string,
  oldCategoryName: string,
  newCategoryName: string
): Promise<ApiResponse<Category>> => {
  try {
    const response = await apiClient.post<ApiResponse<Category>>('/api/categories/name/update', {
      accountId,
      old_category_name: oldCategoryName,
      new_category_name: newCategoryName,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating category name:', error);
    throw error;
  }
};

// Remove a category
export const removeCategoryApi = async (accountId: string, category: string): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.delete<ApiResponse<void>>('/api/categories/remove', {
      params: { accountId, category },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing category:', error);
    throw error;
  }
};

// Update category color
export const updateCategoryColorApi = async (
  accountId: string,
  categoryName: string,
  color: CategoryColor
): Promise<ApiResponse<Category>> => {
  try {
    const response = await apiClient.post<ApiResponse<Category>>('/api/categories/color/update', {
      accountId,
      category_name: categoryName,
      color: color,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating category color:', error);
    throw error;
  }
};

// Cleanup orphaned holdings categories
export const cleanupOrphanedHoldingsCategoriesApi = async (
  accountId: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>('/api/categories/cleanup/orphaned', {
      accountId,
    });
    return response.data;
  } catch (error) {
    console.error('Error cleaning up orphaned holdings categories:', error);
    throw error;
  }
};

// Cleanup orphaned holdings categories for specific assets
export const cleanupOrphanedHoldingsCategoriesForAssetsApi = async (
  accountId: string,
  assetNames: string[]
): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>('/api/categories/cleanup/orphaned/assets', {
      accountId,
      assetNames,
    });
    return response.data;
  } catch (error) {
    console.error('Error cleaning up orphaned holdings categories for assets:', error);
    throw error;
  }
};

// Fetch category color map
export const fetchCategoryColorMapApi = async (
  accountId: string
): Promise<ApiResponse<{ categoryColors: { [category: string]: CategoryColor } }>> => {
  try {
    const response = await apiClient.get<ApiResponse<{ categoryColors: { [category: string]: CategoryColor } }>>(
      '/api/categories/fetch/color-map',
      {
        params: { accountId },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching category color map:', error);
    throw error;
  }
};