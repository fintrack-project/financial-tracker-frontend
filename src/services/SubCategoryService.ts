import axios from 'axios';

export interface subcategoryService {
  subcategories: { [category: string]: string[] }; // Holds the subcategories for each category
  addSubcategory: (category: string) => void; // Adds a new subcategory to a category
  editSubcategory: (category: string, subIndex: number, newValue: string) => void; // Edits an existing subcategory
  removeSubcategory: (
    accountId: string,
    category: string,
    subcategory: string
  ) => Promise<void>; // Removes a subcategory from a category
  updateSubcategory: (
    accountId: string,
    subcategoryData: { category_name: string; subcategories: string[] }
  ) => Promise<void>; // Syncs a subcategory with the backend
}

export const createSubcategoryService = (
  subcategories: { [category: string]: string[] },
  setSubcategories: React.Dispatch<React.SetStateAction<{ [category: string]: string[] }>>
) => {
  const addSubcategory = (category: string) => {
    const updatedSubcategories = { ...subcategories };
    if (!updatedSubcategories[category]) {
      updatedSubcategories[category] = [];
    }
    updatedSubcategories[category].push(''); // Add an empty subcategory
    setSubcategories(updatedSubcategories);
  };

  const removeSubcategory = async (accountId: string, category: string, subcategory: string) => {
    try {
      await axios.delete(`/api/categories/subcategories/remove`, {
        params: { accountId, category, subcategory },
      });
    } catch (error) {
      console.error(`Error removing subcategory "${subcategory}" from category "${category}":`, error);
      throw error;
    }
  };

  const editSubcategory = (category: string, subIndex: number, newValue: string) => {
    const updatedSubcategories = { ...subcategories };
    if (updatedSubcategories[category]) {
      updatedSubcategories[category][subIndex] = newValue;
    }
    setSubcategories(updatedSubcategories);
  };

  const updateSubcategory = async (
    accountId: string,
    subcategoryData: { category_name: string; subcategories: string[] }
  ) => {
    try {
      console.log('Updating subcategory:', subcategoryData);
      const response = await axios.post(`/api/categories/subcategories/update`, subcategoryData, {
        params: { accountId },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating subcategory:', error);
      throw error;
    }
  };

  return {
    addSubcategory, 
    editSubcategory, 
    updateSubcategory,
    removeSubcategory,
  };
};