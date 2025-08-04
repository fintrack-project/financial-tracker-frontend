import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../../../shared/utils/test-utils';
import HoldingsTable from '../../../../../features/finance/components/HoldingsTable/HoldingsTable';

// Mock the useHoldingsData hook
jest.mock('../../../../../features/finance/hooks/useHoldingsData', () => ({
  useHoldingsData: jest.fn(),
}));
const mockUseHoldingsData = jest.mocked(require('../../../../../features/finance/hooks/useHoldingsData').useHoldingsData);

// Mock the useBaseCurrency hook
jest.mock('../../../../../shared/hooks/useBaseCurrency', () => ({
  useBaseCurrency: jest.fn(),
}));
const mockUseBaseCurrency = jest.mocked(require('../../../../../shared/hooks/useBaseCurrency').useBaseCurrency);

// Mock the formatNumber utility
jest.mock('../../../../../shared/utils/FormatNumber', () => ({
  formatNumber: jest.fn((value: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  }),
}));

// Mock the Icon component
jest.mock('../../../../../shared/components/Card/Icon', () => {
  return function MockIcon({ icon, className, 'aria-hidden': ariaHidden }: { 
    icon: any; 
    className?: string; 
    'aria-hidden'?: boolean; 
  }) {
    return <div data-testid="icon" className={className} aria-hidden={ariaHidden}>{icon}</div>;
  };
});

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaChartLine: () => <div data-testid="chart-icon">📈</div>,
}));

