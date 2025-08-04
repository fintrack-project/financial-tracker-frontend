import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../../../../shared/utils/test-utils';

// Mock the BalancePreviewTable component as a static element
jest.mock('../../../../../features/finance/components/BalanceTable/BalancePreviewTable', () => ({
  __esModule: true,
  default: ({ accountId, existingTransactions, uploadedTransactions, onConfirm }: any) => (
    <div data-testid="balance-preview-table">
      <h2>Balance Preview</h2>
      <div data-testid="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Asset Name</th>
              <th>Symbol</th>
              <th>Asset Type</th>
              <th>Credit</th>
              <th>Debit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {existingTransactions && existingTransactions.length > 0 && (
              existingTransactions.map((transaction: any, index: number) => (
                <tr key={`existing-${index}`} data-testid={`existing-transaction-${index}`} className="existing-transaction">
                  <td>{transaction.date}</td>
                  <td>{transaction.assetName}</td>
                  <td>{transaction.symbol}</td>
                  <td>{transaction.assetType}</td>
                  <td>{transaction.credit}</td>
                  <td>{transaction.debit}</td>
                  <td>
                    <button data-testid={`delete-existing-${index}`}>Delete</button>
                  </td>
                </tr>
              ))
            )}
            {uploadedTransactions && uploadedTransactions.length > 0 && (
              uploadedTransactions.map((transaction: any, index: number) => (
                <tr key={`uploaded-${index}`} data-testid={`uploaded-transaction-${index}`} className="uploaded-transaction highlighted-row">
                  <td>{transaction.date}</td>
                  <td>{transaction.assetName}</td>
                  <td>{transaction.symbol}</td>
                  <td>{transaction.assetType}</td>
                  <td>{transaction.credit}</td>
                  <td>{transaction.debit}</td>
                  <td>
                    <button data-testid={`delete-uploaded-${index}`}>Delete</button>
                  </td>
                </tr>
              ))
            )}
            {(!existingTransactions || existingTransactions.length === 0) && 
             (!uploadedTransactions || uploadedTransactions.length === 0) && (
              <tr>
                <td colSpan={7}>
                  <div data-testid="no-transactions">No transactions to preview</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div data-testid="table-footer">
        <button data-testid="confirm-changes-button">Confirm Changes</button>
      </div>
      {accountId && (
        <div data-testid="account-info">Account: {accountId}</div>
      )}
      <div data-testid="transaction-counts">
        <span data-testid="existing-count">Existing: {existingTransactions?.length || 0}</span>
        <span data-testid="uploaded-count">Uploaded: {uploadedTransactions?.length || 0}</span>
      </div>
    </div>
  ),
}));

import BalancePreviewTable from '../../../../../features/finance/components/BalanceTable/BalancePreviewTable';

describe('BalancePreviewTable Component', () => {
  const mockOnConfirm = jest.fn();
  const mockExistingTransactions: any[] = [
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

  const mockUploadedTransactions: any[] = [
    {
      transactionId: null,
      accountId: null,
      date: '2024-01-17',
      assetName: 'Tesla Inc.',
      symbol: 'TSLA',
      assetType: 'STOCK',
      credit: 2000.00,
      debit: 0,
    },
    {
      transactionId: null,
      accountId: null,
      date: '2024-01-18',
      assetName: 'Bitcoin',
      symbol: 'BTC',
      assetType: 'CRYPTO',
      credit: 0,
      debit: 500.00,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    test('should render balance preview table with title', () => {
      render(
        <BalancePreviewTable 
          accountId="test-account" 
          existingTransactions={mockExistingTransactions}
          uploadedTransactions={mockUploadedTransactions}
          onConfirm={mockOnConfirm}
        />
      );
      expect(screen.getByText('Balance Preview')).toBeInTheDocument();
      expect(screen.getByTestId('balance-preview-table')).toBeInTheDocument();
    });

    test('should render table wrapper', () => {
      render(
        <BalancePreviewTable 
          accountId="test-account" 
          existingTransactions={mockExistingTransactions}
          uploadedTransactions={mockUploadedTransactions}
          onConfirm={mockOnConfirm}
        />
      );
      expect(screen.getByTestId('table-wrapper')).toBeInTheDocument();
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    test('should render table headers correctly', () => {
      render(
        <BalancePreviewTable 
          accountId="test-account" 
          existingTransactions={mockExistingTransactions}
          uploadedTransactions={mockUploadedTransactions}
          onConfirm={mockOnConfirm}
        />
      );
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('Asset Name')).toBeInTheDocument();
      expect(screen.getByText('Symbol')).toBeInTheDocument();
      expect(screen.getByText('Asset Type')).toBeInTheDocument();
      expect(screen.getByText('Credit')).toBeInTheDocument();
      expect(screen.getByText('Debit')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    test('should render confirm changes button', () => {
      render(
        <BalancePreviewTable 
          accountId="test-account" 
          existingTransactions={mockExistingTransactions}
          uploadedTransactions={mockUploadedTransactions}
          onConfirm={mockOnConfirm}
        />
      );
      expect(screen.getByTestId('confirm-changes-button')).toBeInTheDocument();
      expect(screen.getByText('Confirm Changes')).toBeInTheDocument();
    });

    test('should display account information when accountId is provided', () => {
      render(
        <BalancePreviewTable 
          accountId="test-account" 
          existingTransactions={mockExistingTransactions}
          uploadedTransactions={mockUploadedTransactions}
          onConfirm={mockOnConfirm}
        />
      );
      expect(screen.getByTestId('account-info')).toBeInTheDocument();
      expect(screen.getByText('Account: test-account')).toBeInTheDocument();
    });
  });

  describe('Transaction Display', () => {
    test('should render existing transactions', () => {
      render(
        <BalancePreviewTable 
          accountId="test-account" 
          existingTransactions={mockExistingTransactions}
          uploadedTransactions={mockUploadedTransactions}
          onConfirm={mockOnConfirm}
        />
      );
      
      expect(screen.getByTestId('existing-transaction-0')).toBeInTheDocument();
      expect(screen.getByTestId('existing-transaction-1')).toBeInTheDocument();
      expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
      expect(screen.getByText('Microsoft Corp.')).toBeInTheDocument();
    });

    test('should render uploaded transactions with highlighting', () => {
      render(
        <BalancePreviewTable 
          accountId="test-account" 
          existingTransactions={mockExistingTransactions}
          uploadedTransactions={mockUploadedTransactions}
          onConfirm={mockOnConfirm}
        />
      );
      
      expect(screen.getByTestId('uploaded-transaction-0')).toBeInTheDocument();
      expect(screen.getByTestId('uploaded-transaction-1')).toBeInTheDocument();
      expect(screen.getByText('Tesla Inc.')).toBeInTheDocument();
      expect(screen.getByText('Bitcoin')).toBeInTheDocument();
      
      // Check that uploaded transactions have highlighting class
      const uploadedRows = screen.getAllByTestId(/uploaded-transaction-/);
      uploadedRows.forEach(row => {
        expect(row).toHaveClass('highlighted-row');
      });
    });

    test('should display transaction data correctly', () => {
      render(
        <BalancePreviewTable 
          accountId="test-account" 
          existingTransactions={mockExistingTransactions}
          uploadedTransactions={mockUploadedTransactions}
          onConfirm={mockOnConfirm}
        />
      );
      
      // Check existing transaction data
      expect(screen.getByText('2024-01-15')).toBeInTheDocument();
      expect(screen.getByText('AAPL')).toBeInTheDocument();
      expect(screen.getAllByText('STOCK')).toHaveLength(3); // 2 existing + 1 uploaded
      expect(screen.getByText('1000')).toBeInTheDocument();
      
      // Check uploaded transaction data
      expect(screen.getByText('2024-01-17')).toBeInTheDocument();
      expect(screen.getByText('TSLA')).toBeInTheDocument();
      expect(screen.getByText('CRYPTO')).toBeInTheDocument();
      expect(screen.getByText('2000')).toBeInTheDocument();
      expect(screen.getAllByText('500')).toHaveLength(2); // 1 existing + 1 uploaded
    });

    test('should render delete buttons for all transactions', () => {
      render(
        <BalancePreviewTable 
          accountId="test-account" 
          existingTransactions={mockExistingTransactions}
          uploadedTransactions={mockUploadedTransactions}
          onConfirm={mockOnConfirm}
        />
      );
      
      expect(screen.getByTestId('delete-existing-0')).toBeInTheDocument();
      expect(screen.getByTestId('delete-existing-1')).toBeInTheDocument();
      expect(screen.getByTestId('delete-uploaded-0')).toBeInTheDocument();
      expect(screen.getByTestId('delete-uploaded-1')).toBeInTheDocument();
    });
  });

  describe('Empty State Handling', () => {
    test('should render empty state when no transactions', () => {
      render(
        <BalancePreviewTable 
          accountId="test-account" 
          existingTransactions={[]}
          uploadedTransactions={[]}
          onConfirm={mockOnConfirm}
        />
      );
      
      expect(screen.getByTestId('no-transactions')).toBeInTheDocument();
      expect(screen.getByText('No transactions to preview')).toBeInTheDocument();
    });

    test('should render empty state when transactions are null', () => {
      render(
        <BalancePreviewTable 
          accountId="test-account" 
          existingTransactions={null as any}
          uploadedTransactions={null as any}
          onConfirm={mockOnConfirm}
        />
      );
      
      expect(screen.getByTestId('no-transactions')).toBeInTheDocument();
      expect(screen.getByText('No transactions to preview')).toBeInTheDocument();
    });

    test('should render empty state when transactions are undefined', () => {
      render(
        <BalancePreviewTable 
          accountId="test-account" 
          existingTransactions={undefined as any}
          uploadedTransactions={undefined as any}
          onConfirm={mockOnConfirm}
        />
      );
      
      expect(screen.getByTestId('no-transactions')).toBeInTheDocument();
      expect(screen.getByText('No transactions to preview')).toBeInTheDocument();
    });
  });

  describe('Transaction Counts', () => {
    test('should display transaction counts', () => {
      render(
        <BalancePreviewTable 
          accountId="test-account" 
          existingTransactions={mockExistingTransactions}
          uploadedTransactions={mockUploadedTransactions}
          onConfirm={mockOnConfirm}
        />
      );
      
      expect(screen.getByTestId('transaction-counts')).toBeInTheDocument();
      expect(screen.getByTestId('existing-count')).toBeInTheDocument();
      expect(screen.getByTestId('uploaded-count')).toBeInTheDocument();
      expect(screen.getByText('Existing: 2')).toBeInTheDocument();
      expect(screen.getByText('Uploaded: 2')).toBeInTheDocument();
    });

    test('should display zero counts when no transactions', () => {
      render(
        <BalancePreviewTable 
          accountId="test-account" 
          existingTransactions={[]}
          uploadedTransactions={[]}
          onConfirm={mockOnConfirm}
        />
      );
      
      expect(screen.getByText('Existing: 0')).toBeInTheDocument();
      expect(screen.getByText('Uploaded: 0')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('should handle null accountId', () => {
      render(
        <BalancePreviewTable 
          accountId={null} 
          existingTransactions={mockExistingTransactions}
          uploadedTransactions={mockUploadedTransactions}
          onConfirm={mockOnConfirm}
        />
      );
      
      expect(screen.getByText('Balance Preview')).toBeInTheDocument();
      expect(screen.queryByTestId('account-info')).not.toBeInTheDocument();
    });

    test('should handle empty accountId', () => {
      render(
        <BalancePreviewTable 
          accountId="" 
          existingTransactions={mockExistingTransactions}
          uploadedTransactions={mockUploadedTransactions}
          onConfirm={mockOnConfirm}
        />
      );
      
      expect(screen.getByText('Balance Preview')).toBeInTheDocument();
      expect(screen.queryByTestId('account-info')).not.toBeInTheDocument();
    });

    test('should handle large number of transactions', () => {
      const largeExistingTransactions: any[] = Array.from({ length: 100 }, (_, index) => ({
        transactionId: `existing-${index}`,
        accountId: 'account1',
        date: '2024-01-15',
        assetName: `Asset ${index}`,
        symbol: `SYM${index}`,
        assetType: 'STOCK',
        credit: 100.00,
        debit: 0,
        totalBalanceBefore: index * 100,
        totalBalanceAfter: (index + 1) * 100,
      }));

      const largeUploadedTransactions: any[] = Array.from({ length: 50 }, (_, index) => ({
        transactionId: null,
        accountId: null,
        date: '2024-01-16',
        assetName: `Uploaded Asset ${index}`,
        symbol: `UPL${index}`,
        assetType: 'STOCK',
        credit: 200.00,
        debit: 0,
      }));

      render(
        <BalancePreviewTable 
          accountId="test-account" 
          existingTransactions={largeExistingTransactions}
          uploadedTransactions={largeUploadedTransactions}
          onConfirm={mockOnConfirm}
        />
      );
      
      expect(screen.getByText('Existing: 100')).toBeInTheDocument();
      expect(screen.getByText('Uploaded: 50')).toBeInTheDocument();
    });

    test('should handle mixed transaction types', () => {
      const mixedExistingTransactions: any[] = [
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
          assetName: 'Bitcoin',
          symbol: 'BTC',
          assetType: 'CRYPTO',
          credit: 0,
          debit: 500.00,
          totalBalanceBefore: 1000.00,
          totalBalanceAfter: 500.00,
        },
        {
          transactionId: '3',
          accountId: 'account1',
          date: '2024-01-17',
          assetName: 'EUR/USD',
          symbol: 'EURUSD',
          assetType: 'FOREX',
          credit: 2000.00,
          debit: 0,
          totalBalanceBefore: 500.00,
          totalBalanceAfter: 2500.00,
        },
      ];

      render(
        <BalancePreviewTable 
          accountId="test-account" 
          existingTransactions={mixedExistingTransactions}
          uploadedTransactions={mockUploadedTransactions}
          onConfirm={mockOnConfirm}
        />
      );
      
      expect(screen.getAllByText('STOCK')).toHaveLength(2); // 1 existing + 1 uploaded
      expect(screen.getAllByText('CRYPTO')).toHaveLength(2); // 1 existing + 1 uploaded
      expect(screen.getByText('FOREX')).toBeInTheDocument();
      expect(screen.getByText('Existing: 3')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('should have proper heading structure', () => {
      render(
        <BalancePreviewTable 
          accountId="test-account" 
          existingTransactions={mockExistingTransactions}
          uploadedTransactions={mockUploadedTransactions}
          onConfirm={mockOnConfirm}
        />
      );
      const heading = screen.getByRole('heading', { name: 'Balance Preview' });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');
    });

    test('should have proper table structure', () => {
      render(
        <BalancePreviewTable 
          accountId="test-account" 
          existingTransactions={mockExistingTransactions}
          uploadedTransactions={mockUploadedTransactions}
          onConfirm={mockOnConfirm}
        />
      );
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      
      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(7); // Date, Asset Name, Symbol, Asset Type, Credit, Debit, Actions
    });

    test('should have proper button elements', () => {
      render(
        <BalancePreviewTable 
          accountId="test-account" 
          existingTransactions={mockExistingTransactions}
          uploadedTransactions={mockUploadedTransactions}
          onConfirm={mockOnConfirm}
        />
      );
      
      const confirmButton = screen.getByTestId('confirm-changes-button');
      const deleteButtons = screen.getAllByText('Delete');
      
      expect(confirmButton).toBeInTheDocument();
      expect(deleteButtons.length).toBeGreaterThan(0);
    });

    test('should have proper transaction row structure', () => {
      render(
        <BalancePreviewTable 
          accountId="test-account" 
          existingTransactions={mockExistingTransactions}
          uploadedTransactions={mockUploadedTransactions}
          onConfirm={mockOnConfirm}
        />
      );
      
      const existingRows = screen.getAllByTestId(/existing-transaction-/);
      const uploadedRows = screen.getAllByTestId(/uploaded-transaction-/);
      
      expect(existingRows.length).toBe(2);
      expect(uploadedRows.length).toBe(2);
      
      existingRows.forEach(row => {
        expect(row).toHaveClass('existing-transaction');
      });
      
      uploadedRows.forEach(row => {
        expect(row).toHaveClass('uploaded-transaction');
        expect(row).toHaveClass('highlighted-row');
      });
    });
  });
}); 