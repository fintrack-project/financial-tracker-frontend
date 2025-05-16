import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import UserSession from '../../utils/UserSession';
import { logoutUser } from '../../services/authService';
import { fetchCurrentAccountApi } from '../../api/accountApi';
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
    const storedUserId = session.getUserId();
    setUserId(storedUserId);

    // Fetch the currently logged-in account ID dynamically
    const fetchAccountId = async () => {
      try {
        const response = await fetchCurrentAccountApi();
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to fetch account ID');
        }

        onAccountChange(response.data.accountId);
      } catch (error) {
        console.error('Error fetching account ID:', error);
        navigate('/login');
      }
    };

    fetchAccountId();
  }, [onAccountChange, navigate]);

  const handleLogout = () => {
    console.log('User logged out');
    logoutUser();
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
        <div className="account-dropdown-menu">
          <div className="account-menu-avatar">
            {userId ? userId.charAt(0).toUpperCase() : <span role="img" aria-label="user">👤</span>}
          </div>
          <p className="user-id">Logged in as: {userId || 'Guest'}</p>
          <div className="menu-items">
          <NavLink
            to="/platform/profile"
            className={({ isActive }) =>
              isActive ? 'dropdown-item active' : 'dropdown-item'
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="/platform/support"
            className={({ isActive }) =>
              isActive ? 'dropdown-item active' : 'dropdown-item'
            }
          >
            Support
          </NavLink>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;