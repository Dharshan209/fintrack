import React, { useEffect, useState } from 'react';
import AddTransactionForm from './AddTransactionForm';
import './Transactions.css';
import { supabase } from '../config/supabase';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [addTransaction, setAddTransaction] = useState(false);
  const [selectedTab, setSelectedTab] = useState('All');

  const fetchTransactions = async () => {
    const user_id = localStorage.getItem('user_id');

    const { data, error } = await supabase
      .schema('fintrack')
      .from('transactions')
      .select(`
        id,
        transaction_date,
        description,
        amount,
        type,
        category:category_id (name )
      `)
      .eq('user_id', user_id)
      .order('transaction_date', { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error.message);
    } else {
      setTransactions(data);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddTransaction = () => {
    setAddTransaction(prev => !prev);
  };

  const handleSubmit = async (data) => {
    console.log("Form submitted!", data);
    await fetchTransactions(); 
    setAddTransaction(false);
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const filteredTransactions = transactions.filter(txn => {
    if (selectedTab === 'Income') return txn.type === 'income';
    if (selectedTab === 'Expenses') return txn.type === 'expense';
    return true;
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
            <tr key={txn.id || idx}>
              <td>{txn.transaction_date?.split('T')[0]}</td>
              <td>{txn.category?.name || 'Unknown'}</td>
              <td>{txn.description}</td>
              <td className={
                txn.type === 'income' ? 'income-amount' :
                txn.type === 'expense' ? 'expense-amount' :
                'saving-amount'
              }>
                {txn.type === 'income' ? `+${txn.amount}` :
                 txn.type === 'expense' ? `-${txn.amount}` :
                 `+${txn.amount}`}
              </td>
              <td><span className="status">{txn.status || 'Completed'}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
