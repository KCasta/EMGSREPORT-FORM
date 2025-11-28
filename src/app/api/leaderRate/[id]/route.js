import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import WorkerReport from "@/models/WorkerReport";

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = params; // Report ID from URL
    const { rating, leaderComment } = await req.json(); // Data from frontend

    await WorkerReport.findByIdAndUpdate(
      id,
      {
        rating,
        leaderComment: leaderComment || "", // Optional comment
      },
      { new: true }
    );

    return NextResponse.json(
      { message: "✅ Rating Updated Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Leader Rate Error:", error);
    return NextResponse.json(
      { message: "❌ Failed to update rating", error: error.message },
      { status: 500 }
    );
  }
}
