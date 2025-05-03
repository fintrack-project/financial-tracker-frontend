import axios from 'axios';

// Add a new holdings category
export const addHoldingsCategoryApi = async (
  accountId: string,
  holdingsCategories: {
    [category: string]: {
      [assetName: string]: string | null;
    };
  }
) => {
  return axios.post(`/api/categories/holdings/add`, holdingsCategories, {
    params: { accountId },
  });
};

// Update holdings categories
export const updateHoldingsCategoriesApi = async (
  accountId: string,
  holdingsCategories: {
    [category: string]: {
      [assetName: string]: string | null;
    };
  }
) => {
  return axios.post(`/api/categories/holdings/update`, holdingsCategories, {
    params: { accountId },
  });
};

// Remove a holdings category
export const removeHoldingsCategoryApi = async (accountId: string, category: string) => {
  return axios.post(`/api/categories/holdings/remove`, null, {
    params: { accountId, category },
  });
};

// Fetch holdings categories
export const fetchHoldingsCategoriesApi = async (accountId: string) => {
  return axios.get(`/api/categories/holdings/fetch`, {
    params: { accountId },
  });
};