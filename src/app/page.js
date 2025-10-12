"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react"; // 👁️ import icons

const LandingPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) {
      alert("Please select a role before submitting.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      // Store role & email for OTP page
      // Store role & email for OTP page
      // Store role & email for OTP page
      localStorage.setItem("emailForOTP", formData.email);
      localStorage.setItem("roleAfterOTP", formData.role);

      // Redirect to OTP page
      alert("Signup successful! Please verify your email with OTP.");
      router.push("/otp-page");
    } catch (err) {
      setLoading(false);
      console.error("Error during signup:", err);
      alert("An unexpected error occurred. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col lg:flex-row bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl w-full h-full lg:h-[90vh]">
        {/* Left Section */}
        <div className="w-full lg:w-1/2 relative h-72 lg:h-full">
          <img
            src="https://placehold.co/600x800?text=Welcome+Back"
            alt="Welcome"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-red-800 opacity-90" />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4">
              Welcome Back!
            </h2>
            <p className="text-base md:text-lg mb-4 md:mb-8">
              Sign in to your account to continue managing reports and tasks.
            </p>
            <Link href="/signin">
              <button className="bg-black text-white font-semibold py-2 md:py-3 px-6 md:px-8 rounded-full shadow-md hover:bg-black transition duration-300 transform hover:scale-105">
                SIGN IN
              </button>
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-white overflow-y-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-red-800 mb-4 md:mb-6 text-center">
            Create Account
          </h2>
          <p className="text-center text-black mb-4 md:mb-6 text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="text-red-800 hover:underline">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 md:py-3"
              required
            />
            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 md:py-3"
              required
            />
            {/* Role */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 md:py-3"
              required
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="leader">Leader</option>
              <option value="worker">Worker</option>
            </select>

            {/* Password */}
            {/* Password */}
            <div>
              {/* Password Hint */}
              <p className="text-xs text-gray-500 mt-1">
                Password must be 8–12 characters long and include at least one
                uppercase letter, one lowercase letter, one number, and one
                special character (e.g., @, #, $).
              </p>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 md:py-3 pr-10"
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 hover:text-red-800"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 md:py-3 pr-10"
                required
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 hover:text-red-800"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-red-800 text-sm hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-gray-400" : "bg-red-800 hover:bg-red-900"
              } text-white font-semibold py-2 md:py-3 rounded-md transition`}
            >
              {loading ? "Signing Up..." : "SIGN UP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
