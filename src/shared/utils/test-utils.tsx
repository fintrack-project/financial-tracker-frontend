import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NotificationProvider } from '../../shared/contexts/NotificationContext';

// Mock data for testing
export const mockTransactions = [
  {
    transactionId: '1',
    accountId: 'account1',
    date: '2024-01-15',
    assetName: 'Apple Inc.',
    symbol: 'AAPL',
    assetType: 'STOCK',
    credit: 1000.00,
    debit: 0,
    totalBalanceBefore: 0,
    totalBalanceAfter: 1000.00,
  },
  {
    transactionId: '2',
    accountId: 'account1',
    date: '2024-01-16',
    assetName: 'Microsoft Corp.',
    symbol: 'MSFT',
    assetType: 'STOCK',
    credit: 500.00,
    debit: 0,
    totalBalanceBefore: 1000.00,
    totalBalanceAfter: 1500.00,
  },
];

export const mockHoldings = [
  {
    assetName: 'Apple Inc.',
    symbol: 'AAPL',
    quantity: 10,
    assetType: 'STOCK',
    priceInBaseCurrency: 150.00,
    totalValueInBaseCurrency: 1500.00,
  },
  {
    assetName: 'Microsoft Corporation',
    symbol: 'MSFT',
    quantity: 5,
    assetType: 'STOCK',
    priceInBaseCurrency: 300.00,
    totalValueInBaseCurrency: 1500.00,
  },
];

export const mockCategories = [
  'Technology',
  'Healthcare',
  'Finance',
  'Consumer Goods',
];

export const mockSubcategories = {
  'Technology': ['Software', 'Hardware', 'Cloud Services'],
  'Healthcare': ['Pharmaceuticals', 'Medical Devices', 'Biotechnology'],
  'Finance': ['Banking', 'Insurance', 'Investment'],
  'Consumer Goods': ['Retail', 'Food & Beverage', 'Apparel'],
};

// Mock API responses
export const mockApiResponses = {
  transactions: {
    success: true,
    data: mockTransactions,
  },
  holdings: {
    success: true,
    data: mockHoldings,
  },
  categories: {
    success: true,
    data: mockCategories,
  },
  subcategories: {
    success: true,
    data: mockSubcategories,
  },
};

// Mock localStorage/sessionStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true,
});

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
  includeRouter?: boolean;
}

const AllTheProviders = ({ children, includeRouter = true }: { children: React.ReactNode; includeRouter?: boolean }) => {
  if (includeRouter) {
    return (
      <NotificationProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </NotificationProvider>
    );
  }
  
  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { route = '/', includeRouter = true, ...renderOptions } = options;
  
  // Set up the route if provided
  if (route !== '/') {
    window.history.pushState({}, 'Test page', route);
  }
  
  return render(ui, {
    wrapper: ({ children }) => <AllTheProviders includeRouter={includeRouter}>{children}</AllTheProviders>,
    ...renderOptions,
  });
};

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Helper functions
export const createMockTransaction = (overrides = {}) => ({
  transactionId: 'mock-id',
  accountId: 'account1',
  date: '2024-01-15',
  assetName: 'Mock Asset',
  symbol: 'MOCK',
  assetType: 'STOCK',
  credit: 1000.00,
  debit: 0,
  totalBalanceBefore: 0,
  totalBalanceAfter: 1000.00,
  ...overrides,
});

export const createMockHolding = (overrides = {}) => ({
  assetName: 'Mock Asset',
  symbol: 'MOCK',
  quantity: 10,
  assetType: 'STOCK',
  priceInBaseCurrency: 100.00,
  totalValueInBaseCurrency: 1000.00,
  ...overrides,
});

export const createMockCategory = (overrides = {}) => ({
  id: 'mock-category-id',
  name: 'Mock Category',
  color: 'BLUE',
  accountId: 'account1',
  ...overrides,
});

export const createMockSubcategory = (overrides = {}) => ({
  id: 'mock-subcategory-id',
  name: 'Mock Subcategory',
  categoryId: 'mock-category-id',
  accountId: 'account1',
  ...overrides,
}); 