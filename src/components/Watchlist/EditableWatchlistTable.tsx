import React, { Dispatch, SetStateAction } from 'react';
import EditableWatchlistRow from './EditableWatchlistRow';
import IconButton from '../Button/IconButton';
import './EditableWatchlistTable.css';

interface EditableWatchlistTableProps<T> {
  columns: { key: keyof T; label: string; editable?: boolean; placeholder?: string }[];
  rows: T[];
  setRows: Dispatch<SetStateAction<T[]>>;
  onAddRow: () => void;
  onRemoveRow: (index: number) => Promise<void>;
  onConfirmRow: (index: number) => Promise<void>;
  resetHasFetched: () => void;
}

const EditableWatchlistTable = <T extends { confirmed?: boolean; symbol?: string; assetType?: string }>({
  columns,
  rows,
  setRows,
  onAddRow,
  onRemoveRow,
  onConfirmRow,
  resetHasFetched,
}: EditableWatchlistTableProps<T>) => {
  const handleInputChange = (index: number, key: keyof T, value: string | number) => {
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      [key]: value
    };
    setRows(updatedRows);
  };

  const handleEditRow = (index: number) => {
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      confirmed: false
    };
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    onAddRow();
  };

  return (
    <div className="editable-watchlist-table-container">
      <table className="editable-watchlist-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key as string}>{col.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <EditableWatchlistRow
              key={index}
              row={row}
              columns={columns}
              onInputChange={(key, value) => handleInputChange(index, key, value)}
              onConfirm={() => onConfirmRow(index)}
              onEdit={() => handleEditRow(index)}
              onRemove={() => onRemoveRow(index)}
            />
          ))}
          <tr>
            <td colSpan={columns.length + 1}>
              <IconButton type="add" onClick={handleAddRow} label="Add Row" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EditableWatchlistTable;