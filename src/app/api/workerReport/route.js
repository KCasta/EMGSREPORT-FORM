import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import WorkerReport from "@/models/WorkerReport";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";

// 📌 Save Worker Report
export async function POST(req) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { reportDate, responses, department } = await req.json();

    if (!department) {
      return NextResponse.json(
        { message: "Department is required" },
        { status: 400 }
      );
    }

    // 📝 Save report
    const newReport = await WorkerReport.create({
      user: user._id,
      department,
      reportDate,
      responses,
    });

    return NextResponse.json(
      { message: "Report submitted successfully", report: newReport },
      { status: 201 }
    );
  } catch (error) {
    console.error("Report Submit Error:", error);
    return NextResponse.json(
      { message: "Failed to submit report", error: error.message },
      { status: 500 }
    );
  }
}

// 📌 Fetch Reports for Leader Dashboard
export async function GET(req) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const leader = await User.findById(decoded.id);
    if (!leader) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 🚫 Workers must NOT access leader reports
    if (leader.role !== "leader") {
      return NextResponse.json(
        { message: "Only leaders can view reports" },
        { status: 403 }
      );
    }

    // 🎯 Leader sees ONLY their department reports
    const dept = leader.departments[0]; // Only one per leader

    const reports = await WorkerReport.find({ department: dept })
      .populate("user", "name email") // show worker info
      .sort({ createdAt: -1 });

    return NextResponse.json({ reports, department: dept }, { status: 200 });
  } catch (error) {
    console.error("Fetch Reports Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch reports", error: error.message },
      { status: 500 }
    );
  }
}
