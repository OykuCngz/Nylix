import React from 'react';

const LandingPage = ({ onEnter, onBeginJourney }) => {
  return (
    <div id="landing-page" className="view-section bg-white overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light py-4 px-5 sticky-top bg-white border-bottom">
        <div className="container-fluid p-0">
          <a className="navbar-brand font-heading fw-bold fs-3 ls-1" href="#" style={{ color: '#1b4332' }}>NYLIX</a>
          <div className="collapse navbar-collapse justify-content-center">
            <ul className="navbar-nav gap-5 small fw-bold text-uppercase ls-2">
              <li className="nav-item"><a className="nav-link text-muted" href="#manifesto">Manifesto</a></li>
              <li className="nav-item"><a className="nav-link text-muted" href="#structure">Structure</a></li>
              <li className="nav-item"><a className="nav-link text-muted" href="#vision">Vision</a></li>
            </ul>
          </div>
          <button 
            className="btn btn-premium px-4 text-white" 
            style={{ backgroundColor: 'var(--nylix-accent)', borderRadius: '12px' }}
            onClick={onEnter}
          >
            Enter Workspace
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="position-relative">
        <div className="row g-0 h-100" style={{ minHeight: 'calc(100vh - 100px)' }}>
          {/* Content Column */}
          <div className="col-lg-6 d-flex align-items-center p-5 p-lg-5">
            <div className="p-xl-5">
              <small className="badge bg-light border text-uppercase fw-bold ls-2 smallest mb-4 px-3 py-2 shadow-sm" style={{ color: 'var(--nylix-accent)' }}>
                Architectural Intent Engine
              </small>
              <h1 className="display-1 font-heading mb-4 text-dark" style={{ lineHeight: 0.9, letterSpacing: '-0.05em' }}>
                Construct your vision,<br />
                <span className="opacity-50 fw-light">blueprint your future.</span>
              </h1>
              <p className="text-muted fs-5 mb-5 fw-light" style={{ maxWidth: '550px' }}>
                Nylix is a high-fidelity workspace designed for precision-thinking architects of their own destiny. Organize your technical intents with elegance.
              </p>
              
              <div className="d-flex gap-4 align-items-center">
                <button 
                  className="btn btn-premium px-5 py-3 fs-5 shadow-lg text-white" 
                  style={{ backgroundColor: 'var(--nylix-accent)', borderRadius: '16px' }}
                  onClick={onEnter}
                >
                  Start Designing
                </button>
                <button 
                  className="btn btn-light px-4 py-3 border-0 fw-bold d-flex align-items-center gap-3 bg-white shadow-sm"
                  onClick={onBeginJourney}
                  style={{ borderRadius: '16px' }}
                >
                  <i className="bi bi-play-circle-fill fs-3" style={{ color: 'var(--nylix-accent)' }}></i> 
                  <span className="ls-1">Begin Journey</span>
                </button>
              </div>
            </div>
          </div>

          {/* Visual Column */}
          <div className="col-lg-6 d-none d-lg-block position-relative">
             <div className="h-100 w-100 p-4">
                <div className="rounded-5 overflow-hidden h-100 shadow-2xl position-relative">
                   <img 
                      src="https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=1400" 
                      className="w-100 h-100 object-fit-cover" 
                      alt="Productivity Aesthetic"
                      style={{ filter: 'brightness(1.05)' }}
                   />
                   <div className="position-absolute bottom-0 end-0 p-5">
                      <div className="card glass-card p-4 rounded-4 shadow-lg border-0" style={{ width: '280px' }}>
                         <div className="smallest fw-bold text-uppercase ls-2 text-muted mb-2">Core Engine</div>
                         <div className="fw-bold font-heading text-dark">Nylix Framework v2</div>
                         <div className="mt-3 rounded-pill" style={{ height: '4px', width: '70%', backgroundColor: 'var(--nylix-accent)' }}></div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
