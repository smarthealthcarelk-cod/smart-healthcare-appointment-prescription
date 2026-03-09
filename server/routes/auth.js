import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import { signToken } from '../middleware/auth.js';
import { randomUUID } from 'crypto';
import Joi from 'joi';
import { validateBody } from '../middleware/validate.js';

const router = express.Router();

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  nic: Joi.string().allow('', null),
  phone: Joi.string().allow('', null),
  address: Joi.string().allow('', null),
});

router.post('/login', validateBody(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query(
      'SELECT id, email, password, role, name, nic, phone, address, specialization, hospital_id, license_no FROM users WHERE email = ?',
      [email]
    );
    const user = rows[0];
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const { password: _, ...safe } = user;
    const token = signToken(user);
    res.json({ token, user: safe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/register', validateBody(registerSchema), async (req, res) => {
  try {
    const { name, email, password, nic, phone, address } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password required' });
    }
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR phone = ?',
      [email, phone || null]
    );
    if (existing.length) {
      return res.status(400).json({ error: 'Email or phone already registered' });
    }
    const id = randomUUID();
    const hashed = bcrypt.hashSync(password, 10);
    await pool.query(
      'INSERT INTO users (id, email, password, role, name, nic, phone, address, email_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, email, hashed, 'patient', name, nic || null, phone || null, address || null, 0]
    );
    const [rows] = await pool.query(
      'SELECT id, email, role, name, nic, phone, address FROM users WHERE id = ?',
      [id]
    );
    const user = rows[0];
    const token = signToken({ id: user.id, role: user.role });
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
