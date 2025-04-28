import React from 'react';
import './Support.css';

interface ProfileProps {
  accountId: string | null; // Receive accountId as a prop
}

const Support: React.FC<ProfileProps> = ({ accountId }) => {
  return (
    <div className="support-container">
      <h1>Support</h1>
      <p>Need help? Contact our support team or browse our FAQ section.</p>
    </div>
  );
};

export default Support;