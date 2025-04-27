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
  assetType: string; 
  credit: number; 
  debit: number; 
  unit?: string; 
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
        {transactions.length === 0 ? (
          <div className="no-transactions-message">
            No transactions
          </div>
        ) : (
          <>
            <table className="transaction-table">
              <colgroup>
                <col className="col-date" />
                <col className="col-asset-name" />
                <col className="col-symbol" />
                <col className="col-asset-type" />
                <col className="col-credit" />
                <col className="col-debit" />
                <col className="col-total-before" />
                <col className="col-total-after" />
                <col className="col-unit" />
                {onDeleteClick && <col className="col-delete" />}
              </colgroup>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Asset Name</th>
                  <th>Symbol</th>
                  <th>Asset Type</th>
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
                  <col className="col-date" />
                  <col className="col-asset-name" />
                  <col className="col-symbol" />
                  <col className="col-asset-type" />
                  <col className="col-credit" />
                  <col className="col-debit" />
                  <col className="col-total-before" />
                  <col className="col-total-after" />
                  <col className="col-unit" />
                  {onDeleteClick && <col className="col-delete" />}
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
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;