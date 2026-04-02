import mongoose from 'mongoose';

const otpSchema = mongoose.Schema({
  email: {
    type: String, 
    required: true,
  },
  otpHash: { // Replacing plaintext `otp` for extreme security
    type: String,
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 300 // The document auto-deletes after 5 minutes
  }
});

const Otp = mongoose.model('Otp', otpSchema);

export default Otp;
