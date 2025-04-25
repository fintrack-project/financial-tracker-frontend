import React from 'react';
import IconButton from '../Button/IconButton';

interface EditableWatchlistRowProps<T> {
  row: Partial<T>;
  columns: { key: keyof T; editable?: boolean; placeholder?: string }[];
  onInputChange: (key: keyof T, value: string | number) => void;
  onConfirm: () => void;
  onEdit: () => void;
  onRemove: () => void;
}

const EditableWatchlistRow = <T extends { confirmed?: boolean }>({
  row,
  columns,
  onInputChange,
  onConfirm,
  onEdit,
  onRemove,
}: EditableWatchlistRowProps<T>) => {
  return (
    <tr className={row.confirmed ? 'confirmed-row' : ''}>
      {columns.map((col) => (
        <td key={col.key as string}>
        {row.confirmed || !col.editable ? (
          // Ensure the value is a string or fallback to '-'
          String(row[col.key] ?? '-')
        ) : (
          <input
            type="text"
            value={String(row[col.key] ?? '')} // Ensure the value is a string
            placeholder={col.placeholder || ''}
            onChange={(e) => onInputChange(col.key, e.target.value)}
          />
        )}
      </td>
      ))}
      <td>
        <div className="button-group">
          {!row.confirmed ? (
            <>
              <IconButton type="confirm" onClick={onConfirm} label="Confirm" />
              <IconButton type="remove" onClick={onRemove} label="Remove" />
            </>
          ) : (
            <>
              <IconButton type="edit" onClick={onEdit} label="Edit" />
              <IconButton type="remove" onClick={onRemove} label="Remove" />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default EditableWatchlistRow;