"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * CustomerCareWorker Form
 * - Sends report to correct leaders based on department
 * - Uses correct department strings
 */

const ALL_DEPARTMENTS = [
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

export default function CustomerCareWorker() {
  const [form, setForm] = useState({
    reportDate: "",
    responses: {
      q1: "",
      q2: "",
      q3: "",
      q4: "",
      q5: "",
      text1: "",
      text2: "",
      text3: "",
      text4: "",
    },
  });

  const [department, setDepartment] = useState("");
  const [deptOptions, setDeptOptions] = useState(ALL_DEPARTMENTS);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [submitterName, setSubmitterName] = useState("");

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user) {
        // Use user's departments if available
        if (Array.isArray(user.departments) && user.departments.length > 0) {
          setDeptOptions(user.departments);
          setDepartment(user.departments[0]);
        } else {
          setDeptOptions(ALL_DEPARTMENTS);
        }

        setSubmitterName(user.name || user.fullName || "");
      }
    } catch {
      setDeptOptions(ALL_DEPARTMENTS);
    }
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleResponseChange = (id, value) => {
    setForm((prev) => ({
      ...prev,
      responses: { ...prev.responses, [id]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!department) {
      setMessage({ type: "error", text: "Please select a department." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/workerReport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportDate: form.reportDate,
          responses: form.responses,
          department,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMessage({
          type: "error",
          text: data?.message || "Failed to submit report.",
        });
        return;
      }

      setMessage({
        type: "success",
        text: `Report submitted to ${department} leader successfully!`,
      });

      setForm({
        reportDate: "",
        responses: {
          q1: "",
          q2: "",
          q3: "",
          q4: "",
          q5: "",
          text1: "",
          text2: "",
          text3: "",
          text4: "",
        },
      });

      setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    } catch (error) {
      setLoading(false);
      setMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black text-white font-inter relative">
      <main className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-gradient-to-r from-red-900/90 to-gray-900/80 backdrop-blur-lg border border-red-700 rounded-t-3xl shadow-lg p-5 text-center"
        >
          <h1 className="text-3xl font-bold uppercase">
            EMGS Weekly Workers Report
          </h1>

          {submitterName && (
            <p className="text-sm text-gray-200 mt-2">
              Submitting as: <strong>{submitterName}</strong>
            </p>
          )}
        </motion.div>

        {/* Message */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className={`mt-4 p-4 rounded-md text-center ${
                message.type === "success" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* FORM */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="bg-white/10 backdrop-blur-md p-6 rounded-b-3xl border border-gray-700 shadow-2xl mt-4"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Department */}
            <div className="text-center">
              <label className="block text-gray-300 font-medium">
                Select Department
              </label>

              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="mt-2 px-5 py-3 border border-gray-500 rounded-md bg-white/20 text-white focus:ring-2 focus:ring-red-600 text-center"
              >
                <option value="">-- Select Department --</option>
                {deptOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Report Date */}
            <div className="text-center">
              <label className="block text-gray-300 font-medium">
                Week Ending Date
              </label>

              <input
                type="date"
                id="reportDate"
                value={form.reportDate}
                onChange={handleChange}
                required
                className="mt-2 px-5 py-3 bg-white/20 text-white border border-gray-500 rounded-md text-center"
              />
            </div>

            {/* YES/NO Questions */}
            <div className="p-5 border border-gray-700 bg-black/30 rounded-2xl space-y-5">
              <h2 className="text-xl text-red-400 text-center underline">
                Quick Yes/No Questions
              </h2>

              {[
                "Did you complete all assigned tasks this week?",
                "Were there any major challenges during your work?",
                "Did you collaborate effectively with your team?",
                "Did you meet your weekly targets?",
                "Do you need extra support or training?",
              ].map((q, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-white/5 border border-gray-600"
                >
                  <label className="block mb-2">{q}</label>

                  <div className="flex justify-center space-x-5">
                    {["Yes", "No"].map((ans) => (
                      <button
                        key={ans}
                        type="button"
                        onClick={() => handleResponseChange(`q${i + 1}`, ans)}
                        className={`px-6 py-2 rounded-full font-semibold border ${
                          form.responses[`q${i + 1}`] === ans
                            ? "bg-red-600 text-white border-red-500"
                            : "bg-white/10 text-gray-300 border-gray-500 hover:bg-white/20"
                        }`}
                      >
                        {ans}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* TEXT FEEDBACK */}
            <div className="p-5 border border-gray-700 bg-black/30 rounded-2xl space-y-5">
              <h2 className="text-xl text-red-400 text-center underline">
                Written Feedback
              </h2>

              {[
                "What challenges did you face this week?",
                "What are your goals for next week?",
                "Do you have any complaints or suggestions?",
                "Any message for your department leader?",
              ].map((q, i) => (
                <div key={i}>
                  <label className="block mb-2">{q}</label>

                  <textarea
                    rows="2"
                    className="w-full px-3 py-2 bg-white/20 text-white border border-gray-600 rounded-md"
                    value={form.responses[`text${i + 1}`]}
                    onChange={(e) =>
                      handleResponseChange(`text${i + 1}`, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            {/* SUBMIT BUTTON */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="py-3 px-12 bg-red-800 hover:bg-red-900 rounded-full text-white font-semibold disabled:opacity-70"
              >
                {loading ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
