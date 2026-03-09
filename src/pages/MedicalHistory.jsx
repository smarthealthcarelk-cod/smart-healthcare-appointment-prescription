import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { medicalRecordsApi } from '../api/api';

function MedicalHistory() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    medicalRecordsApi.list(user.id)
      .then((r) => setRecords(r.sort((a, b) => new Date(b.date) - new Date(a.date))))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-header-title">Medical History</h2>
        <p className="page-header-subtitle">A timeline of your past consultations and treatments.</p>
      </div>
      {records.length === 0 ? (
        <div className="alert alert-info">No medical records yet.</div>
      ) : (
        <div className="timeline">
          {records.map(r => (
            <div key={r.id} className="card shadow-sm card-hover mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <span className="badge bg-secondary">{r.type}</span>
                  <small className="text-muted">{r.date}</small>
                </div>
                <h6 className="mt-2">{r.doctor}</h6>
                <p className="mb-0">{r.summary}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MedicalHistory;
