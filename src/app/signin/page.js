"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Signin = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Sign in failed. Please try again.");
        setLoading(false);
        return;
      }

      // ✅ Save user & token
      localStorage.setItem("token", data.token || "");
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);

      setMessage("✅ Sign in successful!");
      setLoading(false);

      // ✅ Redirect based on backend response
      if (data.redirectTo) {
        router.push(data.redirectTo);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Sign In Error:", error);
      setMessage("❌ Something went wrong. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 font-sans px-4 py-8">
      <div className="flex flex-col lg:flex-row bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl w-full">
        {/* Left Section */}
        <div className="w-full lg:w-1/2 relative h-72 lg:h-auto">
          <img
            src="https://placehold.co/600x800?text=Welcome+Back"
            alt="Welcome"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-red-800 opacity-90" />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Newly Employed
            </h2>
            <p className="text-sm md:text-lg mb-6">
              Create an account to start managing your tasks and reports.
            </p>
            <Link href="/">
              <button className="bg-black text-white font-semibold py-2 px-6 rounded-full shadow-md hover:bg-black transition duration-300 transform hover:scale-105 text-sm md:text-base">
                SIGN UP
              </button>
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-white overflow-y-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-red-800 mb-4 text-center">
            Sign In
          </h2>

          <p className="text-center text-black mb-6 text-sm">
            Don’t have an account?{" "}
            <Link href="/" className="text-red-800 hover:underline">
              Sign up
            </Link>
          </p>

          {message && (
            <p
              className={`text-center mb-4 font-medium ${
                message.includes("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm text-black mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="text-black w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Role */}
            <div className="z-10 relative">
              <label htmlFor="role" className="block text-sm text-black mb-1">
                Select Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="text-black w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="" disabled hidden>
                  Choose Role
                </option>
                <option value="leader">Leader</option>
                <option value="worker">Worker</option>
              </select>
            </div>

            {/* Password */}
            <div className="relative z-0">
              <label
                htmlFor="password"
                className="block text-sm text-black mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="text-black w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-semibold py-3 px-6 rounded-md shadow-md hover:bg-red-800 transition duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "SIGN IN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
