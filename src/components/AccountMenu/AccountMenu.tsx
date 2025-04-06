import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserSession from '../../utils/UserSession';
import './AccountMenu.css';

interface AccountMenuProps {
  onAccountChange: (accountId: string) => void; // Callback to pass the accountId
}

const AccountMenu: React.FC<AccountMenuProps> = ({ onAccountChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the user ID from the UserSession singleton
    const session = UserSession.getInstance();
    setUserId(session.getUserId());
  }, []);

  useEffect(() => {
    // Fetch the currently logged-in account ID dynamically
    const fetchAccountId = async () => {
      try {
        const response = await fetch('/api/accounts/current', {
          credentials: 'include', // Include cookies for session-based authentication
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch account ID');
        }

        const data = await response.json();
        onAccountChange(data.accountId);
      } catch (error) {
        console.error('Error fetching account ID:', error);
      }
    };

    fetchAccountId();
  }, [onAccountChange]);

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