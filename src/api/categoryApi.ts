import { apiClient } from '../utils/apiClient';

interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Fetch category names
export const fetchCategoryNamesApi = async (accountId: string): Promise<ApiResponse<string[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<string[]>>('/api/categories/fetch/names', {
      params: { accountId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching category names:', error);
    throw error;
  }
};

// Fetch categories and subcategories
export const fetchCategoriesAndSubcategoriesApi = async (accountId: string): Promise<ApiResponse<Category[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<Category[]>>('/api/categories/fetch', {
      params: { accountId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories and subcategories:', error);
    throw error;
  }
};

// Add a new category
export const addCategoryApi = async (accountId: string, categoryName: string): Promise<ApiResponse<Category>> => {
  try {
    const response = await apiClient.post<ApiResponse<Category>>('/api/categories/add', {
      accountId,
      category_name: categoryName,
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