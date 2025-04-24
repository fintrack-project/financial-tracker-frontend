import React from 'react';
import { format } from 'date-fns';
import './TransactionTable.css';
import TransactionRow from './TransactionRow';

interface TransactionTableProps<T> {
  transactions: T[];
  isHighlighted?: (transaction: T) => boolean; // Function to determine if a row should be highlighted
  isMarkedForDeletion?: (transaction: T) => boolean; // Function to determine if a row is marked for deletion
  onDeleteClick?: (transaction: T) => void; // Callback for delete button
  onDeleteAllClick?: () => void; // Callback for deleting all transactions
}

const TransactionTable = <T extends { 
  transactionId?: string;
  accountId?: string;
  date: string; 
  assetName: string; 
  symbol: string; 
  credit: number; 
  debit: number; 
  unit: string; 
  totalBalanceBefore?: number; 
  totalBalanceAfter?: number }>
  ({
    transactions,
    isHighlighted = () => false,
    isMarkedForDeletion = () => false,
    onDeleteClick,
    onDeleteAllClick,
  }: TransactionTableProps<T>) => {
  return (
    <div className="transaction-table-container">
      <div className="table-wrapper">
        <table className="transaction-table">
          <colgroup>
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '10%' }} />
            {onDeleteClick && <col style={{ width: '10%' }} />}
          </colgroup>
          <thead>
            <tr>
              <th>Date</th>
              <th>Asset Name</th>
              <th>Symbol</th>
              <th>Credit (Increase)</th>
              <th>Debit (Decrease)</th>
              <th>Total Balance Before</th>
              <th>Total Balance After</th>
              <th>Unit</th>
              {onDeleteClick && (
                <th
                  className="delete-column-header"
                  onClick={onDeleteAllClick}
                  style={{ cursor: 'pointer', color: 'red' }}
                >
                  Delete All
                </th>
              )}
            </tr>
          </thead>
        </table>
        <div className="scrollable-tbody">
          <table className="transaction-table">
            <colgroup>
              <col style={{ width: '15%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '10%' }} />
              {onDeleteClick && <col style={{ width: '10%' }} />}
            </colgroup>
            <tbody>
              {transactions.map((transaction, index) => (
                <TransactionRow
                  key={index}
                  transaction={transaction}
                  isHighlighted={isHighlighted(transaction)}
                  isMarkedForDeletion={isMarkedForDeletion(transaction)}
                  onDeleteClick={onDeleteClick ? () => onDeleteClick(transaction) : undefined}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;