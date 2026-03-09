import express from 'express';
import pool from '../config/db.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { randomUUID } from 'crypto';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const patientId = req.query.patientId;
    if (!patientId) return res.status(400).json({ error: 'patientId required' });
    if (req.role === 'patient' && patientId !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const [rows] = await pool.query(
      'SELECT * FROM medical_records WHERE patient_id = ? ORDER BY date DESC',
      [patientId]
    );
    const list = rows.map((r) => ({
      id: r.id,
      patientId: r.patient_id,
      date: r.date?.toISOString?.()?.slice(0, 10) || r.date,
      type: r.type,
      doctor: r.doctor_name,
      summary: r.summary,
    }));
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authMiddleware, requireRole('doctor'), async (req, res) => {
  try {
    const { patientId, type, summary } = req.body;
    if (!patientId || !summary) return res.status(400).json({ error: 'Patient and summary required' });
    const [doc] = await pool.query('SELECT name FROM users WHERE id = ?', [req.userId]);
    const doctorName = doc[0]?.name || 'Doctor';
    const id = randomUUID();
    await pool.query(
      'INSERT INTO medical_records (id, patient_id, date, type, doctor_name, summary, created_by) VALUES (?, ?, CURDATE(), ?, ?, ?, ?)',
      [id, patientId, type || 'Consultation', doctorName, summary, req.userId]
    );
    res.status(201).json({
      id,
      patientId,
      date: new Date().toISOString().slice(0, 10),
      type: type || 'Consultation',
      doctor: doctorName,
      summary,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
