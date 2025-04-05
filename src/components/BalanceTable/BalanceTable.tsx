import React, { useState } from 'react';
import {
  parseCSVFile,
  parseXLSXFile,
  exportToCSV,
  exportToXLSX,
} from '../../services/fileService';
import './BalanceTable.css';

interface Transaction {
  date: string;
  assetName: string;
  credit: number; // Increase
  debit: number; // Decrease
  totalBalanceBefore: number;
  totalBalanceAfter: number;
  unit: string;
}

const BalanceTable: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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

  // Handle file download
  const handleFileDownload = (format: 'csv' | 'xlsx') => {
    if (transactions.length === 0) {
      alert('No data available to download.');
      return;
    }

    if (format === 'csv') {
      exportToCSV(transactions, 'balance.csv');
    } else if (format === 'xlsx') {
      exportToXLSX(transactions, 'balance.xlsx');
    }
  };

  return (
    <div className="balance-table-container">
      <div className="file-actions">
        <input type="file" accept=".csv, .xlsx" onChange={handleFileUpload} />
        <button onClick={() => handleFileDownload('csv')}>Download CSV</button>
        <button onClick={() => handleFileDownload('xlsx')}>Download XLSX</button>
      </div>
      <table className="balance-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Asset Name</th>
            <th>Credit (Increase)</th>
            <th>Debit (Decrease)</th>
            <th>Total Balance Before</th>
            <th>Total Balance After</th>
            <th>Unit</th>
          </tr>
        </thead>
        <tbody>
          {transactions.slice(0, 30).map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.date}</td>
              <td>{transaction.assetName}</td>
              <td>{transaction.credit}</td>
              <td>{transaction.debit}</td>
              <td>{transaction.totalBalanceBefore}</td>
              <td>{transaction.totalBalanceAfter}</td>
              <td>{transaction.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BalanceTable;