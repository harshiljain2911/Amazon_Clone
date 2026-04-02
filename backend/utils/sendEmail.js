import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, text }) => {
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
    console.error(`[Email Service] Failure! Stack Trace:`, error);
    return false;
  }
};

export default sendEmail;
