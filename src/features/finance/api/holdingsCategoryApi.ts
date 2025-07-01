import { apiClient } from '../../../shared/utils/apiClient';
import { ApiResponse } from '../../../shared/types/ApiTypes';
import { HoldingsCategories } from '../types/HoldingsCategoriesTypes';

// Add a new holdings category
export const addHoldingsCategoryApi = async (
  accountId: string,
  holdingsCategories: HoldingsCategories
): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>('/api/categories/holdings/add', holdingsCategories, {
      params: { accountId },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding holdings category:', error);
    throw error;
  }
};

// Update holdings categories
export const updateHoldingsCategoriesApi = async (
  accountId: string,
  holdingsCategories: HoldingsCategories
): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>('/api/categories/holdings/update', holdingsCategories, {
      params: { accountId },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating holdings categories:', error);
    throw error;
  }
};

// Remove a holdings category
export const removeHoldingsCategoryApi = async (accountId: string, category: string): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>('/api/categories/holdings/remove', null, {
      params: { accountId, category },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing holdings category:', error);
    throw error;
  }
};

// Fetch holdings categories
export const fetchHoldingsCategoriesApi = async (accountId: string): Promise<ApiResponse<HoldingsCategories>> => {
  try {
    const response = await apiClient.get<ApiResponse<HoldingsCategories>>('/api/categories/holdings/fetch', {
      params: { accountId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching holdings categories:', error);
    throw error;
  }
};