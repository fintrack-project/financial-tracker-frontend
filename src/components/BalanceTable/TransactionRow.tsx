import React from 'react';
import { format } from 'date-fns';
import { Transaction } from '../../types/Transaction';
import IconButton from '../Button/IconButton';

interface TransactionRowProps {
  transaction: Transaction;
  isHighlighted?: boolean; // Optional prop to highlight the row
  isMarkedForDeletion?: boolean; // Optional prop to mark the row for deletion
  onDeleteClick?: () => void; // Optional callback for delete button
}

const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction,
  isHighlighted = false,
  isMarkedForDeletion = false,
  onDeleteClick,
}) => {
  return (
    <tr
      className={`${isHighlighted ? 'highlight-row' : ''} ${
        isMarkedForDeletion ? 'marked-for-deletion' : ''
      }`}
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
      {onDeleteClick && (
        <td>
          <IconButton type="delete" onClick={onDeleteClick} label="Delete Row" />
        </td>
      )}
    </tr>
  );
};

export default TransactionRow;