const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "kelechizobam82@gmail.com",
    pass: "ikiimnpkybsbtmlm",
  },
});

async function sendTest() {
  try {
    const info = await transporter.sendMail({
      from: '"EMGS Report" <kelechizobam82@gmail.com>',
      to: "kelechizobam82@gmail.com",
      subject: "SMTP Test Success",
      text: "🎉 If you see this, your email setup works perfectly!",
    });
    console.log("✅ Email sent:", info.response);
  } catch (err) {
    console.error("❌ Failed:", err);
  }
}

sendTest();
