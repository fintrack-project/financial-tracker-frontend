import React, { useState } from 'react';
import { parseCSVFile, parseXLSXFile, exportToCSV, exportToXLSX } from '../../services/fileService';
import { uploadPreviewTransactions } from '../../services/transactionService';
import TransactionTable from '../BalanceTable/TransactionTable';
import { Transaction } from 'types/Transaction';
import BlankTransactionRow from './BlankTransactionRow';
import InputTransactionRow from './InputTransactionRow';
import './UploadBalanceTable.css';
import { set } from 'date-fns';

interface UploadBalanceTableProps {
  accountId: string | null; // Account ID for the transactions
  onPreviewUpdate: (previewTransactions: Transaction[]) => void; // Callback to update preview table
}

const UploadBalanceTable: React.FC<UploadBalanceTableProps> = ({ 
  accountId, 
  onPreviewUpdate 
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [templateFormat, setTemplateFormat] = useState<'xlsx' | 'csv'>('xlsx'); // Default format is .xlsx
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown visibility state

  // Add a new blank row
  const addRow = () => {
    setTransactions((prev) => [
      ...prev,
      {
        date: 'yyyy-MM-dd',
        assetName: '',
        symbol: '',
        credit: 0,
        debit: 0,
        unit: '',
      },
    ]);
  };

  // Remove a row by index
  const removeRow = (index: number) => {
    setTransactions((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle input changes for a specific row and column
  const handleInputChange = (index: number, field: keyof Transaction, value: string | number) => {
    setTransactions((prev) =>
      prev.map((transaction, i) =>
        i === index ? { ...transaction, [field]: value } : transaction
      )
    );
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    try {
      let parsedTransactions: Transaction[] = [];
      if (fileExtension === 'csv') {
        parsedTransactions = await parseCSVFile(file);
      } else if (fileExtension === 'xlsx') {
        parsedTransactions = await parseXLSXFile(file);
      } else {
        alert('Unsupported file format. Please upload a CSV or XLSX file.');
        return
      }

      setTransactions((prev) => [...prev, ...parsedTransactions]);
    } catch (error) {
      alert('Error parsing file. Please check the file format and try again.');
    }
  };

  // Download template file
  const handleDownloadTemplate = () => {
    const template = [
      {
        date: 'yyyy-MM-dd',
        assetName: 'ExampleAsset',
        symbol: 'EXA',
        credit: 0,
        debit: 0,
        totalBalanceBefore: 0,
        totalBalanceAfter: 0,
        unit: 'USD',
      },
    ];

    if (templateFormat === 'csv') {
      exportToCSV(template, 'balance_template.csv');
    } else if (templateFormat === 'xlsx') {
      exportToXLSX(template, 'balance_template.xlsx');
    }
  };

  // Handle upload to preview
  const handleUploadToPreview = async () => {
    if (!accountId) {
      alert('Please select an account before uploading transactions.');
      return;
    }

    if (transactions.length === 0) {
      alert('No transactions to upload. Please upload a file first.');
      return;
    }

    try {
      const previewData = await uploadPreviewTransactions(accountId, transactions); // Send transactions to backend
      onPreviewUpdate(previewData); // Update the preview table with the response
      alert('Transactions uploaded to preview successfully.');
    } catch (error) {
      console.error('Error uploading transactions to preview:', error);
      alert('Error uploading transactions. Please try again.');
    }
  };

  return (
    <div className="upload-balance-container">
      <h2>Upload Balance Table</h2>
      <table className="upload-balance-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Asset Name</th>
            <th>Symbol</th>
            <th>Credit (Increase)</th>
            <th>Debit (Decrease)</th>
            <th>Unit</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <InputTransactionRow
              key={index}
              transaction={transaction}
              onInputChange={(field, value) => handleInputChange(index, field, value)}
              onRemoveRow={() => removeRow(index)}
            />
          ))}
          <BlankTransactionRow onAddRow={addRow} />
        </tbody>
      </table>
      <div className="actions-row">
        <div className="upload-button-container">
          <button className="button" onClick={handleUploadToPreview}>Upload Transactions</button>
        </div>
        <div className="file-actions">
          <input type="file" accept=".csv, .xlsx" onChange={handleFileUpload} />
          <button className="button" onClick={handleDownloadTemplate}>Download Template</button>
          <div className="dropdown-container">
            <div
              className="dropdown-selector"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
            .{templateFormat.toLowerCase()} ▼
            </div>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setTemplateFormat('xlsx');
                    setDropdownOpen(false);
                  }}
                >
                  .xlsx
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setTemplateFormat('csv');
                    setDropdownOpen(false);
                  }}
                >
                  .csv
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadBalanceTable;