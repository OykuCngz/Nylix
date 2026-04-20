import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tasks = ({ type, showNotification }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const resp = await axios.get('/api/todos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let filtered = resp.data;
      if (type === 'completed') filtered = resp.data.filter(t => t.status === 'completed');
      else if (type === 'today') filtered = resp.data.filter(t => t.status !== 'completed'); // Simplified logic
      
      setTasks(filtered);
    } catch (err) {
      console.error('Fetch tasks error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [type]);

  const toggleTask = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      await axios.put(`/api/todos/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
      showNotification(`Task marked as ${newStatus}.`, 'success');
    } catch (err) {
      console.error('Toggle task error', err);
    }
  };

  const getSubTitle = () => {
    switch(type) {
      case 'inbox': return 'Capture everything, organize later.';
      case 'today': return 'Focus on what matters most today.';
      case 'upcoming': return 'Plan for your future self.';
      case 'completed': return 'Review your documented successes.';
      default: return '';
    }
  };

  return (
    <div className="view-section pb-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="display-4 fw-bold mb-1 text-primary-blue" style={{ letterSpacing: '-0.03em' }}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </h1>
          <p className="text-muted fs-5">{getSubTitle()}</p>
        </div>
        <button className="btn px-4 py-2 border-0 rounded-3 fw-bold shadow-sm" style={{ backgroundColor: '#f0f1f5' }}>
          <i className="bi bi-trash3-fill me-2" style={{ color: '#3b2ef3' }}></i> Clean Up
        </button>
      </div>
      
      <div className="card border-0 shadow-sm rounded-4 mb-4 bg-white" style={{ cursor: 'pointer' }}>
        <div className="card-body p-4 d-flex align-items-center justify-content-between">
          <span className="text-muted fw-semibold fs-5" style={{ opacity: 0.6 }}>What is the next intention?</span>
          <div className="d-flex gap-4 text-muted fs-5" style={{ opacity: 0.6 }}>
            <i className="bi bi-calendar"></i>
            <i className="bi bi-tag-fill"></i>
            <i className="bi bi-flag-fill"></i>
          </div>
        </div>
      </div>

      <div className="d-flex flex-column gap-3">
        {loading ? (
          <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>
        ) : tasks.length === 0 ? (
          <div className="text-center p-5 text-muted">
            <i className="bi bi-inbox fs-1 mb-3 d-block opacity-25"></i>
            <p className="fw-bold fs-5">Your architectural queue is clear.</p>
          </div>
        ) : (
          tasks.map(task => (
            <div key={task._id} className="card border-0 shadow-sm rounded-4 bg-white">
              <div className="card-body p-4 d-flex align-items-start gap-4">
                <div 
                  className={`rounded d-flex align-items-center justify-content-center shadow-sm cursor-pointer ${task.status === 'completed' ? 'bg-primary-blue' : 'bg-white'}`}
                  style={{ width: '24px', height: '24px', border: '2px solid var(--primary-blue)' }}
                  onClick={() => toggleTask(task._id, task.status)}
                >
                  {task.status === 'completed' && <i className="bi bi-check text-white fs-5"></i>}
                </div>
                <div>
                  <h5 className={`fw-bold mb-0 text-dark ${task.status === 'completed' ? 'opacity-50 text-decoration-line-through' : ''}`}>
                    {task.title}
                  </h5>
                  <div className="d-flex align-items-center gap-3 mt-2">
                    <span className="badge rounded-pill bg-primary-soft text-primary-blue px-3 py-1 fw-bold smallest">#INTENT</span>
                    <span className="text-muted smallest fw-semibold d-flex align-items-center gap-1">
                      <i className="bi bi-clock-fill opacity-50"></i> {task.startDate ? new Date(task.startDate).toLocaleDateString() : 'Added recently'}
                    </span>
                    {task.priority !== 'low' && (
                      <span className="text-muted smallest fw-semibold d-flex align-items-center gap-1 mx-2 border-start ps-3">
                         <i className="bi bi-flag-fill text-danger"></i> {task.priority.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;
