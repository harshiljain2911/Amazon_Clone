import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema(
  {
    fullName:    { type: String, required: true },
    phone:       { type: String, required: true },
    addressLine: { type: String, required: true },
    city:        { type: String, required: true },
    state:       { type: String, required: true },
    pincode:     { type: String, required: true },
    country:     { type: String, default: 'India' },
    isDefault:   { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type:    String,
      required: true,
      trim:    true,
      default: 'Amazon Customer',
    },
    email: {
      type:     String,
      unique:   true,
      required: true,
      lowercase: true,
      trim:     true,
    },
    phone: {
      type:   String,
      trim:   true,
      default: null,
    },
    password: {
      type:   String,
      select: false,    // never returned by default
      default: null,
    },
    isVerified: { type: Boolean, default: false },
    isAdmin:    { type: Boolean, default: false },
    isBlocked:  { type: Boolean, default: false },
    otp:        { type: String, default: null },
    otpExpires: { type: Date, default: null },

    addresses: [addressSchema],

    viewedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    recentSearches: [{ type: String }],

    refreshToken: {
      type:   String,
      select: false,
    },
  },
  { timestamps: true }
);

/* ── Password hashing middleware ── */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* ── Instance helper ── */
userSchema.methods.matchPassword = async function (entered) {
  if (!this.password) return false;
  return bcrypt.compare(entered, this.password);
};

/* ── Indexes for analytics ── */
userSchema.index({ createdAt: -1 });

const User = mongoose.model('User', userSchema);
export default User;
