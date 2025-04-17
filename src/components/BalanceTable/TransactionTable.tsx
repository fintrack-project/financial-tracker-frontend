import React from 'react';
import { format } from 'date-fns';
import './TransactionTable.css';
import { Transaction } from 'types/Transaction';
import TransactionRow from './TransactionRow';

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
          <th>Symbol</th>
          <th>Credit (Increase)</th>
          <th>Debit (Decrease)</th>
          <th>Total Balance Before</th>
          <th>Total Balance After</th>
          <th>Unit</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction, index) => (
          <TransactionRow
            key={index}
            transaction={transaction}
          />
        ))}
      </tbody>
    </table>
  );
};

export default TransactionTable;