import React, { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';

interface StudentProfile {
  degree: string;
  year: string;
  subjects: string[];
  energyPreference: 'morning' | 'afternoon' | 'evening';
  careerInterests: string[];
  financialStressLevel: number;
  hobbies: string[];
}

const Profile: React.FC = () => {
  const { accounts } = useMsal();
  const [profile, setProfile] = useState<StudentProfile>({
    degree: '',
    year: '',
    subjects: [],
    energyPreference: 'morning',
    careerInterests: [],
    financialStressLevel: 1,
    hobbies: []
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // TODO: Fetch profile from API
    // Mock data for now
    setProfile({
      degree: 'Computer Science',
      year: '3rd Year',
      subjects: ['Data Structures', 'Machine Learning', 'Web Development'],
      energyPreference: 'morning',
      careerInterests: ['Software Development', 'AI Research'],
      financialStressLevel: 2,
      hobbies: ['Reading', 'Photography']
    });
  }, []);

  const handleSave = async () => {
    // TODO: Save profile to API
    console.log('Saving profile:', profile);
    setIsEditing(false);
  };

  const addSubject = (subject: string) => {
    if (subject && !profile.subjects.includes(subject)) {
      setProfile(prev => ({
        ...prev,
        subjects: [...prev.subjects, subject]
      }));
    }
  };

  const removeSubject = (subject: string) => {
    setProfile(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subject)
    }));
  };

  if (accounts.length === 0) {
    return (
      <div className="card text-center">
        <h2>Please log in to view your profile</h2>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Student Profile</h1>
          <button 
            className="btn btn-primary"
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>
        <p>This information helps personalize your experience without being intrusive.</p>
      </div>

      <div className="card">
        <h2>Academic Information</h2>
        <div className="form-group">
          <label className="form-label">Degree Program</label>
          {isEditing ? (
            <input
              type="text"
              className="form-input"
              value={profile.degree}
              onChange={(e) => setProfile(prev => ({ ...prev, degree: e.target.value }))}
            />
          ) : (
            <p>{profile.degree || 'Not specified'}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Year of Study</label>
          {isEditing ? (
            <select
              className="form-select"
              value={profile.year}
              onChange={(e) => setProfile(prev => ({ ...prev, year: e.target.value }))}
            >
              <option value="">Select year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Graduate">Graduate</option>
            </select>
          ) : (
            <p>{profile.year || 'Not specified'}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Current Subjects</label>
          <div>
            {profile.subjects.map(subject => (
              <span 
                key={subject}
                style={{ 
                  display: 'inline-block', 
                  background: '#e9ecef', 
                  padding: '0.25rem 0.5rem', 
                  margin: '0.25rem', 
                  borderRadius: '4px' 
                }}
              >
                {subject}
                {isEditing && (
                  <button 
                    onClick={() => removeSubject(subject)}
                    style={{ marginLeft: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
          {isEditing && (
            <input
              type="text"
              className="form-input mt-2"
              placeholder="Add a subject and press Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addSubject(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
          )}
        </div>
      </div>

      <div className="card">
        <h2>Personal Preferences</h2>
        <div className="form-group">
          <label className="form-label">Energy Peak Time</label>
          {isEditing ? (
            <select
              className="form-select"
              value={profile.energyPreference}
              onChange={(e) => setProfile(prev => ({ 
                ...prev, 
                energyPreference: e.target.value as 'morning' | 'afternoon' | 'evening' 
              }))}
            >
              <option value="morning">Morning Person</option>
              <option value="afternoon">Afternoon Peak</option>
              <option value="evening">Evening Energy</option>
            </select>
          ) : (
            <p>{profile.energyPreference === 'morning' ? 'Morning Person' : 
                profile.energyPreference === 'afternoon' ? 'Afternoon Peak' : 'Evening Energy'}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Financial Stress Awareness (1-5)</label>
          <p style={{ fontSize: '0.9rem', color: '#6c757d' }}>
            This helps us understand your context, not provide financial advice.
          </p>
          {isEditing ? (
            <input
              type="range"
              min="1"
              max="5"
              value={profile.financialStressLevel}
              onChange={(e) => setProfile(prev => ({ 
                ...prev, 
                financialStressLevel: parseInt(e.target.value) 
              }))}
            />
          ) : (
            <p>{profile.financialStressLevel}/5</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;