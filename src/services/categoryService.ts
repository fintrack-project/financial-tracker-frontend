import axios from 'axios';

export interface CategoryService {
  categories: string[];
  confirmedCategories: string[];
  addCategory: () => void;
  removeCategory: (accountId: string, category: string) => Promise<void>;
  editCategory: (index: number, newName: string) => void;
  confirmCategory: (accountId: string, index: number) => void;
  updateHoldingsCategories: (
    accountId: string,
    holdingsCategories: {
      [category: string]: {
        [assetName: string]: string | null;
      };
    }
  ) => Promise<void>;
  addHoldingsCategory: (
    accountId: string,
    holdingsCategories: {
      [category: string]: {
        [assetName: string]: string | null;
      };
    }
  ) => Promise<void>;
  removeHoldingsCategory: (accountId: string, category: string) => Promise<void>;
  fetchCategoriesAndSubcategories: (
    accountId: string
  ) => Promise<{ categories: string[]; subcategories: { [category: string]: string[] } }>;
  fetchHoldingsCategories: (accountId: string) => Promise<any>;
}

export const createCategoryService = (
  categories: string[],
  setCategories: React.Dispatch<React.SetStateAction<string[]>>,
  confirmedCategories: string[]
): CategoryService => {

  const addCategory = () => {
    if (categories.length < 3) {
      setCategories([...categories, '']); // Add an empty category for inline editing
    }
  };

  const editCategory = (index: number, newName: string) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = newName;
    setCategories(updatedCategories);
  };

  const fetchCategoriesAndSubcategories = async (
    accountId: string
  ) => {
    try {
      const response = await axios.get(`/api/categories/fetch`, {
        params: { accountId },
      });

      const fetchedCategories = response.data.categories || [];
      const fetchedSubcategories = response.data.subcategories || {};

      return { categories: fetchedCategories, subcategories: fetchedSubcategories };
    } catch (error) {
      console.error('Error fetching categories and subcategories:', error);
      throw error;
    }
  };

  const confirmCategory = async (accountId: string, index: number) => {
    const categoryName = categories[index];
  
    if (!categoryName.trim()) {
      alert('Category name cannot be empty.');
      return;
    }
  
    try {
      // Check if the category is newly added
      const isNewCategory = index + 1 > confirmedCategories.length;
  
      if (isNewCategory) {
          // Send the new category with priority to the backend
          console.log(`Adding new category "${categoryName}".`);
          await axios.post(`/api/categories/add`, {
            accountId,
            category_name: categoryName
          });
      } else {
          // Check if the name has changed
          const oldCategoryName = confirmedCategories[index]; // Use the confirmed index
          if (oldCategoryName === categoryName) {
            console.log(`Category "${categoryName}" is unchanged. No request sent.`);
            return;
          }

          // Update the category name while keeping its priority and subcategories
          console.log(`Renaming category "${oldCategoryName}" to "${categoryName}".`);
          await axios.post(`/api/categories/name/update`, {
            accountId,
            old_category_name: oldCategoryName, // Original name
            new_category_name: categoryName,
          });
      }
      
      console.log(`Confirmed Categories after marking:"${Array.from(categories)}"`);
    } catch (error) {
      console.error(`Error confirming category "${categoryName}":`, error);
      alert(`Failed to confirm category "${categoryName}".`);
    }
  };

  const removeCategory = async (accountId: string, category: string) => {
    if (!category.trim()) {
      console.log(`Ignoring empty category removal.`);
      return;
    }

    try {
      await axios.delete(`/api/categories/remove`, {
        params: { accountId, category },
      });
    } catch (error) {
      console.error(`Error removing category "${category}":`, error);
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

  const removeHoldingsCategory = async (accountId: string, category: string) => {
    try {
      console.log(`Removing holdings category: ${category}`);
  
      const response = await axios.post(`/api/categories/holdings/remove`, null, {
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
  
      console.log('Fetched holdings categories:', response.data);
      return response.data; // Return the fetched data
    } catch (error) {
      console.error('Error fetching holdings categories:', error);
      throw new Error('Failed to fetch holdings categories.');
    }
  };

  return {
    categories,
    confirmedCategories,
    addCategory,
    removeCategory,
    editCategory,
    confirmCategory,
    updateHoldingsCategories,
    addHoldingsCategory,
    removeHoldingsCategory,
    fetchCategoriesAndSubcategories,
    fetchHoldingsCategories,
  };
};