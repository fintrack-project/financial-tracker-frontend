import React, { useState } from 'react';
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

  const categoryService = createCategoryService(categories, setCategories);
  const subcategoryService = createSubcategoryService(subcategories, setSubcategories);

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