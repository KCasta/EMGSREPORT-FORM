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
      required: [true, "Role is required"],
    },
    // ✅ Allow multiple departments
    departments: {
      type: [String],
      enum: allowedDepartments,
      default: [],
      validate: {
        validator: function (arr) {
          return arr.every((dept) => allowedDepartments.includes(dept));
        },
        message: "Invalid department selection.",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      maxlength: [12, "Password must not exceed 12 characters"],
      validate: {
        validator: function (value) {
          // ✅ Must contain uppercase, lowercase, number, and special character
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(value);
        },
        message:
          "Password must include uppercase, lowercase, number, and special character.",
      },
    },
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

// ✅ Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ✅ Compare passwords
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Prevent model overwrite (Next.js hot reload fix)
export default mongoose.models.User || mongoose.model("User", UserSchema);
