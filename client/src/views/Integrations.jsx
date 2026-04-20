import React from 'react';

const Integrations = () => {
  return (
    <div className="view-section">
      <h2 className="fw-bold mb-2">Workspace Integrations</h2>
      <p className="text-muted small mb-5">Connect your architectural toolkit.</p>
      <div className="alert alert-light border-0 shadow-sm rounded-4 p-5 text-center bg-white">
        <i className="bi bi-patch-check fs-1 text-muted mb-3 d-block"></i>
        <h4 className="fw-bold">Integrations Coming Soon</h4>
        <p className="text-muted">We are optimizing connectors for Slack, Google Drive, and more.</p>
      </div>
    </div>
  );
};

export default Integrations;
