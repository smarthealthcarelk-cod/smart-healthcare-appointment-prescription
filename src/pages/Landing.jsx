import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hospitalsApi, specializationsApi, doctorsApi } from '../api/api';

const defaultDoctorAvatar = 'https://i.pravatar.cc/300?u=doctor';
const heroDoctorImage = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=600&fit=crop';

function Landing() {
  const { user } = useAuth();
  const [hospitals, setHospitals] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      hospitalsApi.list().catch(() => []),
      specializationsApi.list().catch(() => []),
      doctorsApi.list().catch(() => []),
    ])
      .then(([h, s, d]) => {
        setHospitals(Array.isArray(h) ? h : []);
        setSpecializations(Array.isArray(s) ? s : []);
        setDoctors(Array.isArray(d) ? d : []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (user) {
    if (user.role === 'patient') return <Navigate to="/" replace />;
    if (user.role === 'doctor') return <Navigate to="/doctor" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
  }

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="landing-hero-new">
        <div className="landing-hero-bg-shapes" />
        <div className="container-xl">
          <div className="row align-items-center min-vh-75 py-5">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <h1 className="landing-hero-title mb-3">
                Book Your Doctor Appointment Online.
              </h1>
              <p className="landing-hero-subtitle mb-4">
                A Healthier Tomorrow Starts Today: Schedule Your Appointment! Your Wellness, Our Expertise: Set Up Your Appointment Today.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/register" className="btn btn-light btn-lg px-4 rounded-3 border-primary text-primary fw-medium">
                  Book An Appointment
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-lg-end">
              <div className="landing-hero-doctor-wrap">
                <img src={heroDoctorImage} alt="Doctor" className="landing-hero-doctor-img" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-5 bg-white" id="how-it-works">
        <div className="container-xl px-4">
          <h2 className="landing-section-title fw-bold mb-2">How It Works!</h2>
          <p className="text-center text-muted mb-5">
            Discover, book, and experience personalized healthcare effortlessly with our user-friendly Doctor Appointment Website.
          </p>
          <div className="row g-4">
            {[
              { step: 1, title: 'Search & Choose', text: 'Find doctors by specialization, name, or hospital. Browse available slots.', icon: '🔍' },
              { step: 2, title: 'Book Appointment', text: 'Select date and time. Submit your appointment request instantly.', icon: '📅' },
              { step: 3, title: 'Visit & Get Care', text: 'Attend your appointment. Doctors can create e-prescriptions for you.', icon: '🏥' },
              { step: 4, title: 'Manage Records', text: 'View prescriptions and medical history anytime from your dashboard.', icon: '📋' },
            ].map((item) => (
              <div key={item.step} className="col-md-6 col-lg-3">
                <div className="text-center p-4 rounded-3 bg-light h-100">
                  <div className="landing-step-number mb-2">{item.icon}</div>
                  <h6 className="fw-semibold mb-2">{item.title}</h6>
                  <p className="text-muted small mb-0">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Hospitals */}
      <section className="py-5" id="hospitals">
        <div className="container-xl px-4">
          <h2 className="text-center fw-bold mb-2">Our Partner Hospitals</h2>
          <p className="text-center text-muted mb-4">Trusted healthcare institutions across Sri Lanka</p>
          {loading ? (
            <div className="text-center py-4"><span className="spinner-border text-primary" /></div>
          ) : (
            <div className="row g-4">
              {hospitals.slice(0, 12).map((h) => (
                <div key={h.id} className="col-md-6 col-lg-4">
                  <div className="card h-100 border shadow-sm card-hover">
                    <div className="card-body">
                      <div className="d-flex align-items-start gap-3">
                        <div className="rounded-3 bg-primary bg-opacity-10 text-primary p-2 flex-shrink-0">🏥</div>
                        <div>
                          <h6 className="card-title mb-1">{h.name}</h6>
                          <p className="text-muted small mb-1">{h.city}</p>
                          {h.address && <p className="small mb-0 text-secondary">{h.address}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Specializations */}
      <section className="py-5 bg-white" id="specializations">
        <div className="container-xl px-4">
          <h2 className="text-center fw-bold mb-2">Specializations We Cover</h2>
          <p className="text-center text-muted mb-4">Expert care across a wide range of medical fields</p>
          {loading ? (
            <div className="text-center py-4"><span className="spinner-border text-primary" /></div>
          ) : (
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {specializations.map((s) => (
                <span key={s.id} className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2 fs-6 fw-normal">
                  {s.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Doctors */}
      <section className="py-5" id="doctors">
        <div className="container-xl px-4">
          <h2 className="text-center fw-bold mb-2">Meet Our Doctors</h2>
          <p className="text-center text-muted mb-4">Experienced specialists ready to care for you</p>
          {loading ? (
            <div className="text-center py-4"><span className="spinner-border text-primary" /></div>
          ) : (
            <div className="row g-4">
              {doctors.map((d) => (
                <div key={d.id} className="col-6 col-md-4 col-lg-3">
                  <div className="card h-100 border shadow-sm card-hover text-center">
                    <div className="card-body p-3">
                      <div className="landing-doctor-avatar mx-auto mb-2 rounded-circle overflow-hidden bg-light">
                        <img
                          src={d.profileImage || defaultDoctorAvatar}
                          alt={d.name}
                          onError={(e) => { e.target.src = defaultDoctorAvatar; }}
                        />
                      </div>
                      <h6 className="card-title mb-1 small">{d.name}</h6>
                      {d.specialization && <p className="text-primary small mb-1">{d.specialization}</p>}
                      {d.hospital?.name && <p className="text-muted small mb-0">{d.hospital.name}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 landing-cta" id="contact">
        <div className="container-xl text-center px-4">
          <h2 className="fw-bold mb-3">Ready to get started?</h2>
          <p className="text-white-50 mb-4">Create an account and book your first appointment today.</p>
          <Link to="/register" className="btn btn-light btn-lg px-4 me-2 rounded-3">Register</Link>
          <Link to="/login" className="btn btn-outline-light btn-lg px-4 rounded-3">Sign In</Link>
        </div>
      </section>
    </div>
  );
}

export default Landing;
