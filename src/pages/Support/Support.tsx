import React from 'react';
import BasePage from '../../pages/BasePage';
import PageTopBar from '../../components/Bar/PageTopBar';
import './Support.css';

interface ProfileProps {
  accountId: string | null; // Receive accountId as a prop
}

const Support: React.FC<ProfileProps> = ({ accountId }) => {
  return (
    <div className="support-container">
      <div className="support-content">
        <h1>Support</h1>
        <p>Need help? Contact our support team or browse our FAQ section.</p>
      </div>
    </div>
  );
};

export default Support;