import React, { useState } from 'react';
import axios from 'axios';

const Auth = ({ onLogin, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const data = isLogin ? { email, password } : { email, password, username: username || "Anonymous" };

    try {
      const resp = await axios.post(endpoint, data);
      onLogin(resp.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-container" className="vh-100 w-100 position-fixed top-0 start-0 z-3 view-section">
      <div className="row g-0 h-100">
        {/* Left Side - Hero (Planner Aesthetic) */}
        <div className="col-lg-5 d-none d-lg-block">
          <div className="h-100 w-100 position-relative">
            <img src="https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=1000" className="w-100 h-100 object-fit-cover" style={{ filter: 'brightness(0.95) saturate(0.8)' }} alt="Planner" />
            <div className="position-absolute bottom-0 start-0 p-5 w-100" style={{ background: 'linear-gradient(transparent, rgba(27, 67, 50, 0.2))' }}>
              <h2 className="display-4 font-heading fw-bold mb-2 ls-1" style={{ color: '#1b4332' }}>NYLIX</h2>
              <p className="fs-5 mb-4 fw-light text-dark opacity-75">Your architectural agenda for future visions.</p>
              <button className="btn btn-outline-dark px-4 py-2 border-1 fw-bold opacity-75 rounded-pill" onClick={onBack}>
                <i className="bi bi-arrow-left me-2"></i> Return Home
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="col-lg-7 bg-white h-100 d-flex flex-column position-relative">
          <button 
            className="btn position-absolute top-0 end-0 m-4 btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center" 
            style={{ width: '40px', height: '40px' }}
            onClick={onBack}
          >
            <i className="bi bi-x-lg text-muted"></i>
          </button>

          <div className="auth-form-wrapper p-5 my-auto mx-auto" style={{ width: '100%', maxWidth: '480px' }}>
            <div className="mb-5">
              <h1 className="font-heading fw-bold mb-2 text-dark">{isLogin ? 'Sign In' : 'Create Workspace'}</h1>
              <p className="text-muted small">Organize your technical intents with precision.</p>
              
              {error && (
                <div className="mt-4 p-3 text-danger bg-danger bg-opacity-10 rounded-3 smallest fw-bold d-flex align-items-center gap-2 border border-danger border-opacity-25 animate-shake">
                  <i className="bi bi-exclamation-circle-fill"></i>
                  <span>{error}</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-4">
                  <label className="smallest fw-bold text-uppercase ls-2 text-muted mb-2">Architect Name</label>
                  <input 
                    type="text" 
                    className="form-control py-3 bg-light border-0 rounded-3 px-4" 
                    placeholder=""
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="smallest fw-bold text-uppercase ls-2 text-muted mb-2">Email Address</label>
                <input 
                  type="email" 
                  className="form-control py-3 bg-light border-0 rounded-3 px-4" 
                  required 
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-5">
                <div className="d-flex justify-content-between">
                  <label className="smallest fw-bold text-uppercase ls-2 text-muted mb-2">Security Key</label>
                  <a href="#" className="smallest fw-bold text-muted text-decoration-none opacity-50">Recovery?</a>
                </div>
                <input 
                  type="password" 
                  className="form-control py-3 bg-light border-0 rounded-3 px-4" 
                  required 
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-premium w-100 py-3 shadow-lg mb-4 text-white" 
                style={{ backgroundColor: 'var(--nylix-accent)', borderRadius: '14px' }}
                disabled={loading}
              >
                {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-journal-check me-2"></i>}
                {isLogin ? 'Authenticate' : 'Initialize'}
              </button>

              <div className="text-center">
                <p className="small text-muted">
                  {isLogin ? 'New to the platform?' : 'Already have an account?'} 
                  <button 
                    type="button"
                    className="btn btn-link fw-bold text-decoration-none p-0 ms-2" 
                    style={{ color: 'var(--nylix-accent)' }}
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? 'Create Account' : 'Sign In'}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
