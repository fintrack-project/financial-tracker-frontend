import React from 'react';
import { Transaction } from '../../types/Transaction';
import IconButton from '../../../../shared/components/Button/IconButton';
import AssetTypeDropDown from '../../../../shared/components/DropDown/AssetTypeDropDown';
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
  const assetTypeOptions = ['STOCK', 'FOREX', 'CRYPTO', 'COMMODITY']; // Asset type options

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
          type="text"
          value={transaction.symbol || ''}
          onChange={(e) => onInputChange('symbol', e.target.value)}
        />
      </td>
      <td>
        <AssetTypeDropDown
          value={transaction.assetType || ''}
          onChange={(value) => onInputChange('assetType', value)}
          assetTypeOptions={assetTypeOptions}
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
        <td>
          <IconButton type="remove" onClick={onRemoveRow} label="Remove Row" size="small" />
        </td>
      </td>
    </tr>
  );
};

export default InputTransactionRow;