import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/sendEmail";

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email)
      return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.isVerified)
      return NextResponse.json({ message: "User already verified" });

    // ✅ Rate limit: only resend every 60 seconds
    const now = new Date();
    const lastSent = user.lastOtpSentAt ? new Date(user.lastOtpSentAt) : null;
    if (lastSent && now - lastSent < 60 * 1000) {
      return NextResponse.json(
        { error: "Please wait 1 minute before requesting another OTP." },
        { status: 429 }
      );
    }

    // ✅ Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    user.lastOtpSentAt = now;
    await user.save({ validateModifiedOnly: true });

    // ✅ Send OTP email
    await sendEmail({
      to: email,
      subject: "Your new EMGS OTP",
      text: `Your new OTP is: ${otp}. It expires in 10 minutes.`,
      html: `<p>Your new OTP is: <b>${otp}</b></p><p>It expires in 10 minutes.</p>`,
    });

    return NextResponse.json({ message: "✅ OTP resent successfully" });
  } catch (err) {
    console.error("Resend OTP Error:", err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
