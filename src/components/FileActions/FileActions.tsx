import React, { useState } from 'react';
import './FileActions.css';

interface FileActionsProps {
  actionName: string;
  fileFormat: 'xlsx' | 'csv';
  onFileFormatChange: (format: 'xlsx' | 'csv') => void;
  onDownload: () => void;
}

const FileActions: React.FC<FileActionsProps> = ({ 
  actionName,
  fileFormat, 
  onFileFormatChange, 
  onDownload 
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="file-actions">
      <button className="button" onClick={onDownload}>
        {actionName}
      </button>
      <div className="dropdown-container">
        <div
          className="dropdown-selector"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          .{fileFormat.toLowerCase()} ▼
        </div>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <div
              className="dropdown-item"
              onClick={() => {
                onFileFormatChange('csv');
                setDropdownOpen(false);
              }}
            >
              .csv
            </div>
            <div
              className="dropdown-item"
              onClick={() => {
                onFileFormatChange('xlsx');
                setDropdownOpen(false);
              }}
            >
              .xlsx
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileActions;