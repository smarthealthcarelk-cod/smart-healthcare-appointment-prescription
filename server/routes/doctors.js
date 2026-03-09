import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.specialization, u.profile_image, u.hospital_id, h.name as hospital_name, h.city as hospital_city, h.address as hospital_address,
       ds.available_days, ds.available_slots
       FROM users u
       LEFT JOIN hospitals h ON u.hospital_id = h.id
       LEFT JOIN doctor_schedules ds ON u.id = ds.doctor_id
       LEFT JOIN (SELECT doctor_id, MAX(id) as mid FROM doctor_schedules GROUP BY doctor_id) latest ON ds.doctor_id = latest.doctor_id AND ds.id = latest.mid
       WHERE u.role = 'doctor' AND (ds.id = latest.mid OR ds.id IS NULL)
       ORDER BY u.name`
    );
    const doctors = rows.map((r) => ({
      id: r.id,
      name: r.name,
      specialization: r.specialization,
      profileImage: r.profile_image || null,
      hospital: r.hospital_id
        ? { id: r.hospital_id, name: r.hospital_name, city: r.hospital_city, address: r.hospital_address }
        : null,
      days: r.available_days ? r.available_days.split(',') : [],
      availableSlots: r.available_slots ? r.available_slots.split(',') : [],
    }));
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
