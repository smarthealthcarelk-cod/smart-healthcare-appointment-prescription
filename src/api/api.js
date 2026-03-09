const API = '/api';

function getToken() {
  return localStorage.getItem('token');
}

function setToken(t) {
  if (t) localStorage.setItem('token', t);
  else localStorage.removeItem('token');
}

async function fetchApi(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

export const authApi = {
  login: (email, password) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (body) => fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  registerRequestCode: (body) => fetchApi('/auth/register/request-code', { method: 'POST', body: JSON.stringify(body) }),
  verifyRegisterCode: (body) => fetchApi('/auth/register/verify-code', { method: 'POST', body: JSON.stringify(body) }),
  passwordForgot: (email) => fetchApi('/auth/password/forgot', { method: 'POST', body: JSON.stringify({ email }) }),
  passwordReset: (body) => fetchApi('/auth/password/reset', { method: 'POST', body: JSON.stringify(body) }),
};

export const usersApi = {
  list: () => fetchApi('/users'),
  patients: () => fetchApi('/users/patients'),
  patientsForPrescription: () => fetchApi('/users/patients-for-prescription'),
  me: () => fetchApi('/users/me'),
  updateMe: (body) => fetchApi('/users/me', { method: 'PUT', body: JSON.stringify(body) }),
  changePassword: (currentPassword, newPassword) => fetchApi('/users/me/password', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) }),
  addDoctor: (body) => fetchApi('/users/doctors', { method: 'POST', body: JSON.stringify(body) }),
  removeDoctor: (id) => fetchApi(`/users/${id}`, { method: 'DELETE' }),
  updateDoctorSchedule: (id, body) => fetchApi(`/users/doctors/${id}/schedule`, { method: 'PUT', body: JSON.stringify(body) }),
  updateMySchedule: (body) => fetchApi('/users/me/schedule', { method: 'PUT', body: JSON.stringify(body) }),
  uploadProfileImage: async (file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API}/users/me/profile-image`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || res.statusText);
    return data;
  },
};

export const hospitalsApi = {
  list: () => fetchApi('/hospitals'),
  create: (body) => fetchApi('/hospitals', { method: 'POST', body: JSON.stringify(body) }),
};
export const specializationsApi = {
  list: () => fetchApi('/specializations'),
  create: (body) => fetchApi('/specializations', { method: 'POST', body: JSON.stringify(body) }),
};
export const doctorsApi = { list: () => fetchApi('/doctors') };

export const appointmentsApi = {
  list: () => fetchApi('/appointments'),
  listAdmin: () => fetchApi('/appointments/admin'),
  create: (body) => fetchApi('/appointments', { method: 'POST', body: JSON.stringify(body) }),
  updateStatus: (id, status) => fetchApi(`/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  cancel: (id) => fetchApi(`/appointments/${id}/cancel`, { method: 'PATCH' }),
  sendReminders: () => fetchApi('/appointments/reminders/send', { method: 'POST' }),
};

export const prescriptionsApi = {
  list: () => fetchApi('/prescriptions'),
  create: (body) => fetchApi('/prescriptions', { method: 'POST', body: JSON.stringify(body) }),
};

export const medicalRecordsApi = {
  list: (patientId) => fetchApi(`/medical-records?patientId=${patientId}`),
  create: (body) => fetchApi('/medical-records', { method: 'POST', body: JSON.stringify(body) }),
};

export const reportsApi = {
  get: () => fetchApi('/reports'),
  downloadCsv: async () => {
    const token = getToken();
    const res = await fetch('/api/reports/export.csv', {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!res.ok) throw new Error('Failed to download CSV report');
    return res.blob();
  },
  downloadPdf: async () => {
    const token = getToken();
    const res = await fetch('/api/reports/export.pdf', {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!res.ok) throw new Error('Failed to download PDF report');
    return res.blob();
  },
};

export { getToken, setToken };
