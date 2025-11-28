import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();

    const { email, otp } = await req.json();

    // Required fields
    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Compare OTP
    if (user.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // OTP Expired?
    if (user.otpExpires && user.otpExpires.getTime() < Date.now()) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    // Save without re-validating password hashing
    await user.save({ validateBeforeSave: false });

    // SUCCESS RESPONSE
    return NextResponse.json(
      {
        message: "OTP verified successfully!",
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
          departments: user.departments,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
