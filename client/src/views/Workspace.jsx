import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Dashboard from './Dashboard';
import Tasks from './Tasks';
import Integrations from './Integrations';
import Settings from './Settings';
import VisionBoard from './VisionBoard';
import Blueprint from './Blueprint';

const Workspace = ({ onLogout, currentView, setView, showNotification, activeVision }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'vision-board': return <VisionBoard onBack={() => setView('dashboard')} showNotification={showNotification} navigate={setView} setActiveVision={setActiveVision} />;
      case 'blueprint': return <Blueprint vision={activeVision} onBack={() => setView('vision-board')} showNotification={showNotification} />;
      case 'inbox':
      case 'today':
      case 'upcoming':
      case 'completed':
        return <Tasks type={currentView} showNotification={showNotification} />;
      case 'integrations': return <Integrations />;
      case 'settings':
      case 'account-settings':
      case 'notifications-settings':
        return <Settings subView={currentView} />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="d-flex vh-100 overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        setView={setView} 
        onLogout={onLogout}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex-grow-1 vh-100 overflow-y-auto" style={{ backgroundColor: '#f4f5f8' }}>
        <Header 
          currentView={currentView} 
          setView={setView} 
          onLogout={onLogout} 
        />
        <main className="p-5">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default Workspace;
