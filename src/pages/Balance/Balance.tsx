import React, { useState, useEffect } from 'react';
import AccountMenu from '../../components/Menu/AccountMenu';
import MainNavigationBar from 'components/NavigationBar/MainNavigationBar';
import BalanceNavigationBar from 'components/NavigationBar/BalanceNavigationBar';
import BalanceOverviewTable from 'components/BalanceTable/BalanceOverviewTable';
import BalancePreviewTable from 'components/BalanceTable/BalancePreviewTable';
import UploadBalanceTable from 'components/BalanceTable/UploadBalanceTable';
import { Transaction } from 'types/Transaction';
import './Balance.css';

const Balance: React.FC = () => {
  const [accountId, setAccountId] = useState<string | null>(null); // Store the currently logged-in account ID
  const [activeTab, setActiveTab] = useState<'overview' | 'edit'>('overview'); // State to manage active tab
  const [existingTransactions, setExistingTransactions] = useState<Transaction[]>([]); // Data from BalanceOverviewTable
  const [uploadedTransactions, setUploadedTransactions] = useState<Transaction[]>([]); // Data from UploadBalanceTable

  // Fetch existing transactions when accountId changes
  useEffect(() => {
    const fetchExistingTransactions = async () => {
      if (!accountId) return;

      try {
        const response = await fetch(`/api/accounts/${accountId}/transactions`);
        if (!response.ok) {
          throw new Error('Failed to fetch existing transactions');
        }
        const data: Transaction[] = await response.json();
        setExistingTransactions(data);
      } catch (error) {
        console.error('Error fetching existing transactions:', error);
      }
    };

    fetchExistingTransactions();
  }, [accountId]);

  // Callback to get the accountId from AccountMenu
  const handleAccountChange = (accountId: string) => {
    console.log('Account ID received in Balance:', accountId); // Debug log
    setAccountId(accountId);
  };

  // Callback to handle the confirmation of transactions
  const handleConfirm = async (transactions: Transaction[]) => {
    try {
      const response = await fetch('/api/accounts/confirm-transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactions),
      });

      if (!response.ok) {
        throw new Error('Failed to confirm transactions');
      }

      alert('Transactions confirmed and updated successfully.');
      setExistingTransactions(transactions); // Update the existing transactions
      setUploadedTransactions([]); // Clear uploaded transactions after confirmation
    } catch (error) {
      console.error('Error confirming transactions:', error);
      alert('Error confirming transactions. Please try again.');
    }
  };

  return (
    <div className="balance-container">
      <MainNavigationBar />
      <div className="top-bar">
        <AccountMenu onAccountChange={handleAccountChange} />
      </div>
      <BalanceNavigationBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="balance-content">
        {activeTab === 'overview' && (
          <div className="balance-overview">
            <BalanceOverviewTable accountId={accountId} />
          </div>
        )}
        {activeTab === 'edit' && (
          <div className="upload-balance">
            <BalancePreviewTable
              accountId={accountId}
              existingTransactions={existingTransactions}
              uploadedTransactions={uploadedTransactions}
              onConfirm={handleConfirm}
            />
            <UploadBalanceTable 
              accountId={accountId}
              onUpload={setUploadedTransactions}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Balance;