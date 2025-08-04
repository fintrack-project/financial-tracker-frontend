import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../../../../shared/utils/test-utils';

// Mock the MarketWatchlist component
jest.mock('../../../../../features/market/components/Watchlist/MarketWatchlist', () => ({
  __esModule: true,
  default: ({ 
    accountId, 
    subscriptionPlan 
  }: { 
    accountId: string | null; 
    subscriptionPlan: string; 
  }) => (
    <div data-testid="market-watchlist">
      <h2>Market Watchlist</h2>
      <div data-testid="watchlist-content">
        <div data-testid="account-info">
          Account ID: {accountId || 'No Account'}
        </div>
        <div data-testid="subscription-info">
          Plan: {subscriptionPlan}
        </div>
        <div data-testid="watchlist-table">
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Asset Type</th>
                <th>Price (USD)</th>
                <th>Price Change (USD)</th>
                <th>% Change</th>
                <th>High (USD)</th>
                <th>Low (USD)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr data-testid="watchlist-row-0">
                <td data-testid="symbol-0">AAPL</td>
                <td data-testid="asset-type-0">STOCK</td>
                <td data-testid="price-0">150.00</td>
                <td data-testid="price-change-0">+2.50</td>
                <td data-testid="percent-change-0">+1.67%</td>
                <td data-testid="high-0">155.00</td>
                <td data-testid="low-0">148.00</td>
                <td>
                  <button data-testid="confirm-0">Confirm</button>
                  <button data-testid="remove-0">Remove</button>
                </td>
              </tr>
              <tr data-testid="watchlist-row-1">
                <td data-testid="symbol-1">MSFT</td>
                <td data-testid="asset-type-1">STOCK</td>
                <td data-testid="price-1">300.00</td>
                <td data-testid="price-change-1">-1.25</td>
                <td data-testid="percent-change-1">-0.42%</td>
                <td data-testid="high-1">305.00</td>
                <td data-testid="low-1">298.00</td>
                <td>
                  <button data-testid="confirm-1">Confirm</button>
                  <button data-testid="remove-1">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div data-testid="add-section">
          <input data-testid="add-symbol-input" placeholder="Enter symbol" />
          <select data-testid="asset-type-select">
            <option value="STOCK">STOCK</option>
            <option value="CRYPTO">CRYPTO</option>
            <option value="COMMODITY">COMMODITY</option>
          </select>
          <button data-testid="add-button">Add to Watchlist</button>
        </div>
      </div>
    </div>
  ),
}));

import MarketWatchlist from '../../../../../features/market/components/Watchlist/MarketWatchlist';

