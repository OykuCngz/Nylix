import React, { useState, useEffect } from 'react';
import LandingPage from './views/LandingPage';
import Workspace from './views/Workspace';
import Auth from './views/Auth';
import VisionBoard from './views/VisionBoard';
import Notification from './components/Notification';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('landing');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [notification, setNotification] = useState(null);
  const [activeVision, setActiveVision] = useState(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    if (token) {
      setView('dashboard');
    }
  }, [token]);

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setView('landing');
  };

  return (
    <>
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
      {view === 'landing' && (
        <LandingPage 
          onEnter={() => setView('auth')} 
          onBeginJourney={() => setView('vision-board')} 
        />
      )}
      {view === 'vision-board' && (
        <VisionBoard 
          onBack={() => setView('landing')} 
          onRequireAuth={() => setView('auth')}
          showNotification={showNotification}
          navigate={setView}
          setActiveVision={setActiveVision}
        />
      )}
      {view === 'auth' && (
        <Auth onLogin={handleLogin} onBack={() => setView('landing')} />
      )}
      {(view === 'dashboard' || view === 'inbox' || view === 'today' || view === 'upcoming' || view === 'completed' || view === 'integrations' || view === 'settings' || view === 'blueprint') && (
        <Workspace 
          currentView={view} 
          setView={setView} 
          onLogout={handleLogout} 
          showNotification={showNotification}
          activeVision={activeVision}
        />
      )}
    </>
  );
}

export default App;
