// export interface SubcategoryService {
//   subcategories: string[][];
//   addSubcategory: (categoryIndex: number) => void;
//   removeSubcategory: (categoryIndex: number, subIndex: number) => void;
//   editSubcategory: (categoryIndex: number, subIndex: number, newName: string) => void;
//   confirmSubcategory: (categoryIndex: number, subIndex: number) => void;
// }

// export const createSubcategoryService = (
//   subcategories: string[][],
//   setSubcategories: React.Dispatch<React.SetStateAction<string[][]>>
// ): SubcategoryService => {
//   const addSubcategory = (categoryIndex: number) => {
//     const updatedSubcategories = [...subcategories];
//     updatedSubcategories[categoryIndex] = [
//       ...(updatedSubcategories[categoryIndex] || []),
//       '', // Add an empty subcategory for inline editing
//     ];
//     setSubcategories(updatedSubcategories);
//   };

//   const removeSubcategory = (categoryIndex: number, subIndex: number) => {
//     const updatedSubcategories = [...subcategories];
//     updatedSubcategories[categoryIndex].splice(subIndex, 1); // Remove the subcategory
//     setSubcategories(updatedSubcategories);
//   };

//   const editSubcategory = (categoryIndex: number, subIndex: number, newName: string) => {
//     const updatedSubcategories = [...subcategories];
//     updatedSubcategories[categoryIndex][subIndex] = newName; // Update the subcategory name
//     setSubcategories(updatedSubcategories);
//   };

//   const confirmSubcategory = (categoryIndex: number, subIndex: number) => {
//     // Subcategories don't need a separate "confirmed" state in this implementation
//     // You can add logic here if needed
//   };

//   return {
//     subcategories,
//     addSubcategory,
//     removeSubcategory,
//     editSubcategory,
//     confirmSubcategory,
//   };
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