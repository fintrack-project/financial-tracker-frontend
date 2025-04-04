import React from 'react';
import './TransactionTable.css';

interface Transaction {
  date: string;
  assetName: string;
  credit: number;
  debit: number;
  totalBalanceBefore: number;
  totalBalanceAfter: number;
  unit: string;
}

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
            <td>{transaction.date}</td>
            <td>{transaction.assetName}</td>
            <td>{transaction.credit}</td>
            <td>{transaction.debit}</td>
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