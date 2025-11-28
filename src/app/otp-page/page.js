"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyOTP() {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");

  // Only read email secretly from localStorage
  const email =
    typeof window !== "undefined" ? localStorage.getItem("emailForOTP") : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (otp.length !== 6) {
      setMessage("OTP must be 6 digits.");
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
        setMessage(data.error || "Invalid OTP");
        return;
      }

      setMessage("OTP verified successfully!");

      // Cleanup
      localStorage.removeItem("emailForOTP");
      localStorage.removeItem("roleAfterOTP");

      setTimeout(() => router.push("/signin"), 1500);
    } catch (err) {
      setLoading(false);
      setMessage("Server error. Try again.");
    }
  };

  const handleResend = async () => {
    setResending(true);
    setMessage("");

    try {
      const res = await fetch("/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setResending(false);

      if (!res.ok) {
        setMessage(data.error || "Failed to resend OTP");
        return;
      }

      setMessage("A new OTP has been sent to your email.");
    } catch (err) {
      setResending(false);
      setMessage("Server error. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl w-full max-w-sm shadow-md">
        <h2 className="text-2xl font-bold text-center text-red-800 mb-4">
          Enter OTP
        </h2>

        {message && (
          <p className="text-center mb-4 text-red-700 font-medium">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={otp}
            autoFocus
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            className="w-full text-center text-xl font-semibold tracking-widest border rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-600"
            maxLength={6}
            placeholder="------"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-800 text-white py-3 rounded-lg hover:bg-red-900"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          {/* RESEND OTP BUTTON */}
          <button
            type="button"
            disabled={resending}
            onClick={handleResend}
            className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600"
          >
            {resending ? "Resending..." : "Resend OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
