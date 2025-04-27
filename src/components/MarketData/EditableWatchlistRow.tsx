import React from 'react';
import AssetTypeDropDown from '../DropDown/AssetTypeDropDown';
import IconButton from '../Button/IconButton';

interface EditableWatchlistRowProps<T> {
  row: T;
  columns: { key: keyof T; label: string; editable?: boolean; placeholder?: string }[];
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
  const assetTypeOptions = ['STOCK', 'COMMODITY', 'CRYPTO']; // Dropdown options
  
  return (
    <tr className={row.confirmed ? 'confirmed-row' : ''}>
      {columns.map((col) => (
        <td key={col.key as string}>
          {row.confirmed || !col.editable ? (
            String(row[col.key] ?? '-')
          ) : col.key === 'assetType' ? ( // Render dropdown for assetType
            <AssetTypeDropDown
              value={String(row[col.key] ?? '')}
              onChange={(value) => onInputChange(col.key, value)}
              assetTypeOptions={assetTypeOptions}
            />
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