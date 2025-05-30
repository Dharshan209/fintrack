import './AddTransactionForm.css';

function AddTransactionForm({ onSubmit }) {
  return (
    <div className="add-transaction-form">
      <input type="text" placeholder="Title" />
      <input type="number" placeholder="Amount" />
      <select>
        <option value="">Category</option>
        <option value="income">Food</option>
        <option value="expense">Entertiment</option>
      </select>
      <select>
        <option value="">Select Type</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <button className="submit-button" onClick={onSubmit}>Submit</button>
    </div>
  );
}

export default AddTransactionForm;
