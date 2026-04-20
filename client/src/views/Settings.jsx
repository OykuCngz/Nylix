import React from 'react';

const Settings = ({ subView }) => {
  return (
    <div className="view-section">
      <h2 className="fw-bold mb-2">Architectural Settings</h2>
      <p className="text-muted small mb-5">Manage your identity and workspace preferences.</p>
      
      <div className="card border-0 shadow-sm rounded-4 p-5 mb-4 bg-white">
        <h5 className="fw-bold mb-4">Account Profile</h5>
        <div className="d-flex align-items-center gap-4 mb-4">
          <img src="https://i.pravatar.cc/150?u=antigravity" className="rounded-4" style={{ width: '80px', height: '80px' }} alt="Avatar" />
          <div>
            <button className="btn btn-outline-secondary btn-sm fw-bold">Change Portrait</button>
          </div>
        </div>
        <div className="row g-4">
          <div className="col-md-6">
            <label className="smallest fw-bold text-uppercase ls-1 text-muted mb-2">Display Name</label>
            <input type="text" className="form-control py-3 bg-light border-0 rounded-3" defaultValue="Julian Sterling" />
          </div>
          <div className="col-md-6">
            <label className="smallest fw-bold text-uppercase ls-1 text-muted mb-2">Primary Email</label>
            <input type="email" className="form-control py-3 bg-light border-0 rounded-3" defaultValue="julian@architect.io" readOnly />
          </div>
        </div>
        <button className="btn px-4 py-2 mt-4 text-white fw-bold" style={{ backgroundColor: '#03045e' }}>Update Profile</button>
      </div>
    </div>
  );
};

export default Settings;
