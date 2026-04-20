import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState({ completed: 0, total: 0, efficiency: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resp = await api.get('/todos');
        const todos = resp.data;
        const completed = todos.filter(t => t.status === 'completed').length;
        const total = todos.length;
        const efficiency = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;
        setStats({ completed, total, efficiency });
      } catch (err) {
        console.error('Stats fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartData = {
    labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    datasets: [
      {
        label: 'Velocity',
        data: [8, 15, 10, 12, 9, 4, 6],
        backgroundColor: '#3b2ef3',
        borderRadius: 6,
        barThickness: 12,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 12,
        titleFont: { family: 'Outfit', size: 14 },
        bodyFont: { family: 'Inter', size: 12 },
        cornerRadius: 8,
      }
    },
    scales: {
      y: { display: false },
      x: { 
        grid: { display: false },
        ticks: { font: { family: 'Inter', size: 10 }, color: '#94a3b8' }
      }
    }
  };

  if (loading) return <div className="text-muted smallest ls-2">INITIALIZING WORKSPACE...</div>;

  return (
    <div className="view-section">
      <div className="row g-5">
        <div className="col-lg-8">
          <div className="welcome-section mb-5">
            <h1 className="display-4 font-heading mb-2">Workspace Overview</h1>
            <p className="text-muted fs-5">Technical analysis of your architectural velocity and output.</p>
          </div>

          <div className="row g-4 mb-5">
            <div className="col-md-7">
              <div className="card glass-card rounded-4 p-5 h-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                   <h6 className="smallest fw-bold text-uppercase ls-2 text-muted">Weekly Performance</h6>
                   <span className="badge bg-light text-dark smallest px-2">v2.4</span>
                </div>
                <div style={{ height: '220px' }}>
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div className="card border-0 rounded-4 p-5 h-100 bg-dark-blue shadow-lg">
                <h6 className="smallest fw-bold text-uppercase ls-2 opacity-50 mb-5">Intent Efficiency</h6>
                <div className="d-flex flex-column align-items-center justify-content-center text-center">
                  <div className="circular-chart mb-4" style={{ width: '120px' }}>
                    <svg viewBox="0 0 36 36" className="circular-svg">
                      <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                      <path className="circle" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b2ef3" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={`${stats.efficiency}, 100`} />
                    </svg>
                    <div className="position-absolute translate-middle start-50 top-50 pt-2">
                       <span className="fs-3 fw-bold">{stats.efficiency}%</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="smallest opacity-50 text-uppercase ls-1">Rank Determination</div>
                    <div className="fw-bold fs-4">
                      {stats.efficiency >= 90 ? 'ALPHA PLUS' : stats.efficiency >= 75 ? 'OPTIMIZED' : stats.efficiency >= 50 ? 'STABLE' : 'CRITICAL'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card glass-card rounded-4 p-5 mb-4 overflow-hidden position-relative">
            <h6 className="smallest fw-bold text-uppercase ls-2 text-muted mb-4">Construction Count</h6>
            <div className="display-2 font-heading mb-1">{stats.completed}</div>
            <p className="smallest text-muted ls-1">Archived/Total Intents: {stats.completed}/{stats.total}</p>
            <div className="mt-4 pt-4 border-top">
               <button className="btn btn-premium btn-primary-nylix w-100">
                 Analyze All Intents
               </button>
            </div>
          </div>
          
          <div className="rounded-4 overflow-hidden position-relative" style={{ height: '280px' }}>
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark-blue opacity-25"></div>
            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800" className="w-100 h-100 object-fit-cover grayscale" alt="Architectural" />
            <div className="position-absolute bottom-0 start-0 p-4 w-100 bg-gradient-to-t from-black to-transparent">
               <span className="smallest text-white opacity-75 ls-2 fw-bold text-uppercase">Material Inspiration</span>
               <div className="text-white fw-bold">Steel & Structure v2</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
