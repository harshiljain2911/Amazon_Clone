import { sendOtpService, verifyOtpService, refreshTokenService, logoutService } from '../services/authService.js';

const COOKIE_OPTS = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge:   30 * 24 * 60 * 60 * 1000, // 30 days in ms
};

/* ── POST /api/auth/send-otp ── */
export const sendOtp = async (req, res) => {
  try {
    const result = await sendOtpService(req.body.email);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Server error during OTP transmission'
    });
  }
};

/* ── POST /api/auth/verify-otp ── */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const { user, accessToken, refreshToken } = await verifyOtpService(email, otp);

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, COOKIE_OPTS);

    // Return success precisely as frontend hook expects
    res.status(200).json({
      success: true,
      token:   accessToken,
      user: {
        _id:     user._id,
        name:    user.name,
        email:   user.email,
        isAdmin: user.isAdmin,
      }
    });
  } catch (err) {
    res.status(err.status || 400).json({
      success: false,
      message: err.message || 'Invalid or expired OTP'
    });
  }
};

/* ── POST /api/auth/refresh ── */
export const refreshToken = async (req, res, next) => {
  try {
    const rt = req.cookies?.refreshToken;
    const { accessToken, refreshToken: newRt } = await refreshTokenService(rt);

    res.cookie('refreshToken', newRt, COOKIE_OPTS);
    res.status(200).json({ success: true, token: accessToken });
  } catch (err) {
    res.status(err.status || 401);
    next(err);
  }
};

/* ── POST /api/auth/logout ── */
export const logout = async (req, res, next) => {
  try {
    await logoutService(req.user?._id);
    res.clearCookie('refreshToken', { ...COOKIE_OPTS, maxAge: 0 });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

/* ── GET /api/auth/me ── */
export const getMe = async (req, res) => {
  const { _id, name, email, isAdmin, phone, addresses } = req.user;
  res.status(200).json({ _id, name, email, isAdmin, phone, addresses });
};
