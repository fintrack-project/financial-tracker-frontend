import React, { useState, useEffect } from 'react';
import { PreviewTransaction } from '../types/PreviewTransaction';
import BalanceNavigationBar from '../../../shared/components/Bar/BalanceNavigationBar';
import BalanceOverviewTable from '../components/BalanceTable/BalanceOverviewTable';
import BalancePreviewTable from '../components/BalanceTable/BalancePreviewTable';
import UploadBalanceTable from '../components/BalanceTable/UploadBalanceTable';
import { OverviewTransaction } from '../types/OverviewTransaction';
import { Transaction } from '../types/Transaction';
import { fetchOverviewTransactions, confirmTransactions } from '../services/transactionService';
import { TimeRangeSelector } from '../../../shared/components/TimeRangeSelector';
import { TimeRange } from '../../../shared/types/TimeRange';
import { getDefaultTimeRange, formatDateForAPI } from '../../../shared/utils/timeRangePresets';
import { useNotification } from '../../../shared/contexts/NotificationContext';
import './Balance.css';

interface BalanceProps {
  accountId: string | null; // Receive accountId as a prop
}

const Balance: React.FC<BalanceProps> = ({ accountId }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'edit'>('overview'); // State to manage active tab
  const [existingOverviewTransactions, setExistingOverviewTransactions] = useState<OverviewTransaction[]>([]); // Data from BalanceOverviewTable
  const [uploadedTransactions, setUploadedTransactions] = useState<Transaction[]>([]); // Data from UploadBalanceTable
  const [timeRange, setTimeRange] = useState<TimeRange>(getDefaultTimeRange()); // Time range state
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const { showNotification } = useNotification();

  // Fetch existing transactions when accountId or timeRange changes
  useEffect(() => {
    const fetchExistingTransactions = async () => {
      if (!accountId) return;

      setLoading(true);
      try {
        const startDate = formatDateForAPI(timeRange.startDate);
        const endDate = formatDateForAPI(timeRange.endDate);
        const overviewTransactions = await fetchOverviewTransactions(accountId, startDate, endDate);
        setExistingOverviewTransactions(overviewTransactions);
      } catch (error) {
        console.error('Error fetching existing transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExistingTransactions();
  }, [accountId, timeRange]);

  // Callback to handle the confirmation of transactions
  const handleConfirm = async (previewTransaction: PreviewTransaction[]) => {
    try {
      if (!accountId) {
        showNotification('error', 'Please select an account before confirming transactions.');
        return;
      }

      await confirmTransactions(accountId, previewTransaction);
      showNotification('success', 'Transactions confirmed successfully.');
      // setExistingTransactions(updatedTransactions); // Update the existing transactions
      setUploadedTransactions([]); // Clear the uploaded transactions
      // Fetch the updated transactions after confirmation 
      try {
        const startDate = formatDateForAPI(timeRange.startDate);
        const endDate = formatDateForAPI(timeRange.endDate);
        const overviewTransactions = await fetchOverviewTransactions(accountId, startDate, endDate);
        setExistingOverviewTransactions(overviewTransactions);
      } catch (error) {
        console.error('Error fetching existing transactions:', error);
      }
    } catch (error) {
      console.error('Error confirming transactions:', error);
    }
  };

  const handleTimeRangeChange = (newTimeRange: TimeRange) => {
    setTimeRange(newTimeRange);
  };

  return (
    <div className="balance-container">
      <div className="balance-header">
        <h1 className="fintrack-section-title">Balance</h1>
        <BalanceNavigationBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
      <div className="balance-content">
        {activeTab === 'overview' && (
          <div className="balance-overview">
            <TimeRangeSelector
              timeRange={timeRange}
              onTimeRangeChange={handleTimeRangeChange}
              loading={loading}
            />
            <BalanceOverviewTable 
              accountId={accountId}
              transactions={existingOverviewTransactions}
              loading={loading}
            />
          </div>
        )}
        {activeTab === 'edit' && (
          <div className="upload-balance">
            <TimeRangeSelector
              timeRange={timeRange}
              onTimeRangeChange={handleTimeRangeChange}
              loading={loading}
            />
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