import React, { useState, useEffect } from 'react';

interface Habit {
  id: string;
  name: string;
  category: 'study' | 'health' | 'finance' | 'recovery';
  description: string;
  frequency: 'daily' | 'weekly';
  lastCompleted?: Date;
  completedDates: string[]; // ISO date strings
}

const Habits: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    category: 'study' as Habit['category'],
    description: '',
    frequency: 'daily' as Habit['frequency']
  });

  useEffect(() => {
    // TODO: Fetch habits from API
    // Mock data for now
    setHabits([
      {
        id: '1',
        name: 'Morning Review',
        category: 'study',
        description: 'Review notes from previous day',
        frequency: 'daily',
        completedDates: ['2024-01-15', '2024-01-14']
      },
      {
        id: '2',
        name: 'Exercise',
        category: 'health',
        description: '30 minutes of physical activity',
        frequency: 'daily',
        completedDates: ['2024-01-15']
      }
    ]);
  }, []);

  const handleAddHabit = async () => {
    if (!newHabit.name.trim()) return;

    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name,
      category: newHabit.category,
      description: newHabit.description,
      frequency: newHabit.frequency,
      completedDates: []
    };

    // TODO: Save to API
    setHabits(prev => [...prev, habit]);
    setNewHabit({ name: '', category: 'study', description: '', frequency: 'daily' });
    setShowAddForm(false);
  };

  const toggleHabitCompletion = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDates.includes(today);
        const updatedDates = isCompleted
          ? habit.completedDates.filter(date => date !== today)
          : [...habit.completedDates, today];
        
        return {
          ...habit,
          completedDates: updatedDates,
          lastCompleted: isCompleted ? undefined : new Date()
        };
      }
      return habit;
    }));
    // TODO: Update in API
  };

  const isCompletedToday = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completedDates.includes(today);
  };

  const getCategoryColor = (category: Habit['category']) => {
    switch (category) {
      case 'study': return '#4a90e2';
      case 'health': return '#28a745';
      case 'finance': return '#ffc107';
      case 'recovery': return '#6f42c1';
      default: return '#6c757d';
    }
  };

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Habit Tracker</h1>
            <p>Build sustainable habits without pressure or streaks.</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            Add Habit
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="card">
          <h2>Add New Habit</h2>
          <div className="form-group">
            <label className="form-label">Habit Name</label>
            <input
              type="text"
              className="form-input"
              value={newHabit.name}
              onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
              placeholder="What habit would you like to track?"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={newHabit.category}
              onChange={(e) => setNewHabit(prev => ({ 
                ...prev, 
                category: e.target.value as Habit['category'] 
              }))}
            >
              <option value="study">Study</option>
              <option value="health">Health</option>
              <option value="finance">Finance</option>
              <option value="recovery">Recovery</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={newHabit.description}
              onChange={(e) => setNewHabit(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe this habit..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Frequency</label>
            <select
              className="form-select"
              value={newHabit.frequency}
              onChange={(e) => setNewHabit(prev => ({ 
                ...prev, 
                frequency: e.target.value as Habit['frequency'] 
              }))}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleAddHabit}>
              Add Habit
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
        <h2>Today's Habits</h2>
        {habits.length === 0 ? (
          <p>No habits tracked yet. Add one when you're ready.</p>
        ) : (
          <div className="habit-grid">
            {habits.map(habit => (
              <div key={habit.id} className="habit-item">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: getCategoryColor(habit.category)
                      }}
                    />
                    <h3 style={{ margin: 0 }}>{habit.name}</h3>
                  </div>
                  <p style={{ color: '#6c757d', margin: '0.25rem 0' }}>{habit.description}</p>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    padding: '0.25rem 0.5rem', 
                    background: '#e9ecef', 
                    borderRadius: '4px' 
                  }}>
                    {habit.category} • {habit.frequency}
                  </span>
                </div>
                <button
                  className={`btn ${isCompletedToday(habit) ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => toggleHabitCompletion(habit.id)}
                  style={{ minWidth: '100px' }}
                >
                  {isCompletedToday(habit) ? '✓ Done' : 'Mark Done'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2>Habit Insights</h2>
        <p style={{ color: '#6c757d', marginBottom: '1rem' }}>
          Remember: Consistency matters more than perfection. No streaks, no pressure.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {['study', 'health', 'finance', 'recovery'].map(category => {
            const categoryHabits = habits.filter(h => h.category === category);
            const completedToday = categoryHabits.filter(h => isCompletedToday(h)).length;
            
            return (
              <div 
                key={category}
                style={{ 
                  textAlign: 'center', 
                  padding: '1rem', 
                  background: '#f8f9fa', 
                  borderRadius: '4px',
                  borderLeft: `4px solid ${getCategoryColor(category as Habit['category'])}`
                }}
              >
                <h3 style={{ textTransform: 'capitalize', margin: '0 0 0.5rem 0' }}>
                  {category}
                </h3>
                <p style={{ margin: 0 }}>
                  {completedToday}/{categoryHabits.length} today
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Habits;