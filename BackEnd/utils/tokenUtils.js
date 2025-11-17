import crypto from 'crypto';

// Generate a random token for email verification
export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate a random token for password reset
export const generateResetToken = () => {
    return crypto.randomBytes(32).toString('hex');
};