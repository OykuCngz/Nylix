import React from 'react';

const Header = ({ currentView, setView, onLogout }) => {
  const getTitle = () => {
    switch(currentView) {
      case 'dashboard': return 'Workspace Overview';
      case 'inbox': return 'Inbox';
      case 'today': return 'Today\'s Intentions';
      case 'upcoming': return 'Upcoming Schedule';
      case 'completed': return 'Archive of Success';
      case 'integrations': return 'Workspace Integrations';
      case 'blueprint': return 'Structural Blueprint';
      case 'settings':
      case 'account-settings':
      case 'notifications-settings':
        return 'Architectural Settings';
      default: return 'The Architect';
    }
  };

  return (
    <header className="bg-white border-bottom py-3 px-5 d-flex align-items-center justify-content-between sticky-top">
      <h4 className="fw-bold m-0">{getTitle()}</h4>
      <div className="d-flex align-items-center gap-4">
        <div className="dropdown">
          <i className="bi bi-bell fs-5 text-muted cursor-pointer"></i>
        </div>
        <div className="dropdown">
          <i 
            className="bi bi-gear fs-5 text-muted cursor-pointer" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
          ></i>
          <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg mt-3 p-2 rounded-4" style={{ minWidth: '220px' }}>
            <li className="px-3 py-2 text-muted fw-bold text-uppercase ls-1 mb-2" style={{ fontSize: '10px' }}>Settings</li>
            <li>
              <button className="dropdown-item py-2 rounded-3 d-flex align-items-center gap-3" onClick={() => setView('account-settings')}>
                <i className="bi bi-person-gear text-muted"></i> Profile Settings
              </button>
            </li>
            <li>
              <button className="dropdown-item py-2 rounded-3 d-flex align-items-center gap-3">
                <i className="bi bi-palette text-muted"></i> Appearance
              </button>
            </li>
            <li>
              <button className="dropdown-item py-2 rounded-3 d-flex align-items-center gap-3" onClick={() => setView('notifications-settings')}>
                <i className="bi bi-bell text-muted"></i> Notifications
              </button>
            </li>
            <li><hr className="dropdown-divider opacity-5" /></li>
            <li>
              <button className="dropdown-item py-2 rounded-3 d-flex align-items-center gap-3 text-danger" onClick={onLogout}>
                <i className="bi bi-box-arrow-right"></i> Sign Out
              </button>
            </li>
          </ul>
        </div>
        <div className="user-avatar" style={{ width: '35px', height: '35px' }}>
          <img src="https://i.pravatar.cc/150?u=antigravity" className="w-100 rounded-circle" alt="User" />
        </div>
      </div>
    </header>
  );
};

export default Header;
