import {
  addSubcategoryApi,
  updateSubcategoryNameApi,
  removeSubcategoryApi,
  updateSubcategoryColorApi,
  fetchSubcategoryColorMapApi
} from '../api/subCategoryApi';
import { CategoryColor } from '../types/CategoryTypes';

export interface subCategoryService {
  subcategories: { [category: string]: string[] }; // Holds the subcategories for each category
  confirmedSubcategories: { [category: string]: string[] }; // Holds confirmed subcategories for each category
  selectedColors: { [category: string]: { [index: number]: CategoryColor } }; // Holds selected colors for new subcategories
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
  setSelectedColor: (category: string, subIndex: number, color: CategoryColor) => void; // Sets selected color for a subcategory
}

export const createSubcategoryService = (
  subcategories: { [category: string]: string[] },
  setSubcategories: React.Dispatch<React.SetStateAction<{ [category: string]: string[] }>>,
  confirmedSubcategories: { [category: string]: string[] }, // Holds confirmed subcategories for each category
  selectedColors: { [category: string]: { [index: number]: CategoryColor } },
  setSelectedColors: React.Dispatch<React.SetStateAction<{ [category: string]: { [index: number]: CategoryColor } }>>,
  showNotification?: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void
) : subCategoryService => {

  const addSubcategory = (category: string) => {
    const updatedSubcategories = { ...subcategories };
    if (!updatedSubcategories[category]) {
      updatedSubcategories[category] = [];
    }
    updatedSubcategories[category].push(''); // Add an empty subcategory
    setSubcategories(updatedSubcategories);
  };

  const setSelectedColor = (category: string, subIndex: number, color: CategoryColor) => {
    setSelectedColors(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}),
        [subIndex]: color
      }
    }));
  };

  const removeSubcategory = async (accountId: string, category: string, subcategory: string) => {
    if (!subcategory.trim()) {
      console.log(`Ignoring empty subcategory removal for category "${category}".`);
      return;
    }

    try {
      await removeSubcategoryApi(accountId, category, subcategory);
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
    subIndex: number
  ) => {
    const subcategoryName = subcategories[category][subIndex];
  
    if (!subcategoryName.trim()) {
      showNotification?.('error', 'Subcategory name cannot be empty.');
      return;
    }
  
    try {
  
      // Check if the subcategory is newly added
      const isNewSubcategory = subIndex + 1 > confirmedSubcategories[category].length;

      if (isNewSubcategory) {
        // Get the selected color if it exists
        const selectedColor = selectedColors[category]?.[subIndex];
        
        // Add the new subcategory to the backend with color
        console.log(`Adding new subcategory "${subcategoryName}" to category "${category}" with color ${selectedColor || 'default'}.`);
        await addSubcategoryApi(accountId, category, subcategoryName, selectedColor);
        
        // Clear the selected color
        if (selectedColor) {
          setSelectedColors(prev => {
            const newColors = { ...prev };
            if (newColors[category]) {
              delete newColors[category][subIndex];
              if (Object.keys(newColors[category]).length === 0) {
                delete newColors[category];
              }
            }
            return newColors;
          });
        }
      } else {
        // Check if the name has changed
        const oldSubcategoryName = confirmedSubcategories[category][subIndex];
        if (oldSubcategoryName === subcategoryName) {
          console.log(`Subcategory "${subcategoryName}" is unchanged. No request sent.`);
          return;
        }

        // Update the subcategory name in the backend
        console.log(`Renaming subcategory "${oldSubcategoryName}" in category "${category}".`);
        await updateSubcategoryNameApi(accountId, category, oldSubcategoryName, subcategoryName);
      }
    } catch (error) {
      console.error(`Error confirming subcategory "${subcategoryName}" in category "${category}":`, error);
      showNotification?.('error', `Failed to confirm subcategory "${subcategoryName}" in category "${category}".`);
    }
  };

  return {
    subcategories,
    confirmedSubcategories,
    selectedColors,
    addSubcategory, 
    editSubcategory, 
    removeSubcategory,
    confirmSubcategory,
    setSelectedColor,
  };
};

export const updateSubcategoryColor = async (
  accountId: string,
  categoryName: string,
  subcategoryName: string,
  color: CategoryColor
): Promise<void> => {
  try {
    const response = await updateSubcategoryColorApi(accountId, categoryName, subcategoryName, color);
    if (!response.success) {
      throw new Error(response.message || 'Failed to update subcategory color');
    }
  } catch (error) {
    console.error('Error updating subcategory color:', error);
    throw error;
  }
};

export const fetchSubcategoryColorMap = async (
  accountId: string,
  categoryName: string
): Promise<{ [subcategory: string]: CategoryColor }> => {
  try {
    const response = await fetchSubcategoryColorMapApi(accountId, categoryName);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch subcategory color map');
    }
    return response.data.subcategoryColors;
  } catch (error) {
    console.error('Error fetching subcategory color map:', error);
    throw error;
  }
};