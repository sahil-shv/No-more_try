import React, { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';

interface DashboardData {
  todaysTasks: number;
  completedTasks: number;
  activeGoals: number;
  trackedHabits: number;
  currentMood: number;
  weeklyReflectionDue: boolean;
}

const Dashboard: React.FC = () => {
  const { accounts } = useMsal();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    todaysTasks: 0,
    completedTasks: 0,
    activeGoals: 0,
    trackedHabits: 0,
    currentMood: 3,
    weeklyReflectionDue: false
  });

  useEffect(() => {
    // TODO: Fetch dashboard data from API
    // For now, using mock data
    setDashboardData({
      todaysTasks: 5,
      completedTasks: 2,
      activeGoals: 3,
      trackedHabits: 4,
      currentMood: 3,
      weeklyReflectionDue: true
    });
  }, []);

  if (accounts.length === 0) {
    return (
      <div className="card text-center">
        <h1>Welcome to nomore</h1>
        <p>A student well-being and productivity companion that respects your autonomy.</p>
        <p>Please log in to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h1>Welcome back, {accounts[0].name || 'Student'}!</h1>
        <p>Here's your gentle overview for today.</p>
      </div>

      <div className="card">
        <h2>Today's Overview</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h3>{dashboardData.completedTasks}/{dashboardData.todaysTasks}</h3>
            <p>Tasks Progress</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h3>{dashboardData.activeGoals}</h3>
            <p>Active Goals</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h3>{dashboardData.trackedHabits}</h3>
            <p>Habits Tracked</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h3>{dashboardData.currentMood}/5</h3>
            <p>Current Mood</p>
          </div>
        </div>
      </div>

      {dashboardData.weeklyReflectionDue && (
        <div className="card" style={{ borderLeft: '4px solid #4a90e2' }}>
          <h2>Weekly Reflection Available</h2>
          <p>Take a moment to reflect on your week when you're ready. No pressure.</p>
          <button className="btn btn-primary">Start Reflection</button>
        </div>
      )}

      <div className="card">
        <h2>Gentle Reminders</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #e9ecef' }}>
            ✨ Remember to take breaks between study sessions
          </li>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #e9ecef' }}>
            🌱 Your progress doesn't need to be perfect to be meaningful
          </li>
          <li style={{ padding: '0.5rem 0' }}>
            💙 Check in with yourself - how are you feeling today?
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;