import React, { useState } from 'react';
import { parseCSVFile, parseXLSXFile, exportToCSV, exportToXLSX } from '../../services/fileService';
import TransactionTable from '../BalanceTable/TransactionTable';
import './UploadBalanceTable.css';

interface Transaction {
  date: string;
  assetName: string;
  credit: number;
  debit: number;
  totalBalanceBefore: number;
  totalBalanceAfter: number;
  unit: string;
}

const UploadBalanceTable: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [templateFormat, setTemplateFormat] = useState<'xlsx' | 'csv'>('xlsx'); // Default format is .xlsx
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown visibility state

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    try {
      if (fileExtension === 'csv') {
        const parsedTransactions = await parseCSVFile(file);
        setTransactions(parsedTransactions);
      } else if (fileExtension === 'xlsx') {
        const parsedTransactions = await parseXLSXFile(file);
        setTransactions(parsedTransactions);
      } else {
        alert('Unsupported file format. Please upload a CSV or XLSX file.');
      }
    } catch (error) {
      alert('Error parsing file. Please check the file format and try again.');
    }
  };

  // Download template file
  const handleDownloadTemplate = () => {
    const template = [
      {
        date: 'YYYY/MM/DD',
        assetName: 'ExampleAsset',
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

  return (
    <div className="upload-balance-container">
      <h2>Upload Balance Table</h2>
      <TransactionTable transactions={transactions} />
      <div className="file-actions">
        <input type="file" accept=".csv, .xlsx" onChange={handleFileUpload} />
        <button onClick={handleDownloadTemplate}>Download Template</button>
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
  );
};

export default UploadBalanceTable;