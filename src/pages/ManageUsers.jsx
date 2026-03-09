import { useState, useEffect } from 'react';
import { usersApi, hospitalsApi, specializationsApi } from '../api/api';
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

function ManageUsers() {
  const [filter, setFilter] = useState('all');
  const [users, setUsers] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [showAddHospital, setShowAddHospital] = useState(false);
  const [showAddSpecialization, setShowAddSpecialization] = useState(false);
  const [newHospital, setNewHospital] = useState({ name: '', city: '', address: '' });
  const [newSpecialization, setNewSpecialization] = useState({ name: '' });
  const [showDoctorPassword, setShowDoctorPassword] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '', email: '', password: '', specialization: '', hospitalId: '', licenseNo: '',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00'],
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([usersApi.list(), hospitalsApi.list(), specializationsApi.list()])
      .then(([u, h, s]) => { setUsers(u); setHospitals(h); setSpecializations(s); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const displayUsers = users.filter(u => {
    if (filter === 'all') return true;
    return u.role === filter;
  });

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const added = await usersApi.addDoctor({
        name: newDoctor.name.startsWith('Dr. ') ? newDoctor.name : `Dr. ${newDoctor.name}`,
        email: newDoctor.email,
        password: newDoctor.password,
        specialization: newDoctor.specialization,
        hospitalId: newDoctor.hospitalId ? parseInt(newDoctor.hospitalId) : null,
        licenseNo: newDoctor.licenseNo || undefined,
        availableDays: newDoctor.availableDays,
        availableSlots: newDoctor.availableSlots,
      });
      setUsers(prev => [...prev, added]);
      setNewDoctor({ name: '', email: '', password: '', specialization: specializations[0]?.name ?? '', hospitalId: String(hospitals[0]?.id ?? ''), licenseNo: '', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00'] });
      setShowAddDoctor(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddHospital = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const added = await hospitalsApi.create(newHospital);
      setHospitals(prev => [...prev, added]);
      setNewHospital({ name: '', city: '', address: '' });
      setShowAddHospital(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddSpecialization = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const added = await specializationsApi.create(newSpecialization);
      setSpecializations(prev => [...prev, added]);
      setNewSpecialization({ name: '' });
      setShowAddSpecialization(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveDoctor = async (id) => {
    if (!window.confirm('Remove this doctor? This action cannot be undone.')) return;
    try {
      await usersApi.removeDoctor(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const getHospitalName = (hospitalId) => hospitals.find(h => h.id === hospitalId)?.name || '-';

  const handleUpdateSchedule = async (doctor) => {
    try {
      const days = doctor.availableDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      const slots = doctor.availableSlots || ['09:00', '10:00', '11:00', '14:00', '15:00'];
      await usersApi.updateDoctorSchedule(doctor.id, { availableDays: days, availableSlots: slots });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="mb-0">Manage Users</h2>
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-outline-primary" onClick={() => setShowAddHospital(true)}>+ Add Hospital</button>
          <button className="btn btn-outline-secondary" onClick={() => setShowAddSpecialization(true)}>+ Add Specialization</button>
          {(filter === 'doctor' || filter === 'all') && (
            <button className="btn btn-primary" onClick={() => setShowAddDoctor(true)}>+ Add Doctor</button>
          )}
        </div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <select className="form-select w-auto d-inline-block" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Users</option>
          <option value="patient">Patients</option>
          <option value="doctor">Doctors</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {showAddHospital && (
        <div className="card shadow-sm mb-4 border-info">
          <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
            <span className="fw-medium">Add New Hospital</span>
            <button type="button" className="btn btn-sm btn-light" onClick={() => setShowAddHospital(false)}>×</button>
          </div>
          <div className="card-body">
            <form onSubmit={handleAddHospital}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-medium">Hospital Name</label>
                  <input type="text" className="form-control" placeholder="e.g. Colombo General Hospital" value={newHospital.name} onChange={(e) => setNewHospital(h => ({ ...h, name: e.target.value }))} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium">City</label>
                  <input type="text" className="form-control" placeholder="e.g. Colombo" value={newHospital.city} onChange={(e) => setNewHospital(h => ({ ...h, city: e.target.value }))} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium">Address</label>
                  <input type="text" className="form-control" placeholder="e.g. Colombo 10" value={newHospital.address} onChange={(e) => setNewHospital(h => ({ ...h, address: e.target.value }))} required />
                </div>
              </div>
              <button type="submit" className="btn btn-info mt-3" disabled={submitting}>{submitting ? 'Adding...' : 'Add Hospital'}</button>
            </form>
          </div>
        </div>
      )}

      {showAddSpecialization && (
        <div className="card shadow-sm mb-4 border-secondary">
          <div className="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
            <span className="fw-medium">Add New Specialization</span>
            <button type="button" className="btn btn-sm btn-light" onClick={() => setShowAddSpecialization(false)}>×</button>
          </div>
          <div className="card-body">
            <form onSubmit={handleAddSpecialization}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium">Specialization Name</label>
                  <input type="text" className="form-control" placeholder="e.g. Ophthalmologist" value={newSpecialization.name} onChange={(e) => setNewSpecialization(s => ({ ...s, name: e.target.value }))} required />
                </div>
              </div>
              <button type="submit" className="btn btn-secondary mt-3" disabled={submitting}>{submitting ? 'Adding...' : 'Add Specialization'}</button>
            </form>
          </div>
        </div>
      )}

      {showAddDoctor && (
        <div className="card shadow-sm mb-4 border-primary">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <span className="fw-medium">Add New Doctor</span>
            <button type="button" className="btn btn-sm btn-light" onClick={() => setShowAddDoctor(false)}>×</button>
          </div>
          <div className="card-body">
            <form onSubmit={handleAddDoctor}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium">Full Name</label>
                  <input type="text" className="form-control" placeholder="Dr. Name" value={newDoctor.name} onChange={(e) => setNewDoctor(d => ({ ...d, name: e.target.value }))} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">Email</label>
                  <input type="email" className="form-control" value={newDoctor.email} onChange={(e) => setNewDoctor(d => ({ ...d, email: e.target.value }))} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">Specialization</label>
                  <select className="form-select" value={newDoctor.specialization} onChange={(e) => setNewDoctor(d => ({ ...d, specialization: e.target.value }))} required>
                    <option value="">-- Select --</option>
                    {specializations.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">Hospital</label>
                  <select className="form-select" value={newDoctor.hospitalId} onChange={(e) => setNewDoctor(d => ({ ...d, hospitalId: e.target.value }))} required>
                    <option value="">-- Select --</option>
                    {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">License No</label>
                  <input type="text" className="form-control" placeholder="e.g. GMC-SL-003" value={newDoctor.licenseNo} onChange={(e) => setNewDoctor(d => ({ ...d, licenseNo: e.target.value }))} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">Password</label>
                  <div className="input-group">
                    <input
                      type={showDoctorPassword ? 'text' : 'password'}
                      className="form-control"
                      value={newDoctor.password}
                      onChange={(e) => setNewDoctor(d => ({ ...d, password: e.target.value }))}
                      placeholder="Min. 6 characters"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowDoctorPassword(p => !p)}
                      aria-label={showDoctorPassword ? 'Hide password' : 'Show password'}
                    >
                      <span aria-hidden="true">{showDoctorPassword ? '🙈' : '👁'}</span>
                    </button>
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium">Doctor Schedule — Available Days</label>
                  <div className="d-flex flex-wrap gap-2">
                    {DAYS.map(day => (
                      <div key={day} className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" id={`day-${day}`} checked={newDoctor.availableDays.includes(day)} onChange={(e) => {
                          const arr = e.target.checked ? [...newDoctor.availableDays, day].sort((a, b) => DAYS.indexOf(a) - DAYS.indexOf(b)) : newDoctor.availableDays.filter(d => d !== day);
                          setNewDoctor(d => ({ ...d, availableDays: arr }));
                        }} />
                        <label className="form-check-label" htmlFor={`day-${day}`}>{day}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium">Doctor Schedule — Available Time Slots</label>
                  <div className="d-flex flex-wrap gap-2">
                    {SLOTS.map(slot => (
                      <div key={slot} className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" id={`slot-${slot}`} checked={newDoctor.availableSlots.includes(slot)} onChange={(e) => {
                          const arr = e.target.checked ? [...newDoctor.availableSlots, slot].sort() : newDoctor.availableSlots.filter(s => s !== slot);
                          setNewDoctor(d => ({ ...d, availableSlots: arr }));
                        }} />
                        <label className="form-check-label" htmlFor={`slot-${slot}`}>{slot}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary mt-3" disabled={submitting}>{submitting ? 'Adding...' : 'Add Doctor'}</button>
            </form>
          </div>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Details</th>
                  {(filter === 'doctor' || filter === 'all') && <th className="text-end">Action</th>}
                </tr>
              </thead>
              <tbody>
                {displayUsers.map(u => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className={`badge bg-${u.role === 'admin' ? 'danger' : u.role === 'doctor' ? 'primary' : 'secondary'}`}>{u.role}</span></td>
                    <td>
                      {u.role === 'patient' && (u.phone || u.nic) && <small>{u.phone} / {u.nic}</small>}
                      {u.role === 'doctor' && <small>{u.specialization} @ {getHospitalName(u.hospital_id)}</small>}
                      {u.role === 'admin' && <small>System</small>}
                    </td>
                    {(filter === 'doctor' || filter === 'all') && (
                      <td className="text-end">
                        {u.role === 'doctor' ? (
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveDoctor(u.id)}>Remove</button>
                        ) : '-'}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
