import axios from 'axios';

// Fetch category names
export const fetchCategoryNamesApi = async (accountId: string): Promise<string[]> => {
  return axios.get(`/api/categories/fetch/names`, {
    params: { accountId },
  });
};

// Fetch categories and subcategories
export const fetchCategoriesAndSubcategoriesApi = async (accountId: string) => {
  return axios.get(`/api/categories/fetch`, {
    params: { accountId },
  });
};

// Add a new category
export const addCategoryApi = async (accountId: string, categoryName: string) => {
  return axios.post(`/api/categories/add`, {
    accountId,
    category_name: categoryName,
  });
};

// Update category name
export const updateCategoryNameApi = async (
  accountId: string,
  oldCategoryName: string,
  newCategoryName: string
) => {
  return axios.post(`/api/categories/name/update`, {
    accountId,
    old_category_name: oldCategoryName,
    new_category_name: newCategoryName,
  });
};

// Remove a category
export const removeCategoryApi = async (accountId: string, category: string) => {
  return axios.delete(`/api/categories/remove`, {
    params: { accountId, category },
  });
};