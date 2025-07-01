import React, { useState, useEffect } from 'react';
import { PreviewTransaction } from '../../shared/types/PreviewTransaction';
import BalanceNavigationBar from '../../components/Bar/BalanceNavigationBar';
import BalanceOverviewTable from '../../shared/components/Table/BalanceTable/BalanceOverviewTable';
import BalancePreviewTable from '../../shared/components/Table/BalanceTable/BalancePreviewTable';
import UploadBalanceTable from '../../shared/components/Table/BalanceTable/UploadBalanceTable';
import { OverviewTransaction } from '../../shared/types/OverviewTransaction';
import { Transaction } from '../../shared/types/Transaction';
import { fetchOverviewTransactions, confirmTransactions } from '../../services/transactionService';
import './Balance.css';

interface BalanceProps {
  accountId: string | null; // Receive accountId as a prop
}

const Balance: React.FC<BalanceProps> = ({ accountId }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'edit'>('overview'); // State to manage active tab
  const [existingOverviewTransactions, setExistingOverviewTransactions] = useState<OverviewTransaction[]>([]); // Data from BalanceOverviewTable
  const [uploadedTransactions, setUploadedTransactions] = useState<Transaction[]>([]); // Data from UploadBalanceTable

  // Fetch existing transactions when accountId changes
  useEffect(() => {
    const fetchExistingTransactions = async () => {
      if (!accountId) return;

      try {
        const overviewTransactions = await fetchOverviewTransactions(accountId);
        setExistingOverviewTransactions(overviewTransactions);
      } catch (error) {
        console.error('Error fetching existing transactions:', error);
      }
    };

    fetchExistingTransactions();
  }, [accountId]);

  // Callback to handle the confirmation of transactions
  const handleConfirm = async (previewTransaction: PreviewTransaction[]) => {
    try {
      if (!accountId) {
        alert('Please select an account before confirming transactions.');
        return;
      }

      await confirmTransactions(accountId, previewTransaction);
      alert('Transactions confirmed successfully.');
      // setExistingTransactions(updatedTransactions); // Update the existing transactions
      setUploadedTransactions([]); // Clear the uploaded transactions
      // Fetch the updated transactions after confirmation 
      try {
        const overviewTransactions = await fetchOverviewTransactions(accountId);
        setExistingOverviewTransactions(overviewTransactions);
      } catch (error) {
        console.error('Error fetching existing transactions:', error);
      }
    } catch (error) {
      console.error('Error confirming transactions:', error);
    }
  };

  return (
    <div className="balance-container">
      <h1 className="fintrack-section-title">Balance</h1>
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
              existingTransactions={existingOverviewTransactions}
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