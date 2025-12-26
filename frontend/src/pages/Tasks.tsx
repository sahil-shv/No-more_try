import React, { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: Date;
  linkedGoalId?: string;
  linkedHabitId?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    dueDate: ''
  });

  useEffect(() => {
    // TODO: Fetch tasks from API
    // Mock data for now
    const today = new Date();
    setTasks([
      {
        id: '1',
        title: 'Review ML lecture notes',
        description: 'Go through today\'s machine learning concepts',
        completed: false,
        priority: 'high',
        createdAt: new Date(),
        dueDate: today
      },
      {
        id: '2',
        title: 'Complete React tutorial',
        description: 'Finish the hooks section',
        completed: true,
        priority: 'medium',
        createdAt: new Date()
      },
      {
        id: '3',
        title: 'Plan weekend study schedule',
        description: 'Organize subjects for weekend review',
        completed: false,
        priority: 'low',
        createdAt: new Date()
      }
    ]);
  }, []);

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      completed: false,
      priority: newTask.priority,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
      createdAt: new Date()
    };

    // TODO: Save to API
    setTasks(prev => [...prev, task]);
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
    setShowAddForm(false);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    // TODO: Update in API
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    // TODO: Delete from API
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const isToday = (date?: Date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const todaysTasks = tasks.filter(task => !task.completed && (!task.dueDate || isToday(task.dueDate)));
  const completedTasks = tasks.filter(task => task.completed);
  const upcomingTasks = tasks.filter(task => !task.completed && task.dueDate && !isToday(task.dueDate));

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Daily Tasks</h1>
            <p>Simple task organization without overwhelming pressure.</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            Add Task
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="card">
          <h2>Add New Task</h2>
          <div className="form-group">
            <label className="form-label">Task Title</label>
            <input
              type="text"
              className="form-input"
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What needs to be done?"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (optional)</label>
            <textarea
              className="form-textarea"
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add more details..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={newTask.priority}
                onChange={(e) => setNewTask(prev => ({ 
                  ...prev, 
                  priority: e.target.value as Task['priority'] 
                }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Due Date (optional)</label>
              <input
                type="date"
                className="form-input"
                value={newTask.dueDate}
                onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleAddTask}>
              Add Task
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

      {/* Today's Tasks */}
      <div className="card">
        <h2>Today's Focus ({todaysTasks.length} tasks)</h2>
        {todaysTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
            <p>✨ No tasks for today! Take this time to rest or explore something new.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {todaysTasks.map(task => (
              <div 
                key={task.id}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem', 
                  background: '#f8f9fa', 
                  borderRadius: '4px',
                  borderLeft: `4px solid ${getPriorityColor(task.priority)}`
                }}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id)}
                  style={{ marginRight: '1rem', transform: 'scale(1.2)' }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    margin: '0 0 0.5rem 0',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    opacity: task.completed ? 0.6 : 1
                  }}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p style={{ color: '#6c757d', margin: '0 0 0.5rem 0' }}>
                      {task.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ 
                      fontSize: '0.8rem', 
                      padding: '0.25rem 0.5rem', 
                      background: getPriorityColor(task.priority),
                      color: 'white',
                      borderRadius: '4px' 
                    }}>
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                        Due: {task.dueDate.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  className="btn btn-danger"
                  onClick={() => deleteTask(task.id)}
                  style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <div className="card">
          <h2>Upcoming Tasks</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {upcomingTasks.map(task => (
              <div 
                key={task.id}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem', 
                  background: '#f8f9fa', 
                  borderRadius: '4px',
                  opacity: 0.8
                }}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id)}
                  style={{ marginRight: '1rem', transform: 'scale(1.2)' }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{task.title}</h3>
                  {task.description && (
                    <p style={{ color: '#6c757d', margin: '0 0 0.5rem 0' }}>
                      {task.description}
                    </p>
                  )}
                  <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                    Due: {task.dueDate?.toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="card">
          <h2>Completed Today ({completedTasks.length})</h2>
          <p style={{ color: '#6c757d', marginBottom: '1rem' }}>
            Great work! Remember that progress isn't always about completing everything.
          </p>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {completedTasks.slice(0, 5).map(task => (
              <div 
                key={task.id}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem', 
                  background: '#d4edda', 
                  borderRadius: '4px',
                  opacity: 0.8
                }}
              >
                <span style={{ marginRight: '0.5rem' }}>✓</span>
                <span style={{ textDecoration: 'line-through' }}>{task.title}</span>
              </div>
            ))}
            {completedTasks.length > 5 && (
              <p style={{ color: '#6c757d', textAlign: 'center', margin: '0.5rem 0 0 0' }}>
                ... and {completedTasks.length - 5} more completed tasks
              </p>
            )}
          </div>
        </div>
      )}

      {/* Gentle Reminders */}
      <div className="card">
        <h2>Task Management Tips</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #e9ecef' }}>
            🌱 It's okay if you don't complete everything - progress over perfection
          </li>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #e9ecef' }}>
            📅 Unfinished tasks will gently move to tomorrow, no stress
          </li>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #e9ecef' }}>
            🎯 Focus on 2-3 important tasks rather than a long overwhelming list
          </li>
          <li style={{ padding: '0.5rem 0' }}>
            💙 Celebrate small wins - every completed task is an achievement
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Tasks;