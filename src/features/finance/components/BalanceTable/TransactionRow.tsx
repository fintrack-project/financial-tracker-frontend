import React from 'react';
import { format } from 'date-fns';
import IconButton from '../../../../shared/components/Button/IconButton';
import { formatNumber } from '../../../../shared/utils/FormatNumber';

interface TransactionRowProps<T> {
  transaction: T;
  isHighlighted?: boolean; // Optional prop to highlight the row
  isMarkedForDeletion?: boolean; // Optional prop to mark the row for deletion
  onDeleteClick?: () => void; // Optional callback for delete button
}

const TransactionRow = <T extends {
  transactionId?: string;
  accountId?: string; 
  date: string; 
  assetName: string; 
  symbol: string;
  assetType: string;
  credit: number; 
  debit: number; 
  unit?: string; 
  totalBalanceBefore?: 
  number; totalBalanceAfter?: 
  number }>
  ({
    transaction,
    isHighlighted = false,
    isMarkedForDeletion = false,
    onDeleteClick,
  }: TransactionRowProps<T>) => {

  return (
    <tr
      className={`${isHighlighted ? 'highlight-row' : ''} ${
        isMarkedForDeletion ? 'marked-for-deletion' : ''
      }`}
    >
      <td>{format(new Date(transaction.date), 'yyyy-MM-dd')}</td>
      <td>{transaction.assetName}</td>
      <td>{transaction.symbol}</td>
      <td>{transaction.assetType}</td>
      <td>{formatNumber(transaction.credit)}</td>
      <td className={transaction.debit !== 0 ? 'debit-column' : ''}>
        {transaction.debit !== 0 ? `(${transaction.debit})` : transaction.debit}
      </td>
      {transaction.totalBalanceBefore !== undefined && (
        <td>{formatNumber(transaction.totalBalanceBefore)}</td>
      )}
      {transaction.totalBalanceAfter !== undefined && (
        <td>{formatNumber(transaction.totalBalanceAfter)}</td>
      )}
      <td>{transaction.unit}</td>
      {onDeleteClick && (
        <td>
          <IconButton type="delete" onClick={onDeleteClick} label="Delete Row" size="small"/>
        </td>
      )}
    </tr>
  );
};

export default TransactionRow;