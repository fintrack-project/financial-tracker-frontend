import React, { useState, useEffect } from 'react';
import _, { set } from 'lodash';
import AccountMenu from '../../components/Menu/AccountMenu';
import MainNavigationBar from 'components/NavigationBar/MainNavigationBar';
import EditableHoldingsTable from 'components/HoldingsTable/EditableHoldingsTable';
import CategoriesTable from 'components/Category/CategoriesTable';
import { createCategoryService } from '../../services/categoryService';
import { createSubcategoryService } from '../../services/subCategoryService';
import { createHoldingsCategoriesService } from 'services/holdingsCategoriesService';
import './Holdings.css'; // Import the CSS file

const Holdings: React.FC = () => {
  const [accountId, setAccountId] = useState<string | null>(null); // Store the currently logged-in account ID
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
          await categoryService.fetchCategoriesAndSubcategories(accountId);

        // Fetch holdings categories from the API
        const response = await holdingsCategoriesService.fetchHoldingsCategories(accountId);

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

  // Callback to get the accountId from AccountMenu
  const handleAccountChange = (newAccountId: string) => {
    setAccountId(newAccountId);
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
      <div className="top-bar">
        <div className="navigation-bar">
          <MainNavigationBar />
        </div>
        <div className="account-menu">
          <AccountMenu onAccountChange={handleAccountChange} />
        </div>
      </div>
      <div className="holdings-list">
        <h1>Holdings</h1>
        <EditableHoldingsTable 
          accountId={accountId}
          categories={categories}
          subcategories={subcategories}
          categoryService={categoryService}
          confirmedHoldingsCategories={confirmedHoldingsCategories}
          holdingsCategoriesService={holdingsCategoriesService}
          resetHasFetched={resetHasFetched}
        />
        <h1>Categories</h1>
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