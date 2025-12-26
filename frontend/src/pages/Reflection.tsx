import React, { useState, useEffect } from 'react';

interface WeeklyReflection {
  id: string;
  weekStartDate: Date;
  goals: {
    progress: string;
    challenges: string;
    adjustments: string;
  };
  habits: {
    consistency: string;
    insights: string;
    changes: string;
  };
  tasks: {
    completion: string;
    timeManagement: string;
    priorities: string;
  };
  stress: {
    levels: string;
    triggers: string;
    coping: string;
  };
  finance: {
    awareness: string;
    patterns: string;
    adjustments: string;
  };
  hobbies: {
    engagement: string;
    balance: string;
    joy: string;
  };
  overall: {
    highlights: string;
    learnings: string;
    nextWeek: string;
  };
  createdAt: Date;
}

const Reflection: React.FC = () => {
  const [reflections, setReflections] = useState<WeeklyReflection[]>([]);
  const [currentReflection, setCurrentReflection] = useState<Partial<WeeklyReflection>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [hasReflectedThisWeek, setHasReflectedThisWeek] = useState(false);

  const reflectionSteps = [
    { title: 'Goals', key: 'goals' },
    { title: 'Habits', key: 'habits' },
    { title: 'Tasks', key: 'tasks' },
    { title: 'Well-being', key: 'stress' },
    { title: 'Finance', key: 'finance' },
    { title: 'Hobbies', key: 'hobbies' },
    { title: 'Overall', key: 'overall' }
  ];

  useEffect(() => {
    // TODO: Fetch reflections from API
    // Check if already reflected this week
    const weekStart = getWeekStart(new Date());
    const mockReflections: WeeklyReflection[] = [
      {
        id: '1',
        weekStartDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        goals: {
          progress: 'Made good progress on ML course, started portfolio website',
          challenges: 'Time management between different goals',
          adjustments: 'Focus on one goal at a time'
        },
        habits: {
          consistency: 'Morning review was consistent, exercise less so',
          insights: 'Easier to maintain habits when linked to existing routines',
          changes: 'Will try exercising right after morning review'
        },
        tasks: {
          completion: 'Completed about 70% of planned tasks',
          timeManagement: 'Underestimated time for coding tasks',
          priorities: 'Need to be more realistic about daily capacity'
        },
        stress: {
          levels: 'Moderate stress, mostly manageable',
          triggers: 'Upcoming exams and project deadlines',
          coping: 'Walking and talking to friends helped'
        },
        finance: {
          awareness: 'Spent more on food than expected',
          patterns: 'Tend to buy expensive lunch when stressed',
          adjustments: 'Will prep meals on Sunday'
        },
        hobbies: {
          engagement: 'Took some photos, shared one post',
          balance: 'Good balance between study and creative time',
          joy: 'Photography walk was the highlight of my week'
        },
        overall: {
          highlights: 'Breakthrough moment in understanding React hooks',
          learnings: 'Small consistent actions beat sporadic intense efforts',
          nextWeek: 'Focus on exam prep while maintaining self-care'
        },
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      }
    ];
    
    setReflections(mockReflections);
    
    const thisWeekReflection = mockReflections.find(r => 
      isSameWeek(r.weekStartDate, weekStart)
    );
    setHasReflectedThisWeek(!!thisWeekReflection);
  }, []);

  const getWeekStart = (date: Date) => {
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  };

  const isSameWeek = (date1: Date, date2: Date) => {
    return getWeekStart(date1).getTime() === getWeekStart(date2).getTime();
  };

  const updateReflectionField = (section: string, field: string, value: string) => {
    setCurrentReflection(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof WeeklyReflection],
        [field]: value
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < reflectionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveReflection = async () => {
    const reflection: WeeklyReflection = {
      id: Date.now().toString(),
      weekStartDate: getWeekStart(new Date()),
      goals: currentReflection.goals || { progress: '', challenges: '', adjustments: '' },
      habits: currentReflection.habits || { consistency: '', insights: '', changes: '' },
      tasks: currentReflection.tasks || { completion: '', timeManagement: '', priorities: '' },
      stress: currentReflection.stress || { levels: '', triggers: '', coping: '' },
      finance: currentReflection.finance || { awareness: '', patterns: '', adjustments: '' },
      hobbies: currentReflection.hobbies || { engagement: '', balance: '', joy: '' },
      overall: currentReflection.overall || { highlights: '', learnings: '', nextWeek: '' },
      createdAt: new Date()
    };

    // TODO: Save to API
    setReflections(prev => [reflection, ...prev]);
    setHasReflectedThisWeek(true);
    setCurrentReflection({});
    setCurrentStep(0);
  };

  const renderStepContent = () => {
    const step = reflectionSteps[currentStep];
    const sectionData = currentReflection[step.key as keyof WeeklyReflection] as any || {};

    switch (step.key) {
      case 'goals':
        return (
          <div>
            <h3>Goals Reflection</h3>
            <div className="form-group">
              <label className="form-label">What progress did you make on your goals this week?</label>
              <textarea
                className="form-textarea"
                value={sectionData.progress || ''}
                onChange={(e) => updateReflectionField('goals', 'progress', e.target.value)}
                placeholder="Reflect on your goal progress..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">What challenges did you face?</label>
              <textarea
                className="form-textarea"
                value={sectionData.challenges || ''}
                onChange={(e) => updateReflectionField('goals', 'challenges', e.target.value)}
                placeholder="What made it difficult to work on your goals?"
              />
            </div>
            <div className="form-group">
              <label className="form-label">What adjustments would help next week?</label>
              <textarea
                className="form-textarea"
                value={sectionData.adjustments || ''}
                onChange={(e) => updateReflectionField('goals', 'adjustments', e.target.value)}
                placeholder="How can you approach your goals differently?"
              />
            </div>
          </div>
        );

      case 'habits':
        return (
          <div>
            <h3>Habits Reflection</h3>
            <div className="form-group">
              <label className="form-label">How consistent were you with your habits?</label>
              <textarea
                className="form-textarea"
                value={sectionData.consistency || ''}
                onChange={(e) => updateReflectionField('habits', 'consistency', e.target.value)}
                placeholder="Which habits went well? Which were challenging?"
              />
            </div>
            <div className="form-group">
              <label className="form-label">What insights did you gain about your habits?</label>
              <textarea
                className="form-textarea"
                value={sectionData.insights || ''}
                onChange={(e) => updateReflectionField('habits', 'insights', e.target.value)}
                placeholder="What did you learn about building habits?"
              />
            </div>
            <div className="form-group">
              <label className="form-label">What changes might help next week?</label>
              <textarea
                className="form-textarea"
                value={sectionData.changes || ''}
                onChange={(e) => updateReflectionField('habits', 'changes', e.target.value)}
                placeholder="How can you make habits easier to maintain?"
              />
            </div>
          </div>
        );

      case 'tasks':
        return (
          <div>
            <h3>Task Management Reflection</h3>
            <div className="form-group">
              <label className="form-label">How did task completion go this week?</label>
              <textarea
                className="form-textarea"
                value={sectionData.completion || ''}
                onChange={(e) => updateReflectionField('tasks', 'completion', e.target.value)}
                placeholder="What percentage of tasks did you complete? How did it feel?"
              />
            </div>
            <div className="form-group">
              <label className="form-label">How was your time management?</label>
              <textarea
                className="form-textarea"
                value={sectionData.timeManagement || ''}
                onChange={(e) => updateReflectionField('tasks', 'timeManagement', e.target.value)}
                placeholder="Did you estimate time well? What took longer than expected?"
              />
            </div>
            <div className="form-group">
              <label className="form-label">How well did you prioritize?</label>
              <textarea
                className="form-textarea"
                value={sectionData.priorities || ''}
                onChange={(e) => updateReflectionField('tasks', 'priorities', e.target.value)}
                placeholder="Did you focus on the right things? What would you change?"
              />
            </div>
          </div>
        );

      case 'stress':
        return (
          <div>
            <h3>Well-being Reflection</h3>
            <div className="form-group">
              <label className="form-label">How were your stress levels this week?</label>
              <textarea
                className="form-textarea"
                value={sectionData.levels || ''}
                onChange={(e) => updateReflectionField('stress', 'levels', e.target.value)}
                placeholder="Describe your overall well-being this week..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">What were your main stress triggers?</label>
              <textarea
                className="form-textarea"
                value={sectionData.triggers || ''}
                onChange={(e) => updateReflectionField('stress', 'triggers', e.target.value)}
                placeholder="What situations or thoughts caused stress?"
              />
            </div>
            <div className="form-group">
              <label className="form-label">What helped you cope or feel better?</label>
              <textarea
                className="form-textarea"
                value={sectionData.coping || ''}
                onChange={(e) => updateReflectionField('stress', 'coping', e.target.value)}
                placeholder="What activities, people, or strategies helped?"
              />
            </div>
          </div>
        );

      case 'finance':
        return (
          <div>
            <h3>Financial Awareness Reflection</h3>
            <div className="form-group">
              <label className="form-label">How was your spending awareness this week?</label>
              <textarea
                className="form-textarea"
                value={sectionData.awareness || ''}
                onChange={(e) => updateReflectionField('finance', 'awareness', e.target.value)}
                placeholder="Did you track expenses? Any surprises?"
              />
            </div>
            <div className="form-group">
              <label className="form-label">What spending patterns did you notice?</label>
              <textarea
                className="form-textarea"
                value={sectionData.patterns || ''}
                onChange={(e) => updateReflectionField('finance', 'patterns', e.target.value)}
                placeholder="When or why do you tend to spend more?"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Any gentle adjustments for next week?</label>
              <textarea
                className="form-textarea"
                value={sectionData.adjustments || ''}
                onChange={(e) => updateReflectionField('finance', 'adjustments', e.target.value)}
                placeholder="Small changes that might help with financial wellness?"
              />
            </div>
          </div>
        );

      case 'hobbies':
        return (
          <div>
            <h3>Hobbies & Creativity Reflection</h3>
            <div className="form-group">
              <label className="form-label">How did you engage with hobbies this week?</label>
              <textarea
                className="form-textarea"
                value={sectionData.engagement || ''}
                onChange={(e) => updateReflectionField('hobbies', 'engagement', e.target.value)}
                placeholder="What creative or hobby activities did you do?"
              />
            </div>
            <div className="form-group">
              <label className="form-label">How was the balance between study and hobbies?</label>
              <textarea
                className="form-textarea"
                value={sectionData.balance || ''}
                onChange={(e) => updateReflectionField('hobbies', 'balance', e.target.value)}
                placeholder="Did you have enough time for non-academic activities?"
              />
            </div>
            <div className="form-group">
              <label className="form-label">What brought you joy or satisfaction?</label>
              <textarea
                className="form-textarea"
                value={sectionData.joy || ''}
                onChange={(e) => updateReflectionField('hobbies', 'joy', e.target.value)}
                placeholder="What hobby moments made you feel good?"
              />
            </div>
          </div>
        );

      case 'overall':
        return (
          <div>
            <h3>Overall Week Reflection</h3>
            <div className="form-group">
              <label className="form-label">What were the highlights of your week?</label>
              <textarea
                className="form-textarea"
                value={sectionData.highlights || ''}
                onChange={(e) => updateReflectionField('overall', 'highlights', e.target.value)}
                placeholder="What moments, achievements, or experiences stood out?"
              />
            </div>
            <div className="form-group">
              <label className="form-label">What did you learn about yourself?</label>
              <textarea
                className="form-textarea"
                value={sectionData.learnings || ''}
                onChange={(e) => updateReflectionField('overall', 'learnings', e.target.value)}
                placeholder="Any insights about your patterns, preferences, or growth?"
              />
            </div>
            <div className="form-group">
              <label className="form-label">What's your gentle intention for next week?</label>
              <textarea
                className="form-textarea"
                value={sectionData.nextWeek || ''}
                onChange={(e) => updateReflectionField('overall', 'nextWeek', e.target.value)}
                placeholder="What would you like to focus on or try differently?"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (hasReflectedThisWeek) {
    return (
      <div>
        <div className="card">
          <h1>Weekly Reflection</h1>
          <div style={{ 
            background: '#d4edda', 
            padding: '1rem', 
            borderRadius: '4px', 
            marginTop: '1rem' 
          }}>
            <p style={{ margin: 0 }}>
              ✨ You've completed your reflection for this week! Thank you for taking time to reflect on your journey.
            </p>
          </div>
        </div>

        {reflections.length > 0 && (
          <div className="card">
            <h2>Recent Reflections</h2>
            {reflections.slice(0, 3).map(reflection => (
              <div 
                key={reflection.id}
                style={{ 
                  padding: '1rem', 
                  background: '#f8f9fa', 
                  borderRadius: '4px',
                  marginBottom: '1rem'
                }}
              >
                <h3>Week of {reflection.weekStartDate.toLocaleDateString()}</h3>
                <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                  <p><strong>Highlight:</strong> {reflection.overall.highlights}</p>
                  <p><strong>Learning:</strong> {reflection.overall.learnings}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h1>Weekly Reflection</h1>
        <p>A gentle space to reflect on your week and set intentions for the next one.</p>
        <div style={{ 
          background: '#e7f3ff', 
          padding: '1rem', 
          borderRadius: '4px', 
          marginTop: '1rem' 
        }}>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            Take your time with this reflection. There are no right or wrong answers - just honest self-awareness.
          </p>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Step {currentStep + 1} of {reflectionSteps.length}: {reflectionSteps[currentStep].title}</h2>
          <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
            Progress: {Math.round(((currentStep + 1) / reflectionSteps.length) * 100)}%
          </div>
        </div>

        <div style={{ 
          background: '#e9ecef', 
          borderRadius: '10px', 
          height: '8px', 
          marginBottom: '2rem' 
        }}>
          <div 
            style={{ 
              background: '#4a90e2',
              height: '100%',
              borderRadius: '10px',
              width: `${((currentStep + 1) / reflectionSteps.length) * 100}%`,
              transition: 'width 0.3s ease'
            }}
          />
        </div>

        {renderStepContent()}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <button 
            className="btn btn-secondary"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Previous
          </button>
          
          {currentStep === reflectionSteps.length - 1 ? (
            <button className="btn btn-primary" onClick={saveReflection}>
              Complete Reflection
            </button>
          ) : (
            <button className="btn btn-primary" onClick={nextStep}>
              Next
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <h2>Why Weekly Reflection?</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #e9ecef' }}>
            🌱 Builds self-awareness without judgment
          </li>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #e9ecef' }}>
            📈 Helps you notice patterns and growth over time
          </li>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #e9ecef' }}>
            🎯 Guides gentle adjustments to your approach
          </li>
          <li style={{ padding: '0.5rem 0' }}>
            💙 Creates space for celebrating progress and learning from challenges
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Reflection;