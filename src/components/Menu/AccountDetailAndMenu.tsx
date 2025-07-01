import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import UserSession from '../../shared/utils/UserSession';
import { logoutUser } from 'services/authService';
import './AccountDetailAndMenu.css';

interface AccountDetailAndMenuProps {
  accountId: string;
}

const AccountDetailAndMenu: React.FC<AccountDetailAndMenuProps> = ({ accountId }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const session = UserSession.getInstance();
    const storedUserId = session.getUserId();
    setUserId(storedUserId);
  }, [accountId]);

  const handleLogout = () => {
    console.log('User logged out');
    logoutUser();
    navigate('/');
  };

  return (
    <div className="account-detail-and-menu">
      <div className="account-detail-and-menu-avatar">
        {userId ? userId.charAt(0).toUpperCase() : <span role="img" aria-label="user">👤</span>}
      </div>
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