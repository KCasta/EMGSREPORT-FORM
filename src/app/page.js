"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ChevronDown } from "lucide-react";

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

  // -----------------------------
  // HANDLE ROLE CHANGE
  // -----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "role") {
      setFormData((prev) => ({
        ...prev,
        role: value,
        departments: [], // reset selection when role changes
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // -----------------------------
  // FIXED FUNCTION ✔ worker = many | leader = only one
  // -----------------------------
  const toggleDepartment = (dept) => {
    setFormData((prev) => {
      // Leader → allow ONLY one
      if (prev.role === "leader") {
        return { ...prev, departments: [dept] };
      }

      // Worker → allow MANY
      if (prev.departments.includes(dept)) {
        return {
          ...prev,
          departments: prev.departments.filter((d) => d !== dept),
        };
      } else {
        return {
          ...prev,
          departments: [...prev.departments, dept],
        };
      }
    });
  };

  // -----------------------------
  // SUBMIT FORM
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) return alert("Please select a role.");
    if (formData.password !== formData.confirmPassword)
      return alert("Passwords do not match.");
    if (formData.departments.length === 0)
      return alert("Please select a department.");

    setLoading(true);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) return alert(data.message || "Signup failed");

      // ⭐ STORE DATA FOR OTP PAGE
      localStorage.setItem("emailForOTP", formData.email);
      localStorage.setItem("roleAfterOTP", formData.role);
      localStorage.setItem(
        "selectedDepartments",
        JSON.stringify(formData.departments)
      );

      alert("Signup successful! OTP sent to your email.");

      // ⭐ Redirect *everyone* to OTP page
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
          <div className="absolute inset-0 bg-red-800 opacity-80" />
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-1/2 p-8 md:p-10 flex flex-col justify-center overflow-y-auto">
          <h2 className="text-3xl font-bold text-red-800 mb-6 text-center">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAME */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-3"
            />

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-3"
            />

            {/* ROLE */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-3"
            >
              <option value="">Select Role</option>
              <option value="leader">Leader</option>
              <option value="worker">Worker</option>
            </select>

            {/* DEPARTMENT DROPDOWN */}
            {formData.role && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="w-full flex justify-between items-center border border-gray-300 rounded-md px-4 py-3 bg-white"
                >
                  <span>
                    {formData.departments.length > 0
                      ? formData.departments.join(", ")
                      : "Select Department"}
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
            )}

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-3 pr-10"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-600"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </span>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-3 pr-10"
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 cursor-pointer text-gray-600"
              >
                {showConfirm ? <EyeOff /> : <Eye />}
              </span>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-gray-400" : "bg-red-800 hover:bg-black"
              } text-white font-semibold py-3 rounded-md`}
            >
              {loading ? "Signing Up..." : "SIGN UP"}
            </button>
          </form>

          <Link href="/signin" className="text-center block mt-4 text-red-800">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
