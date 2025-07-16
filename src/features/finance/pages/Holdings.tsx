import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import EditableHoldingsTable from '../components/HoldingsTable/EditableHoldingsTable';
import CategoriesTable from '../../categories/components/CategoryTable/CategoriesTable';
import { createCategoryService, fetchCategoriesAndSubcategoriesNamesMap, fetchCategoryColorMap } from '../../categories/services/categoryService';
import { createSubcategoryService, fetchSubcategoryColorMap } from '../../categories/services/subCategoryService';
import { createHoldingsCategoriesService, fetchHoldingsCategories } from '../services/holdingsCategoriesService';
import { CategoryColor } from '../../categories/types/CategoryTypes';
import { useNotification } from '../../../shared/contexts/NotificationContext';
import './Holdings.css'; // Import the CSS file

interface HoldingsProps {
  accountId: string | null; // Receive accountId as a prop
}

const Holdings: React.FC<HoldingsProps> = ({ accountId }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<{ [category: string]: string[] }>({});
  const [hasFetched, setHasFetched] = useState(false);
  const [categoryColors, setCategoryColors] = useState<{ [category: string]: CategoryColor }>({});
  const [subcategoryColors, setSubcategoryColors] = useState<{ [category: string]: { [subcategory: string]: CategoryColor } }>({});

  const [confirmedCategories, setConfirmedCategories] = useState<string[]>([]);; // Track confirmed categories
  const [confirmedSubcategories, setConfirmedSubcategories] = useState<{ [category: string]: string[] }>({}); // Track confirmed subcategories
  const [confirmedHoldingsCategories, setConfirmedHoldingsCategories] = useState<{
    [category: string]: {
      [assetName: string]: string | null;
    };
  }>({});

  const categoryService = createCategoryService(categories, setCategories, confirmedCategories);
  const subcategoryService = createSubcategoryService(subcategories, setSubcategories, confirmedSubcategories);
  const holdingsCategoriesService = createHoldingsCategoriesService(
  );
  const { showNotification } = useNotification();
    
  // Fetch categories and subcategories when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (!accountId) {
        console.warn('Account ID is required to fetch categories.');
        return;
      }

      try {
        // Fetch categories and subcategories from the API
        const { categories: fetchedCategories, subcategories: fetchedSubcategories } =
          await fetchCategoriesAndSubcategoriesNamesMap(accountId);

        // Fetch holdings categories from the API
        const response = await fetchHoldingsCategories(accountId);

        // Fetch color maps
        const categoryColorMap = await fetchCategoryColorMap(accountId);
        const subcategoryColorMapPromises = fetchedCategories.map(async (category) => {
          const colors = await fetchSubcategoryColorMap(accountId, category);
          return { category, colors };
        });
        const subcategoryColorMapResults = await Promise.all(subcategoryColorMapPromises);
        const subcategoryColorMap = subcategoryColorMapResults.reduce((acc, { category, colors }) => {
          acc[category] = colors;
          return acc;
        }, {} as { [category: string]: { [subcategory: string]: CategoryColor } });

        // Use the onUpdateCategories callback to update the parent state
        setCategories([...fetchedCategories]);
        setSubcategories(_.cloneDeep(fetchedSubcategories));
        setCategoryColors(categoryColorMap);
        setSubcategoryColors(subcategoryColorMap);

        // Update confirmedCategories
        setConfirmedCategories([...fetchedCategories]);
        setConfirmedSubcategories(_.cloneDeep(fetchedSubcategories));

        // Update holdings categories
        setConfirmedHoldingsCategories(_.cloneDeep(response) || {});

        setHasFetched(true); // Mark as fetched

      } catch (error) {
        console.error('Error fetching data:', error);
        showNotification('error', 'Failed to fetch categories. Please try again.', 5000);
      }
    };

    if (!hasFetched) {
      fetchData();
    }
  }, [accountId, categoryService, subcategoryService, hasFetched, showNotification]);

  // Callback to reset hasFetched state
  const resetHasFetched = () => {
    setHasFetched(false);
  };

  const handleUpdateCategories = (updatedCategories: string[]) => {
    setCategories(updatedCategories);

    // Reset subcategories for any removed categories
    const updatedSubcategories = { ...subcategories };
    Object.keys(updatedSubcategories).forEach((category) => {
      if (!updatedCategories.includes(category)) {
        delete updatedSubcategories[category];
      }
    });
    setSubcategories(updatedSubcategories);
  };

  return (
    <div className="holdings-container">
      <h1 className="fintrack-section-title">Holdings</h1>
      
      {/* My Holdings Widget Container */}
      <div className="holdings-widget">
        <div className="holdings-widget-header">
          <h3>My Holdings</h3>
        </div>
        <div className="holdings-section">
          <EditableHoldingsTable 
            accountId={accountId}
            categories={categories}
            subcategories={subcategories}
            categoryService={categoryService}
            confirmedHoldingsCategories={confirmedHoldingsCategories}
            holdingsCategoriesService={holdingsCategoriesService}
            resetHasFetched={resetHasFetched}
            categoryColors={categoryColors}
            subcategoryColors={subcategoryColors}
          />
        </div>
      </div>

      {/* My Categories Widget Container */}
      <div className="categories-widget">
        <div className="categories-widget-header">
          <h3>My Categories</h3>
        </div>
        <div className="categories-section">
          <CategoriesTable 
            accountId={accountId}
            categories={categories}
            subcategories={subcategories}
            categoryService={categoryService}
            subcategoryService={subcategoryService}
            onUpdateCategories={handleUpdateCategories}
            resetHasFetched={resetHasFetched}
            categoryColors={categoryColors}
            subcategoryColors={subcategoryColors}
          />
        </div>
      </div>
    </div>
  );
};

export default Holdings;