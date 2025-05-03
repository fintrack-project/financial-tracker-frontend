// import axios from 'axios';
import {
  addHoldingsCategoryApi,
  updateHoldingsCategoriesApi,
  removeHoldingsCategoryApi,
  fetchHoldingsCategoriesApi,
} from '../api/holdingsCategoryApi';

export interface HoldingsCategoriesService {
  addHoldingsCategory: (
    accountId: string,
    holdingsCategories: {
      [category: string]: {
        [assetName: string]: string | null;
      };
    }
  ) => Promise<void>;
  updateHoldingsCategories: (
    accountId: string,
    holdingsCategories: {
      [category: string]: {
        [assetName: string]: string | null;
      };
    }
  ) => Promise<void>;
  removeHoldingsCategory: (accountId: string, category: string) => Promise<void>;
}

export const createHoldingsCategoriesService = () => {
  const addHoldingsCategory = async (
    accountId: string,
    holdingsCategories: {
      [category: string]: {
        [assetName: string]: string | null;
      };
    }
  ) => {
    try {
      console.log('Adding new holdings category:', holdingsCategories);

      const response = await addHoldingsCategoryApi(accountId, holdingsCategories);

      return response.data;
    } catch (error) {
      console.error('Error adding new holdings category:', error);
      throw error;
    }
  };

  const updateHoldingsCategories = async (
    accountId: string,
    holdingsCategories: {
      [category: string]: {
        [assetName: string]: string | null;
      };
    }
  ) => {
    try {
      const response = await updateHoldingsCategoriesApi(accountId, holdingsCategories);

      return response.data;
    } catch (error) {
      console.error('Error updating holdings categories:', error);
      throw error;
    }
  };

  const removeHoldingsCategory = async (accountId: string, category: string) => {
    try {
      console.log(`Removing holdings category: ${category}`);

      const response = await removeHoldingsCategoryApi(accountId, category);

      console.log(`Successfully removed holdings category: ${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing holdings category "${category}":`, error);
      throw new Error(`Failed to remove holdings category "${category}".`);
    }
  };

  return {
    addHoldingsCategory,
    updateHoldingsCategories,
    removeHoldingsCategory
  };
};

export const fetchHoldingsCategories = async (accountId: string) => {
  try {
    const response = await fetchHoldingsCategoriesApi(accountId);

    return response.data;
  } catch (error) {
    console.error('Error fetching holdings categories:', error);
    throw error;
  }
};