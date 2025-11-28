"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * WorkerReportForm
 * - Department dropdown (populated from logged-in user departments when available)
 * - Sends { reportDate, responses, department } to the API
 * - Shows the submitter's name (from localStorage user)
 * - Keeps styling & animations
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

const Parcelworker = () => {
  // form state for date and responses
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

  // department chosen for this report
  const [department, setDepartment] = useState("");
  // list of options to show in dropdown (either user's departments or all)
  const [deptOptions, setDeptOptions] = useState(ALL_DEPARTMENTS);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // submitter name loaded from localStorage (set at signin)
  const [submitterName, setSubmitterName] = useState("");

  // on mount: load user from localStorage and populate departments/options
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        // If the user has departments (array), use them as options and preselect first
        if (Array.isArray(user.departments) && user.departments.length > 0) {
          setDeptOptions(user.departments);
          setDepartment(user.departments[0]);
        } else {
          // otherwise use global list
          setDeptOptions(ALL_DEPARTMENTS);
        }

        // use the user's name for display (field name used in your user object)
        setSubmitterName(user.name || user.fullName || "");
      }
    } catch (err) {
      // if parsing fails, fall back to global list
      setDeptOptions(ALL_DEPARTMENTS);
      setSubmitterName("");
    }
  }, []);

  // handle date inputs (id must match keys in state)
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  // handle yes/no & text responses updates
  const handleResponseChange = (id, value) => {
    setForm((prev) => ({
      ...prev,
      responses: { ...prev.responses, [id]: value },
    }));
  };

  // handle submit: send department + report data to API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!department) {
      setMessage({ type: "error", text: "Please select a department." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // NOTE: ensure this matches whatever your API route is:
      // - if your API file is at `app/api/workerReport/route.js` use "/api/workerReport"
      // - if it is `app/api/workerReports/route.js` use "/api/workerReports"
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

      // success
      setMessage({
        type: "success",
        text: `Report submitted to ${department} leader successfully!`,
      });

      // reset form fields (keep department so user doesn't have to rechoose)
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

      // hide message after a little while
      setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    } catch (error) {
      console.error("Submit Error:", error);
      setMessage({ type: "error", text: "Network error. Please try again." });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black text-white font-inter relative">
      {/* Background watermark logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="/EMGS_Logo.png"
          alt="EMGS Logo"
          className="h-[40vh] opacity-10 object-contain rotate-[268deg]"
        />
      </div>

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
          <p className="text-gray-300 mt-2">
            Share your progress, challenges & feedback below
          </p>

          {/* Show submitter name (taken from localStorage user) */}
          {submitterName && (
            <p className="text-sm text-gray-200 mt-2">
              Submitting as: <strong>{submitterName}</strong>
            </p>
          )}
        </motion.div>

        {/* Feedback message (success/error) */}
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

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="bg-white/10 backdrop-blur-md p-6 rounded-b-3xl border border-gray-700 shadow-2xl mt-4"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Department dropdown */}
            <div className="text-center">
              <label className="block text-gray-300 font-medium">
                Select Department
              </label>
              <select
                id="department"
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

            {/* Report date */}
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
                className="mt-2 px-5 py-3 border border-gray-500 rounded-md bg-white/20 text-white focus:ring-2 focus:ring-red-600 text-center"
              />
            </div>

            {/* Yes/No questions */}
            <div className="p-5 rounded-2xl border border-gray-700 bg-black/30 space-y-5">
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
                  className="rounded-xl p-4 bg-white/5 border border-gray-600"
                >
                  <label className="block mb-2 text-gray-200">{q}</label>
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

            {/* Text feedback */}
            <div className="p-5 rounded-2xl border border-gray-700 bg-black/30 space-y-5">
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
                  <label className="block text-gray-200 mb-2">{q}</label>
                  <textarea
                    rows="2"
                    className="w-full px-3 py-2 bg-white/20 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-red-600"
                    value={form.responses[`text${i + 1}`]}
                    onChange={(e) =>
                      handleResponseChange(`text${i + 1}`, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            {/* Submit */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="py-3 px-12 bg-red-800 hover:bg-red-900 rounded-full text-white font-semibold shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        </motion.div>
      </main>

      <footer className="w-full text-center text-gray-400 py-4">
        <p>© {new Date().getFullYear()} EMGS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Parcelworker;
