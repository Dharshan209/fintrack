
import './IncomevsExpence.css';
import {
  LineChart, Line, XAxis, Tooltip, ResponsiveContainer
} from 'recharts';

const data = [
  { month: 'Jan', value: 3000 },
  { month: 'Feb', value: 2800 },
  { month: 'Mar', value: 2400 },
  { month: 'Apr', value: 2700 },
  { month: 'May', value: 2000 },
  { month: 'Jun', value: 2600 },
];

function IncomevsExpence() {
  return (
    <div className="chart-container">
      <div className="chart-header">
        <div>
          <p className="chart-title">Income vs Expenses</p>
          <p className="chart-amount">2,222</p>
          <p className="chart-subtext">
            Last 6 Months <span className="chart-growth">+12%</span>
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#1e3a8a" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default IncomevsExpence;
