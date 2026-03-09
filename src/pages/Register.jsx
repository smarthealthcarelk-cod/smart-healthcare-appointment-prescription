import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const healthcareIcons = ['💉', '❤️', '🩺', '💊', '🏥', '🔬', '🛏️', '🚑', '📋', '🩹', '🩸', '⛑️'];

function Register() {
  const [step, setStep] = useState('form'); // 'form' | 'verify'
  const [form, setForm] = useState({ name: '', email: '', password: '', nic: '', phone: '', address: '' });
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { registerRequestCode, registerVerifyCode } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await registerRequestCode(form);
    setLoading(false);
    if (result.success) {
      setStep('verify');
    } else {
      setError(result.error);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await registerVerifyCode({ ...form, code });
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page auth-register-page">
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
            <h2 className="auth-form-heading">
              {step === 'form' ? 'Create your account' : 'Verify your email'}
            </h2>
            <p className="auth-form-desc">
              {step === 'form'
                ? 'Register as a patient to start booking appointments.'
                : 'A 6-digit verification code was sent to your email. Enter it below to complete registration.'}
            </p>
            {error && <div className="alert alert-danger">{error}</div>}

            {step === 'form' && (
            <form onSubmit={handleSubmitForm}>
              <div className="mb-3">
                <label className="form-label fw-medium">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control form-control-lg auth-input"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control form-control-lg auth-input"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium">NIC</label>
                <input
                  type="text"
                  name="nic"
                  className="form-control form-control-lg auth-input"
                  placeholder="e.g. 199012345678"
                  value={form.nic}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control form-control-lg auth-input"
                  placeholder="e.g. 0771234567"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium">Address</label>
                <input
                  type="text"
                  name="address"
                  className="form-control form-control-lg auth-input"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label fw-medium">Password</label>
                <div className="input-group input-group-lg">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="form-control auth-input"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    placeholder="Min. 6 characters"
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
                <small className="text-muted">Use at least 6 characters with a mix of letters and numbers.</small>
              </div>
              <button type="submit" className="btn auth-btn-primary btn-lg w-100 mb-3" disabled={loading}>
                {loading ? 'Sending code...' : 'Create Account'}
              </button>
            </form>
            )}

            {step === 'verify' && (
            <form onSubmit={handleVerify}>
              <div className="mb-3">
                <label className="form-label fw-medium">6-digit verification code</label>
                <input
                  type="text"
                  className="form-control form-control-lg auth-input"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter code from email"
                  maxLength={6}
                  required
                />
                <small className="text-muted">Check your email ({form.email}) for the code.</small>
              </div>
              <button type="submit" className="btn auth-btn-primary btn-lg w-100 mb-2" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Create Account'}
              </button>
              <button
                type="button"
                className="btn btn-link text-muted d-block w-100"
                onClick={() => { setStep('form'); setCode(''); setError(''); }}
              >
                Use different email
              </button>
            </form>
            )}

            <p className="text-center text-muted mb-0">
              Already have an account? <Link to="/login" className="auth-link fw-medium">Sign In</Link>
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

export default Register;
