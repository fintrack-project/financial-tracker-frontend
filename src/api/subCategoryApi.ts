import axios from 'axios';

// Add a new subcategory
export const addSubcategoryApi = async (
  accountId: string,
  categoryName: string,
  subcategoryName: string
) => {
  return axios.post(`/api/categories/subcategories/add`, {
    accountId,
    category_name: categoryName,
    subcategory_name: subcategoryName,
  });
};

// Update a subcategory name
export const updateSubcategoryNameApi = async (
  accountId: string,
  categoryName: string,
  oldSubcategoryName: string,
  newSubcategoryName: string
) => {
  return axios.post(`/api/categories/subcategories/name/update`, {
    accountId,
    category_name: categoryName,
    old_subcategory_name: oldSubcategoryName,
    new_subcategory_name: newSubcategoryName,
  });
};

// Remove a subcategory
export const removeSubcategoryApi = async (
  accountId: string,
  categoryName: string,
  subcategoryName: string
) => {
  return axios.delete(`/api/categories/subcategories/remove`, {
    params: { accountId, category: categoryName, subcategory: subcategoryName },
  });
};