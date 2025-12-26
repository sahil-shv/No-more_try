import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { instance, accounts } = useMsal();
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogin = () => {
    instance.loginPopup().catch(e => {
      console.error('Login failed:', e);
    });
  };
  
  const handleLogout = () => {
    instance.logoutPopup().catch(e => {
      console.error('Logout failed:', e);
    });
  };

  return (
    <nav className="nav">
      <div className="container">
        <ul className="nav-list">
          <li>
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>
              Profile
            </Link>
          </li>
          <li>
            <Link to="/goals" className={`nav-link ${isActive('/goals') ? 'active' : ''}`}>
              Goals
            </Link>
          </li>
          <li>
            <Link to="/habits" className={`nav-link ${isActive('/habits') ? 'active' : ''}`}>
              Habits
            </Link>
          </li>
          <li>
            <Link to="/tasks" className={`nav-link ${isActive('/tasks') ? 'active' : ''}`}>
              Tasks
            </Link>
          </li>
          <li>
            <Link to="/focus" className={`nav-link ${isActive('/focus') ? 'active' : ''}`}>
              Focus
            </Link>
          </li>
          <li>
            <Link to="/stress" className={`nav-link ${isActive('/stress') ? 'active' : ''}`}>
              Well-being
            </Link>
          </li>
          <li>
            <Link to="/ai" className={`nav-link ${isActive('/ai') ? 'active' : ''}`}>
              AI Assistant
            </Link>
          </li>
          <li>
            <Link to="/hobbies" className={`nav-link ${isActive('/hobbies') ? 'active' : ''}`}>
              Hobbies
            </Link>
          </li>
          <li>
            <Link to="/reflection" className={`nav-link ${isActive('/reflection') ? 'active' : ''}`}>
              Reflection
            </Link>
          </li>
          <li>
            {accounts.length > 0 ? (
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            ) : (
              <button onClick={handleLogin} className="btn btn-primary">
                Login
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;