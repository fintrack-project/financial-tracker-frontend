import React from 'react';
import './ProfileTable.css';

interface ProfileTableRow {
  label: string; // First column: Label
  value: React.ReactNode; // Second column: Value
  status?: React.ReactNode; // Third column: Status (optional)
  actions?: React.ReactNode; // Fourth column: Actions (optional)
  editable?: boolean; // Flag to indicate if the row is editable
  redacted?: boolean; // Flag to indicate if the value should be redacted
}

interface ProfileTableProps {
  data: ProfileTableRow[]; // Add `editable` flag
  onEditConfirm?: (label: string, newValue: string) => void; // Callback for confirming edits
}

const ProfileTable: React.FC<ProfileTableProps> = ({ data }) => {

  return (
    <div className="profile-table">
      {data.map((item, index) => (
        <div key={index} className="profile-table-row">
          <div className="profile-table-label">{item.label}</div>
          <div className="profile-table-value">{item.value || 'N/A'}</div>
          <div className="profile-table-status">{item.status || ''}</div>
          <div className="profile-table-action">{item.actions || ''}</div>
        </div>
      ))}
    </div>
  );
};

export default ProfileTable;