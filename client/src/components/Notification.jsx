import React, { useEffect } from 'react';

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch(type) {
      case 'success': return 'bi-check-circle-fill text-success';
      case 'error': return 'bi-exclamation-triangle-fill text-danger';
      default: return 'bi-info-circle-fill text-primary-blue';
    }
  };

  return (
    <div className="notification-toast position-fixed bottom-0 end-0 m-5 p-4 bg-white shadow-lg rounded-4 border-0 d-flex align-items-center gap-3 animate-slide-up" style={{ zIndex: 10000, minWidth: '320px' }}>
      <div className="fs-3">
        <i className={`bi ${getIcon()}`}></i>
      </div>
      <div>
        <h6 className="fw-bold m-0 text-dark">Architect's Note</h6>
        <p className="smallest text-muted m-0 mt-1">{message}</p>
      </div>
      <button className="btn-close ms-auto smallest" onClick={onClose}></button>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp {
          from { transform: translateY(100%) scale(0.9); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .notification-toast {
           border-left: 4px solid #03045e !important;
        }
      `}} />
    </div>
  );
};

export default Notification;
