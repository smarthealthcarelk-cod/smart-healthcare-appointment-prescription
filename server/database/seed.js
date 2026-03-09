import 'dotenv/config';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import { randomUUID } from 'crypto';

const hash = (p) => bcrypt.hashSync(p, 10);

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SLOTS = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickDays(n) { const shuffled = [...DAYS].sort(() => Math.random() - 0.5); return shuffled.slice(0, n).sort().join(','); }
function pickSlots(n) { const shuffled = [...SLOTS].sort(() => Math.random() - 0.5); return shuffled.slice(0, n).sort().join(','); }

async function run() {
  const conn = await pool.getConnection();
  try {
    console.log('Seeding database...');

    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    await conn.query('TRUNCATE medical_records');
    await conn.query('TRUNCATE prescriptions');
    await conn.query('TRUNCATE appointments');
    await conn.query('TRUNCATE doctor_schedules');
    await conn.query('TRUNCATE users');
    await conn.query('TRUNCATE hospitals');
    await conn.query('TRUNCATE specializations');
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');

    // Specializations (12)
    const specs = [
      'General Physician', 'Cardiologist', 'Pediatrician', 'Dermatologist', 'Neurologist', 'Orthopedist',
      'Psychiatrist', 'Gynecologist', 'ENT Specialist', 'Ophthalmologist', 'Urologist', 'Rheumatologist'
    ];
    await conn.query(
      `INSERT INTO specializations (name) VALUES ${specs.map(() => '(?)').join(', ')}`,
      specs
    );
    console.log('Specializations inserted (12).');

    // Hospitals (12)
    const hospitals = [
      ['National Hospital of Sri Lanka', 'Colombo', 'Colombo 10'],
      ['Lanka Hospital', 'Colombo', 'Colombo 05'],
      ['Durdans Hospital', 'Colombo', 'Colombo 03'],
      ['Teaching Hospital Kandy', 'Kandy', 'Peradeniya Road'],
      ['Teaching Hospital Karapitiya', 'Galle', 'Galle Road'],
      ['Jaffna Teaching Hospital', 'Jaffna', 'Hospital Road'],
      ['Asiri Surgical Hospital', 'Colombo', 'Kirulapona'],
      ['Nawaloka Hospital', 'Colombo', 'Nawam Mawatha'],
      ['Hemas Hospital', 'Colombo', 'Wattala Road'],
      ['Base Hospital Gampaha', 'Gampaha', 'Colombo Road'],
      ['District General Hospital Matara', 'Matara', 'Bandarawela Road'],
      ['Teaching Hospital Anuradhapura', 'Anuradhapura', 'New Town']
    ];
    for (let i = 0; i < hospitals.length; i++) {
      await conn.query(
        'INSERT INTO hospitals (id, name, city, address) VALUES (?, ?, ?, ?)',
        [i + 1, ...hospitals[i]]
      );
    }
    console.log('Hospitals inserted (12).');

    // Admins (2)
    const adminId1 = randomUUID();
    const adminId2 = randomUUID();
    await conn.query(
      `INSERT INTO users (id, email, password, role, name) VALUES (?, ?, ?, 'admin', ?), (?, ?, ?, 'admin', ?)`,
      [adminId1, 'admin@test.com', hash('123456'), 'System Administrator', adminId2, 'admin2@test.com', hash('123456'), 'Admin User Two']
    );
    console.log('Admins inserted (2).');

    // Patients (15)
    const patients = [
      ['patient@test.com', 'Nimal Perera', '199012345678', '0771234567', '45, Galle Road, Colombo 03'],
      ['kamal@test.com', 'Kamal Silva', '198567890123', '0719876543', '12, Temple Street, Kandy'],
      ['sithara@test.com', 'Sithara Fernando', '199512345679', '0762345678', '78, Main Street, Galle'],
      ['rohan@test.com', 'Rohan Jayasinghe', '199234567890', '0723456789', '23, Park Road, Colombo 07'],
      ['nadeesha@test.com', 'Nadeesha Wijeratne', '198812345680', '0774567890', '56, Lake Road, Kandy'],
      ['chamara@test.com', 'Chamara Gunawardena', '199345678901', '0715678901', '9, Beach Road, Galle'],
      ['dilini@test.com', 'Dilini Perera', '199678901234', '0766789012', '34, Station Road, Gampaha'],
      ['prasanna@test.com', 'Prasanna Rajapaksa', '198956789012', '0777890123', '67, Hospital Lane, Matara'],
      ['shiranthi@test.com', 'Shiranthi De Silva', '199089012345', '0728901234', '11, Temple Road, Kandy'],
      ['sanka@test.com', 'Sanka Dissanayake', '199190123456', '0719012345', '89, Old Town, Jaffna'],
      ['chandrika@test.com', 'Chandrika Abeywickrama', '198701234567', '0770123456', '22, Main St, Anuradhapura'],
      ['dinesh@test.com', 'Dinesh Ranawaka', '199201345678', '0761234568', '44, Market Road, Colombo 11'],
      ['nadini@test.com', 'Nadini Jayawardena', '199302456789', '0772345679', '5, School Lane, Galle'],
      ['anuradha@test.com', 'Anuradha Senanayake', '198803567890', '0713456780', '77, Hill Street, Kandy'],
      ['lalitha@test.com', 'Lalitha Herath', '199404678901', '0764567891', '33, Garden Road, Colombo 04']
    ];
    const patientIds = [];
    for (const [email, name, nic, phone, address] of patients) {
      const id = randomUUID();
      await conn.query(
        'INSERT INTO users (id, email, password, role, name, nic, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, email, hash('123456'), 'patient', name, nic, phone, address]
      );
      patientIds.push(id);
    }
    console.log('Patients inserted (15).');

    // Doctors (12) - use specialization names from specs, hospital_id 1-12
    const doctorData = [
      ['doctor@test.com', 'Dr. Sunil Jayawardena', 'General Physician', 1, 'GMC-SL-001'],
      ['dr.rani@test.com', 'Dr. Rani Fernando', 'Cardiologist', 2, 'GMC-SL-002'],
      ['dr.ajith@test.com', 'Dr. Ajith De Silva', 'Pediatrician', 1, 'GMC-SL-003'],
      ['dr.samanthi@test.com', 'Dr. Samanthi Wijesinghe', 'Dermatologist', 2, 'GMC-SL-004'],
      ['dr.nishantha@test.com', 'Dr. Nishantha Bandara', 'Neurologist', 3, 'GMC-SL-005'],
      ['dr.dilani@test.com', 'Dr. Dilani Perera', 'Gynecologist', 1, 'GMC-SL-006'],
      ['dr.ruwan@test.com', 'Dr. Ruwan Senanayake', 'Orthopedist', 4, 'GMC-SL-007'],
      ['dr.chamari@test.com', 'Dr. Chamari Gunawardena', 'Psychiatrist', 2, 'GMC-SL-008'],
      ['dr.sameera@test.com', 'Dr. Sameera Jayakody', 'ENT Specialist', 5, 'GMC-SL-009'],
      ['dr.thushari@test.com', 'Dr. Thushari Abeywickrama', 'Ophthalmologist', 3, 'GMC-SL-010'],
      ['dr.mahinda@test.com', 'Dr. Mahinda Rathnayake', 'Urologist', 6, 'GMC-SL-011'],
      ['dr.nadeeka@test.com', 'Dr. Nadeeka Silva', 'Rheumatologist', 4, 'GMC-SL-012']
    ];
    const doctorIds = [];
    for (const [email, name, spec, hospId, license] of doctorData) {
      const id = randomUUID();
      const profileImage = `https://i.pravatar.cc/300?u=${encodeURIComponent(email)}`;
      await conn.query(
        'INSERT INTO users (id, email, password, role, name, specialization, hospital_id, license_no, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, email, hash('123456'), 'doctor', name, spec, hospId, license, profileImage]
      );
      doctorIds.push(id);
    }
    console.log('Doctors inserted (12).');

    // Doctor schedules (one per doctor)
    for (const did of doctorIds) {
      await conn.query(
        'INSERT INTO doctor_schedules (doctor_id, available_days, available_slots) VALUES (?, ?, ?)',
        [did, pickDays(4), pickSlots(5)]
      );
    }
    console.log('Doctor schedules inserted (12).');

    // Appointments (15+) - mix of past (completed), today/tomorrow (confirmed/pending)
    const fmt = (d) => d.toISOString().split('T')[0];
    const today = new Date();
    const aptRows = [];
    const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    const reasons = [
      'Regular checkup', 'Heart palpitations', 'Fever and cough', 'Child vaccination', 'ECG follow-up',
      'Skin rash', 'Headache', 'Joint pain', 'Eye checkup', 'Prenatal visit', 'Allergy symptoms',
      'Blood pressure review', 'Back pain', 'Annual physical', 'Follow-up consultation'
    ];
    for (let i = 0; i < 18; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + (i % 5 === 0 ? -Math.floor(i / 2) : i));
      const status = d < today ? (Math.random() > 0.3 ? 'completed' : 'cancelled') : pick(['pending', 'confirmed']);
      aptRows.push([
        randomUUID(),
        pick(patientIds),
        pick(doctorIds),
        Math.floor(Math.random() * 12) + 1,
        fmt(d),
        pick(SLOTS),
        status,
        pick(reasons)
      ]);
    }
    for (const row of aptRows) {
      await conn.query(
        'INSERT INTO appointments (id, patient_id, doctor_id, hospital_id, date, time, status, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        row
      );
    }
    console.log('Appointments inserted (18).');

    // Prescriptions (15) - only for patients with completed appointments
    const meds = [
      [{ name: 'Paracetamol 500mg', dosage: '2 tablets 3 times daily', duration: '5 days' }, { name: 'Amoxicillin 500mg', dosage: '1 capsule 3 times daily', duration: '7 days' }],
      [{ name: 'Aspirin 75mg', dosage: '1 tablet daily', duration: 'Ongoing' }, { name: 'Atorvastatin 20mg', dosage: '1 tablet at night', duration: 'Ongoing' }],
      [{ name: 'Cetirizine 10mg', dosage: '1 tablet at night', duration: '7 days' }, { name: 'Salbutamol Inhaler', dosage: '2 puffs when needed', duration: 'As required' }],
      [{ name: 'Ibuprofen 400mg', dosage: '1 tablet 3 times daily', duration: '3 days' }],
      [{ name: 'Omeprazole 20mg', dosage: '1 capsule before breakfast', duration: '14 days' }],
      [{ name: 'Metformin 500mg', dosage: '1 tablet twice daily', duration: 'Ongoing' }],
      [{ name: 'Lisinopril 10mg', dosage: '1 tablet in morning', duration: 'Ongoing' }],
      [{ name: 'Clopidogrel 75mg', dosage: '1 tablet daily', duration: 'Ongoing' }],
      [{ name: 'Hydrochlorothiazide 25mg', dosage: '1 tablet daily', duration: '14 days' }],
      [{ name: 'Ciprofloxacin 500mg', dosage: '1 tablet twice daily', duration: '7 days' }],
      [{ name: 'Diclofenac 50mg', dosage: '1 tablet with food', duration: '5 days' }],
      [{ name: 'Prednisolone 5mg', dosage: '2 tablets for 3 days then taper', duration: '7 days' }],
      [{ name: 'Azithromycin 500mg', dosage: '1 tablet daily', duration: '3 days' }],
      [{ name: 'Metronidazole 400mg', dosage: '1 tablet 3 times daily', duration: '7 days' }],
      [{ name: 'Ranitidine 150mg', dosage: '1 tablet twice daily', duration: '14 days' }]
    ];
    const notes = [
      'For fever and infection. Complete full course.', 'Cardiac care. Monitor BP regularly.', 'Allergy and mild asthma. Avoid dust.',
      'Take with food. Rest advised.', 'Complete full course. Avoid alcohol.', 'Monitor blood sugar.', 'Monitor BP weekly.',
      'Regular follow-up required.', 'Reduce salt intake.', 'Avoid dairy with medication.', 'Rest and physiotherapy advised.',
      'Taper as directed. Do not stop suddenly.', 'Complete full course.', 'Avoid alcohol during treatment.', 'Take before meals.'
    ];
    for (let i = 0; i < 15; i++) {
      const pid = pick(patientIds);
      const did = pick(doctorIds);
      const d = new Date(today);
      d.setDate(d.getDate() - (i + 1));
      await conn.query(
        'INSERT INTO prescriptions (id, patient_id, doctor_id, date, medications, notes) VALUES (?, ?, ?, ?, ?, ?)',
        [randomUUID(), pid, did, fmt(d), JSON.stringify(pick(meds)), pick(notes)]
      );
    }
    console.log('Prescriptions inserted (15).');

    // Medical records (15)
    const recordTypes = ['Consultation', 'Cardiac', 'Vaccination', 'Surgery Follow-up', 'Lab Review', 'Emergency', 'Routine Check', 'Follow-up'];
    const summaries = [
      'Fever, sore throat. Diagnosed with viral infection. Prescribed Paracetamol and Amoxicillin.',
      'ECG done. Mild hypertension. Started on Aspirin and statins.',
      'Child flu vaccination completed.',
      'Cough and allergy. Prescribed antihistamine and inhaler.',
      'Knee pain. X-ray done. Physiotherapy recommended.',
      'Skin allergy. Prescribed topical steroid.',
      'Blood sugar elevated. Lifestyle advice given.',
      'Prenatal check-up. All normal.',
      'Vision test done. New glasses prescription.',
      'Ear infection. Antibiotic prescribed.',
      'Joint stiffness. Rheumatoid workup ordered.',
      'Urinary symptoms. Culture sent.',
      'Blood pressure control reviewed. Medication adjusted.',
      'Headache evaluation. MRI scheduled.',
      'Annual health screening. All parameters normal.'
    ];
    for (let i = 0; i < 15; i++) {
      const pid = pick(patientIds);
      const did = pick(doctorIds);
      const d = new Date(today);
      d.setDate(d.getDate() - (i % 7 + 1));
      const drIdx = doctorIds.indexOf(did);
      const drName = drIdx >= 0 ? doctorData[drIdx][1] : 'Dr. Unknown';
      await conn.query(
        'INSERT INTO medical_records (id, patient_id, date, type, doctor_name, summary, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [randomUUID(), pid, fmt(d), pick(recordTypes), drName, pick(summaries), did]
      );
    }
    console.log('Medical records inserted (15).');

    console.log('\nSeed completed.');
    console.log('Admin: admin@test.com, admin2@test.com | Password: 123456');
    console.log('Patients: patient@test.com, kamal@test.com, sithara@test.com, ... (15 total)');
    console.log('Doctors: doctor@test.com, dr.rani@test.com, ... (12 total)');
  } finally {
    conn.release();
    process.exit(0);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
