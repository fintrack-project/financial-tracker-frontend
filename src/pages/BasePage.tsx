import React, { useState } from 'react';
import PageTopBar from '../components/Bar/PageTopBar';

interface BasePageProps {
  children: React.ReactElement<{ accountId: string }>;
}

const BasePage: React.FC<BasePageProps> = ({ children }) => {
  const [accountId, setAccountId] = useState<string | null>(null);

  const handleAccountChange = (accountId: string) => {
    setAccountId(accountId);
    console.log('Account changed to:', accountId);
  };

  if (!accountId) {
    return (
      <div className="base-page">
        <PageTopBar onAccountChange={handleAccountChange} />
        <div className="base-page-content">
          <p>Please select an account to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="base-page">
      <PageTopBar onAccountChange={handleAccountChange} />
      <div className="base-page-content">
        {React.cloneElement(children, { accountId })} {/* Pass accountId to child */}
      </div>
    </div>
  );
};

export default BasePage;