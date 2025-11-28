"use client";

import React, { useState } from "react";

export default function LeaderReportForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    department: "",
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    summary: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/leader-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMessage(data.error || "❌ Failed to send report.");
        return;
      }

      setMessage("✅ Report sent successfully!");

      setForm({
        name: "",
        department: "",
        q1: "",
        q2: "",
        q3: "",
        q4: "",
        summary: "",
      });
    } catch (err) {
      setLoading(false);
      setMessage("❌ Server error. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-xl w-full">
        <h1 className="text-3xl font-bold text-center text-red-800 mb-6">
          Leader Weekly Report
        </h1>

        {message && (
          <p className="text-center mb-4 font-semibold text-red-700">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="name"
            type="text"
            placeholder="Leader Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border px-4 py-3 rounded-md"
          />

          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            required
            className="w-full border px-4 py-3 rounded-md"
          >
            <option value="">Select Department</option>
            <option>Parcel</option>
            <option>Media</option>
            <option>IELTS Masterclass</option>
            <option>Express CV</option>
            <option>Job Application</option>
            <option>IELTS Booking</option>
            <option>Travel/Tour</option>
            <option>OSCE</option>
            <option>Customer Service</option>
            <option>Marketing</option>
            <option>IT Department</option>
          </select>

          {/* Leader Questions */}
          {["q1", "q2", "q3", "q4"].map((q, i) => (
            <textarea
              key={q}
              name={q}
              rows="2"
              placeholder={`Question ${i + 1}`}
              value={form[q]}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-md"
              required
            />
          ))}

          <textarea
            name="summary"
            rows="3"
            placeholder="Additional Comments / Summary"
            value={form.summary}
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-md"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-800 hover:bg-black text-white py-3 rounded-lg transition"
          >
            {loading ? "Sending..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
}
