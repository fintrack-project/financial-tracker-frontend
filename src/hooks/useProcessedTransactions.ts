import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Transaction } from 'types/Transaction';
import { OverviewTransaction } from 'types/OverviewTransaction';

export const useProcessedTransactions = (transactions: Transaction[]) => {
  const [processedTransactions, setProcessedTransactions] = useState<OverviewTransaction[]>([]);

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setProcessedTransactions([]);
      return;
    }

    // Sort transactions in ascending order of date for calculation
    const transactionsForCalculation = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Track total balance per asset name
    const balanceMap: Record<string, number> = {};

    const calculatedTransactions: OverviewTransaction[] = transactionsForCalculation.map(
      (transaction) => {
        const { assetName, credit, debit } = transaction;

        // Initialize balance for the asset if not already tracked
        if (!balanceMap[assetName]) {
          balanceMap[assetName] = 0;
        }

        // Calculate totalBalanceBefore and totalBalanceAfter
        const totalBalanceBefore = balanceMap[assetName];
        const totalBalanceAfter = totalBalanceBefore + credit - debit;

        // Update the balance map
        balanceMap[assetName] = totalBalanceAfter;

        return {
          ...transaction,
          date: format(new Date(transaction.date), 'yyyy-MM-dd'), // Format the date as YYYY-MM-DD
          totalBalanceBefore,
          totalBalanceAfter,
        };
      }
    );

    // Sort transactions in descending order of date for display
    const sortedForDisplay = calculatedTransactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setProcessedTransactions(sortedForDisplay);
  }, [transactions]);

  return processedTransactions;
};