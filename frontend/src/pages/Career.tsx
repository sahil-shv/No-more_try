import React, { useState, useEffect } from 'react';

interface CareerTask {
  id: string;
  title: string;
  description: string;
  estimatedTime: number; // in minutes
  completed: boolean;
  category: 'skill-building' | 'exploration' | 'networking' | 'portfolio';
  createdAt: Date;
}

const Career: React.FC = () => {
  const [careerTasks, setCareerTasks] = useState<CareerTask[]>([]);
  const [userProfile, setUserProfile] = useState({
    degree: 'Computer Science',
    interests: ['Software Development', 'AI Research']
  });

  useEffect(() => {
    // TODO: Fetch career tasks and profile from API
    // Mock data for now
    setCareerTasks([
      {
        id: '1',
        title: 'Research AI ethics frameworks',
        description: 'Spend 20 minutes reading about current AI ethics guidelines',
        estimatedTime: 20,
        completed: false,
        category: 'exploration',
        createdAt: new Date()
      },
      {
        id: '2',
        title: 'Update LinkedIn profile summary',
        description: 'Revise your LinkedIn summary to reflect current skills',
        estimatedTime: 15,
        completed: true,
        category: 'portfolio',
        createdAt: new Date()
      },
      {
        id: '3',
        title: 'Practice coding problem',
        description: 'Solve one medium-level algorithm problem',
        estimatedTime: 30,
        completed: false,
        category: 'skill-building',
        createdAt: new Date()
      }
    ]);
  }, []);

  const generateNewTasks = async () => {
    // TODO: Call AI service to generate personalized career tasks
    // Mock implementation for now
    const newTasks: CareerTask[] = [
      {
        id: Date.now().toString(),
        title: 'Explore React Native documentation',
        description: 'Read the getting started guide for mobile development',
        estimatedTime: 25,
        completed: false,
        category: 'skill-building',
        createdAt: new Date()
      },
      {
        id: (Date.now() + 1).toString(),
        title: 'Research tech companies in your area',
        description: 'Find 3 companies that align with your interests',
        estimatedTime: 20,
        completed: false,
        category: 'exploration',
        createdAt: new Date()
      }
    ];

    setCareerTasks(prev => [...newTasks, ...prev]);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setCareerTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    // TODO: Update in API
  };

  const getCategoryColor = (category: CareerTask['category']) => {
    switch (category) {
      case 'skill-building': return '#4a90e2';
      case 'exploration': return '#28a745';
      case 'networking': return '#ffc107';
      case 'portfolio': return '#6f42c1';
      default: return '#6c757d';
    }
  };

  const getCategoryIcon = (category: CareerTask['category']) => {
    switch (category) {
      case 'skill-building': return '🛠️';
      case 'exploration': return '🔍';
      case 'networking': return '🤝';
      case 'portfolio': return '📁';
      default: return '📋';
    }
  };

  const activeTasks = careerTasks.filter(task => !task.completed);
  const completedTasks = careerTasks.filter(task => task.completed);

  return (
    <div>
      <div className="card">
        <h1>Career Readiness</h1>
        <p>Small, manageable steps toward your career goals. No pressure, just gentle progress.</p>
      </div>

      <div className="card">
        <h2>Your Career Context</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <h3>Degree Program</h3>
            <p>{userProfile.degree}</p>
          </div>
          <div>
            <h3>Career Interests</h3>
            <div>
              {userProfile.interests.map(interest => (
                <span 
                  key={interest}
                  style={{ 
                    display: 'inline-block', 
                    background: '#e9ecef', 
                    padding: '0.25rem 0.5rem', 
                    margin: '0.25rem', 
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>This Week's Micro-Tasks</h2>
          <button className="btn btn-primary" onClick={generateNewTasks}>
            Get New Suggestions
          </button>
        </div>
        
        {activeTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
            <p>No active career tasks. Click "Get New Suggestions" for personalized micro-tasks!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {activeTasks.map(task => (
              <div 
                key={task.id}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem', 
                  background: '#f8f9fa', 
                  borderRadius: '4px',
                  borderLeft: `4px solid ${getCategoryColor(task.category)}`
                }}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id)}
                  style={{ marginRight: '1rem', transform: 'scale(1.2)' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span>{getCategoryIcon(task.category)}</span>
                    <h3 style={{ margin: 0 }}>{task.title}</h3>
                    <span style={{ 
                      fontSize: '0.8rem', 
                      color: '#6c757d',
                      background: '#e9ecef',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px'
                    }}>
                      {task.estimatedTime} min
                    </span>
                  </div>
                  <p style={{ color: '#6c757d', margin: '0 0 0.5rem 0' }}>
                    {task.description}
                  </p>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    padding: '0.25rem 0.5rem', 
                    background: getCategoryColor(task.category),
                    color: 'white',
                    borderRadius: '4px',
                    textTransform: 'capitalize'
                  }}>
                    {task.category.replace('-', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {completedTasks.length > 0 && (
        <div className="card">
          <h2>Completed This Week ({completedTasks.length})</h2>
          <p style={{ color: '#6c757d', marginBottom: '1rem' }}>
            Great progress! Every small step builds toward your career goals.
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
                <span>{getCategoryIcon(task.category)}</span>
                <span style={{ marginLeft: '0.5rem' }}>{task.title}</span>
                <span style={{ 
                  marginLeft: 'auto',
                  fontSize: '0.8rem', 
                  color: '#6c757d' 
                }}>
                  {task.estimatedTime} min
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2>Career Development Areas</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div style={{ 
            padding: '1rem', 
            background: '#e7f3ff', 
            borderRadius: '4px',
            borderLeft: `4px solid ${getCategoryColor('skill-building')}`
          }}>
            <h3>🛠️ Skill Building</h3>
            <p style={{ fontSize: '0.9rem', color: '#6c757d' }}>
              Develop technical and soft skills relevant to your field
            </p>
            <ul style={{ fontSize: '0.9rem' }}>
              <li>Practice coding challenges</li>
              <li>Learn new frameworks</li>
              <li>Take online courses</li>
            </ul>
          </div>
          
          <div style={{ 
            padding: '1rem', 
            background: '#f0f9ff', 
            borderRadius: '4px',
            borderLeft: `4px solid ${getCategoryColor('exploration')}`
          }}>
            <h3>🔍 Career Exploration</h3>
            <p style={{ fontSize: '0.9rem', color: '#6c757d' }}>
              Research industries, companies, and career paths
            </p>
            <ul style={{ fontSize: '0.9rem' }}>
              <li>Industry trend research</li>
              <li>Company culture exploration</li>
              <li>Role requirement analysis</li>
            </ul>
          </div>
          
          <div style={{ 
            padding: '1rem', 
            background: '#fff9e6', 
            borderRadius: '4px',
            borderLeft: `4px solid ${getCategoryColor('networking')}`
          }}>
            <h3>🤝 Professional Networking</h3>
            <p style={{ fontSize: '0.9rem', color: '#6c757d' }}>
              Build meaningful professional relationships
            </p>
            <ul style={{ fontSize: '0.9rem' }}>
              <li>LinkedIn engagement</li>
              <li>Professional events</li>
              <li>Informational interviews</li>
            </ul>
          </div>
          
          <div style={{ 
            padding: '1rem', 
            background: '#f8f0ff', 
            borderRadius: '4px',
            borderLeft: `4px solid ${getCategoryColor('portfolio')}`
          }}>
            <h3>📁 Portfolio Development</h3>
            <p style={{ fontSize: '0.9rem', color: '#6c757d' }}>
              Showcase your skills and experiences
            </p>
            <ul style={{ fontSize: '0.9rem' }}>
              <li>Project documentation</li>
              <li>Resume updates</li>
              <li>Online presence</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Career Readiness Tips</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #e9ecef' }}>
            🌱 Focus on consistent small actions rather than overwhelming goals
          </li>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #e9ecef' }}>
            📚 Connect your academic learning to real-world applications
          </li>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #e9ecef' }}>
            🤝 Build relationships authentically, not just for career gain
          </li>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #e9ecef' }}>
            💡 Stay curious about emerging trends in your field
          </li>
          <li style={{ padding: '0.5rem 0' }}>
            ✨ Remember: Career development is a marathon, not a sprint
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Career;