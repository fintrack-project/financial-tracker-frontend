import axios from 'axios';

export interface subcategoryService {
  subcategories: { [category: string]: string[] }; // Holds the subcategories for each category
  addSubcategory: (category: string) => void; // Adds a new subcategory to a category
  editSubcategory: (category: string, subIndex: number, newValue: string) => void; // Edits an existing subcategory
  removeSubcategory: (category: string, subIndex: number) => void; // Removes a subcategory from a category
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

  const editSubcategory = (category: string, subIndex: number, newValue: string) => {
    const updatedSubcategories = { ...subcategories };
    if (updatedSubcategories[category]) {
      updatedSubcategories[category][subIndex] = newValue;
    }
    setSubcategories(updatedSubcategories);
  };

  // const removeSubcategory = (category: string, subIndex: number) => {
  //   const updatedSubcategories = { ...subcategories };
  //   if (updatedSubcategories[category]) {
  //     updatedSubcategories[category].splice(subIndex, 1); // Remove the subcategory at the given index
  //     if (updatedSubcategories[category].length === 0) {
  //       delete updatedSubcategories[category]; // Remove the category if no subcategories remain
  //     }
  //   }
  //   setSubcategories(updatedSubcategories);
  // };

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
    // removeSubcategory,
    updateSubcategory,
  };
};