import React from 'react';
import BaseUserAccountPage from './BaseUserAccountPage';
import './Support.css';

interface SupportProps {
  accountId: string | null; // Receive accountId as a prop
}

const Support: React.FC<SupportProps> = ({ accountId }) => {
  const leftContent = (
    <div>
      <h2>Support Information</h2>
      <p>Account ID: {accountId}</p>
      <p>Contact our support team for assistance.</p>
    </div>
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