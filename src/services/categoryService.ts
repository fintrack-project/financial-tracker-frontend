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