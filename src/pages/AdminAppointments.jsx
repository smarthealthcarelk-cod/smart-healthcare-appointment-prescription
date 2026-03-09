import { useState, useEffect } from 'react';
import { appointmentsApi } from '../api/api';

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    appointmentsApi.listAdmin()
      .then(setAppointments)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  let filtered = appointments;
  if (filter === 'pending') filtered = appointments.filter(a => a.status === 'pending');
  if (filter === 'confirmed') filtered = appointments.filter(a => a.status === 'confirmed');
  if (filter === 'completed') filtered = appointments.filter(a => a.status === 'completed');

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <h2 className="mb-4">Monitor Appointments</h2>
      <div className="mb-3 d-flex gap-2 flex-wrap">
        <select className="form-select w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Appointments</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Hospital</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id}>
                    <td>{a.date}</td>
                    <td>{a.time}</td>
                    <td>{a.patientName || '-'}</td>
                    <td>{a.doctorName || '-'}</td>
                    <td>{a.hospitalName || '-'}</td>
                    <td>{a.reason}</td>
                    <td>
                      <span className={`badge bg-${a.status === 'confirmed' ? 'success' : a.status === 'pending' ? 'warning' : 'secondary'}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {filtered.length === 0 && <p className="text-muted mt-3 mb-0">No appointments found.</p>}
    </div>
  );
}

export default AdminAppointments;
