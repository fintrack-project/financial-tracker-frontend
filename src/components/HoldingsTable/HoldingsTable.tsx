import React from 'react';
import './HoldingsTable.css';

interface Holding {
  name: string;
  amount: number;
  price: number;
  unit: string;
  totalValue: number;
}

const HoldingsTable: React.FC = () => {
  // Dummy data for holdings
  const holdings: Holding[] = Array.from({ length: 20 }, (_, index) => ({
    name: `Asset ${index + 1}`,
    amount: Math.floor(Math.random() * 100 + 1), // Random total amount
    price: Math.floor(Math.random() * 1000 + 1), // Random price
    unit: 'USD',
    totalValue: 0, // Will be calculated dynamically
  })).map((holding) => ({
    ...holding,
    totalValue: holding.amount * holding.price, // Calculate total value
  }));

  return (
    <div className="holdings-table-container">
      <table className="holdings-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Total Amount</th>
            <th>Price</th>
            <th>Unit</th>
            <th>Total Value</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding, index) => (
            <tr key={index}>
              <td>{holding.name}</td>
              <td>{holding.amount}</td>
              <td>{holding.price}</td>
              <td>{holding.unit}</td>
              <td>{holding.totalValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HoldingsTable;