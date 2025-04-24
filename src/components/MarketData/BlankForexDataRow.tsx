import React from 'react';
import IconButton from '../Button/IconButton';

interface BlankForexDataRowProps {
  onAddRow: () => void; // Callback to add a new row
}

const BlankForexDataRow: React.FC<BlankForexDataRowProps> = ({ onAddRow }) => {
  return (
    <tr>
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
        <input type="text" disabled />
      </td>
      <td>
        <IconButton type="add" onClick={onAddRow} label="Add Row" />
      </td>
    </tr>
  );
};

export default BlankForexDataRow;