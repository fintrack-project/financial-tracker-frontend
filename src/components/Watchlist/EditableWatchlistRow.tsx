import React from 'react';
import AssetTypeDropDown from '../DropDown/AssetTypeDropDown';
import IconButton from '../Button/IconButton';
import { formatNumber } from '../../utils/FormatNumber';

interface EditableWatchlistRowProps<T> {
  row: T;
  columns: { key: keyof T; label: string; editable?: boolean; placeholder?: string }[];
  onInputChange: (key: keyof T, value: string | number) => void;
  onConfirm: () => void;
  onEdit: () => void;
  onRemove: () => void;
}

const EditableWatchlistRow = <T extends { confirmed?: boolean; assetType?: string }>({
  row,
  columns,
  onInputChange,
  onConfirm,
  onEdit,
  onRemove,
}: EditableWatchlistRowProps<T>) => {
  const assetTypeOptions = ['STOCK', 'COMMODITY', 'CRYPTO']; // Dropdown options
  
  const formatValue = (key: keyof T, value: any) => {
    if (typeof value === 'number') {
      // Use 6 decimal places for FOREX prices and changes
      if (row.assetType === 'FOREX' && 
          (key === 'price' || key === 'priceChange' || key === 'high' || key === 'low')) {
        return formatNumber(value, 6);
      }
      // Use 2 decimal places for other numeric values
      return formatNumber(value);
    }
    return String(value ?? '-');
  };
  
  return (
    <tr className={row.confirmed ? 'confirmed-row' : ''}>
      {columns.map((col) => (
        <td key={col.key as string}>
          {row.confirmed || !col.editable ? (
            formatValue(col.key, row[col.key])
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