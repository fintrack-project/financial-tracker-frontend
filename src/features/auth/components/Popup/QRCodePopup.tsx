import React from 'react';
import './QRCodePopup.css'; // Add styles for the popup

interface QRCodePopupProps {
  title: string; // Title of the popup
  instructions: string; // Instructions to display
  qrCode: string; // QR code image URL or base64 string
  onClose: () => void; // Callback to close the popup
}

const QRCodePopup: React.FC<QRCodePopupProps> = ({
  title,
  instructions,
  qrCode,
  onClose,
}) => {

  return (
    <div className="qr-code-popup">
      <div className="popup-content">
        <h2>{title}</h2>
        <p>{instructions}</p>
        <img src={qrCode} alt="QR Code" className="qr-code-image" />
        <div className="popup-actions">
          <button className="secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default QRCodePopup;