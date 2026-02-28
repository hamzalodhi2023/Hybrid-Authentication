import nodemailer from "nodemailer";

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: process.env.SMTP_PORT,
  secure: true, // Use true for port 465, false for port 587
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

const sendMail = async (to, subject, text, html) => {
  const info = await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to,
    subject,
    text,
    html,
  });
};

export default sendMail;
