import React from 'react';
import './AuthBasePage.css';

// Import logo assets
import FinTrackGif from '../../assets/logo/FinTrackGif.gif';

interface AuthBasePageProps {
  title: string; // Page title (e.g., "Login" or "Register")
  children: React.ReactNode; // Content of the page (e.g., form fields and buttons)
}

const AuthBasePage: React.FC<AuthBasePageProps> = ({ title, children }) => {
  return (
    <div className="auth-base-container">
      {/* Left half: Auth content */}
      <div className="auth-left">
        <div className="auth-header">
          <h1>{title}</h1>
        </div>
        <div className="auth-content">{children}</div>
      </div>

      {/* Right half: Large FinTrack GIF */}
      <div className="auth-right">
        <img src={FinTrackGif} alt="FinTrack GIF" className="large-logo" />
      </div>
    </div>
  );
};

export default AuthBasePage;