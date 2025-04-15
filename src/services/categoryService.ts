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
    holdingsCategories: { asset_name: string; category: string; subcategory: string | null }[]
  ) => Promise<void>;
  fetchCategoriesAndSubcategories: (
    accountId: string
  ) => Promise<{ categories: string[]; subcategories: { [category: string]: string[] } }>;
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

  const removeCategory = async (accountId: string, category: string) => {
    try {
      await axios.delete(`/api/categories/remove`, {
        params: { accountId, category },
      });
    } catch (error) {
      console.error(`Error removing category "${category}":`, error);
      throw error;
    }
  };

  const editCategory = (index: number, newName: string) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = newName;
    console.log(`Editing category "${updatedCategories[index]}" to "${newName}".`);
    console.log(`Confirmed categories before edit:`, confirmedCategories);
    setCategories(updatedCategories);
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
  
          console.log(`New category "${categoryName}" added.`);
      } else {
          // Check if the name has changed
          const oldCategoryName = confirmedCategories[index]; // Use the confirmed index
          if (oldCategoryName === categoryName) {
            console.log(`Category "${categoryName}" is unchanged. No request sent.`);
            return;
          }

          // Log the payload for debugging
          console.log('Payload for category update:', {
            accountId,
            old_category_name: oldCategoryName,
            new_category_name: categoryName,
          });

          // Update the category name while keeping its priority and subcategories
          console.log(`Renaming category "${oldCategoryName}" to "${categoryName}".`);
          await axios.post(`/api/categories/name/update`, {
            accountId,
            old_category_name: oldCategoryName, // Original name
            new_category_name: categoryName,
          });
    
          console.log(`Category "${oldCategoryName}" renamed to "${categoryName}".`);
      }
      
      console.log(`Confirmed Categories after marking:"${Array.from(categories)}"`);
    } catch (error) {
      console.error(`Error confirming category "${categoryName}":`, error);
      alert(`Failed to confirm category "${categoryName}".`);
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
    updateHoldingsCategories,
    fetchCategoriesAndSubcategories,
  };
};