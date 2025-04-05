import React, { useState } from 'react';
import Papa from 'papaparse'; // For CSV parsing
import * as XLSX from 'xlsx'; // For XLSX parsing and exporting
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
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      // Parse CSV file
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedTransactions = results.data.map((row: any) => ({
            date: row.date || '',
            assetName: row.assetName || '',
            credit: Number(row.credit || 0),
            debit: Number(row.debit || 0),
            totalBalanceBefore: Number(row.totalBalanceBefore || 0),
            totalBalanceAfter: Number(row.totalBalanceAfter || 0),
            unit: row.unit || '',
          }));
          setTransactions(parsedTransactions);
        },
      });
    } else if (fileExtension === 'xlsx') {
      // Parse XLSX file
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedTransactions = XLSX.utils.sheet_to_json(sheet).map((row: any) => ({
          date: row.date || '',
          assetName: row.assetName || '',
          credit: Number(row.credit || 0),
          debit: Number(row.debit || 0),
          totalBalanceBefore: Number(row.totalBalanceBefore || 0),
          totalBalanceAfter: Number(row.totalBalanceAfter || 0),
          unit: row.unit || '',
        }));
        setTransactions(parsedTransactions);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Unsupported file format. Please upload a CSV or XLSX file.');
    }
  };

  // Handle file download
  const handleFileDownload = (format: 'csv' | 'xlsx') => {
    if (transactions.length === 0) {
      alert('No data available to download.');
      return;
    }

    const data = transactions.map((transaction) => ({
      date: transaction.date,
      assetName: transaction.assetName,
      credit: transaction.credit,
      debit: transaction.debit,
      totalBalanceBefore: transaction.totalBalanceBefore,
      totalBalanceAfter: transaction.totalBalanceAfter,
      unit: transaction.unit,
    }));

    if (format === 'csv') {
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'balance.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'xlsx') {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Balance');
      XLSX.writeFile(workbook, 'balance.xlsx');
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