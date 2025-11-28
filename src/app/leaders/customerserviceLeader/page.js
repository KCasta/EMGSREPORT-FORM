"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

/** Convert rating number into text */
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

export default function CustomerServiceLeaderDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  /** Fetch reports for Customer Service department */
  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch(
          "/api/workerReport?department=Customer Service"
        );
        const data = await res.json();
        setReports(data.reports || []);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, [refreshKey]);

  /** Format date properly */
  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  /** Placeholder for step 4 rating system */
  const handleRating = async (reportId, rating) => {
    console.log("RATE:", reportId, rating);
  };

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
          Customer Service Leader Dashboard
        </h1>
        <p className="text-gray-700 text-sm sm:text-base">
          Review weekly worker reports below
        </p>
      </motion.div>

      {/* Loading state */}
      {loading && (
        <p className="text-center text-gray-600">Loading reports...</p>
      )}

      {/* Empty state */}
      {!loading && reports.length === 0 && (
        <p className="text-center text-gray-600 italic">
          No reports submitted yet for the Customer Service department.
        </p>
      )}

      {/* Reports Grid */}
      <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report, idx) => {
          const submitter =
            report.user?.name ||
            report.user?.fullName ||
            report.user?.email ||
            "Worker";

          return (
            <motion.div
              key={report._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              className="bg-white border border-red-800 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all"
            >
              <h2 className="text-xl font-bold text-red-900 mb-1">
                {submitter}
              </h2>

              <p className="text-sm text-gray-500 mb-2">
                {formatDate(report.createdAt)}
              </p>

              <p className="text-gray-800 mb-4 leading-relaxed">
                {report.responses?.text1 ||
                  report.responses?.text2 ||
                  "No summary provided."}
              </p>

              {/* Rating */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={18}
                      className={
                        report.rating >= s
                          ? "fill-red-800 text-red-800"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>

                <span className="text-sm font-semibold text-red-800">
                  {report.rating ? getRatingLabel(report.rating) : "Not rated"}
                </span>
              </div>

              <div className="flex justify-between items-center mt-4">
                {/* View Details */}
                <button
                  onClick={() => setSelectedReport(report)}
                  className="px-4 py-1.5 border border-red-800 rounded-full text-sm font-semibold text-red-800 hover:bg-red-800 hover:text-white transition-all"
                >
                  View Details
                </button>

                {/* Quick rating buttons */}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(report._id, star)}
                      className="px-2 py-1 border rounded text-xs text-gray-700 hover:bg-gray-100"
                    >
                      {star}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Details modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white text-black rounded-2xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 text-red-700 font-bold text-lg"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-2">
              {selectedReport.user?.name}
            </h2>

            <p className="text-gray-600 italic mb-4">
              {selectedReport.department}
            </p>

            <div className="space-y-1 text-sm">
              {Object.entries(selectedReport.responses).map(([key, value]) => (
                <p key={key}>
                  <strong>{key.toUpperCase()}:</strong> {value || "—"}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
