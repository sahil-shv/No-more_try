import React, { useState, useEffect } from 'react';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'career' | 'personal';
  status: 'active' | 'paused' | 'completed';
  createdAt: Date;
}

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'academic' as Goal['category']
  });

  useEffect(() => {
    // TODO: Fetch goals from API
    // Mock data for now
    setGoals([
      {
        id: '1',
        title: 'Complete Machine Learning Course',
        description: 'Finish the online ML course by end of semester',
        category: 'academic',
        status: 'active',
        createdAt: new Date()
      },
      {
        id: '2',
        title: 'Build Portfolio Website',
        description: 'Create a professional portfolio to showcase projects',
        category: 'career',
        status: 'active',
        createdAt: new Date()
      }
    ]);
  }, []);

  const handleAddGoal = async () => {
    if (!newGoal.title.trim()) return;

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      status: 'active',
      createdAt: new Date()
    };

    // TODO: Save to API
    setGoals(prev => [...prev, goal]);
    setNewGoal({ title: '', description: '', category: 'academic' });
    setShowAddForm(false);
  };

  const updateGoalStatus = (goalId: string, status: Goal['status']) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, status } : goal
    ));
    // TODO: Update in API
  };

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const maxActiveGoals = 5; // Prevent overload

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Long-term Goals</h1>
            <p>Focus on meaningful objectives without overwhelming yourself.</p>
          </div>
          {activeGoals.length < maxActiveGoals && (
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              Add Goal
            </button>
          )}
        </div>
        
        {activeGoals.length >= maxActiveGoals && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff3cd', borderRadius: '4px' }}>
            <p>You have {activeGoals.length} active goals. Consider completing or pausing some before adding new ones.</p>
          </div>
        )}
      </div>

      {showAddForm && (
        <div className="card">
          <h2>Add New Goal</h2>
          <div className="form-group">
            <label className="form-label">Goal Title</label>
            <input
              type="text"
              className="form-input"
              value={newGoal.title}
              onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What do you want to achieve?"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={newGoal.description}
              onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your goal in more detail..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={newGoal.category}
              onChange={(e) => setNewGoal(prev => ({ 
                ...prev, 
                category: e.target.value as Goal['category'] 
              }))}
            >
              <option value="academic">Academic</option>
              <option value="career">Career</option>
              <option value="personal">Personal</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleAddGoal}>
              Add Goal
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
        <h2>Active Goals ({activeGoals.length}/{maxActiveGoals})</h2>
        {activeGoals.length === 0 ? (
          <p>No active goals yet. Add one when you're ready.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {activeGoals.map(goal => (
              <div 
                key={goal.id}
                style={{ 
                  padding: '1rem', 
                  background: '#f8f9fa', 
                  borderRadius: '4px',
                  borderLeft: `4px solid ${
                    goal.category === 'academic' ? '#4a90e2' :
                    goal.category === 'career' ? '#28a745' : '#ffc107'
                  }`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3>{goal.title}</h3>
                    <p style={{ color: '#6c757d', margin: '0.5rem 0' }}>{goal.description}</p>
                    <span style={{ 
                      fontSize: '0.8rem', 
                      padding: '0.25rem 0.5rem', 
                      background: '#e9ecef', 
                      borderRadius: '4px' 
                    }}>
                      {goal.category}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => updateGoalStatus(goal.id, 'paused')}
                      style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                    >
                      Pause
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={() => updateGoalStatus(goal.id, 'completed')}
                      style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                    >
                      Complete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {goals.filter(g => g.status !== 'active').length > 0 && (
        <div className="card">
          <h2>Completed & Paused Goals</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {goals.filter(g => g.status !== 'active').map(goal => (
              <div 
                key={goal.id}
                style={{ 
                  padding: '1rem', 
                  background: goal.status === 'completed' ? '#d4edda' : '#f8f9fa', 
                  borderRadius: '4px',
                  opacity: 0.8
                }}
              >
                <h3>{goal.title}</h3>
                <p style={{ color: '#6c757d' }}>{goal.description}</p>
                <span style={{ 
                  fontSize: '0.8rem', 
                  padding: '0.25rem 0.5rem', 
                  background: goal.status === 'completed' ? '#28a745' : '#6c757d', 
                  color: 'white',
                  borderRadius: '4px' 
                }}>
                  {goal.status}
                </span>
                {goal.status === 'paused' && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => updateGoalStatus(goal.id, 'active')}
                    style={{ fontSize: '0.8rem', padding: '0.5rem', marginLeft: '1rem' }}
                  >
                    Resume
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;