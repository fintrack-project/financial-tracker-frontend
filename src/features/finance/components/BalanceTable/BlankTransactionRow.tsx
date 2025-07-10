import React from 'react';
import IconButton from '../../../../shared/components/Button/IconButton';
import AssetTypeDropDown from '../../../../shared/components/DropDown/AssetTypeDropDown';
import './TransactionRow.css';
interface BlankTransactionRowProps {
  onAddRow: () => void; // Callback to add a new row
}

const BlankTransactionRow: React.FC<BlankTransactionRowProps> = ({ onAddRow }) => {
  const assetTypeOptions = ['STOCK', 'FOREX', 'CRYPTO', 'COMMODITY']; // Asset type options

  return (
    <tr>
      <td>
        <input type="date" disabled />
      </td>
      <td>
        <input type="text" placeholder="my AAPL" disabled />
      </td>
      <td>
        <input type="text" placeholder="AAPL" disabled />
      </td>
      <td>
        <AssetTypeDropDown
          value=""
          onChange={() => {}}
          assetTypeOptions={assetTypeOptions}
          disabled={true}
        />
      </td>
      <td>
        <input type="number" placeholder="0" disabled />
      </td>
      <td>
        <input type="number" placeholder="0" disabled />
      </td>
      <td>
        <td>
          <IconButton type="add" onClick={onAddRow} label="Add Row" size="small" />
        </td>
      </td>
    </tr>
  );
};

export default BlankTransactionRow;