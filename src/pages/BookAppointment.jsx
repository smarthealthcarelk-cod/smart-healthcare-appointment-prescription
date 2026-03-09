import { useState, useEffect } from 'react';
import { doctorsApi, hospitalsApi, appointmentsApi } from '../api/api';

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([doctorsApi.list(), hospitalsApi.list()])
      .then(([d, h]) => { setDoctors(d); setHospitals(h); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const selectedDoctor = doctors.find(d => d.id === doctorId);
  const doctorHospitalId = selectedDoctor?.hospital?.id;

  useEffect(() => {
    if (doctorId && doctorHospitalId) setHospitalId(String(doctorHospitalId));
  }, [doctorId, doctorHospitalId]);
  const availableTimes = selectedDoctor?.availableSlots || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await appointmentsApi.create({ doctorId, hospitalId: hospitalId || undefined, date, time, reason });
      setBooked(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;

  if (booked) {
    return (
      <div className="card border-success">
        <div className="card-body p-5 text-center">
          <h4 className="text-success mb-3">Appointment Request Submitted</h4>
          <p className="mb-0">Your appointment for {date} at {time} has been requested</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-header-title">Book Appointment</h2>
        <p className="page-header-subtitle">Choose a doctor, date, and time for your visit.</p>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm card-hover">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Select Doctor</label>
                    <select className="form-select" value={doctorId} onChange={(e) => { setDoctorId(e.target.value); setTime(''); }} required>
                      <option value="">-- Choose Doctor --</option>
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>{d.name} — {d.specialization} ({d.hospital?.name})</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Hospital</label>
                    <input type="text" className="form-control bg-light" value={selectedDoctor?.hospital ? `${selectedDoctor.hospital.name} — ${selectedDoctor.hospital.city}` : 'Select doctor first'} readOnly disabled={!doctorId} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-medium">Date</label>
                    <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} required />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-medium">Time Slot</label>
                    <select className="form-select" value={time} onChange={(e) => setTime(e.target.value)} required disabled={!doctorId}>
                      <option value="">-- Choose --</option>
                      {availableTimes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-medium">Reason for Visit</label>
                    <textarea className="form-control" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} required />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>{submitting ? 'Submitting...' : 'Book Appointment'}</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm card-hover h-100">
            <div className="card-header bg-light fw-medium">Hospitals (Sri Lanka)</div>
            <div className="card-body p-0">
              <ul className="list-group list-group-flush">
                {hospitals.map(h => (
                  <li key={h.id} className="list-group-item">{h.name}<br /><small className="text-muted">{h.city}</small></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;
