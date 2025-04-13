export interface SubcategoryService {
  subcategories: string[][];
  addSubcategory: (categoryIndex: number) => void;
  removeSubcategory: (categoryIndex: number, subIndex: number) => void;
  editSubcategory: (categoryIndex: number, subIndex: number, newName: string) => void;
  confirmSubcategory: (categoryIndex: number, subIndex: number) => void;
}

export const createSubcategoryService = (
  subcategories: string[][],
  setSubcategories: React.Dispatch<React.SetStateAction<string[][]>>
): SubcategoryService => {
  const addSubcategory = (categoryIndex: number) => {
    const updatedSubcategories = [...subcategories];
    updatedSubcategories[categoryIndex] = [
      ...(updatedSubcategories[categoryIndex] || []),
      '', // Add an empty subcategory for inline editing
    ];
    setSubcategories(updatedSubcategories);
  };

  const removeSubcategory = (categoryIndex: number, subIndex: number) => {
    const updatedSubcategories = [...subcategories];
    updatedSubcategories[categoryIndex].splice(subIndex, 1); // Remove the subcategory
    setSubcategories(updatedSubcategories);
  };

  const editSubcategory = (categoryIndex: number, subIndex: number, newName: string) => {
    const updatedSubcategories = [...subcategories];
    updatedSubcategories[categoryIndex][subIndex] = newName; // Update the subcategory name
    setSubcategories(updatedSubcategories);
  };

  const confirmSubcategory = (categoryIndex: number, subIndex: number) => {
    // Subcategories don't need a separate "confirmed" state in this implementation
    // You can add logic here if needed
  };

  return {
    subcategories,
    addSubcategory,
    removeSubcategory,
    editSubcategory,
    confirmSubcategory,
  };
};