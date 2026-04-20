import React from 'react';

const Sidebar = ({ currentView, setView, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid' },
    { id: 'vision-board', label: 'Vision Board', icon: 'bi-archive' },
    { id: 'projects', label: 'Projects', icon: 'bi-layers' },
    { divider: true },
    { id: 'inbox', label: 'Inbox', icon: 'bi-inbox' },
    { id: 'today', label: 'Today', icon: 'bi-sun' },
    { id: 'upcoming', label: 'Upcoming', icon: 'bi-calendar' },
    { id: 'completed', label: 'Completed', icon: 'bi-check2-circle' },
    { divider: true },
    { id: 'integrations', label: 'Integrations', icon: 'bi-patch-check' },
    { id: 'account-settings', label: 'Profile', icon: 'bi-person' },
  ];

  return (
    <div id="sidebar-wrapper" className="bg-white border-bottom h-100 py-4 d-flex flex-column" style={{ width: '280px', borderRight: '1px solid #eee' }}>
      <div className="px-4 mb-5">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-dark-blue rounded-3 p-2" style={{ backgroundColor: '#03045e' }}>
            <i className="bi bi-compass text-white fs-5"></i>
          </div>
          <div>
            <div className="fw-bold fs-5">The Architect</div>
            <div className="smallest text-muted fw-bold text-uppercase ls-1">Workspace of Intentions</div>
          </div>
        </div>
      </div>

      <div className="list-group list-group-flush px-3 flex-grow-1 overflow-y-auto">
        {menuItems.map((item, idx) => {
          if (item.divider) return <hr key={idx} className="my-2 border-secondary opacity-10" />;
          
          const isActive = currentView === item.id || (item.id === 'account-settings' && currentView === 'settings');

          return (
            <button
              key={item.id}
              className={`list-group-item list-group-item-action border-0 py-2 rounded-3 text-start d-flex align-items-center ${isActive ? 'active bg-primary-soft text-primary-blue' : 'text-muted'}`}
              onClick={() => setView(item.id)}
            >
              <i className={`bi ${item.icon} me-3`}></i>
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="px-3 mt-auto mb-4">
        <button 
          className="btn w-100 py-3 rounded-3 fw-bold text-white shadow-lg mb-4 d-flex align-items-center justify-content-center gap-2" 
          style={{ backgroundColor: '#3b2ef3' }}
        >
          <i className="bi bi-plus-lg"></i> Add Task
        </button>
        <button className="list-group-item list-group-item-action border-0 py-2 rounded-3 text-muted smallest fw-bold text-uppercase ls-1 text-start">
          <i className="bi bi-question-circle me-3"></i>Help
        </button>
        <button 
          className="list-group-item list-group-item-action border-0 py-2 rounded-3 text-muted smallest fw-bold text-uppercase ls-1 text-start"
          onClick={onLogout}
        >
          <i className="bi bi-door-open me-3"></i>Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
