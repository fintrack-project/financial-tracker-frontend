import React, { useState } from 'react';
import PageTopBar from '../../components/Bar/PageTopBar';
import './BasePage.css';

interface BasePageProps {
  children: React.ReactElement<{ accountId: string }>;
}

const BasePage: React.FC<BasePageProps> = ({ children }) => {
  const [accountId, setAccountId] = useState<string | null>(null);

  const handleAccountChange = (accountId: string) => {
    setAccountId(accountId);
  };

  if (!accountId) {
    return (
      <div className="base-page">
        <PageTopBar onAccountChange={handleAccountChange} />
        <div className="base-page-content">
          <div className="base-page-message">
            <h2>Welcome to FinTrack</h2>
            <p>Please select an account to continue.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="base-page">
      <PageTopBar onAccountChange={handleAccountChange} />
      <div className="base-page-content">
        {React.cloneElement(children, { accountId })}
      </div>
    </div>
  );
};

export default BasePage;