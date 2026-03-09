import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentsApi } from '../api/api';

function NotificationBell() {
  const { user } = useAuth();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = useCallback(() => {
    if (!user) return;
    setLoading(true);
    const api = user.role === 'admin' ? appointmentsApi.listAdmin() : appointmentsApi.list();
    api
      .then((list) => setItems(list || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications, location.pathname]);

  useEffect(() => {
    const el = dropdownRef.current;
    if (!el) return;
    const onShow = () => fetchNotifications();
    el.addEventListener('show.bs.dropdown', onShow);
    return () => el.removeEventListener('show.bs.dropdown', onShow);
  }, [fetchNotifications]);

  const today = new Date().toISOString().split('T')[0];

  const reminders =
    user?.role === 'patient'
      ? items.filter((a) => a.date >= today && ['pending', 'confirmed'].includes(a.status)).slice(0, 5)
      : user?.role === 'doctor'
        ? items.filter((a) => a.status === 'pending').slice(0, 5)
        : user?.role === 'admin'
          ? items.filter((a) => a.status === 'pending').slice(0, 5)
          : [];

  const count = reminders.length;

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        className="btn btn-outline-light btn-sm position-relative"
        type="button"
        id="notifDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        🔔
        {count > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {count}
          </span>
        )}
      </button>
      <ul className="dropdown-menu dropdown-menu-end shadow" style={{ minWidth: 280 }} aria-labelledby="notifDropdown">
        <li className="dropdown-header fw-semibold">
          {user?.role === 'patient' ? '📅 Appointment Reminders' : user?.role === 'admin' ? '⏳ Pending Appointments' : '⏳ Pending Approval'}
        </li>
        {loading ? (
          <li><span className="dropdown-item text-muted">Loading...</span></li>
        ) : reminders.length === 0 ? (
          <li><span className="dropdown-item text-muted">No notifications</span></li>
        ) : (
          reminders.map((a) => (
            <li key={a.id}>
              <Link
                className="dropdown-item py-2"
                to={user?.role === 'doctor' ? '/doctor/appointments' : user?.role === 'admin' ? '/admin/appointments' : '/book'}
              >
                <span className="badge bg-secondary me-2">{a.date}</span>
                {a.time} — {a.reason || (a.patientName && `Patient: ${a.patientName}`) || 'Appointment'}
              </Link>
            </li>
          ))
        )}
        {(user?.role === 'patient' && reminders.length > 0) && (
          <>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <Link className="dropdown-item small text-primary" to="/" >
                View all appointments →
              </Link>
            </li>
          </>
        )}
        {((user?.role === 'doctor' || user?.role === 'admin') && reminders.length > 0) && (
          <>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <Link className="dropdown-item small text-primary" to={user?.role === 'admin' ? '/admin/appointments' : '/doctor/appointments'}>
                {user?.role === 'admin' ? 'Monitor appointments' : 'Manage appointments'} →
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default NotificationBell;
