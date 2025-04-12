export interface CategoryService {
  categories: string[];
  subcategories: string[][];
  confirmedCategories: Set<number>;
  addCategory: () => void;
  removeCategory: (index: number) => void;
  editCategory: (index: number, newName: string) => void;
  confirmCategory: (index: number) => void;
  updateSubcategory: (categoryIndex: number, assetIndex: number, value: string) => void;
}

export const createCategoryService = (
  categories: string[],
  subcategories: string[][],
  setCategories: React.Dispatch<React.SetStateAction<string[]>>,
  setSubcategories: React.Dispatch<React.SetStateAction<string[][]>>
) => {
  const confirmedCategories: Set<number> = new Set();

  const addCategory = () => {
    if (categories.length < 3) {
      setCategories([...categories, '']); // Add an empty category for inline editing
      setSubcategories([...subcategories, Array(subcategories[0]?.length || 0).fill('')]); // Add empty subcategories for each asset
    }
  };

  const removeCategory = (index: number) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    const updatedSubcategories = subcategories.filter((_, i) => i !== index);
    setCategories(updatedCategories);
    setSubcategories(updatedSubcategories);
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

  const updateSubcategory = (categoryIndex: number, assetIndex: number, value: string) => {
    const updatedSubcategories = [...subcategories];
    updatedSubcategories[categoryIndex][assetIndex] = value;
    setSubcategories(updatedSubcategories);
  };

  return {
    categories,
    subcategories,
    confirmedCategories,
    addCategory,
    removeCategory,
    editCategory,
    confirmCategory,
    updateSubcategory,
  };
};