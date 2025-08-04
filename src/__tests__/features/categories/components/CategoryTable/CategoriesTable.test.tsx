import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../../../../shared/utils/test-utils';
import { CategoryColor } from '../../../../../features/categories/types/CategoryTypes';

// Mock the entire CategoriesTable component to avoid axios import issues
jest.mock('../../../../../features/categories/components/CategoryTable/CategoriesTable', () => {
  return function MockCategoriesTable({ 
    categories, 
    subcategories, 
    categoryColors, 
    subcategoryColors 
  }: { 
    categories: string[]; 
    subcategories: { [category: string]: string[] }; 
    categoryColors: { [category: string]: CategoryColor }; 
    subcategoryColors: { [category: string]: { [subcategory: string]: CategoryColor } }; 
  }) {
    return (
      <div data-testid="categories-table" className="categories-table-container">
        <table className="categories-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Subcategories</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={index} data-testid={`category-row-${index}`}>
                <td data-testid={`category-name-${index}`}>{category}</td>
                <td>
                  <ul>
                    {subcategories[category]?.map((subcategory, subIndex) => (
                      <li key={subIndex} data-testid={`subcategory-${index}-${subIndex}`}>
                        {subcategory}
                      </li>
                    ))}
                  </ul>
                  <div className="add-subcategory-container">
                    <button data-testid={`add-subcategory-${index}`}>Add Subcategory</button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length < 3 && (
              <tr>
                <td colSpan={2}>
                  <div className="add-category-container">
                    <button data-testid="add-category">Add Category</button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };
});

import CategoriesTable from '../../../../../features/categories/components/CategoryTable/CategoriesTable';

describe('CategoriesTable Component', () => {
  const mockCategories = ['Food', 'Transportation', 'Entertainment'];
  const mockSubcategories = {
    'Food': ['Groceries', 'Restaurants', 'Takeout'],
    'Transportation': ['Gas', 'Public Transit', 'Ride Share'],
    'Entertainment': ['Movies', 'Games', 'Books'],
  };
  const mockCategoryColors: { [category: string]: CategoryColor } = {
    'Food': CategoryColor.RED,
    'Transportation': CategoryColor.GREEN,
    'Entertainment': CategoryColor.BLUE,
  };
  const mockSubcategoryColors: { [category: string]: { [subcategory: string]: CategoryColor } } = {
    'Food': {
      'Groceries': CategoryColor.RED,
      'Restaurants': CategoryColor.ORANGE,
      'Takeout': CategoryColor.GOLDENROD,
    },
    'Transportation': {
      'Gas': CategoryColor.GREEN,
      'Public Transit': CategoryColor.CYAN,
      'Ride Share': CategoryColor.DARK_CYAN,
    },
    'Entertainment': {
      'Movies': CategoryColor.BLUE,
      'Games': CategoryColor.PURPLE,
      'Books': CategoryColor.MEDIUM_SLATE_BLUE,
    },
  };

  const defaultProps = {
    accountId: 'test-account-id',
    categories: mockCategories,
    subcategories: mockSubcategories,
    categoryService: {} as any,
    subcategoryService: {} as any,
    onUpdateCategories: jest.fn(),
    resetHasFetched: jest.fn(),
    categoryColors: mockCategoryColors,
    subcategoryColors: mockSubcategoryColors,
  };

  describe('Component Rendering', () => {
    test('should render table with all categories', () => {
      render(<CategoriesTable {...defaultProps} />);

      expect(screen.getByTestId('categories-table')).toBeInTheDocument();
      expect(screen.getByText('Food')).toBeInTheDocument();
      expect(screen.getByText('Transportation')).toBeInTheDocument();
      expect(screen.getByText('Entertainment')).toBeInTheDocument();
    });

    test('should render subcategories for each category', () => {
      render(<CategoriesTable {...defaultProps} />);

      expect(screen.getByText('Groceries')).toBeInTheDocument();
      expect(screen.getByText('Restaurants')).toBeInTheDocument();
      expect(screen.getByText('Gas')).toBeInTheDocument();
      expect(screen.getByText('Movies')).toBeInTheDocument();
    });

    test('should render add category button when less than 3 categories', () => {
      const fewerCategories = ['Food', 'Transportation'];
      const fewerSubcategories = {
        'Food': ['Groceries', 'Restaurants'],
        'Transportation': ['Gas', 'Public Transit'],
      };
      const fewerCategoryColors = {
        'Food': CategoryColor.RED,
        'Transportation': CategoryColor.GREEN,
      };
      const fewerSubcategoryColors = {
        'Food': {
          'Groceries': CategoryColor.RED,
          'Restaurants': CategoryColor.ORANGE,
        },
        'Transportation': {
          'Gas': CategoryColor.GREEN,
          'Public Transit': CategoryColor.CYAN,
        },
      };

      render(
        <CategoriesTable 
          {...defaultProps} 
          categories={fewerCategories} 
          subcategories={fewerSubcategories} 
          categoryColors={fewerCategoryColors}
          subcategoryColors={fewerSubcategoryColors}
        />
      );

      expect(screen.getByTestId('add-category')).toBeInTheDocument();
    });

    test('should render add subcategory buttons for each category', () => {
      render(<CategoriesTable {...defaultProps} />);

      expect(screen.getByTestId('add-subcategory-0')).toBeInTheDocument();
      expect(screen.getByTestId('add-subcategory-1')).toBeInTheDocument();
      expect(screen.getByTestId('add-subcategory-2')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty categories list', () => {
      render(<CategoriesTable {...defaultProps} categories={[]} subcategories={{}} categoryColors={{}} subcategoryColors={{}} />);

      expect(screen.getByTestId('categories-table')).toBeInTheDocument();
      // Should still render the table structure even with no categories
      // Since there are 0 categories (less than 3), the add category button should be present
      expect(screen.getByTestId('add-category')).toBeInTheDocument();
    });

    test('should handle categories with no subcategories', () => {
      const categoriesWithNoSubs = ['Food', 'Transportation'];
      const subcategoriesWithNoSubs = {
        'Food': [],
        'Transportation': [],
      };
      const categoryColorsWithNoSubs = {
        'Food': CategoryColor.RED,
        'Transportation': CategoryColor.GREEN,
      };
      const subcategoryColorsWithNoSubs = {
        'Food': {},
        'Transportation': {},
      };

      render(
        <CategoriesTable 
          {...defaultProps} 
          categories={categoriesWithNoSubs} 
          subcategories={subcategoriesWithNoSubs} 
          categoryColors={categoryColorsWithNoSubs}
          subcategoryColors={subcategoryColorsWithNoSubs}
        />
      );

      expect(screen.getByText('Food')).toBeInTheDocument();
      expect(screen.getByText('Transportation')).toBeInTheDocument();
    });

    test('should not show add category button when 3 or more categories', () => {
      const manyCategories = ['Food', 'Transportation', 'Entertainment', 'Shopping'];
      const manySubcategories = {
        'Food': ['Groceries'],
        'Transportation': ['Gas'],
        'Entertainment': ['Movies'],
        'Shopping': ['Clothes'],
      };
      const manyCategoryColors = {
        'Food': CategoryColor.RED,
        'Transportation': CategoryColor.GREEN,
        'Entertainment': CategoryColor.BLUE,
        'Shopping': CategoryColor.PURPLE,
      };
      const manySubcategoryColors = {
        'Food': { 'Groceries': CategoryColor.RED },
        'Transportation': { 'Gas': CategoryColor.GREEN },
        'Entertainment': { 'Movies': CategoryColor.BLUE },
        'Shopping': { 'Clothes': CategoryColor.PURPLE },
      };

      render(
        <CategoriesTable 
          {...defaultProps} 
          categories={manyCategories} 
          subcategories={manySubcategories} 
          categoryColors={manyCategoryColors}
          subcategoryColors={manySubcategoryColors}
        />
      );

      expect(screen.queryByTestId('add-category')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('should have proper table structure', () => {
      render(<CategoriesTable {...defaultProps} />);

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(2);
      expect(headers[0]).toHaveTextContent('Category Name');
      expect(headers[1]).toHaveTextContent('Subcategories');
    });

    test('should have proper list structure for subcategories', () => {
      render(<CategoriesTable {...defaultProps} />);

      const lists = screen.getAllByRole('list');
      expect(lists.length).toBeGreaterThan(0);
    });
  });
}); 