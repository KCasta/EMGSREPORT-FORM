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
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  const otpInputRef = useRef(null);

  // Load stored email + role
  useEffect(() => {
    const storedRole = localStorage.getItem("roleAfterOTP");
    const storedEmail = localStorage.getItem("emailForOTP");
    if (storedRole) setRole(storedRole);
    if (storedEmail) setEmail(storedEmail);
    otpInputRef.current?.focus();
  }, []);

  // Timer
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

      // Remove temporary role/email data
      localStorage.removeItem("roleAfterOTP");
      localStorage.removeItem("emailForOTP");

      // Redirect Logic
      setTimeout(() => {
        if (role === "worker") {
          const storedDepts = JSON.parse(
            localStorage.getItem("selectedDepartments") || "[]"
          );

          if (storedDepts.length === 1) {
            const dept = storedDepts[0];

            const deptRoutes = {
              "Parcel Dept": "/workers/parcelworker",
              "Media Dept": "/workers/mediaworker",
              "IELTS Masterclass Dept": "/workers/ielts-masterclass",
              "Express CV Dept": "/workers/express-cv",
              "Job Application Dept": "/workers/job-application",
              "IELTS Booking Dept": "/workers/ielts-booking",
              "Travel/Tour Dept": "/workers/travel-tour",
              "OSCE Dept": "/workers/osce",
              "Customer Service Dept": "/workers/customer-care",
              "NCLEX Dept": "/workers/nclex",
              "Marketing Dept": "/workers/marketing",
              "IT Dept": "/workers/itdepartment",
            };

            const route = deptRoutes[dept];
            if (route) router.push(route);
            else router.push("/workers");
          } else {
            router.push("/workers"); // choose department page
          }
        } else if (role === "leader") {
          router.push("/leaders");
        } else {
          router.push("/");
        }
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
      setTimeLeft(600);
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
          Enter the OTP sent to your email to activate your account.
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
          <input
            value={email}
            readOnly
            className="w-full border px-4 py-2 rounded bg-gray-100"
          />

          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            ref={otpInputRef}
            className="w-full border px-4 py-2 rounded"
            maxLength={6}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-800 hover:bg-red-900 text-white py-2 rounded"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            type="button"
            onClick={handleResendOTP}
            disabled={loading}
            className="w-full mt-2 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
          >
            Resend OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
