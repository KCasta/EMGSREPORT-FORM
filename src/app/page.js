"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ChevronDown, Check } from "lucide-react";

const departmentsList = [
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
  "IT Department",
];

const LandingPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
    departments: [],
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle department checkbox toggle
  const toggleDepartment = (dept) => {
    setFormData((prev) => {
      const alreadySelected = prev.departments.includes(dept);
      const updated = alreadySelected
        ? prev.departments.filter((d) => d !== dept)
        : [...prev.departments, dept];
      return { ...prev, departments: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) return alert("Please select a role.");
    if (formData.password !== formData.confirmPassword)
      return alert("Passwords do not match.");
    if (formData.departments.length === 0)
      return alert("Please select at least one department.");

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
          departments: formData.departments,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) return alert(data.message || "Signup failed");

      localStorage.setItem("emailForOTP", formData.email);
      localStorage.setItem("roleAfterOTP", formData.role);

      alert("Signup successful! Please verify your email with OTP.");
      router.push("/otp-page");
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col lg:flex-row bg-white rounded-lg shadow-xl overflow-hidden max-w-6xl w-full">
        {/* LEFT SIDE */}
        <div className="w-full lg:w-1/2 relative h-72 lg:h-full">
          <img
            src="https://placehold.co/600x800?text=Welcome+Back"
            alt="Welcome"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-red-800 opacity-90" />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Welcome Back!
            </h2>
            <p className="text-base md:text-lg mb-6">
              Sign in to your account to continue managing reports and tasks.
            </p>
            <Link href="/signin">
              <button className="bg-black text-white font-semibold py-3 px-8 rounded-full shadow-md hover:bg-gray-900 transition-transform transform hover:scale-105">
                SIGN IN
              </button>
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-1/2 p-8 md:p-10 flex flex-col justify-center overflow-y-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-red-800 mb-6 text-center">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-800"
              required
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-800"
              required
            />

            {/* Role */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-800"
              required
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="leader">Leader</option>
              <option value="worker">Worker</option>
            </select>

            {/* Department Multi-Select Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="w-full flex justify-between items-center border border-gray-300 rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-red-800"
              >
                <span className="text-gray-700">
                  {formData.departments.length > 0
                    ? formData.departments.join(", ")
                    : "Select Department(s)"}
                </span>
                <ChevronDown size={20} className="text-gray-600" />
              </button>

              {dropdownOpen && (
                <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                  {departmentsList.map((dept) => (
                    <label
                      key={dept}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.departments.includes(dept)}
                        onChange={() => toggleDepartment(dept)}
                        className="mr-2 accent-red-800"
                      />
                      {dept}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <p className="text-xs text-gray-500 mb-1">
                Must include uppercase, lowercase, number & special character.
              </p>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-red-800"
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
                className="w-full border border-gray-300 rounded-md px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-red-800"
                required
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 hover:text-red-800"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

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
                loading ? "bg-gray-400" : "bg-red-800 hover:bg-black"
              } text-white font-semibold py-3 rounded-md transition`}
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
