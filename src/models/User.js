import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
  "NCLEX",
  "IT Department",
];

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["worker", "leader"],
      required: true,
    },

    departments: {
      type: [String],
      enum: allowedDepartments,
      default: [],
      validate: {
        validator: function (arr) {
          if (this.role === "leader") return arr.length === 1;
          return arr.every((d) => allowedDepartments.includes(d));
        },
        message:
          "Leaders must belong to exactly ONE department. Workers may belong to multiple.",
      },
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 12,
      validate: {
        validator: function (value) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(value);
        },
        message:
          "Password must include uppercase, lowercase, number, and special character.",
      },
    },

    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },

    // ============================
    // 🔥 POINT SYSTEM ADDED
    // ============================

    points: {
      type: Number,
      default: 0, // Workers start with 0 points
    },

    formsSubmitted: {
      type: Number,
      default: 0, // to know if user already earned the +5 point
    },

    lastRatedReport: {
      type: String,
      default: null, // report ID of last report rated
    },
  },
  { timestamps: true }
);

// Hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
