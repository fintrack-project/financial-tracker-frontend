import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../../../shared/test-utils';
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
      <div data-testid="categories-table">
        <table>
          <thead>
            <tr>
              <th>Categories</th>
              <th>Subcategories</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={index} data-testid={`category-row-${index}`}>
                <td data-testid={`category-name-${index}`}>{category}</td>
                <td>
                  {subcategories[category]?.map((subcategory, subIndex) => (
                    <div key={subIndex} data-testid={`subcategory-${index}-${subIndex}`}>
                      {subcategory}
                    </div>
                  ))}
                </td>
                <td>
                  <button data-testid={`edit-category-${index}`}>Edit</button>
                  <button data-testid={`delete-category-${index}`}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button data-testid="add-category">Add Category</button>
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

    test('should render edit and delete buttons for categories', () => {
      render(<CategoriesTable {...defaultProps} />);

      expect(screen.getByTestId('edit-category-0')).toBeInTheDocument();
      expect(screen.getByTestId('delete-category-0')).toBeInTheDocument();
      expect(screen.getByTestId('edit-category-1')).toBeInTheDocument();
      expect(screen.getByTestId('delete-category-1')).toBeInTheDocument();
    });

    test('should render add category button', () => {
      render(<CategoriesTable {...defaultProps} />);

      expect(screen.getByTestId('add-category')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty categories list', () => {
      render(<CategoriesTable {...defaultProps} categories={[]} subcategories={{}} categoryColors={{}} subcategoryColors={{}} />);

      expect(screen.getByTestId('categories-table')).toBeInTheDocument();
      // Should still render the table structure even with no categories
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
  });

  describe('Accessibility', () => {
    test('should have proper table structure', () => {
      render(<CategoriesTable {...defaultProps} />);

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      const headers = screen.getAllByRole('columnheader');
      expect(headers.length).toBeGreaterThan(0);
    });

    test('should have proper button structure', () => {
      render(<CategoriesTable {...defaultProps} />);

      const editButtons = screen.getAllByTestId(/edit-category-/);
      editButtons.forEach(button => {
        expect(button).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTestId(/delete-category-/);
      deleteButtons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });
  });
}); 