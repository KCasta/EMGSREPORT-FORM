"use client";

import React, { useContext } from "react";
import styles from "./darkModeToggle.module.css";
import { ThemeContext } from "../../context/ThemeContext";

const DarkModeToggle = () => {
  const { toggle, mode } = useContext(ThemeContext);

  return (
    <div
      className={styles.container}
      onClick={toggle}
      style={{
        borderColor: mode === "light" ? "black" : "white",
        borderStyle: "solid",
        borderWidth: "1.5px",
      }}
    >
      <div className={styles.icon}>🌙</div>
      <div className={styles.icon}>🔆</div>
      <div
        className={styles.ball}
        style={{
          transform: mode === "light" ? "translateX(0)" : "translateX(18px)",
        }}
      />
    </div>
  );
};

export default DarkModeToggle;
