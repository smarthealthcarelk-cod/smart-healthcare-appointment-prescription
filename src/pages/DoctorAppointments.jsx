import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentsApi } from '../api/api';

function DoctorAppointments() {
  const [myAppointments, setMyAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    appointmentsApi.list()
      .then(setMyAppointments)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  let filtered = myAppointments;
  if (filter === 'upcoming') filtered = myAppointments.filter(a => a.date >= today && ['pending', 'confirmed'].includes(a.status));
  if (filter === 'pending') filtered = myAppointments.filter(a => a.status === 'pending');
  if (filter === 'today') filtered = myAppointments.filter(a => a.date === today);

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try {
      await appointmentsApi.updateStatus(id, status);
      setMyAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (e) {
      setError(e.message);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <h2 className="mb-4">Manage Appointments</h2>
      <div className="mb-3">
        <select className="form-select w-auto d-inline-block" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Appointments</option>
          <option value="pending">Pending Approval</option>
          <option value="upcoming">Upcoming</option>
          <option value="today">Today</option>
        </select>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Patient</th>
                  <th>Hospital</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id}>
                    <td>{a.date}</td>
                    <td>{a.time}</td>
                    <td>{a.patientName || 'Patient'}</td>
                    <td>{a.hospitalName || '-'}</td>
                    <td>{a.reason}</td>
                    <td><span className={`badge bg-${a.status === 'confirmed' ? 'success' : a.status === 'completed' ? 'info' : a.status === 'pending' ? 'warning' : 'secondary'}`}>{a.status}</span></td>
                    <td>
                      <Link to={`/doctor/patient-history?patientId=${a.patientId}`} className="btn btn-sm btn-outline-primary me-1">View History</Link>
                      {a.status === 'pending' && (
                        <>
                          <button className="btn btn-sm btn-success me-1" onClick={() => handleStatus(a.id, 'confirmed')} disabled={updating === a.id}>Approve</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleStatus(a.id, 'cancelled')} disabled={updating === a.id}>Reject</button>
                        </>
                      )}
                      {a.status === 'confirmed' && (
                        <button className="btn btn-sm btn-info" onClick={() => handleStatus(a.id, 'completed')} disabled={updating === a.id}>Mark Complete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <p className="text-muted mb-0">No appointments found.</p>}
        </div>
      </div>
    </div>
  );
}

export default DoctorAppointments;
