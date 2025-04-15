import axios from 'axios';

export interface subcategoryService {
  subcategories: { [category: string]: string[] }; // Holds the subcategories for each category
  addSubcategory: (category: string) => void; // Adds a new subcategory to a category
  editSubcategory: (category: string, subIndex: number, newValue: string) => void; // Edits an existing subcategory
  removeSubcategory: (
    accountId: string,
    category: string,
    subcategory: string
  ) => Promise<void>; // Removes a subcategory from a category
}

export const createSubcategoryService = (
  subcategories: { [category: string]: string[] },
  setSubcategories: React.Dispatch<React.SetStateAction<{ [category: string]: string[] }>>
) => {
  // Initialize confirmedSubcategories to track confirmed subcategories for each category
  const confirmedSubcategories: { [category: string]: Set<number> } = {};

  const addSubcategory = (category: string) => {
    const updatedSubcategories = { ...subcategories };
    if (!updatedSubcategories[category]) {
      updatedSubcategories[category] = [];
    }
    updatedSubcategories[category].push(''); // Add an empty subcategory
    setSubcategories(updatedSubcategories);
  };

  const removeSubcategory = async (accountId: string, category: string, subcategory: string) => {
    try {
      await axios.delete(`/api/categories/subcategories/remove`, {
        params: { accountId, category, subcategory },
      });
    } catch (error) {
      console.error(`Error removing subcategory "${subcategory}" from category "${category}":`, error);
      throw error;
    }
  };

  const editSubcategory = (category: string, subIndex: number, newValue: string) => {
    const updatedSubcategories = { ...subcategories };
    if (updatedSubcategories[category]) {
      updatedSubcategories[category][subIndex] = newValue;
    }
    setSubcategories(updatedSubcategories);
  };

  const confirmSubcategory = async (
    accountId: string,
    category: string,
    subIndex: number,
    subcategories: string[]
  ) => {
    const subcategoryName = subcategories[subIndex];
  
    if (!subcategoryName.trim()) {
      alert('Subcategory name cannot be empty.');
      return;
    }
  
    try {
      // Initialize the confirmedSubcategories set for the category if it doesn't exist
      if (!confirmedSubcategories[category]) {
        confirmedSubcategories[category] = new Set();
      }

      // Check if the subcategory is newly added
      const isNewSubcategory = !confirmedSubcategories[category].has(subIndex);

      if (isNewSubcategory) {
        // Add the new subcategory to the backend
        await axios.post(`/api/categories/subcategories/add`, {
          accountId,
          category_name: category,
          subcategory_name: subcategoryName,
        });
  
        console.log(`New subcategory "${subcategoryName}" added to category "${category}".`);
      } else {
        // Update the subcategory name in the backend
        await axios.put(`/api/categories/subcategories/update`, {
          accountId,
          category_name: category,
          old_subcategory_name: subcategories[subIndex],
          new_subcategory_name: subcategoryName,
        });
  
        console.log(`Subcategory "${subcategories[subIndex]}" renamed to "${subcategoryName}" in category "${category}".`);
      }

      // Mark the subcategory as confirmed
      confirmedSubcategories[category].add(subIndex);
    } catch (error) {
      console.error(`Error confirming subcategory "${subcategoryName}" in category "${category}":`, error);
      alert(`Failed to confirm subcategory "${subcategoryName}" in category "${category}".`);
    }
  };

  return {
    addSubcategory, 
    editSubcategory, 
    removeSubcategory,
    confirmSubcategory,
  };
};