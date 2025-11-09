import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";

const departmentRoutes = {
  "Parcel Dept": "/workers/parcelworker",
  "Media Dept": "/workers/mediaworker",
  "IELTS Masterclass Dept": "/workers/ielts-masterclass",
  "Express CV Dept": "/workers/express-cv",
  "Job Application Dept": "/workers/job-application",
  "IELTS Booking Dept": "/workers/ielts-booking",
  "Travel/Tour Dept": "/workers/travel-tour",
  "OSCE Dept": "/workers/osce",
  "Customer Service Dept": "/workers/customer-care",
  "NCLEX Dept": "/workers/nclex",
  "Marketing Dept": "/workers/marketing",
  "IT Dept": "/workers/itdepartment",
};

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { message: "Please verify your email before logging in" },
        { status: 403 }
      );
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ✅ Determine redirect based on department count
    const departments = user.departments || [];
    let redirectTo = "/workers"; // default if multiple departments

    if (departments.length === 1) {
      redirectTo = departmentRoutes[departments[0]] || "/workers";
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      {
        message: "✅ Login successful",
        redirectTo, // ✅ frontend uses this
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Signin Error:", error);
    return NextResponse.json(
      { message: "❌ Signin failed", error: error.message },
      { status: 500 }
    );
  }
}
