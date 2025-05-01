import React, { useEffect, useState } from 'react';
import BaseUserAccountPage from './BaseUserAccountPage';
import { fetchCurrenciesByAccountId, updateBaseCurrency, AccountCurrency } from '../../services/accountCurrencyService'; // Adjust the import path as necessary
import AccountDetailAndMenu from '../../components/Menu/AccountDetailAndMenu'; // Import AccountDetailAndMenu
import './Settings.css';

interface SettingsProps {
  accountId: string | null; // Receive accountId as a prop
}

const Settings: React.FC<SettingsProps> = ({ accountId }) => {
  const [currencies, setCurrencies] = useState<AccountCurrency[]>([]); // List of available currencies
  const [baseCurrency, setBaseCurrency] = useState<string>('USD'); // Default base currency
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      if (!accountId) {
        setError('Account ID is required to fetch currencies.');
        return;
      }

      try {
        const fetchedCurrencies = await fetchCurrenciesByAccountId(accountId);
        setCurrencies(fetchedCurrencies);
        console.log('Fetched currencies:', fetchedCurrencies);

        // Find and set the default currency
        const defaultCurrency = fetchedCurrencies.find((currency) => currency.default);
        console.log('Default currency:', defaultCurrency);
        if (defaultCurrency) {
          setBaseCurrency(defaultCurrency.currency);
        }
      } catch (err) {
        setError('Failed to fetch currencies. Please try again later.');
      }
    };

    fetchCurrencies();
  }, [accountId]);

  const handleBaseCurrencyChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrency = event.target.value;
    setBaseCurrency(selectedCurrency);

    if (!accountId) {
      setError('Account ID is required to update the base currency.');
      return;
    }

    try {
      await updateBaseCurrency(accountId, selectedCurrency);
      setSuccessMessage(`Base currency updated to ${selectedCurrency}.`);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError('Failed to update base currency. Please try again later.');
      setSuccessMessage(null); // Clear any previous success messages
    }
  };

  const leftContent = (
    <AccountDetailAndMenu
      accountId={accountId || 'Guest'} // Display accountId or "Guest" if accountId is null
    />
  );

  const rightContent = (
    <div>
      <h2>Settings Settings</h2>
      <p>Welcome to your settings page. Here you can manage your account details, update your personal information, and more.</p>
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
              <option key={currency.currency} value={currency.currency}>
                {currency.currency}
              </option>
            ))
          ) : (
            <option value="USD">USD</option> // Default option if no currencies are loaded
          )}
        </select>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </div>
  );

  return <BaseUserAccountPage leftContent={leftContent} rightContent={rightContent} />;
};

export default Settings;