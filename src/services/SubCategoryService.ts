import axios from 'axios';
import { sub } from 'date-fns';

export interface subCategoryService {
  subcategories: { [category: string]: string[] }; // Holds the subcategories for each category
  confirmedSubcategories: { [category: string]: string[] }; // Holds confirmed subcategories for each category
  addSubcategory: (category: string) => void; // Adds a new subcategory to a category
  editSubcategory: (category: string, subIndex: number, newValue: string) => void; // Edits an existing subcategory
  confirmSubcategory: (
    accountId: string,
    category: string,
    subIndex: number
  ) => Promise<void>; // Confirms a subcategory and sends it to the backend
  removeSubcategory: (
    accountId: string,
    category: string,
    subcategory: string
  ) => Promise<void>; // Removes a subcategory from a category

}

export const createSubcategoryService = (
  subcategories: { [category: string]: string[] },
  setSubcategories: React.Dispatch<React.SetStateAction<{ [category: string]: string[] }>>,
  confirmedSubcategories: { [category: string]: string[] } // Holds confirmed subcategories for each category
) : subCategoryService => {

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
      console.log(`Editing subcategory "${updatedSubcategories[category][subIndex]}" in category "${category}" to "${newValue}".`);
      console.log(`Confirmed subcategories for category "${category}":`, confirmedSubcategories[category]);
      console.log('subcategories === confirmedSubcategories:', subcategories === confirmedSubcategories);
      console.log('updatedSubcategories === confirmedSubcategories:', updatedSubcategories === confirmedSubcategories);
    }

    setSubcategories(updatedSubcategories);
  };

  const confirmSubcategory = async (
    accountId: string,
    category: string,
    subIndex: number
  ) => {
    const subcategoryName = subcategories[category][subIndex];
  
    if (!subcategoryName.trim()) {
      alert('Subcategory name cannot be empty.');
      return;
    }
  
    try {
      console.log(`Starting confirmation for subcategory "${subcategoryName}" in category "${category}".`);
      console.log(`Subcategories for category "${category}":`, subcategories);
      console.log(`Confirmed subcategories for category "${category}":`, confirmedSubcategories[category]);
  
      // Check if the subcategory is newly added
      const isNewSubcategory = subIndex + 1 > confirmedSubcategories[category].length;
      console.log(`Is new subcategory: ${isNewSubcategory}`);

      if (isNewSubcategory) {
        // Add the new subcategory to the backend
        console.log(`Adding new subcategory "${subcategoryName}" to category "${category}".`);
        await axios.post(`/api/categories/subcategories/add`, {
          accountId,
          category_name: category,
          subcategory_name: subcategoryName,
        });
  
        console.log(`New subcategory "${subcategoryName}" added to category "${category}".`);
      } else {
        // Check if the name has changed
        const oldSubcategoryName = confirmedSubcategories[category][subIndex];
        if (oldSubcategoryName === subcategoryName) {
          console.log(`Subcategory "${subcategoryName}" is unchanged. No request sent.`);
          return;
        }

        // Update the subcategory name in the backend
        console.log(`Renaming subcategory "${oldSubcategoryName}" in category "${category}".`);
        await axios.post(`/api/categories/subcategories/name/update`, {
          accountId,
          category_name: category,
          old_subcategory_name: subcategories[subIndex],
          new_subcategory_name: subcategoryName,
        });
  
        console.log(`Subcategory "${oldSubcategoryName}" renamed to "${subcategoryName}" in category "${category}".`);
      }
    } catch (error) {
      console.error(`Error confirming subcategory "${subcategoryName}" in category "${category}":`, error);
      alert(`Failed to confirm subcategory "${subcategoryName}" in category "${category}".`);
    }
  };

  return {
    subcategories,
    confirmedSubcategories,
    addSubcategory, 
    editSubcategory, 
    removeSubcategory,
    confirmSubcategory,
  };
};