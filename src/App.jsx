import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import PatientDashboard from './pages/PatientDashboard';
import BookAppointment from './pages/BookAppointment';
import MyPrescriptions from './pages/MyPrescriptions';
import MedicalHistory from './pages/MedicalHistory';
import ViewDoctorSchedules from './pages/ViewDoctorSchedules';
import PatientProfile from './pages/PatientProfile';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorSchedule from './pages/DoctorSchedule';
import DoctorAppointments from './pages/DoctorAppointments';
import DoctorPatientHistory from './pages/DoctorPatientHistory';
import CreatePrescription from './pages/CreatePrescription';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import AdminAppointments from './pages/AdminAppointments';
import Reports from './pages/Reports';

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Landing />;
  if (user.role === 'patient') return <PatientDashboard />;
  if (user.role === 'doctor') return <Navigate to="/doctor" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  return <Landing />;
}

function App() {
  return (
    <ErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomeRedirect />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="book" element={<ProtectedRoute roles={['patient']}><BookAppointment /></ProtectedRoute>} />
            <Route path="prescriptions" element={<ProtectedRoute roles={['patient']}><MyPrescriptions /></ProtectedRoute>} />
            <Route path="history" element={<ProtectedRoute roles={['patient']}><MedicalHistory /></ProtectedRoute>} />
            <Route path="doctor-schedules" element={<ProtectedRoute roles={['patient']}><ViewDoctorSchedules /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute roles={['patient', 'doctor', 'admin']}><PatientProfile /></ProtectedRoute>} />
            <Route path="doctor" element={<ProtectedRoute roles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
            <Route path="doctor/schedule" element={<ProtectedRoute roles={['doctor']}><DoctorSchedule /></ProtectedRoute>} />
            <Route path="doctor/appointments" element={<ProtectedRoute roles={['doctor']}><DoctorAppointments /></ProtectedRoute>} />
            <Route path="doctor/prescriptions" element={<ProtectedRoute roles={['doctor']}><CreatePrescription /></ProtectedRoute>} />
            <Route path="doctor/patient-history" element={<ProtectedRoute roles={['doctor']}><DoctorPatientHistory /></ProtectedRoute>} />
            <Route path="admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="admin/users" element={<ProtectedRoute roles={['admin']}><ManageUsers /></ProtectedRoute>} />
            <Route path="admin/appointments" element={<ProtectedRoute roles={['admin']}><AdminAppointments /></ProtectedRoute>} />
            <Route path="admin/reports" element={<ProtectedRoute roles={['admin']}><Reports /></ProtectedRoute>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
