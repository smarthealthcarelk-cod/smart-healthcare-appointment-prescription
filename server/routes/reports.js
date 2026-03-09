import express from 'express';
import pool from '../config/db.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import PDFDocument from 'pdfkit';

const router = express.Router();

router.get('/', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT role, COUNT(*) as count FROM users WHERE role IN ('patient','doctor') GROUP BY role"
    );
    const [aptStats] = await pool.query(
      "SELECT status, COUNT(*) as count FROM appointments GROUP BY status"
    );
    const [rxCount] = await pool.query('SELECT COUNT(*) as total FROM prescriptions');
    const stats = { users: {}, appointments: {}, prescriptions: rxCount[0].total };
    users.forEach((u) => { stats.users[u.role] = u.count; });
    aptStats.forEach((a) => { stats.appointments[a.status] = a.count; });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CSV export for admin reports (appointments overview)
router.get('/export.csv', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.date, a.time, a.status,
              pa.name AS patient, doc.name AS doctor, h.name AS hospital
       FROM appointments a
       JOIN users pa ON a.patient_id = pa.id
       JOIN users doc ON a.doctor_id = doc.id
       LEFT JOIN hospitals h ON a.hospital_id = h.id
       ORDER BY a.date, a.time`
    );
    const header = ['Date', 'Time', 'Status', 'Patient', 'Doctor', 'Hospital'];
    const csvLines = [
      header.join(','),
      ...rows.map(r =>
        [r.date?.toISOString?.()?.slice(0, 10) || r.date, r.time, r.status, r.patient, r.doctor, r.hospital]
          .map(v => `"${(v || '').toString().replace(/"/g, '""')}"`).join(',')
      ),
    ];
    const csv = csvLines.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="appointments-report.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PDF export for admin reports (appointments overview + summary)
router.get('/export.pdf', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.date, a.time, a.status,
              pa.name AS patient, doc.name AS doctor, h.name AS hospital
       FROM appointments a
       JOIN users pa ON a.patient_id = pa.id
       JOIN users doc ON a.doctor_id = doc.id
       LEFT JOIN hospitals h ON a.hospital_id = h.id
       ORDER BY a.date, a.time`
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="appointments-report.pdf"');

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    doc.pipe(res);

    doc.fontSize(18).text('Smart Healthcare - Appointments Report', { align: 'center' });
    doc.moveDown();

    doc.fontSize(10).text(`Total appointments: ${rows.length}`);
    const statusCounts = rows.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {});
    Object.entries(statusCounts).forEach(([status, count]) => {
      doc.text(`${status}: ${count}`);
    });
    doc.moveDown();

    const tableTop = doc.y;
    const colWidths = [70, 50, 70, 120, 120, 80];
    const headers = ['Date', 'Time', 'Status', 'Patient', 'Doctor', 'Hospital'];

    doc.font('Helvetica-Bold');
    headers.forEach((h, i) => {
      const x = 40 + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
      doc.text(h, x, tableTop, { width: colWidths[i] });
    });
    doc.moveDown();
    doc.font('Helvetica');

    let y = tableTop + 18;
    const rowHeight = 16;
    rows.forEach((r) => {
      if (y > doc.page.height - 60) {
        doc.addPage();
        y = 40;
      }
      const values = [
        r.date?.toISOString?.()?.slice(0, 10) || r.date,
        r.time,
        r.status,
        r.patient,
        r.doctor,
        r.hospital,
      ];
      values.forEach((val, i) => {
        const x = 40 + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
        doc.text(val || '', x, y, { width: colWidths[i], ellipsis: true });
      });
      y += rowHeight;
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
