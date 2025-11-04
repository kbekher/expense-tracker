import { useState, useEffect } from 'react';
import { getExpenseStats, getRecurringPayments, getCategories } from '../services/api';
import type { ExpenseStats, RecurringPayment, Category } from '../types';

interface OverviewProps {
  userId: string;
}

export default function Overview({ userId }: OverviewProps) {
  const [stats, setStats] = useState<ExpenseStats | null>(null);
  const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [userId, selectedYear, selectedMonth, viewMode]);

  const loadData = async () => {
    setLoading(true);
    try {
      const year = viewMode === 'year' ? selectedYear : undefined;
      const month = viewMode === 'month' ? selectedMonth : undefined;
      const statsData = await getExpenseStats(userId, year, month);
      setStats(statsData);
      
      const recurring = await getRecurringPayments(userId);
      setRecurringPayments(recurring);
    } catch (error) {
      console.error('Failed to load overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecurringTotal = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return recurringPayments
      .filter(p => p.isActive && !p.excludedMonths.includes(currentMonth))
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getMonthName = (month: number) => {
    const date = new Date(2000, month - 1, 1);
    return date.toLocaleString('en-US', { month: 'long' });
  };

  if (loading) {
    return (
      <div className="overview loading">
        <div className="loading-spinner"></div>
        <p>Loading overview...</p>
      </div>
    );
  }

  return (
    <div className="overview">
      <div className="overview-header">
        <h2>Expense Overview</h2>
        <div className="view-controls">
          <button
            className={viewMode === 'month' ? 'active' : ''}
            onClick={() => setViewMode('month')}
          >
            Month
          </button>
          <button
            className={viewMode === 'year' ? 'active' : ''}
            onClick={() => setViewMode('year')}
          >
            Year
          </button>
        </div>
      </div>

      <div className="date-selector">
        {viewMode === 'month' ? (
          <>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {getMonthName(month)}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </>
        ) : (
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="stats-summary">
        <div className="stat-card total">
          <h3>Total Expenses</h3>
          <p className="stat-value">{formatCurrency(stats?.total || 0)}</p>
        </div>
        <div className="stat-card recurring">
          <h3>Recurring Payments</h3>
          <p className="stat-value">{formatCurrency(getRecurringTotal())}</p>
        </div>
        <div className="stat-card combined">
          <h3>Total (Expenses + Recurring)</h3>
          <p className="stat-value">
            {formatCurrency((stats?.total || 0) + getRecurringTotal())}
          </p>
        </div>
      </div>

      {stats && stats.byCategory.length > 0 && (
        <div className="category-breakdown">
          <h3>By Category</h3>
          <div className="category-list">
            {stats.byCategory.map((cat, index) => {
              const percentage = stats.total > 0 ? (cat.total / stats.total) * 100 : 0;
              return (
                <div key={index} className="category-bar">
                  <div className="category-bar-header">
                    <span className="category-name" style={{ color: cat.color }}>
                      {cat.name}
                    </span>
                    <span className="category-amount">{formatCurrency(cat.total)}</span>
                  </div>
                  <div className="category-bar-bg">
                    <div
                      className="category-bar-fill"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: cat.color
                      }}
                    />
                  </div>
                  <span className="category-percentage">{percentage.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {stats && stats.expenses.length > 0 && (
        <div className="recent-expenses">
          <h3>Recent Expenses</h3>
          <div className="expenses-list">
            {stats.expenses.slice(0, 10).map((expense) => {
              const category = typeof expense.categoryId === 'object' ? expense.categoryId : null;
              const date = new Date(expense.date);
              
              return (
                <div key={expense._id} className="expense-item">
                  <div className="expense-info">
                    <span className="expense-category" style={{ color: category?.color || '#666' }}>
                      {category?.name || 'Unknown'}
                    </span>
                    <span className="expense-description">{expense.description || 'No description'}</span>
                    <span className="expense-date">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <span className="expense-amount">{formatCurrency(expense.amount)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(!stats || stats.expenses.length === 0) && (
        <div className="empty-state">
          <p>No expenses recorded for this period.</p>
        </div>
      )}
    </div>
  );
}

