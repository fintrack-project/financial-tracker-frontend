import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserSession from '../../utils/UserSession';
import './AccountMenu.css';

const AccountMenu: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the user ID from the UserSession singleton
    const session = UserSession.getInstance();
    setUserId(session.getUserId());
  }, []);

  const handleLogout = () => {
    console.log('User logged out');
    const session = UserSession.getInstance();
    session.logout();
    setUserId(null);
    navigate('/');
  };

  return (
    <div className="account-menu">
      <button
        className="account-button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        Account
      </button>
      {isMenuOpen && (
        <div className="dropdown-menu">
          <p>User ID: {userId || 'Guest'}</p>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;