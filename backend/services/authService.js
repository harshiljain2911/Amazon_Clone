import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Otp from '../models/otpModel.js';
import sendEmail from '../utils/sendEmail.js';
import generateToken, { generateRefreshToken } from '../utils/generateToken.js';

/* ── Send OTP ────────────────────────────────────────────────────────────── */
export const sendOtpService = async (rawEmail) => {
  if (!rawEmail) throw Object.assign(new Error('Email is required'), { status: 400 });

  const email = rawEmail.trim().toLowerCase();

  // 1. Find or Create User
  let user = await User.findOne({ email });
  if (!user) {
    console.log(`[AUTH] Creating new user for ${email}`);
    user = await User.create({ 
      email, 
      name: email.split('@')[0] || 'Amazon Customer' 
    });
  }

  // 2. Generate and Save OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  
  await user.save();
  console.log(`\n[AUTH] ✉️  OTP for ${email}: ${otp}\n`);

  // 3. Send Email (non-blocking failure)
  let emailSent = false;
  try {
    emailSent = await sendEmail({
      to:      email,
      subject: 'Your Amazon Clone OTP',
      text:    `Your one-time password is: ${otp}\n\nThis OTP expires in 5 minutes.`,
    });
  } catch (err) {
    console.error('[AUTH] SMTP Delivery Error:', err.message);
  }

  return { 
    emailSent, 
    message: emailSent ? 'OTP sent successfully' : 'OTP generated (check server console)' 
  };
};

/* ── Verify OTP & issue tokens ───────────────────────────────────────────── */
export const verifyOtpService = async (rawEmail, inputOtp) => {
  if (!rawEmail || !inputOtp) throw Object.assign(new Error('Email and OTP required'), { status: 400 });

  const email = rawEmail.trim().toLowerCase();
  const otp   = inputOtp.toString().trim();

  const user = await User.findOne({ email });

  if (!user) {
    throw Object.assign(new Error('User not found'), { status: 404 });
  }

  console.log("Stored OTP:", user.otp);
  console.log("Entered OTP:", otp);
  console.log("Expiry:", user.otpExpires);

  if (user.otp !== otp) {
    throw Object.assign(new Error('Invalid or expired OTP'), { status: 400 });
  }

  if (!user.otpExpires || Date.now() > user.otpExpires.getTime()) {
    throw Object.assign(new Error('Invalid or expired OTP'), { status: 400 });
  }

  user.otp = null;
  user.otpExpires = null;
  user.isVerified = true;

  const accessToken  = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { user, accessToken, refreshToken };
};

/* ── Refresh access token ────────────────────────────────────────────────── */
export const refreshTokenService = async (refreshToken) => {
  if (!refreshToken) throw Object.assign(new Error('Refresh token missing'), { status: 401 });

  let decoded;
  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh'
    );
  } catch {
    throw Object.assign(new Error('Invalid or expired refresh token'), { status: 401 });
  }

  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== refreshToken) {
    throw Object.assign(new Error('Refresh token reuse detected — please log in again'), { status: 401 });
  }

  const newAccessToken  = generateToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

/* ── Logout ──────────────────────────────────────────────────────────────── */
export const logoutService = async (userId) => {
  if (userId) {
    await User.findByIdAndUpdate(userId, { $unset: { refreshToken: '' } });
  }
};
