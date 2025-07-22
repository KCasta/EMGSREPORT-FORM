"use client";

import Link from "next/link";
import DarkModeToggle from "../components/DarkMode/DarkModeToggle.js";
import React, { useState } from "react";

const departments = [
  {
    name: "Parcel Dept",
    href: "/workers/parcelworker",
    letter: "P",
    description:
      "If you are in or belong to the Parcel Dept, click below to continue.",
  },
  {
    name: "Media Dept",
    href: "/workers/mediaworker",
    letter: "M",
    description:
      "If you are in or belong to the Media Dept, click below to continue.",
  },
  {
    name: "IELTS Masterclass Dept",
    href: "/workers/ielts-masterclass",
    letter: "I",
    description:
      "If you are in or belong to the IELTS Masterclass Dept, click below to continue.",
  },
  {
    name: "Express CV Dept",
    href: "/workers/express-cv",
    letter: "E",
    description:
      "If you are in or belong to the Express CV Dept, click below to continue.",
  },
  {
    name: "Job Application Dept",
    href: "/workers/job-application",
    letter: "J",
    description:
      "If you are in or belong to the Job Application Dept, click below to continue.",
  },
  {
    name: "IELTS Booking Dept",
    href: "/workers/ielts-booking",
    letter: "B",
    description:
      "If you are in or belong to the IELTS Booking Dept, click below to continue.",
  },
  {
    name: "Travel/Tour Dept",
    href: "/workers/travel-tour",
    letter: "T",
    description:
      "If you are in or belong to the Travel/Tour Dept, click below to continue.",
  },
  {
    name: "OSCE Dept",
    href: "/workers/osce",
    letter: "O",
    description:
      "If you are in or belong to the OSCE Dept, click below to continue.",
  },
  {
    name: "Customer Service Dept",
    href: "/workers/customer-care",
    letter: "C",
    description:
      "If you are in or belong to the Customer Service Dept, click below to continue.",
  },
  {
    name: "NCLEX Dept",
    href: "/workers/nclex",
    letter: "N",
    description:
      "If you are in or belong to the NCLEX Dept, click below to continue.",
  },
  {
    name: "Marketing Dept",
    href: "/workers/marketing",
    letter: "M",
    description:
      "If you are in or belong to the Marketing Dept, click below to continue.",
  },
  {
    name: "IT Dept",
    href: "/workers/itdepartment",
    letter: "I",
    description:
      "If you are in or belong to the IT Dept, click below to continue.",
  },
];

const Workers = () => {
  const [search, setSearch] = useState("");

  // Filter departments by search term (case insensitive)
  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="min-h-screen font-sans"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* Header */}
      <header
        className="py-4 px-4 md:px-10 border-b-2 shadow-md sticky top-0 z-10 flex items-center"
        style={{
          backgroundColor: "var(--background)",
          borderColor: "var(--foreground)",
          color: "var(--foreground)",
        }}
      >
        <div
          className="w-10 h-10 rounded-full mr-3"
          style={{ backgroundColor: "var(--red-700, #b91c1c)" }}
        />
        <h1
          className="text-lg sm:text-xl md:text-2xl font-bold"
          style={{ color: "var(--foreground)" }}
        >
          EMGS WORKERS REPORT FORM
        </h1>
        <div className="ml-auto">
          <DarkModeToggle />
        </div>
      </header>

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <input
          type="text"
          placeholder="Search your department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border-2 rounded-md focus:outline-none focus:ring-2"
          style={{
            borderColor: "var(--foreground)",
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
          }}
        />
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-4 space-y-12">
        {filteredDepartments.length === 0 && (
          <p
            style={{ color: "var(--foreground)" }}
            className="text-center text-gray-500"
          >
            No departments found.
          </p>
        )}

        {filteredDepartments.map((dept, idx) => (
          <section
            key={dept.name}
            className={`flex flex-col-reverse md:flex-row items-center gap-8 p-6 rounded-xl shadow-md ${
              idx % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
            style={{
              backgroundColor: "var(--background)",
              border: "2px solid var(--foreground)",
              color: "var(--foreground)",
            }}
          >
            <div className="md:w-1/2 text-center md:text-left space-y-4">
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--foreground)" }}
              >
                {dept.name}
              </h2>
              <p style={{ color: "var(--foreground)" }}>{dept.description}</p>
              <Link
                href={dept.href}
                className="inline-block mt-2 px-6 py-2 font-semibold rounded-md shadow-md transition duration-300 transform hover:scale-105"
                style={{
                  backgroundColor: "var(--red-800, #b91c1c)",
                  color: "var(--white, #fff)",
                }}
              >
                {dept.name}
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div
                className="w-32 h-32 md:w-48 md:h-48 rounded-full flex items-center justify-center shadow-lg"
                style={{
                  backgroundColor: "var(--background)",
                  border: "4px solid var(--foreground)",
                  color: "var(--red-800, #b91c1c)",
                }}
              >
                <span className="text-4xl font-bold">{dept.letter}</span>
              </div>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default Workers;
