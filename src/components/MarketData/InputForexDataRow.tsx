import React from 'react';
import IconButton from '../Button/IconButton';

interface InputForexDataRowProps {
  symbol: string;
  onSymbolChange: (value: string) => void; // Callback for symbol input changes
  onRemoveRow: () => void; // Callback to remove the row
}

const InputForexDataRow: React.FC<InputForexDataRowProps> = ({
  symbol,
  onSymbolChange,
  onRemoveRow,
}) => {
  return (
    <tr>
      <td>
        <input
          type="text"
          value={symbol}
          onChange={(e) => onSymbolChange(e.target.value.toUpperCase())}
          placeholder="Enter symbol (e.g., USD)"
        />
      </td>
      <td>
        <input type="text" disabled />
      </td>
      <td>
        <input type="text" disabled />
      </td>
      <td>
        <input type="text" disabled />
      </td>
      <td>
        <input type="text" disabled />
      </td>
      <td>
        <input type="text" disabled />
      </td>
      <td>
        <input type="text" disabled />
      </td>
      <td>
        <IconButton type="remove" onClick={onRemoveRow} label="Remove Row" />
      </td>
    </tr>
  );
};

export default InputForexDataRow;