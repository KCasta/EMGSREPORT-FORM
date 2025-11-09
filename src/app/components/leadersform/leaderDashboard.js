// app/leaders/page.jsx

"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reports = [
  {
    id: 1,
    name: "John Doe",
    department: "Parcel Dept",
    summary: "Completed all assigned deliveries with no issues.",
    rating: 5,
  },
  {
    id: 2,
    name: "Jane Smith",
    department: "Maintenance",
    summary: "Delayed one task due to equipment issues.",
    rating: 3,
  },
  {
    id: 3,
    name: "Peter Obi",
    department: "Diesel Team",
    summary: "Excellent team coordination and reporting.",
    rating: 4,
  },
];

const getRatingLabel = (rating) => {
  switch (rating) {
    case 1:
      return "Poor";
    case 2:
      return "Fair";
    case 3:
      return "Average";
    case 4:
      return "Good";
    case 5:
      return "Excellent";
    default:
      return "";
  }
};

const LeaderDashboard = () => {
  return (
    <div className="min-h-screen bg-white text-red-900 py-10 px-4 sm:px-8 font-inter">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-bold uppercase mb-2">
          EMGS Leader Dashboard
        </h1>
        <p className="text-gray-700 text-sm sm:text-base">
          Review weekly worker reports below
        </p>
      </motion.div>

      {/* Reports Section */}
      <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="bg-white border border-red-800 rounded-2xl shadow-md hover:shadow-lg hover:shadow-red-200 transition-all p-6"
          >
            <h2 className="text-xl font-bold text-red-900 mb-1">
              {report.name}
            </h2>
            <p className="text-sm text-gray-600 italic mb-2">
              {report.department}
            </p>
            <p className="text-gray-800 mb-4 leading-relaxed">
              {report.summary}
            </p>

            {/* Rating Section */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={`${
                      i < report.rating
                        ? "fill-red-800 text-red-800"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-red-800">
                {getRatingLabel(report.rating)}
              </span>
            </div>

            {/* Action Buttons (optional for future use) */}
            <div className="flex justify-end mt-4 space-x-3">
              <button className="px-4 py-1.5 border border-red-800 rounded-full text-sm font-semibold text-red-800 hover:bg-red-800 hover:text-white transition-all">
                View Details
              </button>
              <button className="px-4 py-1.5 border border-gray-400 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all">
                Comment
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Report Form Button */}
      <div className="flex justify-center mt-12">
        <Link href="/leaders/LeaderForm">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-8 py-3 border border-red-800 text-red-800 bg-white font-semibold rounded-full transition-all hover:bg-black hover:text-white"
          >
            Report Form
          </motion.button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-600 text-sm mt-12">
        © {new Date().getFullYear()} EMGS. All rights reserved.
      </footer>
    </div>
  );
};

export default LeaderDashboard;
