import React, { useState } from 'react';
import IconButton from '../Button/IconButton';
import './InputForexDataRow.css'; // Import CSS for styling

interface InputForexDataRowProps {
  symbol: string;
  onSymbolChange: (value: string) => void; // Callback for symbol input changes
  onRemoveRow: () => void; // Callback to remove the row
  onConfirm: (symbol: string) => void; // Callback to confirm the symbol
}

const InputForexDataRow: React.FC<InputForexDataRowProps> = ({
  symbol,
  onSymbolChange,
  onRemoveRow,
  onConfirm,
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false); // State to track if the row is confirmed

  const handleConfirm = () => {
    if (symbol.trim() === '') {
      alert('Symbol cannot be blank. Please enter a valid currency symbol.'); // Warn the user
      return;
    }
    setIsConfirmed(true);
    onConfirm(symbol); // Trigger the callback to start fetching data
  };

  const handleEdit = () => {
    setIsConfirmed(false); // Allow editing the symbol
  };

  return (
    <tr className={`forex-row ${isConfirmed ? 'confirmed' : ''}`}>
      <td>
        {isConfirmed ? (
            symbol
          ) : (
              <input
              type="text"
              value={symbol}
              onChange={(e) => onSymbolChange(e.target.value.toUpperCase())}
              placeholder="EUR/USD"
            />
          )}
      </td>
      <td>
      </td>
      <td>
      </td>
      <td>
      </td>
      <td>
      </td>
      <td>
      </td>
      <td>
      </td>
      <td>
        <div className="button-group">
          {!isConfirmed ? (
            <div>
              <IconButton type="confirm" onClick={handleConfirm} label="Confirm" />
              <IconButton type="remove" onClick={onRemoveRow} label="Remove Row" />
            </div>
          ) : (
            <div>
              <IconButton type="edit" onClick={handleEdit} label="Edit" />
              <IconButton type="remove" onClick={onRemoveRow} label="Remove Row" />
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default InputForexDataRow;