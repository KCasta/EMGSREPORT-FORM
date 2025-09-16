// app/leaders/page.jsx or wherever you want it

"use client";
import React from "react";
import { Star } from "lucide-react"; // or use your own icons

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
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold text-red-800 mb-6 text-center">
        Leader Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white shadow-lg rounded-2xl border border-red-800 p-6"
          >
            <h2 className="text-xl font-semibold text-red-800">
              {report.name}
            </h2>
            <p className="text-red-800 italic mb-1">{report.department}</p>
            <p className="text-red-800 mb-4">{report.summary}</p>

            <div className="flex items-center space-x-2">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  size={20}
                  className={`${
                    index < report.rating
                      ? "fill-red-800 text-red-800"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-red-800 font-semibold">
                {getRatingLabel(report.rating)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderDashboard;
