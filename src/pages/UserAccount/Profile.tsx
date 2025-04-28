import React, { useEffect, useState } from 'react';
import BaseUserAccountPage from './BaseUserAccountPage';
import { fetchCurrenciesByAccountId } from '../../services/accountCurrencyService'; // Adjust the import path as necessary
import './Profile.css';

interface ProfileProps {
  accountId: string | null; // Receive accountId as a prop
}

const Profile: React.FC<ProfileProps> = ({ accountId }) => {
  const [currencies, setCurrencies] = useState<string[]>([]); // List of available currencies
  const [baseCurrency, setBaseCurrency] = useState<string>('USD'); // Default base currency
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      if (!accountId) {
        setError('Account ID is required to fetch currencies.');
        return;
      }

      try {
        const fetchedCurrencies = await fetchCurrenciesByAccountId(accountId);
        setCurrencies(fetchedCurrencies);
      } catch (err) {
        setError('Failed to fetch currencies. Please try again later.');
      }
    };

    fetchCurrencies();
  }, [accountId]);

  const handleBaseCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBaseCurrency(event.target.value);
  };

  const leftContent = (
    <div>
      <h2>Account Details</h2>
      <p>Account ID: {accountId}</p>
      <p>Other account-related information can go here.</p>
    </div>
  );

  const rightContent = (
    <div>
      <h2>Profile Settings</h2>
      <p>Welcome to your profile page. Here you can manage your account details, update your personal information, and more.</p>
      <div className="currency-selector">
        <label htmlFor="currency-dropdown">Select Base Currency:</label>
        <select
          id="currency-dropdown"
          value={baseCurrency}
          onChange={handleBaseCurrencyChange}
          disabled={currencies.length === 0}
        >
          {currencies.length > 0 ? (
            currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))
          ) : (
            <option value="USD">USD</option> // Default option if no currencies are loaded
          )}
        </select>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );

  return <BaseUserAccountPage leftContent={leftContent} rightContent={rightContent} />;
};

export default Profile;