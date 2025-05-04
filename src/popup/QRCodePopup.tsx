import React from 'react';

interface QRCodePopupProps {
  qrCode: string;
  onClose: () => void;
}

const QRCodePopup: React.FC<QRCodePopupProps> = ({ qrCode, onClose }) => {
  return (
    <div className="qr-code-popup">
      <div className="popup-content">
        <h2>Scan QR Code</h2>
        <p>Scan this QR code with Google Authenticator to set up Two-Factor Authentication.</p>
        <img src={qrCode} alt="QR Code" />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default QRCodePopup;