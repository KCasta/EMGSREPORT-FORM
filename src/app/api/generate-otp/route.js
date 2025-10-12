// utils/otp.js

/**
 * Generates a 6-digit numeric OTP
 * @returns {string} - 6-digit OTP as a string
 */
export const generateOTP = () => {
  // Ensures 6 digits, leading zeros included if needed
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};

/**
 * Generates an OTP and its expiration time
 * @param {number} minutes - Minutes until OTP expires (default 10)
 * @returns {object} - { otp: string, expires: Date }
 */
export const generateOTPWithExpiry = (minutes = 10) => {
  const otp = generateOTP();
  const expires = new Date(Date.now() + minutes * 60 * 1000);
  return { otp, expires };
};

// Example usage
if (require.main === module) {
  const { otp, expires } = generateOTPWithExpiry();
  console.log("Generated OTP:", otp);
  console.log("Expires at:", expires.toLocaleString());
}
