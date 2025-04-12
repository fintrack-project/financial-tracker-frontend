import React from 'react';
import { Transaction } from '../../types/Transaction';
import IconButton from '../Button/IconButton';
import './TransactionRow.css';

interface InputTransactionRowProps {
  transaction: Transaction; // The transaction data for the row
  onInputChange: (field: keyof Transaction, value: string | number) => void; // Callback for input changes
  onRemoveRow: () => void; // Callback to remove the row
}

const InputTransactionRow: React.FC<InputTransactionRowProps> = ({
  transaction,
  onInputChange,
  onRemoveRow,
}) => {
  return (
    <tr>
      <td>
        <input
          type="date"
          value={transaction.date || ''}
          onChange={(e) => onInputChange('date', e.target.value)}
        />
      </td>
      <td>
        <input
          type="text"
          value={transaction.assetName || ''}
          onChange={(e) => onInputChange('assetName', e.target.value)}
        />
      </td>
      <td>
        <input
          type="number"
          value={transaction.credit || 0}
          onChange={(e) => onInputChange('credit', parseFloat(e.target.value))}
        />
      </td>
      <td>
        <input
          type="number"
          value={transaction.debit || 0}
          onChange={(e) => onInputChange('debit', parseFloat(e.target.value))}
        />
      </td>
      <td>
        <input
          type="number"
          value={transaction.totalBalanceBefore || 0}
          onChange={(e) =>
            onInputChange('totalBalanceBefore', parseFloat(e.target.value))
          }
        />
      </td>
      <td>
        <input
          type="number"
          value={transaction.totalBalanceAfter || 0}
          onChange={(e) =>
            onInputChange('totalBalanceAfter', parseFloat(e.target.value))
          }
        />
      </td>
      <td>
        <input
          type="text"
          value={transaction.unit || ''}
          onChange={(e) => onInputChange('unit', e.target.value)}
        />
      </td>
      <td>
        <td>
          <IconButton type="remove" onClick={onRemoveRow} label="Remove Row" />
        </td>
      </td>
    </tr>
  );
};

export default InputTransactionRow;