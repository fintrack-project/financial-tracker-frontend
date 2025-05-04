import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import UserSession from '../../utils/UserSession';
import { logoutUser } from '../../services/authService'; // Adjust the import path as necessary
import './AccountMenu.css';

interface AccountMenuProps {
  onAccountChange: (accountId: string) => void; // Callback to pass the accountId
}

const AccountMenu: React.FC<AccountMenuProps> = ({ onAccountChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null); // State to store the accountId
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the user ID from the UserSession singleton
    const session = UserSession.getInstance();
    const storedUserId = session.getUserId();
    setUserId(storedUserId);

    // Fetch the currently logged-in account ID dynamically
    const fetchAccountId = async () => {
      const token = sessionStorage.getItem('authToken'); // Get the JWT token from sessionStorage
      if (!token) {
        console.error('No auth token found. Redirecting to login.');
        navigate('/login'); // Redirect to login if no token is found
        return;
      }

      try {
        const response = await fetch('/api/accounts/current', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch account ID');
        }

        const data = await response.json();
        setAccountId(data.accountId); // Store the accountId in state
        onAccountChange(data.accountId); // Pass the accountId to the parent component
      } catch (error) {
        console.error('Error fetching account ID:', error);
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
          <p className="user-id">Logged in as: {userId || 'Guest'}</p>
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
      )}
    </div>
  );
};

export default AccountMenu;