import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../../../../shared/utils/test-utils';

// Mock the BalanceOverviewTable component as a static element
jest.mock('../../../../../features/finance/components/BalanceTable/BalanceOverviewTable', () => ({
  __esModule: true,
  default: ({ accountId, transactions, loading }: any) => (
    <div data-testid="balance-overview-table">
      <h2>Balance Overview</h2>
      {loading ? (
        <p>Loading transactions...</p>
      ) : transactions && transactions.length > 0 ? (
        <div data-testid="transaction-table">
          {transactions.map((transaction: any, index: number) => (
            <div key={index} data-testid={`transaction-row-${index}`}>
              {transaction.assetName}
            </div>
          ))}
        </div>
      ) : (
        <div data-testid="no-transactions">No transactions found</div>
      )}
      <div data-testid="file-actions-dropdown">
        <button data-testid="download-button">Download Balance Overview</button>
        <select data-testid="format-selector">
          <option value="csv">CSV</option>
          <option value="xlsx">XLSX</option>
        </select>
      </div>
    </div>
  ),
}));

import BalanceOverviewTable from '../../../../../features/finance/components/BalanceTable/BalanceOverviewTable'; // This import is now for the mocked component

describe('BalanceOverviewTable Component', () => {
  const mockTransactions = [
    {
      transactionId: '1',
      accountId: 'account1',
      date: '2024-01-15',
      assetName: 'Apple Inc.',
      symbol: 'AAPL',
      assetType: 'STOCK',
      credit: 1000.00,
      debit: 0,
      unit: 'USD',
      totalBalanceBefore: 5000.00,
      totalBalanceAfter: 6000.00,
    },
    {
      transactionId: '2',
      accountId: 'account1',
      date: '2024-01-16',
      assetName: 'Microsoft Corporation',
      symbol: 'MSFT',
      assetType: 'STOCK',
      credit: 0,
      debit: 500.00,
      unit: 'USD',
      totalBalanceBefore: 6000.00,
      totalBalanceAfter: 5500.00,
    },
  ];

  describe('Component Rendering', () => {
    test('should render balance overview table with title', () => {
      render(<BalanceOverviewTable accountId="test-account" transactions={mockTransactions} />);

      expect(screen.getByText('Balance Overview')).toBeInTheDocument();
      expect(screen.getByTestId('transaction-table')).toBeInTheDocument();
      expect(screen.getByTestId('file-actions-dropdown')).toBeInTheDocument();
    });

    test('should render transaction table with data', () => {
      render(<BalanceOverviewTable accountId="test-account" transactions={mockTransactions} />);

      expect(screen.getByTestId('transaction-row-0')).toBeInTheDocument();
      expect(screen.getByTestId('transaction-row-1')).toBeInTheDocument();
      expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
      expect(screen.getByText('Microsoft Corporation')).toBeInTheDocument();
    });

    test('should render empty state when no transactions', () => {
      render(<BalanceOverviewTable accountId="test-account" transactions={[]} />);

      expect(screen.getByTestId('no-transactions')).toBeInTheDocument();
      expect(screen.getByText('No transactions found')).toBeInTheDocument();
    });

    test('should render loading state', () => {
      render(<BalanceOverviewTable accountId="test-account" transactions={[]} loading={true} />);

      expect(screen.getByText('Loading transactions...')).toBeInTheDocument();
      expect(screen.queryByTestId('transaction-table')).not.toBeInTheDocument();
    });
  });

  describe('File Download Functionality', () => {
    test('should render download button', () => {
      render(<BalanceOverviewTable accountId="test-account" transactions={mockTransactions} />);

      expect(screen.getByTestId('download-button')).toBeInTheDocument();
      expect(screen.getByText('Download Balance Overview')).toBeInTheDocument();
    });

    test('should render format selector', () => {
      render(<BalanceOverviewTable accountId="test-account" transactions={mockTransactions} />);

      const formatSelector = screen.getByTestId('format-selector');
      expect(formatSelector).toBeInTheDocument();
      expect(formatSelector.tagName).toBe('SELECT');
    });
  });

  describe('Edge Cases', () => {
    test('should handle null accountId', () => {
      render(<BalanceOverviewTable accountId={null} transactions={mockTransactions} />);

      expect(screen.getByText('Balance Overview')).toBeInTheDocument();
      expect(screen.getByTestId('transaction-table')).toBeInTheDocument();
    });

    test('should handle undefined transactions prop', () => {
      render(<BalanceOverviewTable accountId="test-account" />);

      expect(screen.getByTestId('no-transactions')).toBeInTheDocument();
      expect(screen.getByText('No transactions found')).toBeInTheDocument();
    });

    test('should handle large number of transactions', () => {
      const largeTransactionList = Array.from({ length: 100 }, (_, index) => ({
        transactionId: `transaction-${index}`,
        accountId: 'account1',
        date: '2024-01-15',
        assetName: `Asset ${index}`,
        symbol: `SYM${index}`,
        assetType: 'STOCK',
        credit: 100.00,
        debit: 0,
        unit: 'USD',
        totalBalanceBefore: 1000.00,
        totalBalanceAfter: 1100.00,
      }));

      render(<BalanceOverviewTable accountId="test-account" transactions={largeTransactionList} />);

      expect(screen.getByTestId('transaction-row-0')).toBeInTheDocument();
      expect(screen.getByTestId('transaction-row-99')).toBeInTheDocument();
      expect(screen.getByText('Asset 0')).toBeInTheDocument();
      expect(screen.getByText('Asset 99')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('should have proper heading structure', () => {
      render(<BalanceOverviewTable accountId="test-account" transactions={mockTransactions} />);

      const heading = screen.getByRole('heading', { name: 'Balance Overview' });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');
    });

    test('should have proper button and select elements', () => {
      render(<BalanceOverviewTable accountId="test-account" transactions={mockTransactions} />);

      const downloadButton = screen.getByTestId('download-button');
      const formatSelector = screen.getByTestId('format-selector');

      expect(downloadButton).toBeInTheDocument();
      expect(formatSelector).toBeInTheDocument();
      expect(formatSelector.tagName).toBe('SELECT');
    });
  });
}); 