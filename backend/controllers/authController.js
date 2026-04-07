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
    console.log("Incoming request:", req.body);
    
    if (!req.body.email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const result = await sendOtpService(req.body.email);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error('[sendOtp] Caught Error:', err);
    if (err.stack) console.error(err.stack);
    
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Server error during OTP transmission',
    });
  }
};

/* ── POST /api/auth/verify-otp ── */
export const verifyOtp = async (req, res) => {
  try {
    console.log('[verifyOtp] Request body:', req.body);
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
      },
    });
  } catch (err) {
    console.error('[verifyOtp] Error:', err.message);
    res.status(err.status || 400).json({
      success: false,
      message: err.message || 'Invalid or expired OTP',
    });
  }
};

/* ── POST /api/auth/refresh ── */
export const refreshToken = async (req, res) => {
  try {
    const rt = req.cookies?.refreshToken;
    if (!rt) {
      return res.status(401).json({ success: false, message: 'Refresh token missing' });
    }

    const { accessToken, refreshToken: newRt } = await refreshTokenService(rt);

    res.cookie('refreshToken', newRt, COOKIE_OPTS);
    res.status(200).json({ success: true, token: accessToken });
  } catch (err) {
    console.error('[refreshToken] Error:', err.message);
    res.status(err.status || 401).json({
      success: false,
      message: err.message || 'Invalid or expired refresh token',
    });
  }
};

/* ── POST /api/auth/logout ── */
export const logout = async (req, res) => {
  try {
    await logoutService(req.user?._id);
    res.clearCookie('refreshToken', { ...COOKIE_OPTS, maxAge: 0 });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    console.error('[logout] Error:', err.message);
    res.status(500).json({
      success: false,
      message: err.message || 'Logout failed',
    });
  }
};

/* ── GET /api/auth/me ── */
export const getMe = async (req, res) => {
  try {
    const { _id, name, email, isAdmin, phone, addresses } = req.user;
    res.status(200).json({ _id, name, email, isAdmin, phone, addresses });
  } catch (err) {
    console.error('[getMe] Error:', err.message);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch user',
    });
  }
};
