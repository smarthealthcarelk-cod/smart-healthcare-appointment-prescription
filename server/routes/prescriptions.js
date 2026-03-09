import express from 'express';
import pool from '../config/db.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { randomUUID } from 'crypto';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    let sql = `SELECT p.*, doc.name as doctor_name FROM prescriptions p
      JOIN users doc ON p.doctor_id = doc.id WHERE 1=1`;
    const params = [];
    if (req.role === 'patient') {
      sql += ' AND p.patient_id = ?';
      params.push(req.userId);
    } else if (req.role === 'doctor') {
      sql += ' AND p.doctor_id = ?';
      params.push(req.userId);
    }
    sql += ' ORDER BY p.date DESC';
    const [rows] = await pool.query(sql, params);
    const list = rows.map((r) => ({
      id: r.id,
      patientId: r.patient_id,
      doctorId: r.doctor_id,
      doctorName: r.doctor_name,
      date: r.date?.toISOString?.()?.slice(0, 10) || r.date,
      medications: typeof r.medications === 'string' ? JSON.parse(r.medications) : r.medications,
      notes: r.notes,
    }));
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authMiddleware, requireRole('doctor'), async (req, res) => {
  try {
    const { patientId, medications, notes } = req.body;
    if (!patientId || !medications?.length) {
      return res.status(400).json({ error: 'Patient and medications required' });
    }
    const id = randomUUID();
    const medJson = JSON.stringify(medications);
    await pool.query(
      'INSERT INTO prescriptions (id, patient_id, doctor_id, date, medications, notes) VALUES (?, ?, ?, CURDATE(), ?, ?)',
      [id, patientId, req.userId, medJson, notes || null]
    );
    res.status(201).json({
      id,
      patientId,
      doctorId: req.userId,
      date: new Date().toISOString().slice(0, 10),
      medications,
      notes: notes || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
