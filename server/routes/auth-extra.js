import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import { signToken } from '../middleware/auth.js';
import { sendEmail, generateSixDigitCode } from '../utils/email.js';
import Joi from 'joi';
import { validateBody } from '../middleware/validate.js';

const router = express.Router();

// Helper: upsert a code in a simple table
async function saveCode(table, identifierField, identifierValue, code) {
  await pool.query(
    `INSERT INTO ${table} (${identifierField}, code, expires_at)
     VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))
     ON DUPLICATE KEY UPDATE code = VALUES(code), expires_at = VALUES(expires_at)`,
    [identifierValue, code]
  );
}

const registerRequestSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  nic: Joi.string().allow('', null),
  phone: Joi.string().allow('', null),
  address: Joi.string().allow('', null),
});

const verifyRegisterSchema = registerRequestSchema.append({
  code: Joi.string().length(6).required(),
});

const forgotSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(6).required(),
  newPassword: Joi.string().min(6).required(),
});

// Registration: request verification code
router.post('/register/request-code', validateBody(registerRequestSchema), async (req, res) => {
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
    const code = generateSixDigitCode();
    await saveCode('email_verification_codes', 'email', email, code);
    await sendEmail({
      to: email,
      subject: 'Smart Healthcare - Registration Verification Code',
      text: `Your verification code is ${code}. It will expire in 15 minutes.`,
    });
    res.json({ success: true, tempUser: { name, email, nic, phone, address } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Registration: verify code and create account
router.post('/register/verify-code', validateBody(verifyRegisterSchema), async (req, res) => {
  try {
    const { name, email, password, nic, phone, address, code } = req.body;
    if (!name || !email || !password || !code) {
      return res.status(400).json({ error: 'Name, email, password and code required' });
    }
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR phone = ?',
      [email, phone || null]
    );
    if (existing.length) {
      return res.status(400).json({ error: 'Email or phone already registered' });
    }
    const [rows] = await pool.query(
      'SELECT code, expires_at FROM email_verification_codes WHERE email = ?',
      [email]
    );
    const row = rows[0];
    if (!row || row.code !== code || new Date(row.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired verification code' });
    }
    const hashed = bcrypt.hashSync(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (id, email, password, role, name, nic, phone, address, email_verified) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?)',
      [email, hashed, 'patient', name, nic || null, phone || null, address || null, 1]
    );
    const insertedId = result.insertId || null;
    const [userRows] = await pool.query(
      'SELECT id, email, role, name, nic, phone, address FROM users WHERE email = ?',
      [email]
    );
    const user = userRows[0];
    await pool.query('DELETE FROM email_verification_codes WHERE email = ?', [email]);
    const token = signToken({ id: user.id || insertedId, role: user.role });
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Forgot password: request code
router.post('/password/forgot', validateBody(forgotSchema), async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    const [rows] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    if (!rows[0]) {
      // Do not reveal whether email exists
      return res.json({ success: true });
    }
    const code = generateSixDigitCode();
    await saveCode('password_reset_codes', 'email', email, code);
    await sendEmail({
      to: email,
      subject: 'Smart Healthcare - Password Reset Code',
      text: `Your password reset code is ${code}. It will expire in 15 minutes.`,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Forgot password: verify code and change password
router.post('/password/reset', validateBody(resetSchema), async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'Email, code and new password required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }
    const [rows] = await pool.query(
      'SELECT code, expires_at FROM password_reset_codes WHERE email = ?',
      [email]
    );
    const row = rows[0];
    if (!row || row.code !== code || new Date(row.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired code' });
    }
    const hashed = bcrypt.hashSync(newPassword, 10);
    await pool.query('UPDATE users SET password = ?, updated_at = NOW() WHERE email = ?', [hashed, email]);
    await pool.query('DELETE FROM password_reset_codes WHERE email = ?', [email]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

