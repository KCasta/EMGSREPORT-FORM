import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();

    const { email, otp } = await req.json();

    // ✅ Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // ✅ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Check OTP match
    if (user.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // ✅ Check OTP expiration
    if (user.otpExpires && user.otpExpires < Date.now()) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    // ✅ Mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    // ⚙️ Disable password validation to avoid re-hash error
    await user.save({ validateModifiedOnly: true });

    // ✅ Return success with user info
    return NextResponse.json(
      {
        message: "✅ Email verified successfully.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
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
