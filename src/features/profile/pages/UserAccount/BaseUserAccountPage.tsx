import React from 'react';
import './BaseUserAccountPage.css';

interface BaseUserAccountPageProps {
  leftContent: React.ReactNode; // Content for the left side
  rightContent: React.ReactNode; // Content for the right side
}

const BaseUserAccountPage: React.FC<BaseUserAccountPageProps> = ({ leftContent, rightContent }) => {
  return (
    <div className="user-account-page">
      <div className="user-account-left">{leftContent}</div>
      <div className="user-account-right">{rightContent}</div>
    </div>
  );
};

export default BaseUserAccountPage;