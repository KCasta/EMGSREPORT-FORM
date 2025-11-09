"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const leaderDepartments = [
  {
    name: "Parcel Leader Form",
    href: "/leaders/parcelLeader",
    letter: "P",
    description: "Click below if you are the leader of the Parcel Department.",
  },
  {
    name: "Media Leader Form",
    href: "/leaders/mediaLeader",
    letter: "M",
    description: "Click below if you are the leader of the Media Department.",
  },
  {
    name: "IELTS Masterclass Leader Form",
    href: "/leaders/ielts-masterclass",
    letter: "I",
    description:
      "Click below if you are the leader of the IELTS Masterclass Department.",
  },
  {
    name: "Express CV Leader Form",
    href: "/leaders/express-cv",
    letter: "E",
    description:
      "Click below if you are the leader of the Express CV Department.",
  },
  {
    name: "Job Application Leader Form",
    href: "/leaders/job-application",
    letter: "J",
    description:
      "Click below if you are the leader of the Job Application Department.",
  },
  {
    name: "IELTS Booking Leader Form",
    href: "/leaders/ielts-booking",
    letter: "B",
    description:
      "Click below if you are the leader of the IELTS Booking Department.",
  },
  {
    name: "Travel/Tour Leader Form",
    href: "/leaders/travel-tour",
    letter: "T",
    description:
      "Click below if you are the leader of the Travel/Tour Department.",
  },
  {
    name: "OSCE Leader Form",
    href: "/leaders/osce",
    letter: "O",
    description: "Click below if you are the leader of the OSCE Department.",
  },
  {
    name: "Customer Service Leader Form",
    href: "/leaders/customercareLeader",
    letter: "C",
    description:
      "Click below if you are the leader of the Customer Service Department.",
  },
  {
    name: "NCLEX Leader Form",
    href: "/leaders/nclex",
    letter: "N",
    description: "Click below if you are the leader of the NCLEX Department.",
  },
  {
    name: "Marketing Leader Form",
    href: "/leaders/marketing",
    letter: "M",
    description:
      "Click below if you are the leader of the Marketing Department.",
  },
  {
    name: "IT Leader Form",
    href: "/leaders/it",
    letter: "I",
    description: "Click below if you are the leader of the IT Department.",
  },
];

const Leaders = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const filtered = leaderDepartments.filter((dept) =>
    dept.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/logout", { method: "POST" });
      if (res.ok) {
        setTimeout(() => router.push("/signin"), 1000);
      } else setLoading(false);
    } catch (err) {
      console.error("Logout error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-800 font-sans">
      {/* Header */}
      <header className="py-4 px-5 md:px-12 bg-white/80 backdrop-blur-sm border-b border-gray-300 shadow-sm sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1 }}
            className="w-10 h-10 bg-red-800 rounded-full shadow-md"
          />
          <h1 className="text-xl md:text-2xl font-extrabold text-black tracking-wide">
            EMGS LEADERS REPORT FORM
          </h1>
        </div>

        <button
          onClick={handleLogout}
          disabled={loading}
          className={`px-5 py-2 rounded-lg font-semibold shadow-md text-white transition-all duration-300 ${
            loading
              ? "bg-red-400 cursor-not-allowed"
              : "bg-red-800 hover:bg-black hover:scale-105"
          }`}
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </header>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for your department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-xl border-2 border-gray-300 focus:border-red-800 focus:ring-2 focus:ring-red-700 outline-none shadow-sm transition duration-300"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute right-4 top-3.5 w-6 h-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
            />
          </svg>
        </div>
      </div>

      {/* Department Sections */}
      <main className="max-w-6xl mx-auto px-4 py-12 grid gap-10">
        {filtered.length === 0 && (
          <p className="text-center text-gray-500">No departments found.</p>
        )}

        {filtered.map((dept, idx) => (
          <motion.section
            key={dept.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className={`flex flex-col md:flex-row items-center justify-between gap-10 p-6 md:p-8 rounded-2xl shadow-lg bg-white/80 backdrop-blur-md border border-gray-200 hover:shadow-2xl hover:bg-white transition-all duration-300 ${
              idx % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="md:w-1/2 space-y-4 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-black">
                {dept.name}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {dept.description}
              </p>
              <Link
                href={dept.href}
                className="inline-block mt-2 px-6 py-2 bg-red-800 text-white font-semibold rounded-lg shadow-md hover:bg-black hover:scale-105 transition-all duration-300"
              >
                Open Form
              </Link>
            </div>

            <div className="md:w-1/2 flex justify-center">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.05 }}
                className="w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-white to-gray-100 border-4 border-black rounded-full flex items-center justify-center shadow-lg"
              >
                <span className="text-5xl text-red-800 font-extrabold">
                  {dept.letter}
                </span>
              </motion.div>
            </div>
          </motion.section>
        ))}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 border-t border-gray-300">
        © {new Date().getFullYear()} EMGS Leaders Portal — All rights reserved.
      </footer>
    </div>
  );
};

export default Leaders;
