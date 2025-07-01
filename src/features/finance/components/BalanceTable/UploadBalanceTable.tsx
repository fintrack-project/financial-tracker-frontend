import React, { useState } from 'react';
import { parseCSVFile, parseXLSXFile, exportToCSV, exportToXLSX } from '../../services/fileService';
import { uploadPreviewTransactions } from '../../services/transactionService';
import { Transaction } from '../../types/Transaction';
import InputTransactionRow from './InputTransactionRow';
import FileActionsDropdown from '../../../../shared/components/DropDown/FileActionsDropdown';
import Icon from '../../../../shared/components/Card/Icon';
import { FaFileInvoiceDollar, FaUpload } from 'react-icons/fa';
import './UploadBalanceTable.css';

interface UploadBalanceTableProps {
  accountId: string | null; // Account ID for the transactions
  onPreviewUpdate: (previewTransactions: Transaction[]) => void; // Callback to update preview table
}

const UploadBalanceTable: React.FC<UploadBalanceTableProps> = ({ 
  accountId, 
  onPreviewUpdate 
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [templateFormat, setTemplateFormat] = useState<'xlsx' | 'csv'>('csv'); // Default format is .xlsx
  const [isLoading, setIsLoading] = useState(false);

  // Add a new blank row
  const addRow = () => {
    setTransactions((prev) => [
      ...prev,
      {
        date: 'yyyy-MM-dd',
        assetName: '',
        symbol: '',
        assetType: '',
        credit: 0,
        debit: 0,
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

    setIsLoading(true);
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    try {
      let parsedTransactions: Transaction[] = [];
      if (fileExtension === 'csv') {
        parsedTransactions = await parseCSVFile(file);
      } else if (fileExtension === 'xlsx') {
        parsedTransactions = await parseXLSXFile(file);
      } else {
        alert('Unsupported file format. Please upload a CSV or XLSX file.');
        return;
      }

      setTransactions((prev) => [...prev, ...parsedTransactions]);
    } catch (error) {
      alert('Error parsing file. Please check the file format and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Download template file
  const handleDownloadTemplate = () => {
    const template = [
      {
        date: 'yyyy-MM-dd',
        assetName: 'ExampleAsset',
        symbol: 'EXA',
        assetType: 'STOCK/FOREX/CRYPTO/COMMODITY',
        credit: 0,
        debit: 0,
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

    setIsLoading(true);
    try {
      const previewData = await uploadPreviewTransactions(accountId, transactions);
      onPreviewUpdate(previewData);
      setTransactions([]);
      alert('Transactions uploaded to preview successfully.');
    } catch (error) {
      console.error('Error uploading transactions to preview:', error);
      alert('Error uploading transactions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="table-container">
        <div className="table-header">
          <h2>Upload Balance Table</h2>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <span>Processing transactions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container upload-balance-container">
      <div className="table-header" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', minHeight: 56, minWidth: 400, padding: '0 48px' }}>
        <div style={{ position: 'absolute', left: 0 }}></div>
        <h2 style={{ margin: 0, flex: 0, textAlign: 'center', width: '100%', whiteSpace: 'nowrap' }}>Upload Balance Table</h2>
        <div style={{ position: 'absolute', right: 0 }}>
          <button className="button button-secondary" onClick={addRow}>
            + Add Transaction
          </button>
        </div>
      </div>
      <div className="scrollable-content">
        <table className="data-table">
          <colgroup>
            <col className="col-date" />
            <col className="col-asset-name" />
            <col className="col-symbol" />
            <col className="col-asset-type" />
            <col className="col-credit" />
            <col className="col-debit" />
            <col className="col-action" />
          </colgroup>
          <thead>
            <tr>
              <th>Date</th>
              <th>Asset Name</th>
              <th>Symbol</th>
              <th>Asset Type</th>
              <th>Credit (Increase)</th>
              <th>Debit (Decrease)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="empty-state">
                    <Icon icon={FaFileInvoiceDollar} className="empty-state-icon" aria-hidden={true} />
                    <div className="empty-state-text">No Transactions Added</div>
                    <div className="empty-state-subtext">Upload a file or add transactions manually</div>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {transactions.map((transaction, index) => (
                  <InputTransactionRow
                    key={index}
                    transaction={transaction}
                    onInputChange={(field, value) => handleInputChange(index, field, value)}
                    onRemoveRow={() => removeRow(index)}
                  />
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
      <div className="table-footer">
        <div className="actions-group">
          <div className="file-input-container">
            <label className="file-input-label">
              <Icon icon={FaUpload} className="fa-icon" aria-hidden={true} />
              Choose File
              <input 
                type="file" 
                accept=".csv, .xlsx" 
                onChange={handleFileUpload}
              />
            </label>
          </div>
          <FileActionsDropdown
            actionName='Download Template'
            fileFormat={templateFormat}
            onFileFormatChange={setTemplateFormat}
            onDownload={handleDownloadTemplate}
          />
        </div>
        <button className="button button-primary" onClick={handleUploadToPreview}>
          Upload Transactions
        </button>
      </div>
    </div>
  );
};

export default UploadBalanceTable;