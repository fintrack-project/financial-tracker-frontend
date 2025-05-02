import React, { useState } from 'react';
import IconButton from '../../Button/IconButton'; // Import your custom IconButton
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

const ProfileTable: React.FC<ProfileTableProps> = ({ data, onEditConfirm }) => {
  const [editState, setEditState] = useState<{ [key: string]: string | null }>({}); // Track edit states

  const handleEditClick = (label: string, currentValue: string | null) => {
    setEditState((prevState) => ({ ...prevState, [label]: currentValue })); // Enable edit mode for the row
  };

  const handleConfirmClick = (label: string) => {
    if (onEditConfirm && editState[label] !== undefined) {
      onEditConfirm(label, editState[label] || ''); // Call the confirm callback
    }
    setEditState((prevState) => {
      const newState = { ...prevState };
      delete newState[label]; // Exit edit mode for the row
      return newState;
    });
  };

  const handleInputChange = (label: string, newValue: string) => {
    setEditState((prevState) => ({ ...prevState, [label]: newValue })); // Update the value in edit state
  };

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