import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersApi, prescriptionsApi } from '../api/api';

function CreatePrescription() {
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [medications, setMedications] = useState([{ name: '', dosage: '', duration: '' }]);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    usersApi.patientsForPrescription()
      .then(setPatients)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const addMedication = () => setMedications([...medications, { name: '', dosage: '', duration: '' }]);

  const updateMed = (i, field, val) => {
    const m = [...medications];
    m[i][field] = val;
    setMedications(m);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await prescriptionsApi.create({ patientId, medications: medications.filter(m => m.name.trim()), notes });
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;

  if (submitted) {
    return (
      <div className="card border-success">
        <div className="card-body p-5 text-center">
          <h4 className="text-success mb-3">Prescription Created</h4>
          <p className="mb-0">Electronic prescription has been saved successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Create Electronic Prescription</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
              {patients.length === 0 && (
                <div className="alert alert-info mb-3">
                  No patients yet. Patients appear here only after they complete an appointment with you.
                </div>
              )}
              <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-medium">Patient</label>
                <div className="d-flex gap-2">
                  <select className="form-select" value={patientId} onChange={(e) => setPatientId(e.target.value)} required disabled={patients.length === 0}>
                    <option value="">-- Select Patient --</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.email})</option>
                    ))}
                  </select>
                  {patientId && (
                    <Link to={`/doctor/patient-history?patientId=${patientId}`} className="btn btn-outline-primary" title="View patient history">View History</Link>
                  )}
                </div>
              </div>
            </div>
            <h6 className="mt-4 mb-3 fw-medium">Medications</h6>
            {medications.map((m, i) => (
              <div key={i} className="row g-2 mb-2">
                <div className="col-md-4">
                  <input className="form-control" placeholder="Medication name" value={m.name} onChange={(e) => updateMed(i, 'name', e.target.value)} required />
                </div>
                <div className="col-md-4">
                  <input className="form-control" placeholder="Dosage" value={m.dosage} onChange={(e) => updateMed(i, 'dosage', e.target.value)} required />
                </div>
                <div className="col-md-3">
                  <input className="form-control" placeholder="Duration" value={m.duration} onChange={(e) => updateMed(i, 'duration', e.target.value)} required />
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-outline-secondary btn-sm mb-3" onClick={addMedication}>+ Add Medication</button>
            <div className="mb-4">
              <label className="form-label fw-medium">Notes</label>
              <textarea className="form-control" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>{submitting ? 'Saving...' : 'Save Prescription'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePrescription;
