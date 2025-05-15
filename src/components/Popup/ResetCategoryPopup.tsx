import React from 'react';
import './ResetCategoryPopup.css';

interface ResetCategoryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  categoryName: string;
}

const ResetCategoryPopup: React.FC<ResetCategoryPopupProps> = ({
  isOpen,
  onClose,
  onConfirm,
  categoryName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="reset-category-popup-overlay">
      <div className="reset-category-popup">
        <h3>Reset Category</h3>
        <p>
          Are you sure you want to reset all subcategories for "{categoryName}"? 
          This action cannot be undone.
        </p>
        <div className="popup-actions">
          <button className="primary" onClick={onConfirm}>
            Reset
          </button>
          <button className="secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetCategoryPopup; 