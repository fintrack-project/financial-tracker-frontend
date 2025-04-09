import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './BalancePreviewTable.css';
import { Transaction } from 'types/Transaction';

interface BalancePreviewTableProps {
  accountId: string | null; // Account ID for the transactions
  existingTransactions: Transaction[]; // Data from BalanceOverviewTable
  uploadedTransactions: Transaction[]; // Data from UploadBalanceTable
  onConfirm: (transactions: Transaction[]) => void; // Callback to confirm changes
}

const BalancePreviewTable: React.FC<BalancePreviewTableProps> = ({
  accountId,
  existingTransactions,
  uploadedTransactions,
  onConfirm,
}) => {
  const [previewTransactions, setPreviewTransactions] = useState<Transaction[]>([
    ...existingTransactions,
    ...uploadedTransactions,
  ]);

  // Update previewTransactions whenever existingTransactions or uploadedTransactions change
  useEffect(() => {
    setPreviewTransactions([...existingTransactions, ...uploadedTransactions]);
  }, [existingTransactions, uploadedTransactions]);

  const handleConfirm = async () => {
    if (!accountId) {
      alert('Please select an account before confirming transactions.');
      return;
    }
    
    try {
      // Call the onConfirm callback to update the database
      await onConfirm(previewTransactions);
      alert('Transactions confirmed and updated successfully.');
    } catch (error) {
      console.error('Error confirming transactions:', error);
      alert('Error confirming transactions. Please try again.');
    }
  };

  return (
    <div className="balance-preview-container">
      <h2>Balance Preview Table</h2>
      <table className="preview-table">
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
          {previewTransactions.map((transaction, index) => (
            <tr
              key={index}
              className={
                uploadedTransactions.includes(transaction) ? 'highlight-row' : ''
              }
            >
              <td>{format(new Date(transaction.date), 'yyyy-MM-dd')}</td>
              <td>{transaction.assetName}</td>
              <td>{transaction.credit}</td>
              <td className={transaction.debit !== 0 ? 'debit-column' : ''}>
                {transaction.debit !== 0 ? `(${transaction.debit})` : transaction.debit}
              </td>
              <td>{transaction.totalBalanceBefore}</td>
              <td>{transaction.totalBalanceAfter}</td>
              <td>{transaction.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="confirm-button" onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );
};

export default BalancePreviewTable;