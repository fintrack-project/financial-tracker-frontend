import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import UserSession from '../../utils/UserSession';
import './AccountDetailAndMenu.css';

interface AccountDetailAndMenuProps {
  accountId: string; // Name or email of the logged-in user
}

const AccountDetailAndMenu: React.FC<AccountDetailAndMenuProps> = ({ accountId }) => {
  const [userId, setUserId] = useState<string | null>(null); // State to store the userId
  const [error, setError] = useState<string | null>(null); // State to handle errors
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the user ID from the UserSession singleton
    const session = UserSession.getInstance();
    const storedUserId = session.getUserId();
    setUserId(storedUserId);
  }, [accountId]);

  const handleLogout = () => {
    console.log('User logged out');
    const session = UserSession.getInstance();
    session.logout();
    setUserId(null);
    navigate('/');
  };

  return (
    <div className="account-detail-and-menu">
      <h1 className="account-detail-and-menu-title">Account Details</h1>
      <p className="account-detail-and-menu-user">Logged in as: {userId}</p>
      <nav className="account-detail-and-menu-nav">
        <NavLink to="/platform/profile" className="account-detail-and-menu-link">
          Profile
        </NavLink>
        <NavLink to="/platform/settings" className="account-detail-and-menu-link">
          Settings
        </NavLink>
        <NavLink to="/platform/support" className="account-detail-and-menu-link">
          Support
        </NavLink>
      </nav>

      <button className="account-detail-and-menu-logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default AccountDetailAndMenu;