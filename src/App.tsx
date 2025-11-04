import { useState } from 'react';
import './App.css';
import { useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ExpenseInput from './components/ExpenseInput';
import Overview from './components/Overview';
import Categories from './components/Categories';
import RecurringPayments from './components/RecurringPayments';

function App() {
  const { user, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'input' | 'categories' | 'recurring'>('overview');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show login/register if not authenticated
  if (!user) {
    return authMode === 'login' ? (
      <Login onSwitchToRegister={() => setAuthMode('register')} />
    ) : (
      <Register onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>💰 Expense Tracker</h1>
            <p className="user-info">Welcome, {user.username}!</p>
          </div>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={activeTab === 'input' ? 'active' : ''}
          onClick={() => setActiveTab('input')}
        >
          ➕ Add Expense
        </button>
        <button
          className={activeTab === 'categories' ? 'active' : ''}
          onClick={() => setActiveTab('categories')}
        >
          🏷️ Categories
        </button>
        <button
          className={activeTab === 'recurring' ? 'active' : ''}
          onClick={() => setActiveTab('recurring')}
        >
          🔄 Recurring
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'overview' && <Overview userId={user._id} />}
        {activeTab === 'input' && <ExpenseInput userId={user._id} />}
        {activeTab === 'categories' && <Categories userId={user._id} />}
        {activeTab === 'recurring' && <RecurringPayments userId={user._id} />}
      </main>
    </div>
  );
}

export default App;
