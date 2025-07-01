import React from 'react';
import BaseUserAccountPage from './BaseUserAccountPage';
import AccountDetailAndMenu from '../../../../shared/components/Menu/AccountDetailAndMenu';
import './Support.css';

interface SupportProps {
  accountId: string | null;
}

const Support: React.FC<SupportProps> = ({ accountId }) => {
  const leftContent = (
    <AccountDetailAndMenu
      accountId={accountId || 'Guest'}
    />
  );

  const rightContent = (
    <div className="support-container">
      <h2>Support</h2>
      <div className="support-content">
        <section className="support-section">
          <h3>Need Help?</h3>
          <p>Our support team is here to help you with any questions or issues you may have.</p>
          <div className="support-options">
            <div className="support-option">
              <h4>Contact Support</h4>
              <p>Get in touch with our support team for personalized assistance.</p>
              <button className="support-button">Contact Us</button>
            </div>
            <div className="support-option">
              <h4>FAQ</h4>
              <p>Find answers to commonly asked questions.</p>
              <button className="support-button">View FAQs</button>
            </div>
            <div className="support-option">
              <h4>Documentation</h4>
              <p>Access our comprehensive documentation and guides.</p>
              <button className="support-button">View Docs</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  return <BaseUserAccountPage leftContent={leftContent} rightContent={rightContent} />;
};

export default Support;