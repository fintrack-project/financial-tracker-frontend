import React from 'react';
import BaseUserAccountPage from './BaseUserAccountPage';
import AccountDetailAndMenu from '../../components/Menu/AccountDetailAndMenu'; // Import AccountDetailAndMenu
import './Support.css';

interface SupportProps {
  accountId: string | null; // Receive accountId as a prop
}

const Support: React.FC<SupportProps> = ({ accountId }) => {
  const leftContent = (
    <AccountDetailAndMenu
      accountId={accountId || 'Guest'} // Display accountId or "Guest" if accountId is null
    />
  );

  const rightContent = (
    <div>
      <h2>Help Center</h2>
      <p>Browse our FAQ section or submit a support ticket for further assistance.</p>
    </div>
  );

  return <BaseUserAccountPage leftContent={leftContent} rightContent={rightContent} />;
};

export default Support;