import React, { useState, useEffect } from 'react';
import AccountMenu from '../../components/Menu/AccountMenu';
import MainNavigationBar from 'components/NavigationBar/MainNavigationBar';
import BalanceNavigationBar from 'components/NavigationBar/BalanceNavigationBar';
import BalanceOverviewTable from 'components/BalanceTable/BalanceOverviewTable';
import BalancePreviewTable from 'components/BalanceTable/BalancePreviewTable';
import UploadBalanceTable from 'components/BalanceTable/UploadBalanceTable';
import { Transaction } from 'types/Transaction';
import { fetchTransactions, confirmTransactions } from 'services/transactionService';
import './Balance.css';
import { PreviewTransaction } from 'types/PreviewTransaction';

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
        const transactions = await fetchTransactions(accountId);
        setExistingTransactions(transactions);
      } catch (error) {
        console.error('Error fetching existing transactions:', error);
      }
    };

    fetchExistingTransactions();
  }, [accountId]);

  // Callback to get the accountId from AccountMenu
  const handleAccountChange = (accountId: string) => {
    setAccountId(accountId);
  };

  // Callback to handle the confirmation of transactions
  const handleConfirm = async (PreviewTransaction: PreviewTransaction[]) => {
    try {
      if (!accountId) {
        alert('Please select an account before confirming transactions.');
        return;
      }

      await confirmTransactions(accountId, PreviewTransaction);
      alert('Transactions confirmed successfully.');
      // setExistingTransactions(updatedTransactions); // Update the existing transactions
      setUploadedTransactions([]); // Clear the uploaded transactions
      // Fetch the updated transactions after confirmation 
      try {
        const transactions = await fetchTransactions(accountId);
        setExistingTransactions(transactions);
      } catch (error) {
        console.error('Error fetching existing transactions:', error);
      }
    } catch (error) {
      console.error('Error confirming transactions:', error);
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
              onPreviewUpdate={setUploadedTransactions}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Balance;