import React, { useState, useEffect } from 'react';
import _, { set } from 'lodash';
import EditableHoldingsTable from '../../components/Table/HoldingsTable/EditableHoldingsTable';
import CategoriesTable from '../../components/Table/CategoryTable/CategoriesTable';
import { createCategoryService, fetchCategoriesAndSubcategories } from '../../services/categoryService';
import { createSubcategoryService } from '../../services/subCategoryService';
import { createHoldingsCategoriesService, fetchHoldingsCategories } from 'services/holdingsCategoriesService';
import './Holdings.css'; // Import the CSS file

interface HoldingsProps {
  accountId: string | null; // Receive accountId as a prop
}

const Holdings: React.FC<HoldingsProps> = ({ accountId }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<{ [category: string]: string[] }>({});
  const [hasFetched, setHasFetched] = useState(false);

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
          await fetchCategoriesAndSubcategories(accountId);

        // Fetch holdings categories from the API
        const response = await fetchHoldingsCategories(accountId);

        // Use the onUpdateCategories callback to update the parent state
        setCategories([... fetchedCategories]);
        setSubcategories(_.cloneDeep(fetchedSubcategories));

        // Update confirmedCategories
        setConfirmedCategories([... fetchedCategories]);
        setConfirmedSubcategories(_.cloneDeep(fetchedSubcategories));

        // Update holdings categories
        setConfirmedHoldingsCategories(_.cloneDeep(response) || {});

        setHasFetched(true); // Mark as fetched

      } catch (error) {
        alert('Failed to fetch categories. Please try again.');
      }
    };

    if (!hasFetched) {
      fetchData();
    }
  }, [accountId, categoryService, subcategoryService, hasFetched]);

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
      <h2 className="fintrack-section-title">Holdings</h2>
      <div className="holdings-section">
        <EditableHoldingsTable 
          accountId={accountId}
          categories={categories}
          subcategories={subcategories}
          categoryService={categoryService}
          confirmedHoldingsCategories={confirmedHoldingsCategories}
          holdingsCategoriesService={holdingsCategoriesService}
          resetHasFetched={resetHasFetched}
        />
      </div>
      <h2 className="fintrack-section-title">Categories</h2>
      <div className="categories-section">
        <CategoriesTable 
          accountId={accountId}
          categories={categories}
          subcategories={subcategories}
          categoryService={categoryService}
          subcategoryService={subcategoryService}
          onUpdateCategories={handleUpdateCategories}
          resetHasFetched={resetHasFetched}
        />
      </div>
    </div>
  );
};

export default Holdings;