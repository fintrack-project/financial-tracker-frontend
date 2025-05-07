import React, { useEffect, useState } from 'react';
import BaseUserAccountPage from './BaseUserAccountPage';
import { fetchCurrencies, updateBaseCurrency, AccountCurrency } from '../../services/accountCurrencyService'; // Adjust the import path as necessary
import AccountDetailAndMenu from '../../components/Menu/AccountDetailAndMenu'; // Import AccountDetailAndMenu
import ProfileSettings from './ProfileSettings';
import './Profile.css';

interface ProfileProps {
  accountId: string | null; // Receive accountId as a prop
}

const Profile: React.FC<ProfileProps> = ({ accountId }) => {
  const [currencies, setCurrencies] = useState<AccountCurrency[]>([]); // List of available currencies
  const [baseCurrency, setBaseCurrency] = useState<string>('USD'); // Default base currency
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpdateCurrencies = async () => {
      if (!accountId) {
        setError('Account ID is required to fetch currencies.');
        return;
      }

      try {
        const fetchedCurrencies = await fetchCurrencies(accountId);
        setCurrencies(fetchedCurrencies);
        console.log('Fetched currencies:', fetchedCurrencies);

        // Find and set the default currency
        const defaultCurrency = fetchedCurrencies.find((currency: AccountCurrency) => currency.default);
        console.log('Default currency:', defaultCurrency);
        if (defaultCurrency) {
          setBaseCurrency(defaultCurrency.currency);
        }
      } catch (err) {
        setError('Failed to fetch currencies. Please try again later.');
      }
    };

    fetchUpdateCurrencies();
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
    <ProfileSettings 
      accountId={accountId || 'Guest'} // Pass accountId to ProfileSettings
    /> // Use the new ProfileSettings component
  );

  return <BaseUserAccountPage leftContent={leftContent} rightContent={rightContent} />;
};

export default Profile;