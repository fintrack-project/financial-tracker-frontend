import React from 'react';
import IconButton from '../Button/IconButton';
import './TransactionRow.css';
interface BlankTransactionRowProps {
  onAddRow: () => void; // Callback to add a new row
}

const BlankTransactionRow: React.FC<BlankTransactionRowProps> = ({ onAddRow }) => {
  return (
    <tr>
      <td>
        <input type="date" disabled />
      </td>
      <td>
        <input type="text" disabled />
      </td>
      <td>
        <input type="number" disabled />
      </td>
      <td>
        <input type="number" disabled />
      </td>
      <td>
        <input type="number" disabled />
      </td>
      <td>
        <input type="number" disabled />
      </td>
      <td>
        <input type="text" disabled />
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