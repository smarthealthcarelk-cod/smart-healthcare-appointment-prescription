import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usersApi, medicalRecordsApi, prescriptionsApi } from '../api/api';

function DoctorPatientHistory() {
  const [searchParams] = useSearchParams();
  const preselectedPatient = searchParams.get('patientId') || '';
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState(preselectedPatient);
  const [records, setRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecord, setNewRecord] = useState({ type: 'Consultation', summary: '' });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    usersApi.patientsForPrescription()
      .then(setPatients)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!patientId) return;
    Promise.all([
      medicalRecordsApi.list(patientId),
      prescriptionsApi.list()
    ]).then(([recs, rxs]) => {
      setRecords(recs.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setPrescriptions(rxs.filter(p => p.patientId === patientId));
    }).catch((e) => setError(e.message));
  }, [patientId]);

  useEffect(() => {
    if (preselectedPatient) setPatientId(preselectedPatient);
  }, [preselectedPatient]);

  const handleAddRecord = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await medicalRecordsApi.create({ patientId, type: newRecord.type, summary: newRecord.summary });
      const recs = await medicalRecordsApi.list(patientId);
      setRecords(recs.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setNewRecord({ type: 'Consultation', summary: '' });
      setShowAddForm(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPatient = patients.find(p => p.id === patientId);
  const patientRecords = records;

  if (loading) return <div className="text-center py-5">Loading...</div>;

  return (
    <div>
      <h2 className="mb-4">Patient Medical History</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-light fw-medium">Select Patient</div>
            <div className="card-body">
              {patients.length === 0 && (
                <div className="alert alert-info py-2 small mb-3">
                  Patients appear here only after they complete an appointment with you.
                </div>
              )}
              <select className="form-select" value={patientId} onChange={(e) => setPatientId(e.target.value)} disabled={patients.length === 0}>
                <option value="">-- Choose Patient --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {selectedPatient && (
                <div className="mt-3 small text-muted">
                  <div>{selectedPatient.phone}</div>
                  <div>{selectedPatient.address}</div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          {!patientId ? (
            <div className="card shadow-sm">
              <div className="card-body text-center text-muted py-5">Select a patient to view medical history.</div>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Records for {selectedPatient?.name}</h5>
                <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(true)}>+ Add Consultation Record</button>
              </div>

              {showAddForm && (
                <div className="card shadow-sm mb-4 border-primary">
                  <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <span>Add Consultation Record</span>
                    <button type="button" className="btn btn-sm btn-light" onClick={() => setShowAddForm(false)}>×</button>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleAddRecord}>
                      <div className="mb-3">
                        <label className="form-label fw-medium">Type</label>
                        <select className="form-select" value={newRecord.type} onChange={(e) => setNewRecord(r => ({ ...r, type: e.target.value }))}>
                          <option value="Consultation">Consultation</option>
                          <option value="Follow-up">Follow-up</option>
                          <option value="Vaccination">Vaccination</option>
                          <option value="Lab">Lab</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-medium">Summary / Notes</label>
                        <textarea className="form-control" rows={4} value={newRecord.summary} onChange={(e) => setNewRecord(r => ({ ...r, summary: e.target.value }))} required />
                      </div>
                      <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save Record'}</button>
                    </form>
                  </div>
                </div>
              )}

              {saved && <div className="alert alert-success py-2">Consultation record added.</div>}

              <div className="card shadow-sm mb-4">
                <div className="card-header bg-light fw-medium">Medical Records</div>
                <div className="card-body">
                  {patientRecords.length === 0 ? (
                    <p className="text-muted mb-0">No records yet.</p>
                  ) : (
                    patientRecords.map(r => (
                      <div key={r.id} className="border-bottom pb-3 mb-3">
                        <div className="d-flex justify-content-between">
                          <span className="badge bg-secondary">{r.type}</span>
                          <small className="text-muted">{r.date}</small>
                        </div>
                        <div className="fw-medium mt-1">{r.doctor}</div>
                        <p className="mb-0 mt-1">{r.summary}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="card shadow-sm">
                <div className="card-header bg-light fw-medium">Prescriptions</div>
                <div className="card-body">
                  {prescriptions.length === 0 ? (
                    <p className="text-muted mb-0">No prescriptions.</p>
                  ) : (
                    prescriptions.map(rx => (
                      <div key={rx.id} className="border-bottom pb-2 mb-2">
                        <small className="text-muted">{rx.date}</small>
                        <ul className="mb-0 mt-1">
                          {(rx.medications || []).map((m, i) => (
                            <li key={i}>{m.name} — {m.dosage}</li>
                          ))}
                        </ul>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorPatientHistory;
