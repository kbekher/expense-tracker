import { useState } from 'react';
import './NumericKeypad.css';

interface NumericKeypadProps {
  onSubmit: (amount: number) => void;
  categoryId: string;
  categories: any[];
  onCategoryChange: (id: string) => void;
}

export default function NumericKeypad({ onSubmit, categoryId, categories, onCategoryChange }: NumericKeypadProps) {
  const [display, setDisplay] = useState('0');
  const [description, setDescription] = useState('');

  const handleNumberClick = (num: string) => {
    if (display === '0') {
      setDisplay(num);
    } else if (display.length < 10) {
      setDisplay(display + num);
    }
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleBackspace = () => {
    if (display.length === 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleClear = () => {
    setDisplay('0');
  };

  const handleSubmit = () => {
    const amount = parseFloat(display);
    if (amount > 0 && categoryId) {
      onSubmit(amount);
      setDisplay('0');
      setDescription('');
    }
  };

  return (
    <div className="numeric-keypad-container">
      <div className="keypad-header">
        <select
          value={categoryId}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="category-select"
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="description-input"
        />
      </div>

      <div className="amount-display">
        <span className="currency">€</span>
        <span className="amount">{display}</span>
      </div>

      <div className="keypad-grid">
        <button onClick={() => handleNumberClick('7')} className="key">7</button>
        <button onClick={() => handleNumberClick('8')} className="key">8</button>
        <button onClick={() => handleNumberClick('9')} className="key">9</button>
        
        <button onClick={() => handleNumberClick('4')} className="key">4</button>
        <button onClick={() => handleNumberClick('5')} className="key">5</button>
        <button onClick={() => handleNumberClick('6')} className="key">6</button>
        
        <button onClick={() => handleNumberClick('1')} className="key">1</button>
        <button onClick={() => handleNumberClick('2')} className="key">2</button>
        <button onClick={() => handleNumberClick('3')} className="key">3</button>
        
        <button onClick={handleDecimal} className="key">.</button>
        <button onClick={() => handleNumberClick('0')} className="key">0</button>
        <button onClick={handleBackspace} className="key key-backspace">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
            <line x1="18" y1="9" x2="12" y2="15"></line>
            <line x1="12" y1="9" x2="18" y2="15"></line>
          </svg>
        </button>
      </div>

      <button onClick={handleSubmit} className="keypad-submit" disabled={!categoryId || parseFloat(display) <= 0}>
        Add Expense
      </button>
    </div>
  );
}

