import express from 'express';
import pool from '../config/db.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM hospitals ORDER BY name');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { name, city, address } = req.body;
    if (!name?.trim() || !city?.trim() || !address?.trim()) {
      return res.status(400).json({ error: 'Name, city and address required' });
    }
    const [result] = await pool.query(
      'INSERT INTO hospitals (name, city, address) VALUES (?, ?, ?)',
      [name.trim(), city.trim(), address.trim()]
    );
    res.status(201).json({ id: result.insertId, name: name.trim(), city: city.trim(), address: address.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
