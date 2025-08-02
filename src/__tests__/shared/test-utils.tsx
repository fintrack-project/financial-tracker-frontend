import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NotificationProvider } from '../../shared/contexts/NotificationContext';

// Mock data for testing
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  isEmailVerified: true,
  isTwoFactorEnabled: false,
};

export const mockTransaction = {
  id: 'test-transaction-id',
  accountId: 'test-account-id',
  amount: 100.00,
  currency: 'USD',
  description: 'Test transaction',
  category: 'Food',
  subcategory: 'Groceries',
  date: '2024-01-15',
  type: 'EXPENSE',
};

export const mockHolding = {
  id: 'test-holding-id',
  accountId: 'test-account-id',
  symbol: 'AAPL',
  quantity: 10,
  averagePrice: 150.00,
  currentPrice: 160.00,
  totalValue: 1600.00,
  gainLoss: 100.00,
  gainLossPercentage: 6.67,
};

export const mockCategory = {
  id: 'test-category-id',
  name: 'Food',
  color: '#FF5733',
  icon: '🍽️',
  isDefault: false,
};

export const mockMarketData = {
  symbol: 'AAPL',
  price: 160.00,
  change: 2.50,
  changePercent: 1.59,
  volume: 50000000,
  marketCap: 2500000000000,
  high: 165.00,
  low: 155.00,
  open: 158.00,
  previousClose: 157.50,
};

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

// Mock API responses
export const mockApiResponses = {
  auth: {
    login: {
      success: {
        token: 'mock-jwt-token',
        user: mockUser,
      },
      error: {
        message: 'Invalid credentials',
      },
    },
    register: {
      success: {
        message: 'Registration successful',
        user: mockUser,
      },
      error: {
        message: 'Email already exists',
      },
    },
  },
  transactions: {
    list: {
      success: [mockTransaction],
      error: {
        message: 'Failed to fetch transactions',
      },
    },
    create: {
      success: mockTransaction,
      error: {
        message: 'Failed to create transaction',
      },
    },
  },
  holdings: {
    list: {
      success: [mockHolding],
      error: {
        message: 'Failed to fetch holdings',
      },
    },
  },
  categories: {
    list: {
      success: [mockCategory],
      error: {
        message: 'Failed to fetch categories',
      },
    },
  },
  marketData: {
    stock: {
      success: mockMarketData,
      error: {
        message: 'Failed to fetch market data',
      },
    },
  },
};

// Mock localStorage
export const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock sessionStorage
export const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Setup global mocks
beforeEach(() => {
  // Mock localStorage
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });
  
  // Mock sessionStorage
  Object.defineProperty(window, 'sessionStorage', {
    value: mockSessionStorage,
    writable: true,
  });
  
  // Clear all mocks
  jest.clearAllMocks();
});

// Helper function to wait for async operations
export const waitFor = (ms: number = 0) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to create mock event
export const createMockEvent = (value: string) => ({
  target: { value },
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
});

// Helper function to create mock form event
export const createMockFormEvent = () => ({
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
});

// Helper function to create mock file
export const createMockFile = (name: string, size: number, type: string) => {
  const file = new File(['test content'], name, { type });
  Object.defineProperty(file, 'size', {
    value: size,
    writable: false,
  });
  return file;
}; 