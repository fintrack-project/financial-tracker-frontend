import axios from 'axios';

export interface CategoryService {
  categories: string[];
  confirmedCategories: Set<number>;
  addCategory: () => void;
  removeCategory: (index: number) => void;
  editCategory: (index: number, newName: string) => void;
  confirmCategory: (index: number) => void;
  updateCategories: (accountId: string, categories: { category_name: string; subcategories: string[] }[]) => Promise<void>;
  updateHoldingsCategories: (
    accountId: string,
    holdingsCategories: { asset_name: string; category: string; subcategory: string | null }[]
  ) => Promise<void>;
  fetchCategoriesAndSubcategories: (
    accountId: string
  ) => Promise<{ categories: string[]; subcategories: { [category: string]: string[] } }>;
}

export const createCategoryService = (
  categories: string[],
  setCategories: React.Dispatch<React.SetStateAction<string[]>>
): CategoryService => {
  const confirmedCategories: Set<number> = new Set();

  const addCategory = () => {
    if (categories.length < 3) {
      setCategories([...categories, '']); // Add an empty category for inline editing
    }
  };

  const removeCategory = (index: number) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    setCategories(updatedCategories);
    confirmedCategories.delete(index); // Remove the category from confirmed state
  };

  const editCategory = (index: number, newName: string) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = newName;
    setCategories(updatedCategories);
    confirmedCategories.delete(index); // Allow editing for subcategories
  };

  const confirmCategory = (index: number) => {
    confirmedCategories.add(index); // Mark the category as confirmed
  };

  const updateCategories = async (
    accountId: string, 
    categories: { category_name: string; subcategories: string[] }[]
  ) => {
    try {
      const response = await axios.post(`api/categories/update`, categories, {
        params: { accountId },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating categories:', error);
      throw error;
    }
  };

  const updateHoldingsCategories = async (
    accountId: string, 
    holdingsCategories: { asset_name: string; category: string; subcategory: string | null }[]
  ) => {
    try {
      // Transform the data into the expected format
      const formattedCategories = holdingsCategories.reduce((acc, holding) => {
        const existingCategory = acc.find((item) => item.category === holding.category);
  
        if (existingCategory) {
          // Add the subcategory to the existing category
          if (holding.subcategory) {
            existingCategory.subcategories.push(holding.subcategory);
          }
        } else {
          // Create a new category entry
          acc.push({
            category: holding.category,
            subcategories: holding.subcategory ? [holding.subcategory] : [],
          });
        }
  
        return acc;
      }, [] as { category: string; subcategories: string[] }[]);
  
      // Send the transformed data to the backend
      console.log('Payload sent to backend:', holdingsCategories); // Log the payload
      const response = await axios.post(`api/categories/holdings/update`, holdingsCategories, {
        params: { accountId },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error updating holdings categories:', error);
      throw error;
    }
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

  return {
    categories,
    confirmedCategories,
    addCategory,
    removeCategory,
    editCategory,
    confirmCategory,
    updateCategories,
    updateHoldingsCategories,
    fetchCategoriesAndSubcategories,
  };
};