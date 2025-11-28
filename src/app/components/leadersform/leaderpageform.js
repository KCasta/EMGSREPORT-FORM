"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const LeaderPageForm = () => {
  const [formData, setFormData] = useState({
    leaderName: "",
    department: "",
    week: "",
    performanceSummary: "",
    challengesFaced: "",
    teamScore: "",
    recommendations: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Leader Report Submitted:", formData);
    alert("Leader report submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl bg-white border border-gray-200 rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-red-700">
          EMGS Leaders Weekly Report Form
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Leader Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-800">
              Leader Name
            </label>
            <input
              type="text"
              name="leaderName"
              value={formData.leaderName}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 outline-none"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-semibold text-gray-800">
              Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 outline-none"
              required
            >
              <option value="">Select department</option>
              <option value="Media">Media</option>
              <option value="Marketing">Marketing</option>
              <option value="Parcel">Parcel</option>
              <option value="Sales">Sales</option>
              <option value="Technical">Technical</option>
              <option value="Support">Support</option>
            </select>
          </div>

          {/* Week */}
          <div>
            <label className="block text-sm font-semibold text-gray-800">
              Week of Report
            </label>
            <input
              type="week"
              name="week"
              value={formData.week}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 outline-none"
              required
            />
          </div>

          {/* Performance Summary */}
          <div>
            <label className="block text-sm font-semibold text-gray-800">
              Performance Summary
            </label>
            <textarea
              name="performanceSummary"
              value={formData.performanceSummary}
              onChange={handleChange}
              rows="4"
              placeholder="Summarize your team’s performance this week..."
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 outline-none"
              required
            ></textarea>
          </div>

          {/* Challenges Faced */}
          <div>
            <label className="block text-sm font-semibold text-gray-800">
              Challenges Faced
            </label>
            <textarea
              name="challengesFaced"
              value={formData.challengesFaced}
              onChange={handleChange}
              rows="3"
              placeholder="Mention any challenges faced this week..."
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 outline-none"
            ></textarea>
          </div>

          {/* Team Score */}
          <div>
            <label className="block text-sm font-semibold text-gray-800">
              Team Performance Score (1 - 5)
            </label>
            <select
              name="teamScore"
              value={formData.teamScore}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 outline-none"
            >
              <option value="">Select a rating</option>
              <option value="1">⭐ Poor</option>
              <option value="2">⭐⭐ Fair</option>
              <option value="3">⭐⭐⭐ Good</option>
              <option value="4">⭐⭐⭐⭐ Very Good</option>
              <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
            </select>
          </div>

          {/* Recommendations */}
          <div>
            <label className="block text-sm font-semibold text-gray-800">
              Recommendations / Suggestions
            </label>
            <textarea
              name="recommendations"
              value={formData.recommendations}
              onChange={handleChange}
              rows="3"
              placeholder="Provide any recommendations or suggestions..."
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 outline-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 mt-6  font-semibold text-white bg-red-700 rounded-lg hover:bg-black transition"
          >
            Submit Report
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default LeaderPageForm;
