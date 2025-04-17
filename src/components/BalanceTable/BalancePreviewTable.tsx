import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './BalancePreviewTable.css';
import { Transaction } from 'types/Transaction';
import { PreviewTransaction } from 'types/PreviewTransaction';
import TransactionRow from './TransactionRow';
import TransactionTable from './TransactionTable';

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
  // Helper function to convert Transaction[] to PreviewTransaction[]
  const convertToPreviewTransactions = (
    transactions: Transaction[],
    initialBalance: number = 0
  ): PreviewTransaction[] => {
    let runningBalance = initialBalance;

    return transactions.map((transaction) => {
      const totalBalanceBefore = runningBalance;
      runningBalance += transaction.credit - transaction.debit;
      const totalBalanceAfter = runningBalance;

      return {
        ...transaction,
        totalBalanceBefore,
        totalBalanceAfter,
        markDelete: false, // Default to false
      };
    });
  };

  // Initialize previewTransactions state
  const [previewTransactions, setPreviewTransactions] = useState<PreviewTransaction[]>(() => {
    const combinedTransactions = [
      ...convertToPreviewTransactions(existingTransactions),
      ...convertToPreviewTransactions(uploadedTransactions),
    ];
    return combinedTransactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ); // Sort by date (descending)
  });

  // Update previewTransactions whenever existingTransactions or uploadedTransactions change
  useEffect(() => {
    const combinedTransactions = [
      ...convertToPreviewTransactions(existingTransactions),
      ...convertToPreviewTransactions(uploadedTransactions),
    ];
    const sortedTransactions = combinedTransactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ); // Sort by date (descending)

    setPreviewTransactions(sortedTransactions);
  }, [existingTransactions, uploadedTransactions]);

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
      <button className="button" onClick={handleConfirm}>
        Confirm
      </button>
      <TransactionTable
        transactions={previewTransactions}
        isHighlighted={(transaction) => 
          transaction.transactionId === null && 
          transaction.accountId === null
        }
        isMarkedForDeletion={(transaction) => transaction.markDelete}
        onDeleteClick={(transaction) => {
          const index = previewTransactions.indexOf(transaction);
          toggleMarkDelete(index);
        }}
        onDeleteAllClick={() => {
          const allMarked = previewTransactions.every((transaction) => transaction.markDelete);
          setPreviewTransactions((prev) =>
            prev.map((transaction) => ({ ...transaction, markDelete: !allMarked }))
          );
        }}
      />
    </div>
  );
};

export default BalancePreviewTable;