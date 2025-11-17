import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  // In development, log the email to the console instead of sending
  if (process.env.NODE_ENV === 'development') {
    console.log('--- MOCKED EMAIL ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('Body (HTML):');
    console.log(html);
    console.log('--------------------');
    return Promise.resolve();
  }

  try {
    await transporter.sendMail({
      from: `"ShockWave Platform" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
  }
};


export const sendVerificationEmail = async (userEmail, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
  const subject = 'Verify Your Email Address for ShockWave';
  const html = `
    <h1>Welcome to ShockWave!</h1>
    <p>Please click the link below to verify your email address:</p>
    <a href="${verificationUrl}" target="_blank">Verify My Email</a>
    <p>If you did not sign up for an account, you can safely ignore this email.</p>
  `;
  await sendEmail(userEmail, subject, html);
};


export const sendPasswordResetEmail = async (userEmail, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
  const subject = 'Password Reset Request for ShockWave';
  const html = `
    <h1>Password Reset Request</h1>
    <p>You requested a password reset for your ShockWave account. Please click the link below to set a new password:</p>
    <a href="${resetUrl}" target="_blank">Reset My Password</a>
    <p>This link will expire in one hour.</p>
    <p>If you did not request a password reset, please ignore this email.</p>
  `;
  await sendEmail(userEmail, subject, html);
};