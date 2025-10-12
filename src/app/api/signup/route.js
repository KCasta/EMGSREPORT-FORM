import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

// Generate 6-digit numeric OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();

    // ✅ Validate input
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    // ✅ Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // ✅ Create new user (password auto-hashes via User model)
    const newUser = new User({
      name,
      email,
      password,
      role,
      otp,
      otpExpires,
      isVerified: false,
    });

    await newUser.save();

    // ✅ Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === "true", // true for 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // ✅ Email content
    const mailOptions = {
      from: `"EMGS Reports" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your EMGS OTP Verification",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #fafafa; border-radius: 10px; color: #333;">
          <h2 style="color: #d32f2f;">EMGS Email Verification</h2>
          <p>Hello <b>${name}</b>,</p>
          <p>Your one-time password (OTP) is:</p>
          <div style="font-size: 24px; font-weight: bold; color: #000; margin: 10px 0;">
            ${otp}
          </div>
          <p>This code will expire in <b>10 minutes</b>.</p>
          <p>If you didn’t request this, please ignore this email.</p>
          <br/>
          <p>— The EMGS Team</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Error sending OTP email:", emailError);
      await User.findByIdAndDelete(newUser._id); // Rollback user if email fails
      return NextResponse.json(
        { message: "Failed to send OTP email. Please try again." },
        { status: 500 }
      );
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Create response with cookie
    const response = NextResponse.json(
      {
        message: "✅ User registered successfully. Please verify your email.",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );

    // ✅ Set cookie securely
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { message: "❌ Signup failed", error: error.message },
      { status: 500 }
    );
  }
}
