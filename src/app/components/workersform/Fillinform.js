"use client";
import React, { useState } from "react";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";

// Department options
const departments = [
  "Media",
  "Marketing",
  "Parcel",
  "IT",
  "Customer Service",
  "Ielts Masterclass",
  "Job Application",
  "Express CV",
  "IELTS Booking",
  "Travel/Tour",
  "osce",
  "NCLEX",
];

const Fillinform = () => {
  const [form, setForm] = useState({
    employeeName: "",
    department: "",
    reportDate: "",
    completedTasks: "",
    ongoingTasks: "",
    tasksNextWeek: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    alert("Report submitted successfully!");
  };

  return (
    <div className="relative min-h-screen w-full bg-white overflow-hidden">
      {/* === Background Image Centered === */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="/EMGS_Logo.png"
          alt="EMGS Logo"
          className="h-[30vh] w-auto opacity-20 object-contain rotate-[268deg]"
        />
      </div>

      {/* === Page Content === */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 font-inter pt-4">
        {/* Header */}
        <div className="max-w-5xl mx-auto bg-red-800 text-white p-6 rounded-t-lg shadow-md text-center">
          <h1 className="text-3xl font-bold">EMGS Weekly Workers Report</h1>
        </div>

        {/* Form */}
        <div className="max-w-5xl mx-auto bg-gray-50 p-8 rounded-b-lg shadow-lg mt-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="employeeName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Employee Name
                </label>
                <input
                  type="text"
                  id="employeeName"
                  value={form.employeeName}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-black rounded-md text-black sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700"
                >
                  Department
                </label>
                <select
                  id="department"
                  value={form.department}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-black rounded-md text-black sm:text-sm"
                >
                  <option value="">Select a Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="reportDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Report Date (Week Ending)
                </label>
                <input
                  type="date"
                  id="reportDate"
                  value={form.reportDate}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-black rounded-md text-black sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Interact with our Social Media
                </label>
                <div className="flex space-x-4 text-xl mt-2 text-red-800">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram />
                  </a>
                  <a
                    href="https://tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTiktok />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebook />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-md border border-gray-200 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Working Details
              </h2>

              <div>
                <label
                  htmlFor="completedTasks"
                  className="block text-sm font-medium text-gray-700"
                >
                  Completed Tasks
                </label>
                <textarea
                  id="completedTasks"
                  rows="4"
                  value={form.completedTasks}
                  onChange={handleChange}
                  required
                  placeholder="List tasks completed this week..."
                  className="mt-1 w-full px-3 py-2 border border-black rounded-md text-black sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="ongoingTasks"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ongoing Tasks
                </label>
                <textarea
                  id="ongoingTasks"
                  rows="4"
                  value={form.ongoingTasks}
                  onChange={handleChange}
                  required
                  placeholder="Describe tasks currently in progress..."
                  className="mt-1 w-full px-3 py-2 border border-black rounded-md text-black sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="tasksNextWeek"
                  className="block text-sm font-medium text-gray-700"
                >
                  Any Complaint or Area of Improvement
                </label>
                <textarea
                  id="tasksNextWeek"
                  rows="4"
                  value={form.tasksNextWeek}
                  onChange={handleChange}
                  required
                  placeholder="Mention any complaints or areas of improvement..."
                  className="mt-1 w-full px-3 py-2 border border-black rounded-md text-black sm:text-sm"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="py-3 px-6 bg-red-800 text-white rounded-md hover:bg-red-900 transition"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-gray-600 text-sm py-4">
        <p>&copy; {new Date().getFullYear()} EMGS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Fillinform;
