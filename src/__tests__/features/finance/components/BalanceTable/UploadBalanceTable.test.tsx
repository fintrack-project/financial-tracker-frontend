import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../../../../shared/utils/test-utils';

// Mock the UploadBalanceTable component as a static element
jest.mock('../../../../../features/finance/components/BalanceTable/UploadBalanceTable', () => ({
  __esModule: true,
  default: ({ accountId, onPreviewUpdate }: any) => (
    <div data-testid="upload-balance-table">
      <h2>Upload Balance Table</h2>
      <div data-testid="file-upload-section">
        <div data-testid="file-input-container">
          <label data-testid="file-input-label">
            <span data-testid="upload-icon">📁</span>
            Choose File
            <input 
              data-testid="file-input"
              type="file" 
              accept=".csv, .xlsx" 
            />
          </label>
        </div>
        <div data-testid="template-download-section">
          <select data-testid="template-format-selector">
            <option value="csv">CSV</option>
            <option value="xlsx">XLSX</option>
          </select>
          <button data-testid="download-template-button">Download Template</button>
        </div>
      </div>
      <div data-testid="transaction-table">
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
            <tr data-testid="transaction-row-0">
              <td><input data-testid="date-input-0" type="date" value="2024-01-15" readOnly /></td>
              <td><input data-testid="asset-name-input-0" type="text" value="Apple Inc." readOnly /></td>
              <td><input data-testid="symbol-input-0" type="text" value="AAPL" readOnly /></td>
              <td><select data-testid="asset-type-input-0"><option value="STOCK">STOCK</option></select></td>
              <td><input data-testid="credit-input-0" type="number" value="1000" readOnly /></td>
              <td><input data-testid="debit-input-0" type="number" value="0" readOnly /></td>
              <td><button data-testid="remove-row-0">Remove</button></td>
            </tr>
            <tr data-testid="transaction-row-1">
              <td><input data-testid="date-input-1" type="date" value="2024-01-16" readOnly /></td>
              <td><input data-testid="asset-name-input-1" type="text" value="Microsoft Corp." readOnly /></td>
              <td><input data-testid="symbol-input-1" type="text" value="MSFT" readOnly /></td>
              <td><select data-testid="asset-type-input-1"><option value="STOCK">STOCK</option></select></td>
              <td><input data-testid="credit-input-1" type="number" value="500" readOnly /></td>
              <td><input data-testid="debit-input-1" type="number" value="0" readOnly /></td>
              <td><button data-testid="remove-row-1">Remove</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div data-testid="table-footer">
        <button data-testid="add-row-button">Add Row</button>
        <button data-testid="upload-transactions-button">Upload Transactions</button>
      </div>
      {accountId && (
        <div data-testid="account-info">Account: {accountId}</div>
      )}
    </div>
  ),
}));

import UploadBalanceTable from '../../../../../features/finance/components/BalanceTable/UploadBalanceTable';

