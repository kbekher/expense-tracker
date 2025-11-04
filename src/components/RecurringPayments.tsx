import { useState, useEffect } from 'react';
import { getRecurringPayments, createRecurringPayment, toggleExcludeMonth, deleteRecurringPayment, getCategories } from '../services/api';
import type { RecurringPayment, Category } from '../types';

interface RecurringPaymentsProps {
  userId: string;
}

export default function RecurringPayments({ userId }: RecurringPaymentsProps) {
  const [payments, setPayments] = useState<RecurringPayment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPayment, setNewPayment] = useState({
    name: '',
    amount: '',
    categoryId: '',
    dayOfMonth: '1'
  });

  useEffect(() => {
    loadPayments();
    loadCategories();
  }, [userId]);

  const loadPayments = async () => {
    try {
      const data = await getRecurringPayments(userId);
      setPayments(data);
    } catch (error) {
      console.error('Failed to load recurring payments:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await getCategories(userId);
      setCategories(cats);
      if (cats.length > 0 && !newPayment.categoryId) {
        setNewPayment({ ...newPayment, categoryId: cats[0]._id });
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayment.name || !newPayment.amount || !newPayment.categoryId) return;

    try {
      await createRecurringPayment(
        userId,
        newPayment.name,
        parseFloat(newPayment.amount),
        newPayment.categoryId,
        parseInt(newPayment.dayOfMonth)
      );
      setNewPayment({ name: '', amount: '', categoryId: categories[0]?._id || '', dayOfMonth: '1' });
      setShowAddForm(false);
      loadPayments();
    } catch (error) {
      console.error('Failed to create recurring payment:', error);
      alert('Failed to create recurring payment.');
    }
  };

  const handleToggleExclude = async (id: string) => {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    try {
      await toggleExcludeMonth(id, currentMonth);
      loadPayments();
    } catch (error) {
      console.error('Failed to toggle exclude month:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recurring payment?')) return;

    try {
      await deleteRecurringPayment(id);
      loadPayments();
    } catch (error) {
      console.error('Failed to delete recurring payment:', error);
      alert('Failed to delete recurring payment.');
    }
  };

  const getCurrentMonthExcluded = (payment: RecurringPayment) => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return payment.excludedMonths.includes(currentMonth);
  };

  if (categories.length === 0) {
    return (
      <div className="recurring-payments">
        <div className="empty-state">
          <p>⚠️ No categories found. Please create a category first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recurring-payments">
      <div className="section-header">
        <h2>Recurring Payments</h2>
        <button onClick={() => setShowAddForm(!showAddForm)} className="add-btn">
          {showAddForm ? '✕ Cancel' : '+ Add Recurring Payment'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreate} className="recurring-form">
          <div className="form-group">
            <label>Payment Name</label>
            <input
              type="text"
              value={newPayment.name}
              onChange={(e) => setNewPayment({ ...newPayment, name: e.target.value })}
              placeholder="e.g., Rent, Netflix, Gym"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Amount (€)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={newPayment.amount}
              onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              value={newPayment.categoryId}
              onChange={(e) => setNewPayment({ ...newPayment, categoryId: e.target.value })}
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
            <label>Day of Month</label>
            <input
              type="number"
              min="1"
              max="31"
              value={newPayment.dayOfMonth}
              onChange={(e) => setNewPayment({ ...newPayment, dayOfMonth: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Create</button>
        </form>
      )}

      <div className="payments-list">
        {payments.length === 0 ? (
          <div className="empty-state">
            <p>No recurring payments yet. Set up your monthly expenses!</p>
          </div>
        ) : (
          payments.map((payment) => {
            const category = typeof payment.categoryId === 'object' ? payment.categoryId : null;
            const isExcluded = getCurrentMonthExcluded(payment);
            
            return (
              <div key={payment._id} className={`payment-item ${!payment.isActive ? 'inactive' : ''}`}>
                <div className="payment-info">
                  <div className="payment-header">
                    <h3>{payment.name}</h3>
                    <span className="payment-amount">€{payment.amount.toFixed(2)}</span>
                  </div>
                  <div className="payment-details">
                    <span className="payment-category" style={{ color: category?.color || '#666' }}>
                      {category?.name || 'Unknown'}
                    </span>
                    <span className="payment-day">Day {payment.dayOfMonth}</span>
                  </div>
                </div>
                <div className="payment-actions">
                  <button
                    onClick={() => handleToggleExclude(payment._id)}
                    className={`exclude-btn ${isExcluded ? 'excluded' : ''}`}
                    title={isExcluded ? 'Include in current month' : 'Exclude from current month'}
                  >
                    {isExcluded ? '✓ Included' : '⊘ Exclude'}
                  </button>
                  <button
                    onClick={() => handleDelete(payment._id)}
                    className="delete-btn"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

