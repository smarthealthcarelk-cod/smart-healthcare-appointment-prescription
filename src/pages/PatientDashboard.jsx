import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentsApi, prescriptionsApi } from '../api/api';

function PatientDashboard() {
  const { user } = useAuth();
  const [myAppointments, setMyAppointments] = useState([]);
  const [myPrescriptions, setMyPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    Promise.all([appointmentsApi.list(), prescriptionsApi.list()])
      .then(([apts, rxs]) => {
        setMyAppointments(apts);
        setMyPrescriptions(rxs);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = myAppointments.filter(a => ['pending', 'confirmed'].includes(a.status));

  const handleCancel = async (id) => {
    const appt = myAppointments.find(a => a.id === id);
    if (!appt) return;
    const ok = window.confirm(`Cancel appointment on ${appt.date} at ${appt.time}?`);
    if (!ok) return;
    setCancelling(id);
    setError(null);
    try {
      await appointmentsApi.cancel(id);
      setMyAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
    } catch (e) {
      setError(e.message);
    } finally {
      setCancelling(null);
    }
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-header-title">Welcome, {user?.name}</h2>
        <p className="page-header-subtitle">Overview of your upcoming visits and prescriptions.</p>
      </div>
      <div className="row g-4 mb-3">
        <div className="col-lg-4">
          <div className="card border-primary shadow-sm card-hover">
            <div className="card-body">
              <h5 className="card-title">📅 Upcoming Appointments</h5>
              <p className="display-6 text-primary">{upcoming.length}</p>
              <Link to="/book" className="btn btn-primary btn-sm">Book Appointment</Link>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-success shadow-sm card-hover">
            <div className="card-body">
              <h5 className="card-title">💊 Prescriptions</h5>
              <p className="display-6 text-success">{myPrescriptions.length}</p>
              <Link to="/prescriptions" className="btn btn-success btn-sm">View All</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow-sm mt-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Recent Appointments</span>
          <small className="text-muted"></small>
        </div>
        <div className="card-body">
          {myAppointments.length === 0 ? (
            <p className="text-muted mb-0">No appointments yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead><tr><th>Date</th><th>Time</th><th>Status</th><th>Reason</th><th></th></tr></thead>
                <tbody>
                  {myAppointments.slice(0, 5).map(a => (
                    <tr key={a.id}>
                      <td>{a.date}</td>
                      <td>{a.time}</td>
                      <td><span className={`badge bg-${a.status === 'confirmed' ? 'success' : a.status === 'pending' ? 'warning' : 'secondary'}`}>{a.status}</span></td>
                      <td>{a.reason}</td>
                      <td className="text-end">
                        {['pending', 'confirmed'].includes(a.status) && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleCancel(a.id)}
                            disabled={cancelling === a.id}
                          >
                            {cancelling === a.id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}
                      </td>
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

export default PatientDashboard;
