import React, { useState } from 'react';

const AddTransactionForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: '',
    category: '',
    description: '',
    transaction_date: new Date().toISOString().split('T')[0],
    tags: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Categories based on your database schema
  const categories = {
    income: [
      { id: 'salary', name: 'Salary', icon: '💰' },
      { id: 'freelance', name: 'Freelance', icon: '💼' },
      { id: 'business', name: 'Business', icon: '🏢' },
      { id: 'investment', name: 'Investment Returns', icon: '📈' },
      { id: 'rental', name: 'Rental Income', icon: '🏠' },
      { id: 'side-hustle', name: 'Side Hustle', icon: '⚡' },
      { id: 'bonus', name: 'Bonus', icon: '🎁' },
      { id: 'other-income', name: 'Other Income', icon: '💵' }
    ],
    expense: [
      { id: 'food-dining', name: 'Food & Dining', icon: '🍽️' },
      { id: 'groceries', name: 'Groceries', icon: '🛒' },
      { id: 'transportation', name: 'Transportation', icon: '🚗' },
      { id: 'fuel', name: 'Fuel', icon: '⛽' },
      { id: 'health', name: 'Health & Medical', icon: '🏥' },
      { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
      { id: 'shopping', name: 'Shopping', icon: '🛍️' },
      { id: 'utilities', name: 'Utilities', icon: '💡' },
      { id: 'rent', name: 'Rent/Mortgage', icon: '🏠' },
      { id: 'insurance', name: 'Insurance', icon: '🛡️' },
      { id: 'education', name: 'Education', icon: '📚' },
      { id: 'travel', name: 'Travel', icon: '✈️' },
      { id: 'gym', name: 'Gym & Fitness', icon: '💪' },
      { id: 'subscriptions', name: 'Subscriptions', icon: '📱' },
      { id: 'personal-care', name: 'Personal Care', icon: '💄' },
      { id: 'gifts', name: 'Gifts & Donations', icon: '🎁' },
      { id: 'other-expense', name: 'Other Expenses', icon: '💸' }
    ],
    saving: [
      { id: 'emergency', name: 'Emergency Fund', icon: '🛡️' },
      { id: 'vacation', name: 'Vacation Fund', icon: '🏖️' },
      { id: 'retirement', name: 'Retirement', icon: '👴' },
      { id: 'investment-saving', name: 'Investment', icon: '📊' },
      { id: 'house-fund', name: 'House Fund', icon: '🏡' },
      { id: 'car-fund', name: 'Car Fund', icon: '🚙' },
      { id: 'education-fund', name: 'Education Fund', icon: '🎓' },
      { id: 'general-savings', name: 'General Savings', icon: '🏦' }
    ]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Reset category when type changes
    if (name === 'type') {
      setFormData(prev => ({
        ...prev,
        category: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.type) {
      newErrors.type = 'Please select a transaction type';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Process tags
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        tags: tagsArray,
        source: 'website'
      };

      await onSubmit(transactionData);
      
      // Reset form after successful submission
      setFormData({
        amount: '',
        type: '',
        category: '',
        description: '',
        transaction_date: new Date().toISOString().split('T')[0],
        tags: '',
        notes: ''
      });
      
    } catch (error) {
      console.error('Error submitting transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'income': return '#4CAF50';
      case 'expense': return '#F44336';
      case 'saving': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Add Transaction</h2>
        <p className="text-gray-600">Track your financial activity</p>
      </div>

      <div className="space-y-4">
        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transaction Type *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['income', 'expense', 'saving'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => handleInputChange({ target: { name: 'type', value: type } })}
                className={`p-3 rounded-lg border-2 font-medium capitalize transition-all duration-200 ${
                  formData.type === type
                    ? 'border-blue-500 text-white'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
                style={{
                  backgroundColor: formData.type === type ? getTypeColor(type) : 'transparent'
                }}
              >
                {type}
              </button>
            ))}
          </div>
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              placeholder="0.00"
              className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
        </div>

        {/* Category */}
        {formData.type && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories[formData.type]?.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="What was this transaction for?"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            name="transaction_date"
            value={formData.transaction_date}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="work, personal, urgent (comma separated)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="3"
            placeholder="Additional notes..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding...' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionForm;