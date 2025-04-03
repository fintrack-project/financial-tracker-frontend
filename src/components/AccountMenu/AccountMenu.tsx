import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AccountMenu.css';

const AccountMenu: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('User logged out');
    navigate('/'); // Navigate to the login page
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
          <p>User ID: user123</p> {/* Replace with dynamic user ID if needed */}
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;