describe('HoldingsTable Component', () => {
  const mockHoldings = [
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
    {
      assetName: 'Bitcoin',
      symbol: 'BTC',
      quantity: 0.5,
      assetType: 'CRYPTO',
      priceInBaseCurrency: 45000.00,
      totalValueInBaseCurrency: 22500.00,
    },
  ];

  const mockPortfolioData = [
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    test('should render holdings table with title', () => {
      mockUseHoldingsData.mockReturnValue({
        holdings: mockHoldings,
        portfolioData: mockPortfolioData,
        loading: false,
      });
      mockUseBaseCurrency.mockReturnValue({
        baseCurrency: 'USD',
        loading: false,
      });

      render(<HoldingsTable accountId="test-account" />);

      expect(screen.getByText('My Holdings')).toBeInTheDocument();
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    test('should render table headers correctly', () => {
      mockUseHoldingsData.mockReturnValue({
        holdings: mockHoldings,
        portfolioData: mockPortfolioData,
        loading: false,
      });
      mockUseBaseCurrency.mockReturnValue({
        baseCurrency: 'USD',
        loading: false,
      });

      render(<HoldingsTable accountId="test-account" />);

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Symbol')).toBeInTheDocument();
      expect(screen.getByText('Quantity')).toBeInTheDocument();
      expect(screen.getByText('Asset Unit')).toBeInTheDocument();
      expect(screen.getByText('Price (USD)')).toBeInTheDocument();
      expect(screen.getByText('Total Value (USD)')).toBeInTheDocument();
    });

    test('should render holdings data correctly', () => {
      mockUseHoldingsData.mockReturnValue({
        holdings: mockHoldings,
        portfolioData: mockPortfolioData,
        loading: false,
      });
      mockUseBaseCurrency.mockReturnValue({
        baseCurrency: 'USD',
        loading: false,
      });

      render(<HoldingsTable accountId="test-account" />);

      expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
      expect(screen.getByText('AAPL')).toBeInTheDocument();
      expect(screen.getByText('Microsoft Corporation')).toBeInTheDocument();
      expect(screen.getByText('MSFT')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    test('should render loading state when holdings data is loading', () => {
      mockUseHoldingsData.mockReturnValue({
        holdings: [],
        portfolioData: [],
        loading: true,
      });
      mockUseBaseCurrency.mockReturnValue({
        baseCurrency: 'USD',
        loading: false,
      });

      render(<HoldingsTable accountId="test-account" />);

      expect(screen.getByText('Loading holdings data...')).toBeInTheDocument();
      expect(screen.getByText('My Holdings')).toBeInTheDocument();
    });

    test('should render loading state when base currency is loading', () => {
      mockUseHoldingsData.mockReturnValue({
        holdings: mockHoldings,
        portfolioData: mockPortfolioData,
        loading: false,
      });
      mockUseBaseCurrency.mockReturnValue({
        baseCurrency: 'USD',
        loading: true,
      });

      render(<HoldingsTable accountId="test-account" />);

      expect(screen.getByText('Loading holdings data...')).toBeInTheDocument();
      expect(screen.getByText('My Holdings')).toBeInTheDocument();
    });

    test('should render loading state when both are loading', () => {
      mockUseHoldingsData.mockReturnValue({
        holdings: [],
        portfolioData: [],
        loading: true,
      });
      mockUseBaseCurrency.mockReturnValue({
        baseCurrency: 'USD',
        loading: true,
      });

      render(<HoldingsTable accountId="test-account" />);

      expect(screen.getByText('Loading holdings data...')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    test('should render empty state when no holdings', () => {
      mockUseHoldingsData.mockReturnValue({
        holdings: [],
        portfolioData: [],
        loading: false,
      });
      mockUseBaseCurrency.mockReturnValue({
        baseCurrency: 'USD',
        loading: false,
      });

      render(<HoldingsTable accountId="test-account" />);

      expect(screen.getByText('No Holdings Found')).toBeInTheDocument();
      expect(screen.getByText('Add holdings to start tracking your portfolio')).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    test('should display different asset types correctly', () => {
      const mixedData = [
        {
          assetName: 'Apple Inc.',
          symbol: 'AAPL',
          quantity: 10,
          assetType: 'STOCK',
          priceInBaseCurrency: 150.00,
          totalValueInBaseCurrency: 1500.00,
        },
        {
          assetName: 'Bitcoin',
          symbol: 'BTC',
          quantity: 0.5,
          assetType: 'CRYPTO',
          priceInBaseCurrency: 45000.00,
          totalValueInBaseCurrency: 22500.00,
        },
        {
          assetName: 'EUR/USD',
          symbol: 'EURUSD',
          quantity: 1000,
          assetType: 'FOREX',
          priceInBaseCurrency: 1.0850,
          totalValueInBaseCurrency: 1085.00,
        },
      ];

      mockUseHoldingsData.mockReturnValue({
        holdings: mixedData,
        portfolioData: mixedData,
        loading: false,
      });
      mockUseBaseCurrency.mockReturnValue({
        baseCurrency: 'USD',
        loading: false,
      });

      render(<HoldingsTable accountId="test-account" />);

      expect(screen.getByText('STOCK')).toBeInTheDocument();
      expect(screen.getByText('CRYPTO')).toBeInTheDocument();
      expect(screen.getByText('FOREX')).toBeInTheDocument();
    });

    test('should handle null base currency', () => {
      mockUseHoldingsData.mockReturnValue({
        holdings: mockHoldings,
        portfolioData: mockPortfolioData,
        loading: false,
      });
      mockUseBaseCurrency.mockReturnValue({
        baseCurrency: null,
        loading: false,
      });

      render(<HoldingsTable accountId="test-account" />);

      expect(screen.getByText('Price (N/A)')).toBeInTheDocument();
      expect(screen.getByText('Total Value (N/A)')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('should handle null accountId', () => {
      mockUseHoldingsData.mockReturnValue({
        holdings: mockHoldings,
        portfolioData: mockPortfolioData,
        loading: false,
      });
      mockUseBaseCurrency.mockReturnValue({
        baseCurrency: 'USD',
        loading: false,
      });

      render(<HoldingsTable accountId={null} />);

      expect(screen.getByText('My Holdings')).toBeInTheDocument();
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    test('should handle large number of holdings', () => {
      const largeHoldingsList = Array.from({ length: 100 }, (_, index) => ({
        assetName: `Asset ${index}`,
        symbol: `SYM${index}`,
        quantity: 10,
        assetType: 'STOCK',
        priceInBaseCurrency: 100.00,
        totalValueInBaseCurrency: 1000.00,
      }));

      mockUseHoldingsData.mockReturnValue({
        holdings: largeHoldingsList,
        portfolioData: largeHoldingsList,
        loading: false,
      });
      mockUseBaseCurrency.mockReturnValue({
        baseCurrency: 'USD',
        loading: false,
      });

      render(<HoldingsTable accountId="test-account" />);

      expect(screen.getByText('Asset 0')).toBeInTheDocument();
      expect(screen.getByText('Asset 99')).toBeInTheDocument();
      expect(screen.getByText('SYM0')).toBeInTheDocument();
      expect(screen.getByText('SYM99')).toBeInTheDocument();
    });

    test('should handle zero quantities', () => {
      const zeroQuantityData = [
        {
          assetName: 'Apple Inc.',
          symbol: 'AAPL',
          quantity: 0,
          assetType: 'STOCK',
          priceInBaseCurrency: 150.00,
          totalValueInBaseCurrency: 0.00,
        },
      ];

      mockUseHoldingsData.mockReturnValue({
        holdings: zeroQuantityData,
        portfolioData: zeroQuantityData,
        loading: false,
      });
      mockUseBaseCurrency.mockReturnValue({
        baseCurrency: 'USD',
        loading: false,
      });

      render(<HoldingsTable accountId="test-account" />);

      expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
      expect(screen.getByText('AAPL')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('should have proper table structure', () => {
      mockUseHoldingsData.mockReturnValue({
        holdings: mockHoldings,
        portfolioData: mockPortfolioData,
        loading: false,
      });
      mockUseBaseCurrency.mockReturnValue({
        baseCurrency: 'USD',
        loading: false,
      });

      render(<HoldingsTable accountId="test-account" />);

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      const headers = screen.getAllByRole('columnheader');
      expect(headers.length).toBe(6);
    });

    test('should have proper heading structure', () => {
      mockUseHoldingsData.mockReturnValue({
        holdings: mockHoldings,
        portfolioData: mockPortfolioData,
        loading: false,
      });
      mockUseBaseCurrency.mockReturnValue({
        baseCurrency: 'USD',
        loading: false,
      });

      render(<HoldingsTable accountId="test-account" />);

      const heading = screen.getByRole('heading', { name: 'My Holdings' });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H3');
    });

    test('should have proper icon accessibility', () => {
      mockUseHoldingsData.mockReturnValue({
        holdings: [],
        portfolioData: [],
        loading: false,
      });
      mockUseBaseCurrency.mockReturnValue({
        baseCurrency: 'USD',
        loading: false,
      });

      render(<HoldingsTable accountId="test-account" />);

      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });
}); 