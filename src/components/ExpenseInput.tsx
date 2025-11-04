import { useState, useEffect } from 'react';
import { createExpense, getCategories } from '../services/api';
import type { Category } from '../types';
import NumericKeypad from './NumericKeypad';

interface ExpenseInputProps {
  userId: string;
}

export default function ExpenseInput({ userId }: ExpenseInputProps) {
  const [categoryId, setCategoryId] = useState('');
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

  const handleSubmit = async (amount: number) => {
    if (!categoryId) {
      alert('Please select a category');
      return;
    }

    setLoading(true);
    try {
      await createExpense(userId, amount, categoryId, new Date());
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error: any) {
      console.error('Failed to create expense:', error);
      const errorMsg = error.response?.data?.error || 'Failed to add expense. Please try again.';
      alert(errorMsg);
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
      <h2>Add Expense</h2>
      
      {success && (
        <div className="success-message">
          ✅ Expense added successfully!
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Adding expense...</p>
        </div>
      ) : (
        <NumericKeypad
          onSubmit={handleSubmit}
          categoryId={categoryId}
          categories={categories}
          onCategoryChange={setCategoryId}
        />
      )}
    </div>
  );
}

