import React, { useState, useEffect } from 'react';
import AccountMenu from '../../components/Menu/AccountMenu';
import MainNavigationBar from 'components/NavigationBar/MainNavigationBar';
import EditableHoldingsTable from 'components/HoldingsTable/EditableHoldingsTable';
import CategoriesTable from 'components/Category/CategoriesTable';
import { createCategoryService } from '../../services/categoryService';
import { createSubcategoryService } from '../../services/subcategoryService';
import './Holdings.css'; // Import the CSS file

const Holdings: React.FC = () => {
  const [accountId, setAccountId] = useState<string | null>(null); // Store the currently logged-in account ID
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<{ [category: string]: string[] }>({});
  const [hasFetched, setHasFetched] = useState(false);

  const categoryService = createCategoryService(categories, setCategories);
  const subcategoryService = createSubcategoryService(subcategories, setSubcategories);

  // Fetch categories and subcategories when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (!accountId) {
        console.warn('Account ID is required to fetch categories.');
        return;
      }

      try {
        const { categories: fetchedCategories, subcategories: fetchedSubcategories } =
          await categoryService.fetchCategoriesAndSubcategories(accountId);

        // Use the onUpdateCategories callback to update the parent state
        setCategories(fetchedCategories);
        setSubcategories(fetchedSubcategories);
        setHasFetched(true); // Mark as fetched

        console.log('Fetched categories:', fetchedCategories);
        console.log('Fetched subcategories:', fetchedSubcategories);
      } catch (error) {
        alert('Failed to fetch categories. Please try again.');
      }
    };

    if (!hasFetched) {
      fetchData();
    }
  }, [accountId, categoryService, hasFetched]);

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
        />
        <h1>Categories</h1>
        <CategoriesTable 
          accountId={accountId}
          categories={categories}
          subcategories={subcategories}
          categoryService={categoryService}
          subcategoryService={subcategoryService}
          onUpdateCategories={handleUpdateCategories}
        />
      </div>
    </div>
  );
};

export default Holdings;