import { useState, useEffect } from 'react';
import { doctorsApi, hospitalsApi } from '../api/api';

function ViewDoctorSchedules() {
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [filterSpecialization, setFilterSpecialization] = useState('all');
  const [filterHospital, setFilterHospital] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([doctorsApi.list(), hospitalsApi.list()])
      .then(([d, h]) => { setDoctors(d); setHospitals(h); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const specializations = [...new Set(doctors.map(d => d.specialization).filter(Boolean))];

  let filteredDoctors = doctors;
  if (filterSpecialization !== 'all') {
    filteredDoctors = filteredDoctors.filter(d => d.specialization === filterSpecialization);
  }
  if (filterHospital !== 'all') {
    filteredDoctors = filteredDoctors.filter(d => d.hospital?.id === parseInt(filterHospital));
  }

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <h2 className="mb-4">View Doctor Schedules</h2>
      <div className="row mb-4">
        <div className="col-md-4">
          <label className="form-label fw-medium">Filter by Specialization</label>
          <select className="form-select" value={filterSpecialization} onChange={(e) => setFilterSpecialization(e.target.value)}>
            <option value="all">All Specializations</option>
            {specializations.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label fw-medium">Filter by Hospital</label>
          <select className="form-select" value={filterHospital} onChange={(e) => setFilterHospital(e.target.value)}>
            <option value="all">All Hospitals</option>
            {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
        </div>
      </div>
      <div className="row g-4">
        {filteredDoctors.map(doctor => (
          <div key={doctor.id} className="col-lg-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">{doctor.name}</h5>
                <p className="text-muted mb-3">{doctor.specialization}</p>
                <div className="mb-3">
                  <strong>Hospital:</strong> {doctor.hospital?.name || '-'}<br />
                  <small className="text-muted">{doctor.hospital?.city}</small>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <strong>Available Days:</strong>
                    <ul className="list-unstyled mt-1">
                      {(doctor.days || []).map((d, i) => <li key={i} className="small">{d}</li>)}
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <strong>Time Slots:</strong>
                    <ul className="list-unstyled mt-1">
                      {(doctor.availableSlots || []).map((t, i) => <li key={i} className="small">{t}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredDoctors.length === 0 && (
        <div className="alert alert-info">No doctors found matching the filters.</div>
      )}
    </div>
  );
}

export default ViewDoctorSchedules;
