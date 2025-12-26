import React, { useState, useEffect } from 'react';

interface StressLog {
  id: string;
  date: Date;
  mood: number; // 1-5 scale
  fatigue: number; // 1-5 scale
  studyDuration: number; // hours
  stressFactors: string[];
  notes: string;
}

const Stress: React.FC = () => {
  const [stressLogs, setStressLogs] = useState<StressLog[]>([]);
  const [todaysLog, setTodaysLog] = useState<Partial<StressLog>>({
    mood: 3,
    fatigue: 3,
    studyDuration: 0,
    stressFactors: [],
    notes: ''
  });
  const [hasLoggedToday, setHasLoggedToday] = useState(false);

  const stressFactorOptions = [
    'Academic workload',
    'Exam pressure',
    'Financial concerns',
    'Social relationships',
    'Sleep issues',
    'Health concerns',
    'Time management',
    'Career uncertainty',
    'Family expectations',
    'Technology/screen time'
  ];

  useEffect(() => {
    // TODO: Fetch stress logs from API
    // Mock data for now
    const mockLogs: StressLog[] = [
      {
        id: '1',
        date: new Date(Date.now() - 86400000), // Yesterday
        mood: 3,
        fatigue: 4,
        studyDuration: 6,
        stressFactors: ['Academic workload', 'Sleep issues'],
        notes: 'Long study session, felt tired'
      },
      {
        id: '2',
        date: new Date(Date.now() - 172800000), // 2 days ago
        mood: 4,
        fatigue: 2,
        studyDuration: 4,
        stressFactors: ['Time management'],
        notes: 'Good balance today'
      }
    ];
    
    setStressLogs(mockLogs);
    
    // Check if already logged today
    const today = new Date().toDateString();
    const todayLog = mockLogs.find(log => log.date.toDateString() === today);
    setHasLoggedToday(!!todayLog);
    
    if (todayLog) {
      setTodaysLog(todayLog);
    }
  }, []);

  const handleSubmitLog = async () => {
    const log: StressLog = {
      id: Date.now().toString(),
      date: new Date(),
      mood: todaysLog.mood || 3,
      fatigue: todaysLog.fatigue || 3,
      studyDuration: todaysLog.studyDuration || 0,
      stressFactors: todaysLog.stressFactors || [],
      notes: todaysLog.notes || ''
    };

    // TODO: Save to API
    setStressLogs(prev => [log, ...prev]);
    setHasLoggedToday(true);
  };

  const toggleStressFactor = (factor: string) => {
    setTodaysLog(prev => ({
      ...prev,
      stressFactors: prev.stressFactors?.includes(factor)
        ? prev.stressFactors.filter(f => f !== factor)
        : [...(prev.stressFactors || []), factor]
    }));
  };

  const getMoodEmoji = (mood: number) => {
    const emojis = ['😢', '😕', '😐', '🙂', '😊'];
    return emojis[mood - 1] || '😐';
  };

  const getFatigueLevel = (fatigue: number) => {
    const levels = ['Very energetic', 'Energetic', 'Neutral', 'Tired', 'Exhausted'];
    return levels[fatigue - 1] || 'Neutral';
  };

  const getOverloadWarning = () => {
    if (!todaysLog.studyDuration || !todaysLog.fatigue || !todaysLog.mood) return null;
    
    const isOverloaded = 
      todaysLog.studyDuration > 8 || 
      todaysLog.fatigue >= 4 || 
      todaysLog.mood <= 2 ||
      (todaysLog.stressFactors?.length || 0) >= 3;

    if (isOverloaded) {
      return {
        level: 'warning',
        message: 'You might be experiencing some overload. Consider taking breaks and being gentle with yourself.',
        suggestions: [
          'Take a 15-minute walk outside',
          'Practice deep breathing or meditation',
          'Reduce today\'s study goals',
          'Connect with a friend or family member',
          'Engage in a hobby you enjoy'
        ]
      };
    }

    return null;
  };

  const overloadWarning = getOverloadWarning();

  return (
    <div>
      <div className="card">
        <h1>Well-being Check-in</h1>
        <p>A gentle space to reflect on your mental and emotional state. This is for awareness, not medical diagnosis.</p>
        <div style={{ 
          background: '#e7f3ff', 
          padding: '1rem', 
          borderRadius: '4px', 
          marginTop: '1rem' 
        }}>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Important:</strong> This tool is for self-awareness only. If you're experiencing persistent mental health concerns, please reach out to qualified professionals, counselors, or support services.
          </p>
        </div>
      </div>

      {!hasLoggedToday ? (
        <div className="card">
          <h2>Today's Check-in</h2>
          
          <div className="form-group">
            <label className="form-label">How are you feeling today? (1-5)</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', margin: '1rem 0' }}>
              {[1, 2, 3, 4, 5].map(value => (
                <button
                  key={value}
                  onClick={() => setTodaysLog(prev => ({ ...prev, mood: value }))}
                  style={{
                    padding: '0.5rem 1rem',
                    border: todaysLog.mood === value ? '2px solid #4a90e2' : '1px solid #ced4da',
                    borderRadius: '4px',
                    background: todaysLog.mood === value ? '#e7f3ff' : 'white',
                    cursor: 'pointer',
                    fontSize: '1.5rem'
                  }}
                >
                  {getMoodEmoji(value)}
                </button>
              ))}
            </div>
            <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
              Current: {getMoodEmoji(todaysLog.mood || 3)} {todaysLog.mood}/5
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Energy level today? (1-5)</label>
            <input
              type="range"
              min="1"
              max="5"
              value={todaysLog.fatigue || 3}
              onChange={(e) => setTodaysLog(prev => ({ ...prev, fatigue: parseInt(e.target.value) }))}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#6c757d' }}>
              <span>Very energetic</span>
              <span>{getFatigueLevel(todaysLog.fatigue || 3)}</span>
              <span>Exhausted</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Study duration today (hours)</label>
            <input
              type="number"
              className="form-input"
              min="0"
              max="16"
              step="0.5"
              value={todaysLog.studyDuration || 0}
              onChange={(e) => setTodaysLog(prev => ({ ...prev, studyDuration: parseFloat(e.target.value) }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">What's contributing to stress today? (select all that apply)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '1rem' }}>
              {stressFactorOptions.map(factor => (
                <label key={factor} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={todaysLog.stressFactors?.includes(factor) || false}
                    onChange={() => toggleStressFactor(factor)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span style={{ fontSize: '0.9rem' }}>{factor}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Additional notes (optional)</label>
            <textarea
              className="form-textarea"
              value={todaysLog.notes || ''}
              onChange={(e) => setTodaysLog(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="How are you feeling? Any thoughts or observations about your day..."
            />
          </div>

          <button className="btn btn-primary" onClick={handleSubmitLog}>
            Save Today's Check-in
          </button>
        </div>
      ) : (
        <div className="card">
          <h2>Today's Check-in Complete</h2>
          <p>Thank you for taking time to check in with yourself today.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {getMoodEmoji(todaysLog.mood || 3)}
              </div>
              <p style={{ margin: 0 }}>Mood: {todaysLog.mood}/5</p>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚡</div>
              <p style={{ margin: 0 }}>Energy: {todaysLog.fatigue}/5</p>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📚</div>
              <p style={{ margin: 0 }}>Study: {todaysLog.studyDuration}h</p>
            </div>
          </div>
        </div>
      )}

      {overloadWarning && (
        <div className="card" style={{ borderLeft: '4px solid #ffc107' }}>
          <h2>Gentle Reminder</h2>
          <p>{overloadWarning.message}</p>
          <h3>Consider trying:</h3>
          <ul>
            {overloadWarning.suggestions.map((suggestion, index) => (
              <li key={index} style={{ marginBottom: '0.5rem' }}>{suggestion}</li>
            ))}
          </ul>
          <p style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '1rem' }}>
            Remember: Taking care of yourself isn't selfish, it's necessary.
          </p>
        </div>
      )}

      <div className="card">
        <h2>Well-being Patterns</h2>
        <p style={{ color: '#6c757d', marginBottom: '1rem' }}>
          Understanding your patterns can help you make gentle adjustments.
        </p>
        
        {stressLogs.length === 0 ? (
          <p>Start logging your daily check-ins to see patterns over time.</p>
        ) : (
          <div>
            <h3>Recent Check-ins</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {stressLogs.slice(0, 7).map(log => (
                <div 
                  key={log.id}
                  style={{ 
                    padding: '1rem', 
                    background: '#f8f9fa', 
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      {log.date.toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                      Mood: {getMoodEmoji(log.mood)} {log.mood}/5 • 
                      Energy: {log.fatigue}/5 • 
                      Study: {log.studyDuration}h
                    </div>
                    {log.stressFactors.length > 0 && (
                      <div style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '0.25rem' }}>
                        Stress factors: {log.stressFactors.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h2>Self-Care Resources</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#e7f3ff', borderRadius: '4px' }}>
            <h3>🧘 Mindfulness</h3>
            <ul style={{ fontSize: '0.9rem' }}>
              <li>5-minute breathing exercises</li>
              <li>Body scan meditation</li>
              <li>Mindful walking</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', background: '#f0f9ff', borderRadius: '4px' }}>
            <h3>🏃 Physical Care</h3>
            <ul style={{ fontSize: '0.9rem' }}>
              <li>Regular sleep schedule</li>
              <li>Light exercise or stretching</li>
              <li>Proper hydration</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', background: '#f0fff4', borderRadius: '4px' }}>
            <h3>🤝 Social Support</h3>
            <ul style={{ fontSize: '0.9rem' }}>
              <li>Connect with friends/family</li>
              <li>Join study groups</li>
              <li>Campus counseling services</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stress;