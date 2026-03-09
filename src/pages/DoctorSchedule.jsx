import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doctorsApi, usersApi } from '../api/api';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

function DoctorSchedule() {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editDays, setEditDays] = useState([]);
  const [editSlots, setEditSlots] = useState([]);
  const [saving, setSaving] = useState(false);

  const fetchDoctor = () => {
    doctorsApi.list()
      .then((list) => setDoctor(list.find(d => d.id === user?.id)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDoctor();
  }, [user?.id]);

  const startEdit = () => {
    setEditDays(doctor?.days || []);
    setEditSlots(doctor?.availableSlots || []);
    setIsEditing(true);
    setError(null);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editDays.length === 0 || editSlots.length === 0) {
      setError('Select at least one day and one time slot.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await usersApi.updateMySchedule({ availableDays: editDays, availableSlots: editSlots });
      await fetchDoctor();
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (day) => {
    setEditDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort((a, b) => DAYS.indexOf(a) - DAYS.indexOf(b))
    );
  };

  const toggleSlot = (slot) => {
    setEditSlots(prev =>
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot].sort()
    );
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error && !isEditing) return <div className="alert alert-danger">Error: {error}</div>;

  const hospital = doctor?.hospital;

  return (
    <div>
      <h2 className="mb-4">My Availability Schedule</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <h5>{doctor?.name || user?.name}</h5>
          <p className="text-muted mb-3">{doctor?.specialization} — {hospital?.name}, {hospital?.city}</p>

          {isEditing ? (
            <form onSubmit={handleSave}>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="row mb-3">
                <div className="col-md-6">
                  <h6 className="mb-2">Available Days</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {DAYS.map((day) => (
                      <div key={day} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`edit-day-${day}`}
                          checked={editDays.includes(day)}
                          onChange={() => toggleDay(day)}
                        />
                        <label className="form-check-label" htmlFor={`edit-day-${day}`}>{day}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-md-6">
                  <h6 className="mb-2">Time Slots</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {SLOTS.map((slot) => (
                      <div key={slot} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`edit-slot-${slot}`}
                          checked={editSlots.includes(slot)}
                          onChange={() => toggleSlot(slot)}
                        />
                        <label className="form-check-label" htmlFor={`edit-slot-${slot}`}>{slot}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={cancelEdit} disabled={saving}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="row">
                <div className="col-md-6">
                  <h6>Available Days</h6>
                  <ul className="list-group">
                    {(doctor?.days || []).map((d, i) => <li key={i} className="list-group-item">{d}</li>)}
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6>Time Slots</h6>
                  <ul className="list-group">
                    {(doctor?.availableSlots || []).map((t, i) => <li key={i} className="list-group-item">{t}</li>)}
                  </ul>
                </div>
              </div>
              <div className="mt-3">
                <button type="button" className="btn btn-primary" onClick={startEdit}>
                  Edit Schedule
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorSchedule;
