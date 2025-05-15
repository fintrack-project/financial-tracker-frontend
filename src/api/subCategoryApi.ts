import { apiClient } from '../utils/apiClient';
import { ApiResponse } from '../types/ApiTypes';
import { CategoryColor } from '../types/CategoryTypes';

// Add a new subcategory
export const addSubcategoryApi = async (
  accountId: string,
  categoryName: string,
  subcategoryName: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>('/api/categories/subcategories/add', {
      accountId,
      category_name: categoryName,
      subcategory_name: subcategoryName,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding subcategory:', error);
    throw error;
  }
};

// Update a subcategory name
export const updateSubcategoryNameApi = async (
  accountId: string,
  categoryName: string,
  oldSubcategoryName: string,
  newSubcategoryName: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>('/api/categories/subcategories/name/update', {
      accountId,
      category_name: categoryName,
      old_subcategory_name: oldSubcategoryName,
      new_subcategory_name: newSubcategoryName,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating subcategory name:', error);
    throw error;
  }
};

// Remove a subcategory
export const removeSubcategoryApi = async (
  accountId: string,
  categoryName: string,
  subcategoryName: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.delete<ApiResponse<void>>('/api/categories/subcategories/remove', {
      params: { accountId, category: categoryName, subcategory: subcategoryName },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing subcategory:', error);
    throw error;
  }
};

// Update subcategory color
export const updateSubcategoryColorApi = async (
  accountId: string,
  categoryName: string,
  subcategoryName: string,
  color: CategoryColor
): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>('/api/categories/subcategories/color/update', {
      accountId,
      category_name: categoryName,
      subcategory_name: subcategoryName,
      color: color,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating subcategory color:', error);
    throw error;
  }
};