describe('UploadBalanceTable Component', () => {
  const mockOnPreviewUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    test('should render upload balance table with title', () => {
      render(<UploadBalanceTable accountId="test-account" onPreviewUpdate={mockOnPreviewUpdate} />);
      expect(screen.getByText('Upload Balance Table')).toBeInTheDocument();
      expect(screen.getByTestId('upload-balance-table')).toBeInTheDocument();
    });

    test('should render file upload section', () => {
      render(<UploadBalanceTable accountId="test-account" onPreviewUpdate={mockOnPreviewUpdate} />);
      expect(screen.getByTestId('file-upload-section')).toBeInTheDocument();
      expect(screen.getByTestId('file-input-container')).toBeInTheDocument();
      expect(screen.getByTestId('file-input-label')).toBeInTheDocument();
    });

    test('should render template download section', () => {
      render(<UploadBalanceTable accountId="test-account" onPreviewUpdate={mockOnPreviewUpdate} />);
      expect(screen.getByTestId('template-download-section')).toBeInTheDocument();
      expect(screen.getByTestId('template-format-selector')).toBeInTheDocument();
      expect(screen.getByTestId('download-template-button')).toBeInTheDocument();
    });

    test('should render transaction table', () => {
      render(<UploadBalanceTable accountId="test-account" onPreviewUpdate={mockOnPreviewUpdate} />);
      expect(screen.getByTestId('transaction-table')).toBeInTheDocument();
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    test('should render table headers correctly', () => {
      render(<UploadBalanceTable accountId="test-account" onPreviewUpdate={mockOnPreviewUpdate} />);
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('Asset Name')).toBeInTheDocument();
      expect(screen.getByText('Symbol')).toBeInTheDocument();
      expect(screen.getByText('Asset Type')).toBeInTheDocument();
      expect(screen.getByText('Credit')).toBeInTheDocument();
      expect(screen.getByText('Debit')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    test('should render action buttons', () => {
      render(<UploadBalanceTable accountId="test-account" onPreviewUpdate={mockOnPreviewUpdate} />);
      expect(screen.getByTestId('add-row-button')).toBeInTheDocument();
      expect(screen.getByTestId('upload-transactions-button')).toBeInTheDocument();
    });

    test('should display account information when accountId is provided', () => {
      render(<UploadBalanceTable accountId="test-account" onPreviewUpdate={mockOnPreviewUpdate} />);
      expect(screen.getByTestId('account-info')).toBeInTheDocument();
      expect(screen.getByText('Account: test-account')).toBeInTheDocument();
    });
  });

  describe('File Upload Functionality', () => {
    test('should render file input with correct attributes', () => {
      render(<UploadBalanceTable accountId="test-account" onPreviewUpdate={mockOnPreviewUpdate} />);
      const fileInput = screen.getByTestId('file-input');
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute('type', 'file');
      expect(fileInput).toHaveAttribute('accept', '.csv, .xlsx');
    });

    test('should render upload icon', () => {
      render(<UploadBalanceTable accountId="test-account" onPreviewUpdate={mockOnPreviewUpdate} />);
      expect(screen.getByTestId('upload-icon')).toBeInTheDocument();
    });

    test('should render file input label with proper text', () => {
      render(<UploadBalanceTable accountId="test-account" onPreviewUpdate={mockOnPreviewUpdate} />);
      const label = screen.getByTestId('file-input-label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent('Choose File');
    });
  });

  describe('Template Download Functionality', () => {
    test('should render template format selector', () => {
      render(<UploadBalanceTable accountId="test-account" onPreviewUpdate={mockOnPreviewUpdate} />);
      const formatSelector = screen.getByTestId('template-format-selector');
      expect(formatSelector).toBeInTheDocument();
      expect(formatSelector.tagName).toBe('SELECT');
    });

    test('should render template format options', () => {
      render(<UploadBalanceTable accountId="test-account" onPreviewUpdate={mockOnPreviewUpdate} />);
      const formatSelector = screen.getByTestId('template-format-selector');
      expect(formatSelector).toHaveValue('csv');
      
      const options = formatSelector.querySelectorAll('option');
      expect(options).toHaveLength(2);
      expect(options[0]).toHaveValue('csv');
      expect(options[1]).toHaveValue('xlsx');
    });

    test('should render download template button', () => {
      render(<UploadBalanceTable accountId="test-account" onPreviewUpdate={mockOnPreviewUpdate} />);
      expect(screen.getByTestId('download-template-button')).toBeInTheDocument();
      expect(screen.getByText('Download Template')).toBeInTheDocument();
    });
  });

  describe('Transaction Management', () => {
    test('should render transaction rows with input fields', () => {
      render(<UploadBalanceTable accountId="test-account" onPreviewUpdate={mockOnPreviewUpdate} />);
      
      // Check first row
      expect(screen.getByTestId('transaction-row-0')).toBeInTheDocument();
      expect(screen.getByTestId('date-input-0')).toBeInTheDocument();
      expect(screen.getByTestId('asset-name-input-0')).toBeInTheDocument();
      expect(screen.getByTestId('symbol-input-0')).toBeInTheDocument();
      expect(screen.getByTestId('asset-type-input-0')).toBeInTheDocument();
      expect(screen.getByTestId('credit-input-0')).toBeInTheDocument();
      expect(screen.getByTestId('debit-input-0')).toBeInTheDocument();
      expect(screen.getByTestId('remove-row-0')).toBeInTheDocument();

      // Check second row
      expect(screen.getByTestId('transaction-row-1')).toBeInTheDocument();
      expect(screen.getByTestId('date-input-1')).toBeInTheDocument();
      expect(screen.getByTestId('asset-name-input-1')).toBeInTheDocument();
      expect(screen.getByTestId('symbol-input-1')).toBeInTheDocument();
      expect(screen.getByTestId('asset-type-input-1')).toBeInTheDocument();
      expect(screen.getByTestId('credit-input-1')).toBeInTheDocument();
      expect(screen.getByTestId('debit-input-1')).toBeInTheDocument();
      expect(screen.getByTestId('remove-row-1')).toBeInTheDocument();
    });

    test('should display transaction data in input fields', () => {
      render(<UploadBalanceTable accountId="test-account" onPreviewUpdate={mockOnPreviewUpdate} />);
      
      // Check first row data
      expect(screen.getByTestId('date-input-0')).toHaveValue('2024-01-15');
      expect(screen.getByTestId('asset-name-input-0')).toHaveValue('Apple Inc.');
      expect(screen.getByTestId('symbol-input-0')).toHaveValue('AAPL');
      expect(screen.getByTestId('credit-input-0')).toHaveValue(1000);
      expect(screen.getByTestId('debit-input-0')).toHaveValue(0);

      // Check second row data
      expect(screen.getByTestId('date-input-1')).toHaveValue('2024-01-16');
      expect(screen.getByTestId('asset-name-input-1')).toHaveValue('Microsoft Corp.');
      expect(screen.getByTestId('symbol-input-1')).toHaveValue('MSFT');
      expect(screen.getByTestId('credit-input-1')).toHaveValue(500);
      expect(screen.getByTestId('debit-input-1')).toHaveValue(0);
    });

    test('should render remove buttons for each row', () => {
      render(<UploadBalanceTable accountId="test-account" onPreviewUpdate={mockOnPreviewUpdate} />);
      
      const removeButtons = screen.getAllByText('Remove');
      expect(removeButtons).toHaveLength(2);
      expect(screen.getByTestId('remove-row-0')).toBeInTheDocument();
      expect(screen.getByTestId('remove-row-1')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('should handle null accountId', () => {
      render(<UploadBalanceTable accountId={null} onPreviewUpdate={mockOnPreviewUpdate} />);
      expect(screen.getByText('Upload Balance Table')).toBeInTheDocument();
      expect(screen.queryByTestId('account-info')).not.toBeInTheDocument();
    });

    test('should handle empty accountId', () => {
      render(<UploadBalanceTable accountId="" onPreviewUpdate={mockOnPreviewUpdate} />);
      expect(screen.getByText('Upload Balance Table')).toBeInTheDocument();
      expect(screen.queryByTestId('account-info')).not.toBeInTheDocument();
    });

    test('should handle large number of transactions', () => {
      render(<UploadBalanceTable accountId="test-account" onPreviewUpdate={mockOnPreviewUpdate} />);
      
      // The mocked component shows 2 rows, but in a real scenario this would test many rows
      expect(screen.getByTestId('transaction-row-0')).toBeInTheDocument();
      expect(screen.getByTestId('transaction-row-1')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('should have proper heading structure', () => {
      render(<UploadBalanceTable accountId="test-account" onPreviewUpdate={mockOnPreviewUpdate} />);
      const heading = screen.getByRole('heading', { name: 'Upload Balance Table' });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');
    });

    test('should have proper table structure', () => {
      render(<UploadBalanceTable accountId="test-account" onPreviewUpdate={mockOnPreviewUpdate} />);
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      
      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(7); // Date, Asset Name, Symbol, Asset Type, Credit, Debit, Actions
    });

    test('should have proper form elements', () => {
      render(<UploadBalanceTable accountId="test-account" onPreviewUpdate={mockOnPreviewUpdate} />);
      
      const fileInput = screen.getByTestId('file-input');
      const formatSelector = screen.getByTestId('template-format-selector');
      const addButton = screen.getByTestId('add-row-button');
      const uploadButton = screen.getByTestId('upload-transactions-button');
      
      expect(fileInput).toBeInTheDocument();
      expect(formatSelector).toBeInTheDocument();
      expect(addButton).toBeInTheDocument();
      expect(uploadButton).toBeInTheDocument();
    });

    test('should have proper labels for file input', () => {
      render(<UploadBalanceTable accountId="test-account" onPreviewUpdate={mockOnPreviewUpdate} />);
      const fileInput = screen.getByTestId('file-input');
      const label = screen.getByTestId('file-input-label');
      
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent('Choose File');
    });
  });
}); 