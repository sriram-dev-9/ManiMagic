"use client";
import React from "react";
import Navbar from "../components/Navbar";
import ManiMagicPlayClientWrapper from "../components/ManiMagicPlayClientWrapper";
import { useTheme } from "../components/ThemeProvider";

export default function PlayPage() {
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const colors = {
    background: isDark ? '#212129' : '#ece6e2',
    surface: isDark ? '#323949' : '#ffffff',
    text: isDark ? '#ffffff' : '#343434',
    textSecondary: isDark ? '#94a3b8' : '#6c757d',
    primary: isDark ? '#3b82f6' : '#454866',
    border: isDark ? '#4c5265' : '#dee2e6'
  };

  return (
    <div style={{
      paddingTop: "64px",
      background: colors.background,
      minHeight: "100vh",
      transition: 'background 0.3s ease'
    }}>
      <Navbar />
      <div style={{
        minHeight: "calc(100vh - 64px)",
        background: colors.background,
        padding: 0,
        margin: 0,
        transition: 'background 0.3s ease'
      }}>
        <ManiMagicPlayClientWrapper />
      </div>
    </div>
  );
}
