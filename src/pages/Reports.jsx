import { useState, useEffect } from 'react';
import { reportsApi } from '../api/api';

function Reports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    reportsApi.get()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (type) => {
    try {
      setExporting(true);
      const blob = type === 'csv' ? await reportsApi.downloadCsv() : await reportsApi.downloadPdf();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = type === 'csv' ? 'appointments-report.csv' : 'appointments-report.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(e.message || 'Failed to download report');
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  const totalAppointments = Object.values(stats?.appointments || {}).reduce((a, b) => a + (b || 0), 0);
  const completedAppointments = stats?.appointments?.completed ?? 0;
  const totalPrescriptions = stats?.prescriptions ?? 0;
  const patients = stats?.users?.patient ?? 0;
  const doctors = stats?.users?.doctor ?? 0;
  const confirmed = stats?.appointments?.confirmed ?? 0;
  const pending = stats?.appointments?.pending ?? 0;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="mb-0">System Reports</h2>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => handleDownload('csv')}
            disabled={exporting}
          >
            {exporting ? 'Exporting...' : 'Download CSV'}
          </button>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => handleDownload('pdf')}
            disabled={exporting}
          >
            {exporting ? 'Exporting...' : 'Download PDF'}
          </button>
        </div>
      </div>
      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6>Appointments Summary</h6>
              <p className="mb-0">Total: {totalAppointments} | Completed: {completedAppointments}</p>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6>Prescriptions</h6>
              <p className="mb-0">Total issued: {totalPrescriptions}</p>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6>User Statistics</h6>
              <p className="mb-0">Patients: {patients} | Doctors: {doctors}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow-sm">
        <div className="card-header">Appointments by Status</div>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex justify-content-between">Confirmed <span className="badge bg-success">{confirmed}</span></li>
            <li className="list-group-item d-flex justify-content-between">Pending <span className="badge bg-warning">{pending}</span></li>
            <li className="list-group-item d-flex justify-content-between">Completed <span className="badge bg-secondary">{completedAppointments}</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Reports;
