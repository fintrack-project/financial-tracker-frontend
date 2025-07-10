import React, { useState, useEffect } from 'react';
import './BalancePreviewTable.css';
import { Transaction } from '../../types/Transaction';
import { OverviewTransaction } from '../../types/OverviewTransaction';
import { PreviewTransaction } from '../../types/PreviewTransaction';
import TransactionTable from './TransactionTable';

interface BalancePreviewTableProps {
  accountId: string | null; // Account ID for the transactions
  existingTransactions: OverviewTransaction[]; // Data from BalanceOverviewTable
  uploadedTransactions: Transaction[]; // Data from UploadBalanceTable
  onConfirm: (transactions: PreviewTransaction[]) => void; // Callback to confirm changes
}

const BalancePreviewTable: React.FC<BalancePreviewTableProps> = ({
  accountId,
  existingTransactions,
  uploadedTransactions,
  onConfirm,
}) => {
  // State to manage preview transactions
  const [previewTransactions, setPreviewTransactions] = useState<PreviewTransaction[]>([]);

  // Helper function to convert Transaction[] to OverviewTransaction[]
  const convertToOverviewTransactions = (
    transactions: Transaction[],
  ): OverviewTransaction[] => {
    return transactions.map((transaction) => {
      return {
        ...transaction,
        totalBalanceBefore: 0,
        totalBalanceAfter: 0
      };
    });
  };

  // Helper function to convert OverviewTransaction[] to PreviewTransaction[]
  const convertToPreviewTransactions = (
      transactions: OverviewTransaction[],
    ): PreviewTransaction[] => {
      return transactions.map((transaction) => {
        return {
          ...transaction,
          markDelete: false, // Default to false
        };
      });
    };

  // Update previewTransactions when existingTransactions or uploadedTransactions change
  useEffect(() => {
    const combinedTransactions: PreviewTransaction[] = [
      ...convertToPreviewTransactions(existingTransactions),
      ...convertToPreviewTransactions(convertToOverviewTransactions(uploadedTransactions)),
    ];
    
    // Sort the combined transactions based on the specified criteria
    combinedTransactions.sort((a, b) => {
      // 1. Descending order of date
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA !== dateB) {
        return dateB - dateA; // Descending order
      }

      // 2. Ascending order of asset name
      if (a.assetName !== b.assetName) {
        return a.assetName.localeCompare(b.assetName); // Ascending order
      }

      // 3. Ascending order of credit
      if (a.credit !== b.credit) {
        return a.credit - b.credit; // Ascending order
      }

      // 4. Ascending order of debit
      return a.debit - b.debit; // Ascending order
    });

    setPreviewTransactions((prev) => {
      // Preserve the `markDelete` state for existing transactions
      return combinedTransactions.map((transaction) => {
        const existingTransaction = prev.find(
          (t) => t.transactionId === transaction.transactionId
        );
        return existingTransaction || transaction;
      });
    });
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
      <h2 className="fintrack-subsection-title">Balance Preview</h2>
      <div className="table-wrapper">
        <TransactionTable
          transactions={previewTransactions}
          isHighlighted={(transaction) => 
            transaction.transactionId === null && 
            transaction.accountId === null
          }
          isMarkedForDeletion={(transaction) => transaction.markDelete}
          onDeleteClick={(transaction) => {
            const index = previewTransactions.findIndex(
              (t) => t.transactionId === transaction.transactionId
            );
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
      <div className="table-footer">
        <button className="button button-primary" onClick={handleConfirm}>
          Confirm Changes
        </button>
      </div>
    </div>
  );
};

export default BalancePreviewTable;