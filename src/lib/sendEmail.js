import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 465,
      secure: process.env.EMAIL_SECURE === "true" || true, // ✅ SSL for Gmail
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // ✅ prevents socket close errors
      },
      connectionTimeout: 10000, // optional: gives up after 10s if Gmail stalls
    });

    await transporter.sendMail({
      from: `"EMGS Reports" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(`✅ Email sent successfully to ${to}`);
  } catch (err) {
    console.error("❌ Email sending error:", err.message);
    throw new Error("Failed to send email");
  }
};
