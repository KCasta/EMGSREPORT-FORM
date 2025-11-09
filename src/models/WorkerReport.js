import mongoose from "mongoose";

const WorkerReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    reportDate: {
      type: Date,
      required: true,
    },

    // ✅ Yes/No Answers
    responses: {
      q1: { type: String, enum: ["Yes", "No"], required: true },
      q2: { type: String, enum: ["Yes", "No"], required: true },
      q3: { type: String, enum: ["Yes", "No"], required: true },
      q4: { type: String, enum: ["Yes", "No"], required: true },
      q5: { type: String, enum: ["Yes", "No"], required: true },

      // ✅ Written text responses
      text1: { type: String, default: "" },
      text2: { type: String, default: "" },
      text3: { type: String, default: "" },
      text4: { type: String, default: "" },
    },

    // ⭐ Leader Rating (Default = Not Rated)
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    leaderComment: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Prevent re-registering model during dev hot reload
export default mongoose.models.WorkerReport ||
  mongoose.model("WorkerReport", WorkerReportSchema);
