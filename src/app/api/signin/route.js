import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";

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

    // =============================
    // 🔥 Role & Department Redirect
    // =============================

    let redirectTo = "/"; // default fallback

    if (user.role === "leader") {
      const department = user.departments?.[0];

      if (department) {
        const deptSlug = department
          .replace(/[^a-zA-Z0-9 ]/g, "") // remove symbols like "/"
          .replace(/\s+/g, "") // remove spaces
          .toLowerCase(); // lowercase

        redirectTo = `/leaders/${deptSlug}Leader`;
      } else {
        redirectTo = "/leaders"; // fallback if no department assigned
      }
    }

    if (user.role === "worker") {
      redirectTo = "/workers";
    }

    // =============================
    // 🔐 Create JWT Token
    // =============================
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const response = NextResponse.json(
      {
        message: "Login Successful",
        redirectTo,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          departments: user.departments,
        },
      },
      { status: 200 }
    );

    // 🍪 Send Token to Browser as Cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Signin Error:", error);
    return NextResponse.json(
      { message: "Signin failed", error: error.message },
      { status: 500 }
    );
  }
}
