import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportsApi } from '../api/api';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    reportsApi.get()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  const patients = stats?.users?.patient ?? 0;
  const doctors = stats?.users?.doctor ?? 0;
  const totalAppointments = Object.values(stats?.appointments || {}).reduce((a, b) => a + (b || 0), 0);
  const pendingAppointments = stats?.appointments?.pending ?? 0;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-header-title">Administrator Dashboard</h2>
        <p className="page-header-subtitle">High-level view of users and appointment activity.</p>
      </div>
      <div className="row g-4 mb-3">
        <div className="col-lg-3">
          <div className="card border-primary shadow-sm card-hover">
            <div className="card-body text-center">
              <h5>Patients</h5>
              <p className="display-4 text-primary">{patients}</p>
              <Link to="/admin/users" className="btn btn-primary btn-sm">Manage</Link>
            </div>
          </div>
        </div>
        <div className="col-lg-3">
          <div className="card border-success shadow-sm card-hover">
            <div className="card-body text-center">
              <h5>Doctors</h5>
              <p className="display-4 text-success">{doctors}</p>
              <Link to="/admin/users" className="btn btn-success btn-sm">Manage</Link>
            </div>
          </div>
        </div>
        <div className="col-lg-3">
          <div className="card border-info shadow-sm card-hover">
            <div className="card-body text-center">
              <h5>Total Appointments</h5>
              <p className="display-4 text-info">{totalAppointments}</p>
              <Link to="/admin/appointments" className="btn btn-info btn-sm">Monitor</Link>
            </div>
          </div>
        </div>
        <div className="col-lg-3">
          <div className="card border-warning shadow-sm card-hover">
            <div className="card-body text-center">
              <h5>Pending</h5>
              <p className="display-4 text-warning">{pendingAppointments}</p>
              <Link to="/admin/appointments" className="btn btn-warning btn-sm">View</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow-sm mt-4">
        <div className="card-header">Quick Actions</div>
        <div className="card-body">
          <Link to="/admin/users" className="btn btn-outline-primary me-2">Manage Users</Link>
          <Link to="/admin/appointments" className="btn btn-outline-info me-2">Monitor Appointments</Link>
          <Link to="/admin/reports" className="btn btn-outline-secondary me-2">Reports</Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
