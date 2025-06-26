import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import AddTransactionForm from './AddTransactionForm'; // Assuming this component exists
import {
  Plus,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  BarChart3,
  RefreshCw,
  LogIn
} from 'lucide-react';

// MOCK: In a real environment, you would import your configured Supabase client.
// This mock is included to allow the component to compile and demonstrate functionality.
const supabase = {
  schema: () => supabase,
  from: () => supabase,
  select: () => supabase,
  eq: () => supabase,
  single: () => new Promise(resolve => resolve({ 
    data: { total_saving: 50000, total_income: 120000, total_expense: 70000 }, 
    error: null 
  })),
};

// Mock AddTransactionForm as it was not provided
const AddTransactionForm = ({ onSubmit }) => (
  <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', marginTop: '1rem', background: '#f9f9f9' }}>
    <h4>Add New Transaction</h4>
    <p>Transaction form would be here.</p>
    <button onClick={onSubmit} style={{ marginTop: '1rem' }}>Submit</button>
  </div>
);


function Dashboard() {
  const [saving, setSaving] = useState(0);
  const [income, setIncome] = useState(0);
  const [expence, setExpence] = useState(0);
  const [addTransaction, setAddTransaction] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  // Check login status
  const isLoggedIn = !!localStorage.getItem('user_id');

  // Calculate percentage changes
  const savingChange = 1.2;
  const incomeChange = -0.5;
  const expenseChange = 0.8;

  const handleAddTransaction = () => {
    setAddTransaction(!addTransaction);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const fetchSummary = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);

    const id = localStorage.getItem('user_id');
    if (!id) {
      // User is not logged in. Set a user-friendly message instead of a technical error.
      setError('Please log in to view your dashboard.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .schema('fintrack')
        .from('user_financial_summary')
        .select('*')
        .eq('user_id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        setSaving(data.total_saving || 0);
        setIncome(data.total_income || 0);
        setExpence(data.total_expense || 0);
      }
    } catch (err) {
      console.error('Error fetching financial summary:', err);
      setError('Failed to load your financial data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSummary(false);
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleSubmit = () => {
    console.log('Form submitted!');
    setAddTransaction(false);
    // Refresh data after adding transaction
    fetchSummary(false);
  };

  const netWorth = income - expence;
  const savingsRate = income > 0 ? ((saving / income) * 100).toFixed(1) : 0;
  
  return (
    <>
      <style>{`
        .dashboard { padding: 1.5rem; }
        .dashboard-header { margin-bottom: 0.5rem; }
        .subtitle { color: #6b7280; margin-bottom: 2rem; }
        .card-prompt { text-align: center; padding: 2rem; background-color: #f9fafb; border-radius: 0.5rem; }
        .prompt-message { font-size: 1.125rem; margin-bottom: 1rem; }
        .action-button { display: inline-flex; align-items: center; gap: 0.5rem; background-color: #f3f4f6; border: 1px solid #d1d5db; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 500; cursor: pointer; }
        .action-button.primary { background-color: #111827; color: #ffffff; }
        .quick-stats, .dashboard-actions { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem; }
        .cards { display: grid; gap: 1.5rem; grid-template-columns: repeat(1, 1fr); }
        @media (min-width: 768px) { .cards { grid-template-columns: repeat(3, 1fr); } }
        .card { background-color: #ffffff; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); }
        .card.loading { filter: blur(4px); }
        .card-title { display: flex; align-items: center; gap: 0.5rem; color: #4b5563; }
        .card-value { font-size: 2.25rem; font-weight: 700; margin: 0.5rem 0; }
        .card-change { display: flex; align-items: center; gap: 0.25rem; font-size: 0.875rem; }
        .card-change.positive { color: #10b981; }
        .card-change.negative { color: #ef4444; }
      `}</style>
      <div className="dashboard">
        {/* Render a prompt to log in if the user is not authenticated */}
        {!isLoggedIn ? (
          <>
            <div className="dashboard-header">
              <h1>Dashboard</h1>
            </div>
            <div className="card-prompt">
              <p className="prompt-message">Please log in to view your dashboard.</p>
              <button onClick={() => navigate('/')} className="action-button primary">
                <LogIn size={16} style={{ marginRight: '8px' }} />
                Go to Login
              </button>
            </div>
          </>
        ) : error ? (
           // Render an error message if data fetching fails for a logged-in user
           <>
            <div className="dashboard-header">
              <h1>Dashboard</h1>
            </div>
            <div className="card-prompt error">
              <p className="prompt-message">{error}</p>
              <button onClick={handleRefresh} className="action-button">
                <RefreshCw size={16} />
                Retry
              </button>
            </div>
          </>
        ) : (
          // Main dashboard content for logged-in users
          <>
            <div className="dashboard-header">
              <h1>Dashboard</h1>
            </div>

            <p className="subtitle">Here's an overview of your financial status</p>

            <div className="quick-stats">
              <div className="quick-stat">
                <div className="quick-stat-value">{formatCurrency(netWorth)}</div>
                <div className="quick-stat-label">Net Worth</div>
              </div>
              <div className="quick-stat">
                <div className="quick-stat-value">{savingsRate}%</div>
                <div className="quick-stat-label">Savings Rate</div>
              </div>
              <div className="quick-stat">
                <div className="quick-stat-value">
                  {income > 0 ? ((expence / income) * 100).toFixed(0) : 0}%
                </div>
                <div className="quick-stat-label">Expense Ratio</div>
              </div>
            </div>

            <div className="dashboard-actions">
              <button className="action-button primary" onClick={handleAddTransaction}>
                <Plus size={18} />
                Quick Add
              </button>
              <button className="action-button" onClick={handleRefresh}>
                <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <button className="action-button">
                <BarChart3 size={18} />
                View Reports
              </button>
            </div>

            {addTransaction && <AddTransactionForm onSubmit={handleSubmit} />}

            <div className={`cards ${addTransaction ? 'faded' : ''}`}>
              <div className={`card ${loading ? 'loading' : ''}`}>
                <div className="card-title">
                  <PiggyBank size={18} />
                  Total Savings
                </div>
                <div className="card-value">{loading ? '...' : formatCurrency(saving)}</div>
                <div className={`card-change ${savingChange >= 0 ? 'positive' : 'negative'}`}>
                  {savingChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {Math.abs(savingChange)}% from last month
                </div>
              </div>

              <div className={`card ${loading ? 'loading' : ''}`}>
                <div className="card-title">
                  <TrendingUp size={18} />
                  Total Income
                </div>
                <div className="card-value">{loading ? '...' : formatCurrency(income)}</div>
                <div className={`card-change ${incomeChange >= 0 ? 'positive' : 'negative'}`}>
                  {incomeChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {Math.abs(incomeChange)}% from last month
                </div>
              </div>

              <div className={`card ${loading ? 'loading' : ''}`}>
                <div className="card-title">
                  <CreditCard size={18} />
                  Total Expenses
                </div>
                <div className="card-value">{loading ? '...' : formatCurrency(expence)}</div>
                <div className={`card-change ${expenseChange < 0 ? 'positive' : 'negative'}`}>
                  {expenseChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {Math.abs(expenseChange)}% from last month
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Dashboard;
