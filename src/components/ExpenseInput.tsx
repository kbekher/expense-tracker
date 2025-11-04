import { useState, useEffect } from 'react';
import { createExpense, getCategories } from '../services/api';
import type { Category } from '../types';

interface ExpenseInputProps {
  userId: string;
}

export default function ExpenseInput({ userId }: ExpenseInputProps) {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadCategories();
  }, [userId]);

  const loadCategories = async () => {
    try {
      const cats = await getCategories(userId);
      setCategories(cats);
      if (cats.length > 0 && !categoryId) {
        setCategoryId(cats[0]._id);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !categoryId || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount and select a category');
      return;
    }

    setLoading(true);
    try {
      await createExpense(userId, parseFloat(amount), categoryId, new Date(), description);
      setAmount('');
      setDescription('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to create expense:', error);
      alert('Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="expense-input">
        <div className="empty-state">
          <p>⚠️ No categories found. Please create a category first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="expense-input">
      <h2>Add New Expense</h2>
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label htmlFor="amount">Amount (€)</label>
          <input
            type="number"
            id="amount"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
            autoFocus
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (optional)</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you spend on?"
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Adding...' : '➕ Add Expense'}
        </button>

        {success && (
          <div className="success-message">
            ✅ Expense added successfully!
          </div>
        )}
      </form>
    </div>
  );
}

