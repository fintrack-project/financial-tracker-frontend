import React from 'react';
import { format } from 'date-fns';
import './TransactionTable.css';
import { Transaction } from 'types/Transaction';

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  return (
    <table className="transaction-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Asset Name</th>
          <th>Credit (Increase)</th>
          <th>Debit (Decrease)</th>
          <th>Total Balance Before</th>
          <th>Total Balance After</th>
          <th>Unit</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction, index) => (
          <tr key={index}>
            <td>{format(new Date(transaction.date), 'yyyy-MM-dd')}</td>
            <td>{transaction.assetName}</td>
            <td>{transaction.credit}</td>
            <td className={transaction.debit !== 0 ? 'debit-column' : ''}>
              {transaction.debit !== 0 ? `(${transaction.debit})` : transaction.debit}
            </td>
            <td>{transaction.totalBalanceBefore}</td>
            <td>{transaction.totalBalanceAfter}</td>
            <td>{transaction.unit}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionTable;