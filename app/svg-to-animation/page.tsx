"use client";
import React from "react";
import SVGToAnimation from "../components/SVGToAnimation";
import { useTheme } from "../components/ThemeProvider";

export default function SVGToAnimationPage() {
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
      background: colors.background,
      minHeight: "100vh",
      transition: 'background 0.3s ease'
    }}>
      <SVGToAnimation />
    </div>
  );
}
