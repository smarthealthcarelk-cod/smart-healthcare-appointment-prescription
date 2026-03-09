import { useState, useEffect } from 'react';
import { prescriptionsApi } from '../api/api';

function MyPrescriptions() {
  const [myPrescriptions, setMyPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    prescriptionsApi.list()
      .then(setMyPrescriptions)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-header-title">My Electronic Prescriptions</h2>
        <p className="page-header-subtitle">View your current and past prescriptions from doctors.</p>
      </div>
      {myPrescriptions.length === 0 ? (
        <div className="alert alert-info">No prescriptions yet.</div>
      ) : (
        <div className="accordion shadow-sm" id="prescriptions">
          {myPrescriptions.map((rx, i) => (
            <div className="accordion-item" key={rx.id}>
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#rx${i}`}>
                  {rx.date} — {rx.doctorName || 'Doctor'}
                </button>
              </h2>
              <div id={`rx${i}`} className="accordion-collapse collapse" data-bs-parent="#prescriptions">
                <div className="accordion-body">
                  <ul className="list-group list-group-flush mb-2">
                    {(rx.medications || []).map((m, j) => (
                      <li key={j} className="list-group-item d-flex justify-content-between">
                        <strong>{m.name}</strong>
                        <span>{m.dosage} — {m.duration}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mb-0 small text-muted"><strong>Notes:</strong> {rx.notes || '-'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPrescriptions;
