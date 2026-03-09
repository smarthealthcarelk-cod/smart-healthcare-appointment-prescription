import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentsApi } from '../api/api';

function DoctorDashboard() {
  const { user } = useAuth();
  const [myAppointments, setMyAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    appointmentsApi.list()
      .then(setMyAppointments)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const upcoming = myAppointments.filter(a => a.date >= today && ['pending', 'confirmed'].includes(a.status));
  const pending = myAppointments.filter(a => a.status === 'pending');

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-header-title">Dr. {user?.name?.replace('Dr. ', '')}</h2>
        <p className="page-header-subtitle">Snapshot of today&apos;s schedule and pending approvals.</p>
      </div>
      <div className="row g-4 mb-3">
        <div className="col-lg-4">
          <div className="card border-primary shadow-sm card-hover">
            <div className="card-body">
              <h5 className="card-title">📅 Upcoming Today</h5>
              <p className="display-6 text-primary">{myAppointments.filter(a => a.date === today).length}</p>
              <Link to="/doctor/appointments" className="btn btn-primary btn-sm">View Appointments</Link>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-warning shadow-sm card-hover">
            <div className="card-body">
              <h5 className="card-title">⏳ Pending Approval</h5>
              <p className="display-6 text-warning">{pending.length}</p>
              <Link to="/doctor/appointments" className="btn btn-warning btn-sm">Manage</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow-sm mt-4">
        <div className="card-header">Upcoming Appointments</div>
        <div className="card-body">
          {upcoming.length === 0 ? (
            <p className="text-muted mb-0">No upcoming appointments.</p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead><tr><th>Date</th><th>Time</th><th>Status</th><th>Reason</th></tr></thead>
                <tbody>
                  {upcoming.slice(0, 5).map(a => (
                    <tr key={a.id}>
                      <td>{a.date}</td>
                      <td>{a.time}</td>
                      <td><span className={`badge bg-${a.status === 'confirmed' ? 'success' : 'warning'}`}>{a.status}</span></td>
                      <td>{a.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
