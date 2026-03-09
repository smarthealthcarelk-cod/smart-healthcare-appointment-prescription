import nodemailer from 'nodemailer';

const smtpUser = process.env.SMTP_USER || 'smarthealthcare.lk@gmail.com';
const smtpPass = process.env.SMTP_PASS || 'xqpm rott amyf wddn';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

export async function sendEmail({ to, subject, text, html }) {
  if (!to) throw new Error('Recipient email is required');
  await transporter.sendMail({
    from: `"Smart Healthcare" <${smtpUser}>`,
    to,
    subject,
    text,
    html,
  });
}

export function generateSixDigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

