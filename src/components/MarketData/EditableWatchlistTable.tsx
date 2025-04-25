import React, { Dispatch, SetStateAction } from 'react';
import EditableWatchlistRow from './EditableWatchlistRow';
import IconButton from '../Button/IconButton';
import './EditableWatchlistTable.css';

interface EditableWatchlistTableProps<T> {
  columns: { key: keyof T; label: string; editable?: boolean; placeholder?: string }[];
  fetchData: (row: Partial<T>) => Promise<T>;
  accountId: string | null;
  rows: T[];
  setRows: Dispatch<SetStateAction<T[]>>;
  onAddRow?: (row: T) => Promise<void>;
  onRemoveRow?: (index: number) => Promise<void>;
  onConfirmRow?: (row: T, index: number) => Promise<void>;
  resetHasFetched: () => void; // Add resetHasFetched as a prop
}

const EditableWatchlistTable = <T extends { confirmed?: boolean }>({
  columns,
  fetchData,
  accountId,
  rows,
  setRows,
  onAddRow,
  onRemoveRow,
  onConfirmRow,
  resetHasFetched,
}: EditableWatchlistTableProps<T>) => {
  const handleAddRow = () => {
    setRows([...rows, {} as T]); // Add a blank row
  };

  const handleRemoveRow = async (index: number) => {
    if (onRemoveRow) {
      await onRemoveRow(index);
      resetHasFetched(); // Trigger refetch after removing a row
    }
  };

  const handleConfirmRow = async (index: number) => {
    const row = rows[index];
    if (onConfirmRow) {
      await onConfirmRow(row, index);
      resetHasFetched(); // Trigger refetch after confirming a row
    }
  };

  const handleInputChange = (index: number, key: keyof T, value: string | number) => {
    const updatedRows = [...rows];
    updatedRows[index][key] = value as T[keyof T]; // Explicitly cast value to T[keyof T]
    setRows(updatedRows);
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
              onConfirm={() => handleConfirmRow(index)}
              onRemove={() => handleRemoveRow(index)}
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