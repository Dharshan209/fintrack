import './Dashboard.css';
import { useEffect, useState } from 'react';
import AddTransactionForm from './AddTransactionForm';
import IncomevsExpence from './Chart/IncomevsExpence';
import { supabase } from '../config/supabase';

function Dashboard() {
  const [saving, setSaving] = useState(12000);
  const [income, setIncome] = useState(8000);
  const [expence, setExpence] = useState(2000);
  const [addTransaction, setAddTransaction] = useState(false);

  const handleAddTransaction = () => {
    setAddTransaction(!addTransaction);
  };

  // useEffect(() => {
  //   const fetchSummary = async () => {
  //     const id = localStorage.getItem('id');
  //     if (!id) {
  //       console.error('User ID not found in localStorage');
  //       return;
  //     }

  //     const { data, error } = await supabase
  //       .schema('fintrack')
  //       .from('user_financial_summary')
  //       .select('*')
  //       .eq('user_id', id)
  //       .single();

  //     if (error) {
  //       console.error('Error fetching financial summary:', error);
  //       return;
  //     }

  //     if (data) {
  //       setSaving(data.total_saving);
  //       setIncome(data.total_income);
  //       setExpence(data.total_expense);
  //     }
  //   };

  //   fetchSummary();
  // }, []); // Runs once on component mount

  const handleSubmit = () => {
    console.log('Form submitted!');
    setAddTransaction(false);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button className="add-button" onClick={handleAddTransaction}>
          + Add Transaction
        </button>
      </div>

      <p className="subtitle">Here’s an overview of your financial status</p>

      {addTransaction && <AddTransactionForm onSubmit={handleSubmit} />}

      <div className={`cards ${addTransaction ? 'faded' : ''}`}>
        <div className="card">
          <p className="card-title">Net Worth</p>
          <p className="card-value">{saving}</p>
          <p className="card-change positive">+1.2%</p>
        </div>
        <div className="card">
          <p className="card-title">Total Income</p>
          <p className="card-value">{income}</p>
          <p className="card-change negative">-0.5%</p>
        </div>
        <div className="card">
          <p className="card-title">Total Expenses</p>
          <p className="card-value">{expence}</p>
          <p className="card-change positive">+0.8%</p>
        </div>
      </div>
      <IncomevsExpence />
    </div>
  );
}

export default Dashboard;
