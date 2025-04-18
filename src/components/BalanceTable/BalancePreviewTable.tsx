import React, { useState, useEffect } from 'react';
import './BalancePreviewTable.css';
import { Transaction } from 'types/Transaction';
import { PreviewTransaction } from 'types/PreviewTransaction';
import { useProcessedTransactions } from 'hooks/useProcessedTransactions';
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
  ): PreviewTransaction[] => {
    return transactions.map((transaction) => {
      return {
        ...transaction,
        totalBalanceBefore: 0,
        totalBalanceAfter: 0,
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

  const processedTransactions = useProcessedTransactions(previewTransactions);

  // Merge `markDelete` into `processedTransactions`
  const mergedTransactions = processedTransactions.map((processedTransaction) => {
    const matchingPreviewTransaction = previewTransactions.find(
      (previewTransaction) => previewTransaction.transactionId === processedTransaction.transactionId
    );

    return {
      ...processedTransaction,
      markDelete: matchingPreviewTransaction?.markDelete || false, // Default to false if not found
    };
  });

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
      await onConfirm(mergedTransactions);
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
        transactions={mergedTransactions}
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