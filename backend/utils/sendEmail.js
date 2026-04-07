import nodemailer from 'nodemailer';

/**
 * Send an email via Gmail SMTP.
 * Returns `true` on success, `false` on failure — never throws.
 */
const sendEmail = async ({ to, subject, text }) => {
  // Bail out early if credentials aren't configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[Email Service] EMAIL_USER or EMAIL_PASS not set — skipping email delivery.');
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Amazon Clone" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Success. Response: ${info.response}`);
    return true;
  } catch (error) {
    console.error('[Email Service] Failure! Error:', error.message);
    // Return false instead of re-throwing — caller decides how to handle
    return false;
  }
};

export default sendEmail;
