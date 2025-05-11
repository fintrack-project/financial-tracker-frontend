import React, { useEffect } from 'react';
import './SubscriptionConfirmationModal.css';

interface SubscriptionConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type: 'upgrade' | 'cancel';
}

const SubscriptionConfirmationModal: React.FC<SubscriptionConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  type
}) => {
  useEffect(() => {
    console.log(`Modal ${type} ${isOpen ? 'opened' : 'closed'}`);
  }, [isOpen, type]);

  const handleClose = () => {
    console.log(`Modal ${type} closed by user`);
    onClose();
  };

  const handleConfirm = () => {
    console.log(`Modal ${type} confirmed by user`);
    onConfirm();
  };

  if (!isOpen) return null;

  console.log(`Rendering ${type} modal with title: ${title}`);

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className={`modal-header ${type}`}>
          <h2>{title}</h2>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="cancel-button" onClick={handleClose}>
            {cancelText}
          </button>
          <button 
            className={`confirm-button ${type}`} 
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionConfirmationModal; 