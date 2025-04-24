import React from 'react';
import IconButton from '../Button/IconButton';

interface BlankForexDataRowProps {
  onAddRow: () => void; // Callback to add a new row
}

const BlankForexDataRow: React.FC<BlankForexDataRowProps> = ({ onAddRow }) => {
  const now = new Date().toLocaleDateString();

  return (
    <tr>
      <td>
        USD/USD
      </td>
      <td>
        1.00
      </td>
      <td>
        0.00
      </td>
      <td>
        0.00%
      </td>
      <td>
        1.00
      </td>
      <td>
        1.00
      </td>
      <td>
        {now}
      </td>
      <td>
        <IconButton type="add" onClick={onAddRow} label="Add Row" />
      </td>
    </tr>
  );
};

export default BlankForexDataRow;