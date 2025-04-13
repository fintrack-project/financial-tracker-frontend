export const createSubcategoryService = (
  subcategories: { [category: string]: string[] },
  setSubcategories: React.Dispatch<React.SetStateAction<{ [category: string]: string[] }>>
) => {
  return {
    addSubcategory: (category: string) => {
      const updatedSubcategories = { ...subcategories };
      if (!updatedSubcategories[category]) {
        updatedSubcategories[category] = [];
      }
      updatedSubcategories[category].push(''); // Add an empty subcategory
      setSubcategories(updatedSubcategories);
    },
    editSubcategory: (category: string, subIndex: number, newValue: string) => {
      const updatedSubcategories = { ...subcategories };
      if (updatedSubcategories[category]) {
        updatedSubcategories[category][subIndex] = newValue;
      }
      setSubcategories(updatedSubcategories);
    },
    removeSubcategory: (category: string, subIndex: number) => {
      const updatedSubcategories = { ...subcategories };
      if (updatedSubcategories[category]) {
        updatedSubcategories[category].splice(subIndex, 1); // Remove the subcategory at the given index
        if (updatedSubcategories[category].length === 0) {
          delete updatedSubcategories[category]; // Remove the category if no subcategories remain
        }
      }
      setSubcategories(updatedSubcategories);
    },
  };
};