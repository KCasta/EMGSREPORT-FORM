import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import WorkerReport from "@/models/WorkerReport";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";

export async function POST(req) {
  try {
    await connectDB();

    // ✅ Get token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Decode user info
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { reportDate, responses } = await req.json();

    // ✅ Determine department (if user has 1 department auto apply)
    const department =
      user.departments.length === 1 ? user.departments[0] : "Multiple Choice";

    // ✅ Save report
    const newReport = await WorkerReport.create({
      userId: user._id,
      department,
      reportDate,
      responses,
    });

    return NextResponse.json(
      { message: "✅ Report Submitted Successfully", report: newReport },
      { status: 201 }
    );
  } catch (error) {
    console.error("Worker Report Error:", error);
    return NextResponse.json(
      { message: "❌ Failed to submit report", error: error.message },
      { status: 500 }
    );
  }
}
