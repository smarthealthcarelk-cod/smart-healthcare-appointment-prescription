import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import auth from './routes/auth.js';
import authExtra from './routes/auth-extra.js';
import rateLimit from 'express-rate-limit';
import users from './routes/users.js';
import hospitals from './routes/hospitals.js';
import doctors from './routes/doctors.js';
import appointments from './routes/appointments.js';
import prescriptions from './routes/prescriptions.js';
import medicalRecords from './routes/medicalRecords.js';
import reports from './routes/reports.js';
import specializations from './routes/specializations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

// Basic rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
});

// Static uploads for profile images
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

app.use('/api/auth', authLimiter, auth);
app.use('/api/auth', authLimiter, authExtra);
app.use('/api/users', users);
app.use('/api/hospitals', hospitals);
app.use('/api/doctors', doctors);
app.use('/api/appointments', appointments);
app.use('/api/prescriptions', prescriptions);
app.use('/api/medical-records', medicalRecords);
app.use('/api/reports', reports);
app.use('/api/specializations', specializations);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
