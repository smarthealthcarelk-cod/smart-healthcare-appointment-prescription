import express from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';
import { authMiddleware, requireRole, signToken } from '../middleware/auth.js';
import { randomUUID } from 'crypto';
import Joi from 'joi';
import { validateBody } from '../middleware/validate.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${req.userId}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image uploads are allowed'));
    }
    cb(null, true);
  },
});

router.get('/patients', authMiddleware, requireRole('admin', 'doctor'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, nic, phone, address FROM users WHERE role = ? ORDER BY name',
      ['patient']
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/patients-for-prescription', authMiddleware, requireRole('doctor'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT DISTINCT u.id, u.name, u.email, u.nic, u.phone, u.address
       FROM users u
       INNER JOIN appointments a ON a.patient_id = u.id
       WHERE a.doctor_id = ? AND a.status = 'completed' AND u.role = 'patient'
       ORDER BY u.name`,
      [req.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, email, role, name, nic, phone, address, specialization, hospital_id, license_no 
       FROM users ORDER BY role, name`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, email, role, name, nic, phone, address, specialization, hospital_id, license_no, profile_image FROM users WHERE id = ?',
      [req.userId]
    );
    if (!rows[0]) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { name, email, nic, phone, address, profileImage } = req.body;
    await pool.query(
      'UPDATE users SET name=?, email=?, nic=?, phone=?, address=?, profile_image=?, updated_at=NOW() WHERE id=?',
      [name || null, email || null, nic || null, phone || null, address || null, profileImage || null, req.userId]
    );
    const [rows] = await pool.query(
      'SELECT id, email, role, name, nic, phone, address, profile_image FROM users WHERE id = ?',
      [req.userId]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/me/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }
    const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [req.userId]);
    if (!rows[0]) return res.status(404).json({ error: 'User not found' });
    const valid = await bcrypt.compare(currentPassword, rows[0].password);
    if (!valid) return res.status(400).json({ error: 'Current password is incorrect' });
    const hashed = bcrypt.hashSync(newPassword, 10);
    await pool.query('UPDATE users SET password=?, updated_at=NOW() WHERE id=?', [hashed, req.userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/me/profile-image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const relativePath = `/uploads/${req.file.filename}`;
    const url = `${baseUrl}${relativePath}`;
    await pool.query('UPDATE users SET profile_image=?, updated_at=NOW() WHERE id=?', [url, req.userId]);
    res.json({ profileImage: url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const addDoctorSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  specialization: Joi.string().allow('', null),
  hospitalId: Joi.alternatives().try(Joi.number().integer(), Joi.string()).allow(null, ''),
  licenseNo: Joi.string().allow('', null),
  availableDays: Joi.array().items(Joi.string()).default(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']),
  availableSlots: Joi.array().items(Joi.string()).default(['09:00', '10:00', '11:00', '14:00', '15:00']),
  profileImage: Joi.string().uri().allow('', null),
});

router.post('/doctors', authMiddleware, requireRole('admin'), validateBody(addDoctorSchema), async (req, res) => {
  try {
    const { name, email, password, specialization, hospitalId, licenseNo, availableDays, availableSlots, profileImage } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password required' });
    }
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const id = randomUUID();
    const hashed = bcrypt.hashSync(password, 10);
    await pool.query(
      'INSERT INTO users (id, email, password, role, name, specialization, hospital_id, license_no, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, email, hashed, 'doctor', name, specialization || null, hospitalId || null, licenseNo || null, profileImage || null]
    );
    const days = Array.isArray(availableDays) ? availableDays.join(',') : (availableDays || 'Mon,Tue,Wed,Thu,Fri');
    const slots = Array.isArray(availableSlots) ? availableSlots.join(',') : (availableSlots || '09:00,10:00,11:00,14:00,15:00');
    await pool.query(
      'INSERT INTO doctor_schedules (doctor_id, available_days, available_slots) VALUES (?, ?, ?)',
      [id, days, slots]
    );
    const [rows] = await pool.query(
      'SELECT id, email, role, name, specialization, hospital_id, license_no FROM users WHERE id = ?',
      [id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update doctor schedule (admin)
const updateScheduleSchema = Joi.object({
  availableDays: Joi.array().items(Joi.string()).min(1).required(),
  availableSlots: Joi.array().items(Joi.string()).min(1).required(),
});

// Update own schedule (doctor)
router.put('/me/schedule', authMiddleware, requireRole('doctor'), validateBody(updateScheduleSchema), async (req, res) => {
  try {
    const doctorId = req.userId;
    const { availableDays, availableSlots } = req.body;
    const days = availableDays.join(',');
    const slots = availableSlots.join(',');
    await pool.query('DELETE FROM doctor_schedules WHERE doctor_id = ?', [doctorId]);
    await pool.query(
      'INSERT INTO doctor_schedules (doctor_id, available_days, available_slots) VALUES (?, ?, ?)',
      [doctorId, days, slots]
    );
    res.json({ success: true, availableDays, availableSlots });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/doctors/:id/schedule', authMiddleware, requireRole('admin'), validateBody(updateScheduleSchema), async (req, res) => {
  try {
    const doctorId = req.params.id;
    const { availableDays, availableSlots } = req.body;
    const days = availableDays.join(',');
    const slots = availableSlots.join(',');
    await pool.query('DELETE FROM doctor_schedules WHERE doctor_id = ?', [doctorId]);
    await pool.query(
      'INSERT INTO doctor_schedules (doctor_id, available_days, available_slots) VALUES (?, ?, ?)',
      [doctorId, days, slots]
    );
    res.json({ success: true, availableDays, availableSlots });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT role FROM users WHERE id = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'User not found' });
    if (rows[0].role !== 'doctor') {
      return res.status(400).json({ error: 'Only doctors can be removed' });
    }
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
