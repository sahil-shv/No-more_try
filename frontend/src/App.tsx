import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Goals from './pages/Goals';
import Habits from './pages/Habits';
import Tasks from './pages/Tasks';
import Focus from './pages/Focus';
import Stress from './pages/Stress';
import AIAssistant from './pages/AIAssistant';
import Career from './pages/Career';
import Finance from './pages/Finance';
import Hobbies from './pages/Hobbies';
import Reflection from './pages/Reflection';

// Azure AD B2C configuration
const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_AD_B2C_CLIENT_ID || '',
    authority: `https://${process.env.REACT_APP_AZURE_AD_B2C_TENANT_NAME}.b2clogin.com/${process.env.REACT_APP_AZURE_AD_B2C_TENANT_NAME}.onmicrosoft.com/${process.env.REACT_APP_AZURE_AD_B2C_POLICY_NAME}`,
    knownAuthorities: [`${process.env.REACT_APP_AZURE_AD_B2C_TENANT_NAME}.b2clogin.com`],
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <Router>
        <div className="App">
          <Navigation />
          <div className="container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/habits" element={<Habits />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/focus" element={<Focus />} />
              <Route path="/stress" element={<Stress />} />
              <Route path="/ai" element={<AIAssistant />} />
              <Route path="/career" element={<Career />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/hobbies" element={<Hobbies />} />
              <Route path="/reflection" element={<Reflection />} />
            </Routes>
          </div>
        </div>
      </Router>
    </MsalProvider>
  );
}

export default App;