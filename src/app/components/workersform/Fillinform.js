"use client";

import DarkModeToggle from "../DarkMode/DarkModeToggle";
import React, { useState, useEffect, useRef } from "react";

const initialDays = (startId) =>
  ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((name, i) => ({
    id: startId + i,
    name,
    dropdowns: ["", ...Array(6).fill("Yes")],
    textInput: "NONE",
    checkbox: false,
    socialStatus: "Whatsapp",
  }));

const weeks = [1, 2, 3, 4].map((w, i) => ({
  id: w,
  name: `WEEK ${w}`,
  days: initialDays(i * 5 + 1),
}));

const selectArrowStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3csvg fill='none' stroke='white' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3e%3c/svg%3e\")",
  backgroundSize: "1.2em",
  backgroundPosition: "calc(100% - 0.5em) center",
  backgroundRepeat: "no-repeat",
};

const Fillinform = () => {
  const [weeksData, setWeeksData] = useState(weeks);
  const [customNames, setCustomNames] = useState([]);
  const [newCustomName, setNewCustomName] = useState("");
  const [activeAddNameDropdown, setActiveAddNameDropdown] = useState(null);
  const addNameRef = useRef(null);

  // Dark mode state & hydration flag
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDark(prefersDark);
      prefersDark
        ? document.documentElement.classList.add("dark")
        : document.documentElement.classList.remove("dark");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark, mounted]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (addNameRef.current && !addNameRef.current.contains(e.target)) {
        setActiveAddNameDropdown(null);
        setNewCustomName("");
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setActiveAddNameDropdown(null);
        setNewCustomName("");
      }
    };
    if (activeAddNameDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [activeAddNameDropdown]);

  const updateDay = (weekId, dayId, changes) => {
    setWeeksData((data) =>
      data.map((week) =>
        week.id === weekId
          ? {
              ...week,
              days: week.days.map((day) =>
                day.id === dayId ? { ...day, ...changes } : day
              ),
            }
          : week
      )
    );
  };

  const handleDropdownChange = (weekId, dayId, index, value) => {
    if (index === 0 && value === "add-name") {
      setActiveAddNameDropdown({ weekId, dayId });
      updateDay(weekId, dayId, {
        dropdowns: weeksData
          .find((w) => w.id === weekId)
          .days.find((d) => d.id === dayId)
          .dropdowns.map((v, i) => (i === index ? "" : v)),
      });
      return;
    }
    setActiveAddNameDropdown(null);
    updateDay(weekId, dayId, {
      dropdowns: weeksData
        .find((w) => w.id === weekId)
        .days.find((d) => d.id === dayId)
        .dropdowns.map((v, i) => (i === index ? value : v)),
    });
  };

  const addNewName = () => {
    const trimmedName = newCustomName.trim();
    if (!trimmedName || customNames.includes(trimmedName)) return;
    setCustomNames((prev) => [...prev, trimmedName]);
    setNewCustomName("");
    setActiveAddNameDropdown(null);
    if (activeAddNameDropdown) {
      updateDay(activeAddNameDropdown.weekId, activeAddNameDropdown.dayId, {
        dropdowns: weeksData
          .find((w) => w.id === activeAddNameDropdown.weekId)
          .days.find((d) => d.id === activeAddNameDropdown.dayId)
          .dropdowns.map((v, i) => (i === 0 ? trimmedName : v)),
      });
    }
  };

  const deleteCustomName = (nameToDelete) => {
    setCustomNames((prev) => prev.filter((n) => n !== nameToDelete));
    setWeeksData((prevWeeks) =>
      prevWeeks.map((week) => ({
        ...week,
        days: week.days.map((day) => ({
          ...day,
          dropdowns: day.dropdowns.map((v, i) =>
            i === 0 && v === nameToDelete ? "" : v
          ),
        })),
      }))
    );
  };

  // Prevent render before hydration to avoid mismatch
  if (!mounted) return null;

  return (
    <div
      className="min-h-screen p-4 font-inter transition-colors duration-300"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* Fixed header */}
      <div
        className="fixed top-0 left-0 w-full p-3 text-sm sm:text-lg font-bold z-50 flex items-center px-4 relative"
        style={{
          backgroundColor: "var(--red-800, #b91c1c)",
          color: "var(--white, #fff)",
        }}
      >
        {/* Centered title */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-lg sm:text-xl md:text-2xl font-bold">
          JULY REPORT FORM
        </h1>

        {/* Right-aligned toggle */}
        <div className="ml-auto">
          <DarkModeToggle />
        </div>
      </div>

      {/* Scroll container */}
      <div className="mt-16 w-full overflow-x-auto">
        <div
          className="min-w-[800px] mx-auto rounded-lg shadow-lg"
          style={{
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
          }}
        >
          <div
            className="grid grid-cols-[80px_repeat(10,_minmax(70px,_1fr))_100px_40px] gap-px border border-black rounded-b-lg"
            style={{ backgroundColor: "var(--foreground)" }}
          >
            <div
              className="p-2 text-xs font-semibold border-b border-r"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
              }}
            ></div>

            {Array(7)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="p-2 text-xs font-semibold border-b border-r text-center"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                ></div>
              ))}

            {["Internship Updates", "NONE", "NONE", "Social Status"].map(
              (txt, i) => (
                <div
                  key={i}
                  className="p-2 text-xs font-semibold border-b border-r text-center"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                >
                  {txt}
                </div>
              )
            )}
            <div
              className="p-2 text-xs font-semibold border-b text-center"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
              }}
            ></div>

            {weeksData.map((week) => (
              <React.Fragment key={week.id}>
                <div
                  className="col-span-full p-2 text-xs font-bold border-t"
                  style={{
                    backgroundColor: "var(--foreground)",
                    color: "var(--background)",
                  }}
                >
                  {week.name}
                </div>

                {week.days.map((day) => (
                  <React.Fragment key={day.id}>
                    <div
                      className="p-2 text-xs font-semibold border-r border-b"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                      }}
                    >
                      {day.name}
                    </div>

                    {day.dropdowns.map((val, idx) => (
                      <div
                        key={idx}
                        className="relative p-1 border-r border-b"
                        style={{
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                        }}
                      >
                        <select
                          className="w-full h-full p-1 text-xs rounded-md pr-8 cursor-pointer border"
                          style={{
                            ...selectArrowStyle,
                            backgroundColor: "var(--red-800, #b91c1c)",
                            color: "var(--white, #fff)",
                            borderColor: "var(--red-700, #991b1b)",
                          }}
                          value={val}
                          onChange={(e) =>
                            handleDropdownChange(
                              week.id,
                              day.id,
                              idx,
                              e.target.value
                            )
                          }
                        >
                          {idx === 0 ? (
                            <>
                              <option value="" disabled>
                                Select Name
                              </option>
                              <option value="add-name">Add Your Name +</option>
                              {customNames.map((name) => (
                                <option key={name} value={name}>
                                  {name}
                                </option>
                              ))}
                            </>
                          ) : (
                            <>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </>
                          )}
                        </select>

                        {idx === 0 &&
                          activeAddNameDropdown?.weekId === week.id &&
                          activeAddNameDropdown?.dayId === day.id && (
                            <div
                              ref={addNameRef}
                              className="absolute z-10 p-2 rounded-md shadow-lg mt-1 w-48 cursor-auto"
                              style={{
                                backgroundColor: "var(--background)",
                                color: "var(--foreground)",
                                border: "1px solid var(--foreground)",
                              }}
                            >
                              <input
                                type="text"
                                className="w-full p-1 mb-2 text-xs rounded-md"
                                placeholder="Enter new name"
                                value={newCustomName}
                                onChange={(e) =>
                                  setNewCustomName(e.target.value)
                                }
                                onKeyDown={(e) =>
                                  e.key === "Enter" && addNewName()
                                }
                                autoFocus
                                style={{
                                  border: "1px solid var(--foreground)",
                                  backgroundColor: "var(--background)",
                                  color: "var(--foreground)",
                                }}
                              />
                              <div className="flex gap-2 mb-2">
                                <button
                                  onClick={addNewName}
                                  className="flex-1 text-xs rounded-md"
                                  style={{
                                    backgroundColor: "var(--red-600, #dc2626)",
                                    color: "var(--white, #fff)",
                                  }}
                                >
                                  Add Name
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveAddNameDropdown(null);
                                    setNewCustomName("");
                                  }}
                                  className="flex-1 text-xs rounded-md"
                                  style={{
                                    backgroundColor: "var(--gray-300, #d1d5db)",
                                    color: "var(--foreground)",
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                              <div
                                className="max-h-32 overflow-y-auto rounded-md p-1"
                                style={{
                                  border: "1px solid var(--foreground)",
                                }}
                              >
                                {customNames.length === 0 && (
                                  <p
                                    className="text-xs text-center"
                                    style={{ color: "var(--foreground)" }}
                                  >
                                    No custom names yet.
                                  </p>
                                )}
                                {customNames.map((name) => (
                                  <div
                                    key={name}
                                    className="flex justify-between items-center text-xs px-2 py-1 rounded cursor-default hover:bg-gray-100"
                                    style={{ color: "var(--foreground)" }}
                                  >
                                    <span>{name}</span>
                                    <button
                                      onClick={() => deleteCustomName(name)}
                                      className="text-red-600 hover:text-red-800 font-bold"
                                    >
                                      &times;
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    ))}

                    {/* Static inputs/selects with same style */}
                    <div
                      className="p-1 border-r border-b"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                      }}
                    >
                      <select
                        className="w-full p-1 text-xs rounded-md"
                        style={{
                          backgroundColor: "var(--red-800, #b91c1c)",
                          color: "var(--white, #fff)",
                          border: "1px solid var(--red-700, #991b1b)",
                        }}
                      >
                        <option>Internship Updates</option>
                        <option>Project A</option>
                        <option>Project B</option>
                      </select>
                    </div>
                    <div
                      className="p-1 border-r border-b"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                      }}
                    >
                      <input
                        className="w-full p-1 text-xs rounded-md"
                        value={day.textInput}
                        onChange={(e) =>
                          updateDay(week.id, day.id, {
                            textInput: e.target.value,
                          })
                        }
                        style={{
                          backgroundColor: "var(--red-800, #b91c1c)",
                          color: "var(--white, #fff)",
                          border: "1px solid var(--red-700, #991b1b)",
                        }}
                      />
                    </div>
                    <div
                      className="p-1 border-r border-b"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                      }}
                    >
                      <input
                        className="w-full p-1 text-xs rounded-md"
                        style={{
                          backgroundColor: "var(--red-800, #b91c1c)",
                          color: "var(--white, #fff)",
                          border: "1px solid var(--red-700, #991b1b)",
                        }}
                      />
                    </div>
                    <div
                      className="p-1 border-r border-b"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                      }}
                    >
                      <select
                        className="w-full p-1 text-xs rounded-md"
                        value={day.socialStatus}
                        onChange={(e) =>
                          updateDay(week.id, day.id, {
                            socialStatus: e.target.value,
                          })
                        }
                        style={{
                          backgroundColor: "var(--red-800, #b91c1c)",
                          color: "var(--white, #fff)",
                          border: "1px solid var(--red-700, #991b1b)",
                        }}
                      >
                        <option value="Whatsapp">Whatsapp</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Instagram">Instagram</option>
                      </select>
                    </div>
                    <div
                      className="flex items-center justify-center p-1 border-b"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                      }}
                    >
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4"
                        checked={day.checkbox}
                        onChange={(e) =>
                          updateDay(week.id, day.id, {
                            checkbox: e.target.checked,
                          })
                        }
                        style={{
                          accentColor: "var(--red-400, #f87171)",
                          borderColor: "var(--red-700, #991b1b)",
                          backgroundColor: "var(--red-800, #b91c1c)",
                        }}
                      />
                    </div>
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fillinform;
