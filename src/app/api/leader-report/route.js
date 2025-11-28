import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, department, q1, q2, q3, q4, summary } = body;

    if (!name || !department || !q1 || !q2 || !q3 || !q4) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Configure Gmail transport
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Fixes Gmail SSL issues
      },
    });

    const htmlMessage = `
      <h2>📌 Leader Weekly Report</h2>

      <p><b>Name:</b> ${name}</p>
      <p><b>Department:</b> ${department}</p>

      <hr />

      <p><b>Q1:</b> ${q1}</p>
      <p><b>Q2:</b> ${q2}</p>
      <p><b>Q3:</b> ${q3}</p>
      <p><b>Q4:</b> ${q4}</p>

      <hr />

      <p><b>Summary:</b></p>
      <p>${summary || "No additional summary provided."}</p>
    `;

    await transporter.sendMail({
      from: `"EMGS Reports" <${process.env.EMAIL_USER}>`,
      to: "kelechizobam82@gmail.com", // ⭐ your email here
      subject: `New Leader Report – ${department}`,
      html: htmlMessage,
    });

    return NextResponse.json({ message: "Email sent!" }, { status: 200 });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json(
      { error: "Failed to send email", details: err.message },
      { status: 500 }
    );
  }
}
