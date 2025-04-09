import React from 'react';
import { Transaction } from 'types/Transaction';

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
          value={transaction.date}
          onChange={(e) => onInputChange('date', e.target.value)}
        />
      </td>
      <td>
        <input
          type="text"
          value={transaction.assetName}
          onChange={(e) => onInputChange('assetName', e.target.value)}
        />
      </td>
      <td>
        <input
          type="number"
          value={transaction.credit}
          onChange={(e) => onInputChange('credit', parseFloat(e.target.value))}
        />
      </td>
      <td>
        <input
          type="number"
          value={transaction.debit}
          onChange={(e) => onInputChange('debit', parseFloat(e.target.value))}
        />
      </td>
      <td>
        <input
          type="number"
          value={transaction.totalBalanceBefore}
          onChange={(e) =>
            onInputChange('totalBalanceBefore', parseFloat(e.target.value))
          }
        />
      </td>
      <td>
        <input
          type="number"
          value={transaction.totalBalanceAfter}
          onChange={(e) =>
            onInputChange('totalBalanceAfter', parseFloat(e.target.value))
          }
        />
      </td>
      <td>
        <input
          type="text"
          value={transaction.unit}
          onChange={(e) => onInputChange('unit', e.target.value)}
        />
      </td>
      <td>
        <button className="remove-button" onClick={onRemoveRow}>
          -
        </button>
      </td>
    </tr>
  );
};

export default InputTransactionRow;