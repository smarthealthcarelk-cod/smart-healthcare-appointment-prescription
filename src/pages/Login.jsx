import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const healthcareIcons = ['💉', '❤️', '🩺', '💊', '🏥', '🔬', '🛏️', '🚑', '📋', '🩹', '🩸', '⛑️'];

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page auth-login-page">
      <div className="auth-row">
        {/* Left: Healthcare illustration / pictures */}
        <div className="auth-illustration-col d-none d-lg-flex order-lg-1">
          <div className="auth-illustration-content">
            <h2 className="auth-illustration-title">SMART</h2>
            <p className="auth-illustration-subtitle">Healthcare Management Service</p>
            <div className="auth-icons-circle">
              <div className="auth-icons-dotted-ring" />
              {healthcareIcons.map((icon, i) => (
                <div
                  key={i}
                  className="auth-icon-item"
                  style={{ '--i': i, '--total': healthcareIcons.length }}
                >
                  <span className="auth-icon-emoji">{icon}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="auth-illustration-footer" />
        </div>

        {/* Right: Form - white background */}
        <div className="auth-form-col order-lg-2">
          <div className="auth-form-inner">
            <h1 className="auth-brand-title">SMART</h1>
            <p className="auth-brand-subtitle">Healthcare Management Service</p>
            <h2 className="auth-form-heading">Welcome back</h2>
            <p className="auth-form-desc">Sign in to your account</p>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-medium">Email</label>
                <input
                  type="email"
                  className="form-control form-control-lg auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium">Password</label>
                <div className="input-group input-group-lg">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control auth-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary auth-eye-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label className="form-check-label text-muted" htmlFor="rememberMe">Remember me</label>
                </div>
                <Link to="/forgot-password" className="auth-link-small">Forgot Password?</Link>
              </div>
              <button type="submit" className="btn auth-btn-primary btn-lg w-100 mb-3">Login</button>
            </form>
            <p className="text-center text-muted mb-0">
              Don&apos;t have an account? <Link to="/register" className="auth-link fw-medium">Create Account</Link>
            </p>
            <div className="auth-footer">
              <span className="auth-footer-text">Smart Healthcare — Sri Lanka</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
