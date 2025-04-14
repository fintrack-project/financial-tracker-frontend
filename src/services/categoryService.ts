import axios from 'axios';

const API_BASE_URL = '/api/categories';

export interface CategoryService {
  categories: string[];
  confirmedCategories: Set<number>;
  addCategory: () => void;
  removeCategory: (index: number) => void;
  editCategory: (index: number, newName: string) => void;
  confirmCategory: (index: number) => void;
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

  return {
    categories,
    confirmedCategories,
    addCategory,
    removeCategory,
    editCategory,
    confirmCategory
  };
};

export const updateCategories = async (accountId: string, categories: { name: string; subcategories: string[] }[]) => {
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

export const updateHoldingsCategories = async (accountId: string, holdingsCategories: { category: string; subcategories: string[] }[]) => {
  try {
    const response = await axios.post(`api/categories/holdings/update`, holdingsCategories, {
      params: { accountId },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating holdings categories:', error);
    throw error;
  }
};