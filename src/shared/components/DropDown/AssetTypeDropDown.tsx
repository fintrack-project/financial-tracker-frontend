import React from 'react';
import './AssetTypeDropDown.css'; // Import the CSS file for styling

interface AssetTypeDropDownProps {
  value: string;
  onChange: (value: string) => void;
  assetTypeOptions: string[];
  disabled?: boolean;
}

const AssetTypeDropDown: React.FC<AssetTypeDropDownProps> = ({
  value,
  onChange,
  assetTypeOptions,
  disabled = false,
}) => {
  return (
    <div className={`asset-type-dropdown ${disabled ? 'disabled' : ''}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="dropdown-select"
      >
        <option value="" disabled>
          Select Asset Type
        </option>
        {assetTypeOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AssetTypeDropDown;