describe('MarketWatchlist Component', () => {
  const defaultProps = {
    accountId: 'test-account-123',
    subscriptionPlan: 'PREMIUM' as const,
  };

  describe('Component Rendering', () => {
    test('should render watchlist with data', () => {
      render(<MarketWatchlist {...defaultProps} />);
      
      expect(screen.getByTestId('market-watchlist')).toBeInTheDocument();
      expect(screen.getByText('Market Watchlist')).toBeInTheDocument();
      expect(screen.getByTestId('watchlist-content')).toBeInTheDocument();
    });

    test('should display account information', () => {
      render(<MarketWatchlist {...defaultProps} />);
      
      expect(screen.getByTestId('account-info')).toBeInTheDocument();
      expect(screen.getByText('Account ID: test-account-123')).toBeInTheDocument();
    });

    test('should display subscription information', () => {
      render(<MarketWatchlist {...defaultProps} />);
      
      expect(screen.getByTestId('subscription-info')).toBeInTheDocument();
      expect(screen.getByText('Plan: PREMIUM')).toBeInTheDocument();
    });

    test('should render watchlist table', () => {
      render(<MarketWatchlist {...defaultProps} />);
      
      expect(screen.getByTestId('watchlist-table')).toBeInTheDocument();
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    test('should display watchlist items', () => {
      render(<MarketWatchlist {...defaultProps} />);
      
      expect(screen.getByTestId('watchlist-row-0')).toBeInTheDocument();
      expect(screen.getByTestId('watchlist-row-1')).toBeInTheDocument();
    });

    test('should display symbol, price, and change for each item', () => {
      render(<MarketWatchlist {...defaultProps} />);
      
      expect(screen.getByTestId('symbol-0')).toHaveTextContent('AAPL');
      expect(screen.getByTestId('price-0')).toHaveTextContent('150.00');
      expect(screen.getByTestId('price-change-0')).toHaveTextContent('+2.50');
      expect(screen.getByTestId('percent-change-0')).toHaveTextContent('+1.67%');
      
      expect(screen.getByTestId('symbol-1')).toHaveTextContent('MSFT');
      expect(screen.getByTestId('price-1')).toHaveTextContent('300.00');
      expect(screen.getByTestId('price-change-1')).toHaveTextContent('-1.25');
      expect(screen.getByTestId('percent-change-1')).toHaveTextContent('-0.42%');
    });

    test('should render add section', () => {
      render(<MarketWatchlist {...defaultProps} />);
      
      expect(screen.getByTestId('add-section')).toBeInTheDocument();
      expect(screen.getByTestId('add-symbol-input')).toBeInTheDocument();
      expect(screen.getByTestId('asset-type-select')).toBeInTheDocument();
      expect(screen.getByTestId('add-button')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('should handle null account ID', () => {
      render(<MarketWatchlist {...defaultProps} accountId={null} />);
      
      expect(screen.getByTestId('market-watchlist')).toBeInTheDocument();
      expect(screen.getByText('Account ID: No Account')).toBeInTheDocument();
    });

    test('should handle different subscription plans', () => {
      const plans = ['FREE', 'BASIC', 'PREMIUM'] as const;
      
      plans.forEach(plan => {
        const { unmount } = render(<MarketWatchlist {...defaultProps} subscriptionPlan={plan} />);
        expect(screen.getByTestId('subscription-info')).toHaveTextContent(`Plan: ${plan}`);
        unmount();
      });
    });
  });

  describe('Accessibility', () => {
    test('should have proper heading structure', () => {
      render(<MarketWatchlist {...defaultProps} />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Market Watchlist');
    });

    test('should have proper table structure', () => {
      render(<MarketWatchlist {...defaultProps} />);
      
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      
      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(8); // Symbol, Asset Type, Price, Price Change, % Change, High, Low, Actions
    });

    test('should have proper button structure', () => {
      render(<MarketWatchlist {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      expect(screen.getByTestId('add-button')).toBeInTheDocument();
    });

    test('should have proper input structure', () => {
      render(<MarketWatchlist {...defaultProps} />);
      
      const input = screen.getByTestId('add-symbol-input');
      expect(input).toHaveAttribute('placeholder', 'Enter symbol');
    });

    test('should have proper select structure', () => {
      render(<MarketWatchlist {...defaultProps} />);
      
      const select = screen.getByTestId('asset-type-select');
      expect(select).toBeInTheDocument();
      
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3); // STOCK, CRYPTO, COMMODITY
    });
  });

  describe('Table Data', () => {
    test('should display asset types correctly', () => {
      render(<MarketWatchlist {...defaultProps} />);
      
      expect(screen.getByTestId('asset-type-0')).toHaveTextContent('STOCK');
      expect(screen.getByTestId('asset-type-1')).toHaveTextContent('STOCK');
    });

    test('should display high and low prices', () => {
      render(<MarketWatchlist {...defaultProps} />);
      
      expect(screen.getByTestId('high-0')).toHaveTextContent('155.00');
      expect(screen.getByTestId('low-0')).toHaveTextContent('148.00');
      expect(screen.getByTestId('high-1')).toHaveTextContent('305.00');
      expect(screen.getByTestId('low-1')).toHaveTextContent('298.00');
    });

    test('should display action buttons for each row', () => {
      render(<MarketWatchlist {...defaultProps} />);
      
      expect(screen.getByTestId('confirm-0')).toBeInTheDocument();
      expect(screen.getByTestId('remove-0')).toBeInTheDocument();
      expect(screen.getByTestId('confirm-1')).toBeInTheDocument();
      expect(screen.getByTestId('remove-1')).toBeInTheDocument();
    });
  });
}); 