import express from 'express';
import pool from '../config/db.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { randomUUID } from 'crypto';
import { sendEmail } from '../utils/email.js';
import Joi from 'joi';
import { validateBody } from '../middleware/validate.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    let sql = `SELECT a.*, 
      pa.name as patient_name, doc.name as doctor_name, h.name as hospital_name
      FROM appointments a
      JOIN users pa ON a.patient_id = pa.id
      JOIN users doc ON a.doctor_id = doc.id
      LEFT JOIN hospitals h ON a.hospital_id = h.id WHERE 1=1`;
    const params = [];
    if (req.role === 'patient') {
      sql += ' AND a.patient_id = ?';
      params.push(req.userId);
    } else if (req.role === 'doctor') {
      sql += ' AND a.doctor_id = ?';
      params.push(req.userId);
    }
    sql += ' ORDER BY a.date, a.time';
    const [rows] = await pool.query(sql, params);
    const list = rows.map((r) => ({
      id: r.id,
      patientId: r.patient_id,
      doctorId: r.doctor_id,
      hospitalId: r.hospital_id,
      patientName: r.patient_name,
      hospitalName: r.hospital_name,
      date: r.date?.toISOString?.()?.slice(0, 10) || r.date,
      time: r.time,
      status: r.status,
      reason: r.reason,
    }));
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/admin', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.id, a.patient_id, a.doctor_id, a.hospital_id, a.date, a.time, a.status, a.reason,
       pa.name as patient_name, doc.name as doctor_name, h.name as hospital_name
       FROM appointments a
       JOIN users pa ON a.patient_id = pa.id
       JOIN users doc ON a.doctor_id = doc.id
       LEFT JOIN hospitals h ON a.hospital_id = h.id
       ORDER BY a.date, a.time`
    );
    const list = rows.map((r) => ({
      id: r.id,
      patientId: r.patient_id,
      doctorId: r.doctor_id,
      hospitalId: r.hospital_id,
      patientName: r.patient_name,
      doctorName: r.doctor_name,
      hospitalName: r.hospital_name,
      date: r.date?.toISOString?.()?.slice(0, 10) || r.date,
      time: r.time,
      status: r.status,
      reason: r.reason,
    }));
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const createAppointmentSchema = Joi.object({
  doctorId: Joi.string().uuid().required(),
  hospitalId: Joi.alternatives().try(Joi.number().integer(), Joi.string()).allow(null, ''),
  date: Joi.string().isoDate().required(),
  time: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
  reason: Joi.string().allow('', null),
});

router.post('/', authMiddleware, requireRole('patient'), validateBody(createAppointmentSchema), async (req, res) => {
  try {
    const { doctorId, hospitalId, date, time, reason } = req.body;
    if (!doctorId || !date || !time) {
      return res.status(400).json({ error: 'Doctor, date and time required' });
    }
    // Prevent double booking for same doctor/date/time (pending or confirmed)
    const [conflicts] = await pool.query(
      `SELECT id FROM appointments 
       WHERE doctor_id = ? AND date = ? AND time = ? 
       AND status IN ('pending','confirmed')`,
      [doctorId, date, time]
    );
    if (conflicts.length) {
      return res.status(400).json({ error: 'This time slot is already booked for the selected doctor.' });
    }
    let hid = hospitalId;
    if (!hid) {
      const [doc] = await pool.query('SELECT hospital_id FROM users WHERE id = ? AND role = ?', [doctorId, 'doctor']);
      hid = doc[0]?.hospital_id;
    }
    if (!hid) return res.status(400).json({ error: 'Hospital required. Select doctor\'s hospital or a hospital.' });
    const id = randomUUID();
    await pool.query(
      'INSERT INTO appointments (id, patient_id, doctor_id, hospital_id, date, time, reason) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, req.userId, doctorId, hid, date, time, reason || null]
    );
    const [rows] = await pool.query('SELECT * FROM appointments WHERE id = ?', [id]);
    const r = rows[0];
    res.status(201).json({
      id: r.id,
      patientId: r.patient_id,
      doctorId: r.doctor_id,
      hospitalId: r.hospital_id,
      date: r.date?.toISOString?.()?.slice(0, 10) || r.date,
      time: r.time,
      status: r.status,
      reason: r.reason,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin-triggered email reminders for upcoming appointments
router.post('/reminders/send', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.id, a.date, a.time, a.status,
              pa.email AS patient_email, pa.name AS patient_name,
              doc.name AS doctor_name, h.name AS hospital_name
       FROM appointments a
       JOIN users pa ON a.patient_id = pa.id
       JOIN users doc ON a.doctor_id = doc.id
       LEFT JOIN hospitals h ON a.hospital_id = h.id
       WHERE a.date = CURDATE() + INTERVAL 1 DAY
         AND a.status IN ('pending','confirmed')`
    );
    let sent = 0;
    // Fire-and-forget best effort; errors per email are ignored to not block others
    await Promise.all(rows.map(async (r) => {
      if (!r.patient_email) return;
      const subject = 'Appointment Reminder - Smart Healthcare';
      const text = `Dear ${r.patient_name || 'Patient'},

This is a reminder for your appointment scheduled on ${r.date?.toISOString?.()?.slice(0, 10) || r.date} at ${r.time} with ${r.doctor_name || 'your doctor'} at ${r.hospital_name || 'the hospital'}.

If you are unable to attend, please update or cancel your appointment through the Smart Healthcare system.

Thank you.`;
      try {
        await sendEmail({ to: r.patient_email, subject, text });
        sent += 1;
      } catch {
        // log in real system
      }
    }));
    res.json({ success: true, processed: rows.length, sent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/status', authMiddleware, requireRole('doctor'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const [rows] = await pool.query('SELECT doctor_id FROM appointments WHERE id = ?', [req.params.id]);
    if (!rows[0] || rows[0].doctor_id !== req.userId) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    await pool.query('UPDATE appointments SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/cancel', authMiddleware, requireRole('patient'), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT patient_id, status FROM appointments WHERE id = ?', [req.params.id]);
    const appt = rows[0];
    if (!appt || appt.patient_id !== req.userId) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    if (appt.status === 'completed') {
      return res.status(400).json({ error: 'Completed appointments cannot be cancelled' });
    }
    if (appt.status === 'cancelled') {
      return res.status(400).json({ error: 'Appointment is already cancelled' });
    }
    await pool.query('UPDATE appointments SET status = ? WHERE id = ?', ['cancelled', req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
