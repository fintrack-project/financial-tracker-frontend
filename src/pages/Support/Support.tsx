import React from 'react';
import PageTopBar from '../../components/Bar/PageTopBar';
import './Support.css';

const Support: React.FC = () => {
  const handleAccountChange = (accountId: string) => {
    console.log('Account changed to:', accountId);
  };

  return (
    <div className="support-container">
      <PageTopBar onAccountChange={handleAccountChange} />
      <div className="support-content">
        <h1>Support</h1>
        <p>Need help? Contact our support team or browse our FAQ section.</p>
      </div>
    </div>
  );
};

export default Support;