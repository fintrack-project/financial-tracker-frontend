import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './BalancePreviewTable.css';
import { Transaction } from 'types/Transaction';
import { PreviewTransaction } from 'types/PreviewTransaction';
import TransactionRow from './TransactionRow';

interface BalancePreviewTableProps {
  accountId: string | null; // Account ID for the transactions
  existingTransactions: Transaction[]; // Data from BalanceOverviewTable
  uploadedTransactions: Transaction[]; // Data from UploadBalanceTable
  onConfirm: (transactions: PreviewTransaction[]) => void; // Callback to confirm changes
}

const BalancePreviewTable: React.FC<BalancePreviewTableProps> = ({
  accountId,
  existingTransactions,
  uploadedTransactions,
  onConfirm,
}) => {
  const [previewTransactions, setPreviewTransactions] = useState<PreviewTransaction[]>([
    ...existingTransactions.map((t) => ({ ...t, markDelete: false })),
    ...uploadedTransactions.map((t) => ({ ...t, markDelete: false })),
  ]);

  // Update previewTransactions whenever existingTransactions or uploadedTransactions change
  useEffect(() => {

    const sortedTransactions = [
      ...existingTransactions.map((t) => ({ ...t, markDelete: false })),
      ...uploadedTransactions.map((t) => ({ ...t, markDelete: false })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date (ascending)

    setPreviewTransactions(sortedTransactions);
  }, [existingTransactions, uploadedTransactions]);

  // Check if a transaction is in the uploadedTransactions list
  const isUploadedTransaction = (transaction: PreviewTransaction) => {
    return uploadedTransactions.some(
      (uploaded) =>
        uploaded.date === transaction.date &&
        uploaded.assetName === transaction.assetName &&
        uploaded.credit === transaction.credit &&
        uploaded.debit === transaction.debit &&
        uploaded.totalBalanceBefore === transaction.totalBalanceBefore &&
        uploaded.totalBalanceAfter === transaction.totalBalanceAfter &&
        uploaded.unit === transaction.unit
    );
  };

  // Toggle the markDelete field for a transaction
  const toggleMarkDelete = (index: number) => {
    setPreviewTransactions((prev) =>
      prev.map((transaction, i) =>
        i === index ? { ...transaction, markDelete: !transaction.markDelete } : transaction
      )
    );
  };

  const handleConfirm = async () => {
    if (!accountId) {
      alert('Please select an account before confirming transactions.');
      return;
    }
    
    try {
      // Send all previewTransactions (including markDelete) to the backend
      await onConfirm(previewTransactions);
    } catch (error) {
      console.error('Error confirming transactions:', error);
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
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {previewTransactions.map((transaction, index) => (
              <TransactionRow
                key={index}
                transaction={transaction}
                isHighlighted={uploadedTransactions.some(
                  (uploaded) =>
                    uploaded.date === transaction.date &&
                    uploaded.assetName === transaction.assetName
                )}
                isMarkedForDeletion={transaction.markDelete}
                onDeleteClick={() => toggleMarkDelete(index)}
              />
            ))}
        </tbody>
      </table>
      <button className="button" onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );
};

export default BalancePreviewTable;