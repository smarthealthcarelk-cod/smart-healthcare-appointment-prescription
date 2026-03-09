import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/api';

const healthcareIcons = ['💉', '❤️', '🩺', '💊', '🏥', '🔬', '🛏️', '🚑', '📋', '🩹', '🩸', '⛑️'];

function ForgotPassword() {
  const [step, setStep] = useState('request'); // 'request' | 'reset'
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRequest = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await authApi.passwordForgot(email);
      setMessage('If this email exists, a 6-digit code has been sent. Please check your inbox.');
      setStep('reset');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await authApi.passwordReset({ email, code, newPassword });
      setMessage('Password updated successfully. You can now sign in with your new password.');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-row">
        {/* Left: Illustration */}
        <div className="auth-illustration-col d-none d-lg-flex order-lg-1">
          <div className="auth-illustration-content">
            <h2 className="auth-illustration-title">SMART</h2>
            <p className="auth-illustration-subtitle">Healthcare Management Service</p>
            <div className="auth-icons-circle">
              <div className="auth-icons-dotted-ring" />
              {healthcareIcons.map((icon, i) => (
                <div
                  key={icon + i}
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

        {/* Right: Form */}
        <div className="auth-form-col order-lg-2">
          <div className="auth-form-inner">
            <h1 className="auth-brand-title">SMART</h1>
            <p className="auth-brand-subtitle">Healthcare Management Service</p>
            <h2 className="auth-form-heading">
              {step === 'request' ? 'Forgot your password?' : 'Reset your password'}
            </h2>
            <p className="auth-form-desc">
              {step === 'request'
                ? 'Enter your email to receive a 6-digit verification code.'
                : 'Enter the 6-digit code from your email and choose a new password.'}
            </p>
            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-info">{message}</div>}

            {step === 'request' && (
              <form onSubmit={handleRequest}>
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
                <button type="submit" className="btn auth-btn-primary btn-lg w-100 mb-3" disabled={loading}>
                  {loading ? 'Sending code...' : 'Send Verification Code'}
                </button>
              </form>
            )}

            {step === 'reset' && (
              <form onSubmit={handleReset}>
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
                  <label className="form-label fw-medium">6-digit Code</label>
                  <input
                    type="text"
                    className="form-control form-control-lg auth-input"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-medium">New Password</label>
                  <div className="input-group input-group-lg">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control auth-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      minLength={6}
                      placeholder="Min. 6 characters"
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
                <button type="submit" className="btn auth-btn-primary btn-lg w-100 mb-3" disabled={loading}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            )}

            <p className="text-center text-muted mb-0">
              Remembered your password?{' '}
              <Link to="/login" className="auth-link fw-medium">Back to Login</Link>
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

export default ForgotPassword;

