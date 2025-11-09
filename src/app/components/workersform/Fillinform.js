"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";

const Fillinform = () => {
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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  const handleResponseChange = (id, value) => {
    setForm({
      ...form,
      responses: { ...form.responses, [id]: value },
    });
  };

  // ✅ FINAL Correct Submit Function
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/workerReports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportDate: form.reportDate,
          responses: form.responses,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "❌ Failed to submit");
        return;
      }

      alert("✅ Report submitted successfully!");

      // Reset form
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
    } catch (error) {
      alert("❌ Network Error");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-inter bg-gradient-to-br from-red-900 via-gray-900 to-black text-white">
      {/* Background Logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="/EMGS_Logo.png"
          alt="EMGS Logo"
          className="h-[40vh] opacity-10 object-contain rotate-[268deg]"
        />
      </div>

      {/* Main Section */}
      <main className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto bg-gradient-to-r from-red-900/90 to-gray-900/80 backdrop-blur-lg border border-red-700 rounded-t-3xl shadow-lg p-5 text-center"
        >
          <h1 className="text-3xl font-bold uppercase text-white">
            EMGS Weekly Workers Report
          </h1>
          <p className="text-gray-300 mt-2">
            Share your progress, challenges & feedback below
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-6 rounded-b-3xl border border-gray-700 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
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
                className="mt-2 px-5 py-3 border border-gray-500 rounded-md bg-white/20 text-white focus:ring-2 focus:ring-red-600 text-center"
              />
            </div>

            {/* Yes/No Questions */}
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

            {/* Text Feedback */}
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
              <button className="py-3 px-12 bg-red-800 hover:bg-red-900 rounded-full text-white font-semibold shadow-lg">
                Submit Report
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

export default Fillinform;
