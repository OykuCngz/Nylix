import React, { useState } from 'react';

const Blueprint = ({ vision, onBack, showNotification }) => {
  const [milestones, setMilestones] = useState([
    { id: 1, title: "Foundation & Core Principles", completed: true },
    { id: 2, title: "Structural Analysis of Objectives", completed: false },
    { id: 3, title: "Execution & Final Assembly", completed: false }
  ]);

  if (!vision) return <div className="p-5">Intent not found. Returning to office...</div>;

  return (
    <div className="blueprint-view w-100 bg-white p-0 d-flex flex-column" style={{ backgroundImage: 'linear-gradient(#f0f0f0 1px, transparent 1px), linear-gradient(90deg, #f0f0f0 1px, transparent 1px)', backgroundSize: '30px 30px', minHeight: 'calc(100vh - 100px)' }}>
      
      {/* Blueprint Control Bar */}
      <div className="px-5 py-4 bg-white border-bottom d-flex justify-content-between align-items-center sticky-top shadow-sm">
        <div>
          <span className="badge bg-primary-soft text-primary-dark smallest fw-bold text-uppercase ls-2 mb-1 px-3">Revision 1.0</span>
          <h2 className="fw-bold m-0 h4">Technical Blueprint</h2>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-dark px-3 fw-bold" onClick={onBack}>
            <i className="bi bi-arrow-left me-2"></i> Dismiss
          </button>
          <button className="btn btn-sm btn-dark-blue px-3 text-white fw-bold shadow-sm" style={{ backgroundColor: '#03045e' }}>
            <i className="bi bi-printer me-2"></i> Export Schematic
          </button>
        </div>
      </div>

      <div className="flex-grow-1 p-5">
        <div className="container-fluid">
          <div className="row g-5">
            {/* Visual Section */}
            <div className="col-lg-5">
              <div className="mb-4">
                 <h1 className="display-6 fw-bold mb-1">{vision.title}</h1>
                 <p className="text-muted smallest ls-2 text-uppercase">Project ID: ARCH-{Math.floor(Math.random() * 9000) + 1000}</p>
              </div>
              <div className="card border-0 rounded-4 overflow-hidden shadow-sm aspect-video mb-4" style={{ height: '300px' }}>
                <img src={vision.image} className="w-100 h-100 object-fit-cover grayscale" style={{ filter: 'brightness(0.9) contrast(1.1)' }} alt={vision.title} />
              </div>
              <div className="alert alert-light border-0 rounded-4 p-4 shadow-sm bg-white">
                <h6 className="smallest fw-bold text-uppercase text-muted ls-2 mb-3">Architect's Statement</h6>
                <p className="fs-5 fw-light" style={{ fontStyle: 'italic' }}>"{vision.description}"</p>
              </div>
            </div>

            {/* Technical Section */}
            <div className="col-lg-7">
              <div className="d-flex flex-column gap-4">
                
                {/* Milestone Section */}
                <div className="card border-0 rounded-4 shadow-sm p-5 bg-white">
                  <h6 className="smallest fw-bold text-uppercase text-muted ls-2 mb-4 d-flex justify-content-between">
                    Phases of Construction
                    <span className="text-primary-blue bg-primary-soft px-2 rounded">Active</span>
                  </h6>
                  
                  <div className="milestones-list d-flex flex-column gap-3">
                    {milestones.map(m => (
                      <div key={m.id} className="d-flex align-items-center gap-3 p-3 rounded-3 border-dashed" style={{ border: '1px dashed #eee' }}>
                        <div className={`rounded-circle d-flex align-items-center justify-content-center ${m.completed ? 'bg-success text-white' : 'bg-light text-muted'}`} style={{ width: '24px', height: '24px' }}>
                          {m.completed ? <i className="bi bi-check"></i> : <i className="bi bi-circle"></i>}
                        </div>
                        <span className={`fw-bold ${m.completed ? 'text-decoration-line-through opacity-50' : ''}`}>{m.title}</span>
                        <button className="btn btn-link p-0 ms-auto text-muted"><i className="bi bi-pencil-square"></i></button>
                      </div>
                    ))}
                    <button className="btn btn-link text-primary-dark fw-bold text-decoration-none p-0 mt-3">+ Draft New Phase</button>
                  </div>
                </div>

                {/* Logistics section */}
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
                       <h6 className="smallest fw-bold text-uppercase text-muted ls-2 mb-3">Primary Category</h6>
                       <div className="d-flex align-items-center gap-2">
                         <i className="bi bi-tag-fill text-primary-blue"></i>
                         <span className="fw-bold">{vision.category}</span>
                       </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
                       <h6 className="smallest fw-bold text-uppercase text-muted ls-2 mb-3">Proposed Deadline</h6>
                       <div className="d-flex align-items-center gap-2">
                         <i className="bi bi-calendar-event text-danger"></i>
                         <span className="fw-bold">August 24, 2026</span>
                       </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blueprint;
