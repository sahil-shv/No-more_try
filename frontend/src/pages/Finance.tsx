import React, { useState, useEffect } from 'react';

interface Expense {
  id: string;
  amount: number;
  category: 'food' | 'transport' | 'books' | 'entertainment' | 'housing' | 'other';
  description: string;
  date: Date;
}

const Finance: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: 'food' as Expense['category'],
    description: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    // TODO: Fetch expenses from API
    // Mock data for now
    setExpenses([
      {
        id: '1',
        amount: 12.50,
        category: 'food',
        description: 'Lunch at campus cafeteria',
        date: new Date()
      },
      {
        id: '2',
        amount: 45.00,
        category: 'books',
        description: 'Programming textbook',
        date: new Date(Date.now() - 86400000)
      },
      {
        id: '3',
        amount: 8.00,
        category: 'transport',
        description: 'Bus fare',
        date: new Date(Date.now() - 172800000)
      }
    ]);
  }, []);

  const handleAddExpense = async () => {
    if (!newExpense.amount || !newExpense.description.trim()) return;

    const expense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      description: newExpense.description.trim(),
      date: new Date()
    };

    // TODO: Save to API
    setExpenses(prev => [expense, ...prev]);
    setNewExpense({ amount: '', category: 'food', description: '' });
    setShowAddForm(false);
  };

  const deleteExpense = (expenseId: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
    // TODO: Delete from API
  };

  const getCategoryColor = (category: Expense['category']) => {
    switch (category) {
      case 'food': return '#28a745';
      case 'transport': return '#4a90e2';
      case 'books': return '#6f42c1';
      case 'entertainment': return '#ffc107';
      case 'housing': return '#dc3545';
      case 'other': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getCategoryIcon = (category: Expense['category']) => {
    switch (category) {
      case 'food': return '🍽️';
      case 'transport': return '🚌';
      case 'books': return '📚';
      case 'entertainment': return '🎬';
      case 'housing': return '🏠';
      case 'other': return '💳';
      default: return '💳';
    }
  };

  // Calculate weekly summary
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const thisWeekExpenses = expenses.filter(expense => expense.date >= weekStart);
  const weeklyTotal = thisWeekExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const categoryTotals = thisWeekExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<Expense['category'], number>);

  return (
    <div>
      <div className="card">
        <h1>Financial Awareness</h1>
        <p>Simple expense tracking for stress awareness, not budgeting pressure.</p>
        <div style={{ 
          background: '#fff3cd', 
          padding: '1rem', 
          borderRadius: '4px', 
          marginTop: '1rem' 
        }}>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Note:</strong> This tool is for awareness only. We don't provide financial advice. 
            For financial planning, consult qualified professionals.
          </p>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>This Week's Overview</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            Add Expense
          </button>
        </div>
        
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          background: '#f8f9fa', 
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: '#4a90e2' }}>
            ${weeklyTotal.toFixed(2)}
          </h3>
          <p style={{ margin: 0, color: '#6c757d' }}>
            Total spent this week ({thisWeekExpenses.length} transactions)
          </p>
        </div>

        {Object.keys(categoryTotals).length > 0 && (
          <div>
            <h3>Category Breakdown</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              {Object.entries(categoryTotals).map(([category, amount]) => (
                <div 
                  key={category}
                  style={{ 
                    textAlign: 'center', 
                    padding: '1rem', 
                    background: '#f8f9fa', 
                    borderRadius: '4px',
                    borderLeft: `4px solid ${getCategoryColor(category as Expense['category'])}`
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                    {getCategoryIcon(category as Expense['category'])}
                  </div>
                  <h4 style={{ margin: '0 0 0.25rem 0', textTransform: 'capitalize' }}>
                    {category}
                  </h4>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>
                    ${amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showAddForm && (
        <div className="card">
          <h2>Add Expense</h2>
          <div className="form-group">
            <label className="form-label">Amount ($)</label>
            <input
              type="number"
              className="form-input"
              step="0.01"
              min="0"
              value={newExpense.amount}
              onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={newExpense.category}
              onChange={(e) => setNewExpense(prev => ({ 
                ...prev, 
                category: e.target.value as Expense['category'] 
              }))}
            >
              <option value="food">Food & Dining</option>
              <option value="transport">Transportation</option>
              <option value="books">Books & Supplies</option>
              <option value="entertainment">Entertainment</option>
              <option value="housing">Housing</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-input"
              value={newExpense.description}
              onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
              placeholder="What was this expense for?"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleAddExpense}>
              Add Expense
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <h2>Recent Expenses</h2>
        {expenses.length === 0 ? (
          <p>No expenses recorded yet. Add one to start tracking.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {expenses.slice(0, 10).map(expense => (
              <div 
                key={expense.id}
                style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem', 
                  background: '#f8f9fa', 
                  borderRadius: '4px',
                  borderLeft: `4px solid ${getCategoryColor(expense.category)}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>
                    {getCategoryIcon(expense.category)}
                  </span>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0' }}>{expense.description}</h3>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#6c757d' }}>
                      {expense.category} • {expense.date.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    ${expense.amount.toFixed(2)}
                  </span>
                  <button 
                    className="btn btn-danger"
                    onClick={() => deleteExpense(expense.id)}
                    style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2>Financial Wellness Tips</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#e7f3ff', borderRadius: '4px' }}>
            <h3>💡 Awareness</h3>
            <ul style={{ fontSize: '0.9rem' }}>
              <li>Track spending without judgment</li>
              <li>Notice patterns, not perfection</li>
              <li>Small awareness leads to better choices</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', background: '#f0f9ff', borderRadius: '4px' }}>
            <h3>🎯 Student Tips</h3>
            <ul style={{ fontSize: '0.9rem' }}>
              <li>Look for student discounts</li>
              <li>Cook meals when possible</li>
              <li>Use campus resources</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', background: '#f0fff4', borderRadius: '4px' }}>
            <h3>🤝 Support</h3>
            <ul style={{ fontSize: '0.9rem' }}>
              <li>Campus financial aid office</li>
              <li>Student emergency funds</li>
              <li>Free financial literacy resources</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ 
        background: '#e7f3ff', 
        padding: '1rem', 
        borderRadius: '4px', 
        marginTop: '1rem' 
      }}>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>
          <strong>Remember:</strong> This tool helps you understand your spending patterns to reduce financial stress. 
          It's not about restricting yourself, but about making informed choices that align with your values and goals.
        </p>
      </div>
    </div>
  );
};

export default Finance;