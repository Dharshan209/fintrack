import React, { useState } from 'react';
import AddTransactionForm from './AddTransactionForm';
import './Transactions.css';

const transactionsData = [
  { date: '2024-03-15', category: 'Groceries', description: 'Weekly shopping at Local Market', amount: '-$120.50', status: 'Completed' },
  { date: '2024-03-14', category: 'Salary', description: 'Monthly paycheck from TechCorp', amount: '+$5,000.00', status: 'Completed' },
  { date: '2024-03-12', category: 'Utilities', description: 'Electricity bill', amount: '-$150.00', status: 'Completed' },
  { date: '2024-03-10', category: 'Dining', description: 'Dinner at The Bistro', amount: '-$85.75', status: 'Completed' },
  { date: '2024-03-08', category: 'Rent', description: 'Monthly rent payment', amount: '-$2,000.00', status: 'Completed' },
  { date: '2024-03-05', category: 'Transportation', description: 'Gasoline for car', amount: '-$45.20', status: 'Completed' },
  { date: '2024-03-03', category: 'Entertainment', description: 'Movie tickets', amount: '-$30.00', status: 'Completed' },
  { date: '2024-03-01', category: 'Healthcare', description: "Doctor's visit", amount: '-$100.00', status: 'Completed' },
  { date: '2024-02-28', category: 'Shopping', description: 'Clothing purchase', amount: '-$250.00', status: 'Completed' },
  { date: '2024-02-25', category: 'Travel', description: 'Flight ticket', amount: '-$400.00', status: 'Completed' },
];

export default function Transactions() {
  const [addTransaction, setAddTransaction] = useState(false);
  const [selectedTab, setSelectedTab] = useState('All');

  const handleAddTransaction = () => {
    setAddTransaction(prev => !prev);
  };

  const handleSubmit = (data) => {
    console.log("Form submitted!", data);
    setAddTransaction(false);
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const filteredTransactions = transactionsData.filter(txn => {
    if (selectedTab === 'Income') return txn.amount.startsWith('+');
    if (selectedTab === 'Expenses') return txn.amount.startsWith('-');
    return true; // 'All'
  });

  return (
    <div className="transactions-container">
      <h1 className="title">Transactions</h1>

      <div className="top-bar">
        <input type="text" placeholder="Search transactions" className="search-input" />
        <button className="new-transaction" onClick={handleAddTransaction}>New Transaction</button>
      </div>

      {addTransaction && <AddTransactionForm onSubmit={handleSubmit} />}

      <div className="tabs">
        {['All', 'Income', 'Expenses'].map(tab => (
          <span
            key={tab}
            className={`tab ${selectedTab === tab ? 'active' : ''}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </span>
        ))}
      </div>

      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((txn, idx) => (
            <tr key={idx}>
              <td>{txn.date}</td>
              <td>{txn.category}</td>
              <td>{txn.description}</td>
              <td>{txn.amount}</td>
              <td><span className="status">{txn.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
