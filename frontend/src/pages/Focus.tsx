import React, { useState, useEffect } from 'react';

interface FocusSession {
  id: string;
  duration: number; // in minutes
  type: 'study' | 'break' | 'deep-work';
  startTime: Date;
  endTime?: Date;
  completed: boolean;
}

const Focus: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<'study' | 'break' | 'deep-work'>('study');
  const [duration, setDuration] = useState(25);
  const [screenTimeToday, setScreenTimeToday] = useState(0);
  const [screenTimeLimit, setScreenTimeLimit] = useState(480); // 8 hours in minutes

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            handleSessionComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining]);

  useEffect(() => {
    // TODO: Fetch today's screen time from API or device
    // Mock data for now
    setScreenTimeToday(320); // 5 hours 20 minutes
  }, []);

  const startSession = () => {
    const session: FocusSession = {
      id: Date.now().toString(),
      duration,
      type: sessionType,
      startTime: new Date(),
      completed: false
    };

    setCurrentSession(session);
    setTimeRemaining(duration * 60); // Convert to seconds
    setIsActive(true);
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const resumeSession = () => {
    setIsActive(true);
  };

  const stopSession = () => {
    if (currentSession) {
      const completedSession = {
        ...currentSession,
        endTime: new Date(),
        completed: false // Manually stopped
      };
      // TODO: Save session to API
      console.log('Session stopped:', completedSession);
    }
    
    setCurrentSession(null);
    setIsActive(false);
    setTimeRemaining(0);
  };

  const handleSessionComplete = () => {
    if (currentSession) {
      const completedSession = {
        ...currentSession,
        endTime: new Date(),
        completed: true
      };
      // TODO: Save session to API
      console.log('Session completed:', completedSession);
    }

    setCurrentSession(null);
    setIsActive(false);
    setTimeRemaining(0);

    // Show gentle completion message
    alert(`${sessionType} session completed! Take a moment to appreciate your focus.`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getScreenTimeStatus = () => {
    const percentage = (screenTimeToday / screenTimeLimit) * 100;
    if (percentage < 70) return { color: '#28a745', message: 'Healthy usage' };
    if (percentage < 90) return { color: '#ffc107', message: 'Approaching limit' };
    return { color: '#dc3545', message: 'Consider taking a break' };
  };

  const screenTimeStatus = getScreenTimeStatus();

  return (
    <div>
      <div className="card">
        <h1>Focus & Screen Discipline</h1>
        <p>Gentle focus sessions and mindful screen time awareness.</p>
      </div>

      {/* Screen Time Awareness */}
      <div className="card">
        <h2>Today's Screen Time</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ 
              background: '#e9ecef', 
              borderRadius: '10px', 
              height: '20px', 
              overflow: 'hidden' 
            }}>
              <div 
                style={{ 
                  background: screenTimeStatus.color,
                  height: '100%',
                  width: `${Math.min((screenTimeToday / screenTimeLimit) * 100, 100)}%`,
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>
          <div style={{ minWidth: '120px', textAlign: 'right' }}>
            <strong>{formatMinutes(screenTimeToday)}</strong> / {formatMinutes(screenTimeLimit)}
          </div>
        </div>
        <p style={{ color: screenTimeStatus.color, margin: 0 }}>
          {screenTimeStatus.message}
        </p>
        {screenTimeToday > screenTimeLimit * 0.8 && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff3cd', borderRadius: '4px' }}>
            <p style={{ margin: 0 }}>
              💙 You've been online for a while. Consider taking a break, going for a walk, or doing something offline.
            </p>
          </div>
        )}
      </div>

      {/* Focus Timer */}
      <div className="card">
        <h2>Focus Timer</h2>
        
        {!currentSession ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <label className="form-label">Session Type</label>
                <select
                  className="form-select"
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value as any)}
                >
                  <option value="study">Study Session</option>
                  <option value="deep-work">Deep Work</option>
                  <option value="break">Break Time</option>
                </select>
              </div>
              <div>
                <label className="form-label">Duration (minutes)</label>
                <select
                  className="form-select"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                >
                  <option value={15}>15 minutes</option>
                  <option value={25}>25 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                </select>
              </div>
            </div>
            
            <div className="text-center">
              <button className="btn btn-primary" onClick={startSession}>
                Start {sessionType} Session
              </button>
            </div>
          </div>
        ) : (
          <div className="focus-timer">
            <div className="timer-display">
              {formatTime(timeRemaining)}
            </div>
            <p style={{ textTransform: 'capitalize', marginBottom: '2rem' }}>
              {currentSession.type.replace('-', ' ')} Session
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              {isActive ? (
                <button className="btn btn-secondary" onClick={pauseSession}>
                  Pause
                </button>
              ) : (
                <button className="btn btn-primary" onClick={resumeSession}>
                  Resume
                </button>
              )}
              <button className="btn btn-danger" onClick={stopSession}>
                Stop
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Focus Tips */}
      <div className="card">
        <h2>Gentle Focus Tips</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #e9ecef' }}>
            🌱 Start with shorter sessions and gradually increase duration
          </li>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #e9ecef' }}>
            💧 Keep water nearby and stay hydrated
          </li>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #e9ecef' }}>
            📱 Put your phone in another room or use focus mode
          </li>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #e9ecef' }}>
            🎵 Try instrumental music or nature sounds
          </li>
          <li style={{ padding: '0.5rem 0' }}>
            ✨ Remember: Perfect focus isn't the goal, consistent effort is
          </li>
        </ul>
      </div>

      {/* Screen Time Settings */}
      <div className="card">
        <h2>Screen Time Settings</h2>
        <div className="form-group">
          <label className="form-label">Daily Screen Time Goal (hours)</label>
          <input
            type="range"
            min="4"
            max="12"
            step="0.5"
            value={screenTimeLimit / 60}
            onChange={(e) => setScreenTimeLimit(parseFloat(e.target.value) * 60)}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#6c757d' }}>
            <span>4h</span>
            <span>{formatMinutes(screenTimeLimit)}</span>
            <span>12h</span>
          </div>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#6c757d' }}>
          This is a gentle reminder, not a strict limit. Adjust based on your needs and circumstances.
        </p>
      </div>
    </div>
  );
};

export default Focus;