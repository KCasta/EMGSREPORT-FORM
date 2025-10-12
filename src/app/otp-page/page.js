"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const VerifyOTP = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [role, setRole] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  const otpInputRef = useRef(null);

  // Load email and role from localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem("roleAfterOTP");
    const storedEmail = localStorage.getItem("emailForOTP");
    if (storedRole) setRole(storedRole);
    if (storedEmail) setEmail(storedEmail);

    // Auto-focus OTP input
    otpInputRef.current?.focus();
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!email || !otp) {
      setMessage({ type: "error", text: "Please enter both email and OTP." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMessage({
          type: "error",
          text: data.error || "OTP verification failed",
        });
        return;
      }

      setMessage({
        type: "success",
        text: data.message || "OTP verified successfully!",
      });

      // Clear localStorage
      localStorage.removeItem("roleAfterOTP");
      localStorage.removeItem("emailForOTP");

      // Redirect after short delay
      setTimeout(() => {
        if (role === "worker") router.push("/workers");
        else if (role === "leader") router.push("/leaders");
        else router.push("/");
      }, 1500);
    } catch (err) {
      setLoading(false);
      console.error(err);
      setMessage({ type: "error", text: "Server error. Try again." });
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch("/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setMessage({
          type: "error",
          text: data.error || "Failed to resend OTP.",
        });
        return;
      }
      setMessage({ type: "success", text: "OTP resent successfully!" });
      setTimeLeft(600); // Reset countdown
      otpInputRef.current?.focus();
    } catch (err) {
      setLoading(false);
      setMessage({ type: "error", text: "Server error. Try again." });
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-red-800 text-center mb-4">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-700 mb-6">
          Enter the 6-digit OTP sent to your email to activate your account.
        </p>

        {message.text && (
          <div
            className={`mb-4 text-center px-3 py-2 rounded ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mb-4">
          OTP expires in {minutes}:{seconds < 10 ? `0${seconds}` : seconds}{" "}
          minutes
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              readOnly
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label htmlFor="otp" className="block text-sm text-gray-700 mb-1">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
              maxLength={6}
              required
              disabled={loading}
              ref={otpInputRef}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-800 hover:bg-red-900"
            } text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            type="button"
            onClick={handleResendOTP}
            disabled={loading}
            className="w-full mt-2 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md shadow-md transition duration-300"
          >
            Resend OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
