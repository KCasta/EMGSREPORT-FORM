"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const leaderDepartments = [
  {
    name: "Parcel Leader Form",
    href: "/leaders/parcelLeader",
    letter: "P",
    description: "Click below if you are the leader of the Parcel Department.",
  },
  {
    name: "Media Leader Form",
    href: "/leaders/media",
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
    href: "/leaders/customer-service",
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
  const [loading, setLoading] = useState(false); // ✅ for logout button
  const router = useRouter();

  const filtered = leaderDepartments.filter((dept) =>
    dept.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Logout function (same as workers)
  const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/logout", { method: "POST" });

      if (res.ok) {
        // optional: clear auth data
        // localStorage.removeItem("authToken");
        setTimeout(() => {
          router.push("/signin");
        }, 1000);
      } else {
        console.error("Logout failed");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error during logout:", err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Header */}
      <header className="py-4 px-4 md:px-10 bg-white border-b-2 border-black shadow-md sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-red-700 rounded-full mr-3" />
          <h1 className="text-xl md:text-2xl font-bold text-black">
            EMGS LEADERS REPORT FORM
          </h1>
        </div>

        {/* ✅ Logout Button */}
        <button
          onClick={handleLogout}
          disabled={loading}
          className={`px-4 py-2 rounded-md font-semibold shadow-md transition duration-300 hover:scale-105 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          style={{
            backgroundColor: "#b91c1c", // red-800
            color: "#fff",
          }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 010 16v4l3.5-3.5L12 20v4a8 8 0 01-8-8z"
                ></path>
              </svg>
              Logging out...
            </span>
          ) : (
            "Logout"
          )}
        </button>
      </header>

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <input
          type="text"
          placeholder="Search your leader department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-red-700"
        />
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-4 space-y-12">
        {filtered.length === 0 && (
          <p className="text-center text-gray-500">
            No leader departments found.
          </p>
        )}

        {filtered.map((dept, idx) => (
          <section
            key={dept.name}
            className={`flex flex-col-reverse md:flex-row items-center gap-8 bg-white p-6 border-2 border-black rounded-xl shadow-md ${
              idx % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="md:w-1/2 text-center md:text-left space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-black">
                {dept.name}
              </h2>
              <p className="text-gray-700">{dept.description}</p>
              <Link
                href={dept.href}
                className="inline-block mt-2 px-6 py-2 bg-red-800 text-white font-semibold rounded-md shadow-md transition duration-300 transform hover:scale-105 hover:bg-black hover:text-white"
              >
                {dept.name}
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-32 h-32 md:w-48 md:h-48 bg-white border-4 border-black rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl text-red-800 font-bold">
                  {dept.letter}
                </span>
              </div>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default Leaders;
