import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isLanding = location.pathname === '/';
  const showLandingHeader = !user && (isLanding || isAuthPage);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <nav className={`navbar navbar-expand-lg ${showLandingHeader ? 'navbar-light bg-white shadow-sm' : 'navbar-dark bg-primary'}`}>
        <div className="container">
          <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
            {showLandingHeader ? (
              <>
                <span className="landing-logo-icon rounded-circle bg-primary text-white d-flex align-items-center justify-content-center">S</span>
                <span className="text-primary">Smart Healthcare</span>
              </>
            ) : (
              <>🏥 Smart Healthcare</>
            )}
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              {user?.role === 'patient' && (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/">Dashboard</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/book">Book Appointment</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/prescriptions">My Prescriptions</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/history">Medical History</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/doctor-schedules">Doctor Schedules</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/profile">Profile</Link></li>
                </>
              )}
              {user?.role === 'doctor' && (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/doctor">Dashboard</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/doctor/schedule">My Schedule</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/doctor/appointments">Appointments</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/doctor/prescriptions">Create Prescription</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/doctor/patient-history">Patient History</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/profile">Profile</Link></li>
                </>
              )}
              {user?.role === 'admin' && (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/admin">Dashboard</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/admin/users">Manage Users</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/admin/appointments">Appointments</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/admin/reports">Reports</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/profile">Profile</Link></li>
                </>
              )}
            </ul>
            {user ? (
              <div className="d-flex align-items-center gap-2">
                <NotificationBell />
                <span className="text-white">{user.name}</span>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
              </div>
            ) : showLandingHeader ? (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-primary rounded-3 px-4">Login</Link>
                <Link to="/register" className="btn btn-primary rounded-3 px-4">Register</Link>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm">Login</Link>
                <Link to="/register" className="btn btn-light btn-sm">Register</Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className={`flex-grow-1 ${isAuthPage || (isLanding && !user) ? '' : 'container-fluid px-4 py-4'}`}>
        {isAuthPage ? <Outlet /> : (isLanding && !user) ? <Outlet /> : (
          <div className="container-xl">
            <Outlet />
          </div>
        )}
      </main>
      {!isAuthPage && (
      <footer className="bg-light py-3 mt-auto">
        <div className="container text-center text-muted small">
          Smart Healthcare Appointment & Prescription Management System — Sri Lanka
        </div>
      </footer>
      )}
    </div>
  );
}

export default Layout;
