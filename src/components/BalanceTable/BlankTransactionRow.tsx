import React from 'react';
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
        <button className="add-button" onClick={onAddRow}>
          +
        </button>
      </td>
    </tr>
  );
};

export default BlankTransactionRow;