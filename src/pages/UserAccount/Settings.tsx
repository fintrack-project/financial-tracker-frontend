import React from 'react';
import BaseUserAccountPage from './BaseUserAccountPage';
import AccountDetailAndMenu from '../../components/Menu/AccountDetailAndMenu';
import { useCurrencyManagement } from '../../hooks/useCurrencyManagement';
import './Settings.css';

interface SettingsProps {
  accountId: string | null;
}

const Settings: React.FC<SettingsProps> = ({ accountId }) => {
  const {
    currencies,
    baseCurrency,
    error,
    successMessage,
    handleBaseCurrencyChange
  } = useCurrencyManagement({ accountId });

  const leftContent = (
    <AccountDetailAndMenu
      accountId={accountId || 'Guest'}
    />
  );

  const rightContent = (
    <div className="settings-container">
      <h2>Settings</h2>
      <div className="settings-section">
        <h3>Currency Settings</h3>
        <p>Manage your base currency preferences here. This will be used for all financial calculations and displays.</p>
        
        <div className="currency-settings">
          <div className="currency-selector">
            <label htmlFor="currency-dropdown">Select Base Currency:</label>
            <select
              id="currency-dropdown"
              value={baseCurrency}
              onChange={handleBaseCurrencyChange}
              disabled={currencies.length === 0}
              className="settings-select"
            >
              {currencies.length > 0 ? (
                currencies.map((currency) => (
                  <option key={currency.currency} value={currency.currency}>
                    {currency.currency}
                  </option>
                ))
              ) : (
                <option value="USD">USD</option>
              )}
            </select>
            {error && <p className="settings-error">{error}</p>}
            {successMessage && <p className="settings-success">{successMessage}</p>}
          </div>
          
          <div className="currency-info">
            <h4>About Base Currency</h4>
            <ul>
              <li>Your base currency is used for all financial calculations</li>
              <li>All other currencies will be converted to your base currency</li>
              <li>You can change your base currency at any time</li>
              <li>Historical data will be preserved but displayed in the new base currency</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return <BaseUserAccountPage leftContent={leftContent} rightContent={rightContent} />;
};

export default Settings;