import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { AIAssistant } from './pages/AIAssistant';
import { SignIn } from './pages/SignIn';
import { WalletTracker } from './pages/WalletTracker';
import { Taskboard } from './pages/Taskboard';
import { LearnEarn } from './pages/LearnEarn';
import { Profile } from './pages/Profile';

// For demo purposes, we'll use a simple auth state
const isAuthenticated = true; // Change this to false to see the landing page

function App() {
  return (
    <Router>
      <div className="font-sans">
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
              <Route path="/ai-assistant" element={<Layout><AIAssistant /></Layout>} />
              <Route path="/wallet-tracker" element={<Layout><WalletTracker /></Layout>} />
              <Route path="/taskboard" element={<Layout><Taskboard /></Layout>} />
              <Route path="/learn-earn" element={<Layout><LearnEarn /></Layout>} />
              <Route path="/profile" element={<Layout><Profile /></Layout>} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;