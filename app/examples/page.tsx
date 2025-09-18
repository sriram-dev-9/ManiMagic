"use client";
import Navbar from "../components/Navbar";
import { useTheme } from "../components/ThemeProvider";

export default function ExamplesPage() {
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const colors = {
    background: isDark ? '#212129' : '#ece6e2',
    text: isDark ? '#ffffff' : '#343434',
    textSecondary: isDark ? '#94a3b8' : '#6c757d'
  };

  return (
    <div style={{ 
      paddingTop: "64px", 
      minHeight: "100vh", 
      background: colors.background,
      transition: 'background 0.3s ease'
    }}>
      <Navbar />
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1 style={{ 
          fontSize: "2rem", 
          marginBottom: "1rem", 
          color: colors.text,
          transition: 'color 0.3s ease'
        }}>
          Examples
        </h1>
        <p style={{ 
          color: colors.textSecondary,
          transition: 'color 0.3s ease'
        }}>
          Coming soon...
        </p>
      </div>
    </div>
  );
}
