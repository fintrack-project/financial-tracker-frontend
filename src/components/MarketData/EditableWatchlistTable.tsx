import React, { useState, Dispatch, SetStateAction } from 'react';
import EditableWatchlistRow from './EditableWatchlistRow';
import IconButton from '../Button/IconButton';
import './EditableWatchlistTable.css';

interface EditableWatchlistTableProps<T> {
  columns: { key: keyof T; label: string; editable?: boolean; placeholder?: string }[];
  fetchData: (row: Partial<T>) => Promise<T>;
  accountId: string | null;
  rows: T[]; // Add rows prop
  setRows: Dispatch<SetStateAction<T[]>>; // Add setRows prop
}

const EditableWatchlistTable = <T extends { confirmed?: boolean }>({
  columns,
  fetchData,
  accountId,
  rows,
  setRows,
}: EditableWatchlistTableProps<T>) => {
  const handleAddRow = () => {
    setRows([...rows, {} as T]); // Add a blank row
  };

  const handleRemoveRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index)); // Remove the row
  };

  const handleConfirm = async (index: number) => {
    const row = rows[index];
    try {
      const updatedRow = await fetchData(row); // Fetch data for the row
      const updatedRows = [...rows];
      updatedRows[index] = { ...updatedRow, confirmed: true }; // Mark row as confirmed
      setRows(updatedRows);
    } catch (error) {
      console.error('Error confirming row:', error);
    }
  };

  const handleEdit = (index: number) => {
    const updatedRows = [...rows];
    updatedRows[index].confirmed = false; // Allow editing
    setRows(updatedRows);
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
              onConfirm={() => handleConfirm(index)}
              onEdit={() => handleEdit(index)}
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