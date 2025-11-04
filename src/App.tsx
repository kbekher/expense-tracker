import { useState } from 'react';
import './App.css';
import { useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ExpenseInput from './components/ExpenseInput';
import Overview from './components/Overview';
import Categories from './components/Categories';
import RecurringPayments from './components/RecurringPayments';
import BottomNav from './components/BottomNav';

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
          <h1>Expense Tracker</h1>
          <button onClick={logout} className="logout-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </header>

      <main className="app-main">
        {activeTab === 'overview' && <Overview userId={user._id} />}
        {activeTab === 'input' && <ExpenseInput userId={user._id} />}
        {activeTab === 'categories' && <Categories userId={user._id} />}
        {activeTab === 'recurring' && <RecurringPayments userId={user._id} />}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
