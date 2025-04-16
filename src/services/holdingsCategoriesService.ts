import axios from 'axios';

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
  fetchHoldingsCategories: (accountId: string) => Promise<any>;
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

      const response = await axios.post(`/api/categories/holdings/add`, holdingsCategories, {
        params: { accountId },
      });

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
      console.log('Updating holdings categories:', holdingsCategories);

      const response = await axios.post(`/api/categories/holdings/update`, holdingsCategories, {
        params: { accountId },
      });

      return response.data;
    } catch (error) {
      console.error('Error updating holdings categories:', error);
      throw error;
    }
  };

  const removeHoldingsCategory = async (accountId: string, category: string) => {
    try {
      console.log(`Removing holdings category: ${category}`);

      const response = await axios.post(`/api/categories/holdings/fetch/remove`, null, {
        params: { accountId, category },
      });

      console.log(`Successfully removed holdings category: ${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing holdings category "${category}":`, error);
      throw new Error(`Failed to remove holdings category "${category}".`);
    }
  };

  const fetchHoldingsCategories = async (accountId: string) => {
    try {
      const response = await axios.get(`/api/categories/holdings/fetch`, {
        params: { accountId },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching holdings categories:', error);
      throw error;
    }
  };

  return {
    addHoldingsCategory,
    updateHoldingsCategories,
    removeHoldingsCategory,
    fetchHoldingsCategories,
  };
};