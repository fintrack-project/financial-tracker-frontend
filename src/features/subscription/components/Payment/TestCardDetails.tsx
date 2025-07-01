import React from 'react';
import './TestCardDetails.css';

interface TestCard {
  title: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  zip: string;
}

const testCards: TestCard[] = [
  {
    title: 'Successful Payment',
    cardNumber: '4242 4242 4242 4242',
    expiryDate: 'Any future date (e.g., 12/25)',
    cvc: 'Any 3 digits (e.g., 123)',
    zip: 'Any 5 digits (e.g., 12345)'
  },
  {
    title: 'Card Decline',
    cardNumber: '4000 0000 0000 0002',
    expiryDate: 'Any future date',
    cvc: 'Any 3 digits',
    zip: 'Any 5 digits'
  },
  {
    title: '3D Secure Authentication',
    cardNumber: '4000 0000 0000 3220',
    expiryDate: 'Any future date',
    cvc: 'Any 3 digits',
    zip: 'Any 5 digits'
  }
];

const TestCardDetails: React.FC = () => {
  return (
    <div className="testing-card-details">
      <h5>Test Card Details</h5>
      <div className="test-cards-grid">
        {testCards.map((card, index) => (
          <div key={index} className="test-card">
            <h6>{card.title}</h6>
            <div className="card-details-grid">
              <div className="card-detail-item">
                <span className="detail-label">Card Number:</span>
                <span className="detail-value">{card.cardNumber}</span>
              </div>
              <div className="card-detail-item">
                <span className="detail-label">Expiry Date:</span>
                <span className="detail-value">{card.expiryDate}</span>
              </div>
              <div className="card-detail-item">
                <span className="detail-label">CVC:</span>
                <span className="detail-value">{card.cvc}</span>
              </div>
              <div className="card-detail-item">
                <span className="detail-label">ZIP:</span>
                <span className="detail-value">{card.zip}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestCardDetails; 