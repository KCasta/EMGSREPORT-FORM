import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const allowedDepartments = [
  "Parcel",
  "Media",
  "IELTS Masterclass",
  "Express CV",
  "Job Application",
  "IELTS Booking",
  "Travel/Tour",
  "OSCE",
  "Customer Service",
  "Marketing",
  "IT Department",
];

// Generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";

export async function POST(req) {
  try {
    const { name, email, password, role, departments } = await req.json();

    // Input validation
    if (!name || !email || !password || !role || !departments?.length) {
      return NextResponse.json(
        { message: "All fields are required, including department(s)." },
        { status: 400 }
      );
    }

    // Department validation
    const invalidDepts = departments.filter(
      (d) => !allowedDepartments.includes(d)
    );
    if (invalidDepts.length > 0) {
      return NextResponse.json(
        { message: `Invalid department(s): ${invalidDepts.join(", ")}` },
        { status: 400 }
      );
    }

    // Leaders MUST have only 1 department
    if (role === "leader" && departments.length !== 1) {
      return NextResponse.json(
        { message: "Leaders must belong to EXACTLY one department." },
        { status: 400 }
      );
    }

    await connectDB();

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists." },
        { status: 400 }
      );
    }

    // Create OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      role,
      departments,
      otp,
      otpExpires,
      isVerified: false,
    });

    await newUser.save();

    // EMAIL CONFIG
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    const mailOptions = {
      from: `"EMGS Reports" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your EMGS OTP Verification",
      html: `
        <div style="font-family: Arial; padding:20px;">
          <h2>Your OTP Code</h2>
          <p>Hello <b>${name}</b>, your verification code is:</p>
          <h1 style="letter-spacing:5px;">${otp}</h1>
          <p>This code expires in 10 minutes.</p>
        </div>
      `,
    };

    // Send email
    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error("Email Error:", err);
      await User.findByIdAndDelete(newUser._id);
      return NextResponse.json(
        { message: "Failed to send OTP email." },
        { status: 500 }
      );
    }

    // DO NOT LOG IN YET → User must verify OTP FIRST
    return NextResponse.json(
      {
        message: "OTP sent successfully!",
        redirectTo: `/verify-otp?email=${email}`,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup Error:", err);
    return NextResponse.json(
      { message: "Signup failed", error: err.message },
      { status: 500 }
    );
  }
}
