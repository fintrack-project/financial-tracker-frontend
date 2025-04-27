import React from 'react';
import IconButton from '../Button/IconButton';
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
        <input type="text" disabled />
      </td>
      <td>
        <input type="text" disabled />
      </td>
      <td>
        <select disabled>
          <option value="" disabled>
            Select Asset Type
          </option>
          {assetTypeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </td>
      <td>
        <input type="number" disabled />
      </td>
      <td>
        <input type="number" disabled />
      </td>
      <td>
        <td>
          <IconButton type="add" onClick={onAddRow} label="Add Row" />
        </td>
      </td>
    </tr>
  );
};

export default BlankTransactionRow;