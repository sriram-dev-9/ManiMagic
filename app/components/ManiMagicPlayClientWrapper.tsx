"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useTheme } from "./ThemeProvider";

export default function ManiMagicPlayClientWrapper() {
  const { currentTheme } = useTheme();

  const ManiMagicPlayClient = dynamic(() => import("./ManiMagicPlayClient"), { 
    ssr: false,
    loading: () => (
      <div style={{
        minHeight: "100vh",
        background: currentTheme.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: currentTheme.textSecondary,
        fontSize: "16px"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 32,
            height: 32,
            border: `2px solid ${currentTheme.border}`,
            borderTop: `2px solid ${currentTheme.active}`,
            borderRadius: "50%",
            margin: "0 auto 12px",
            animation: "spin 1s linear infinite"
          }} />
          <p>Loading ManiMagic Play...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  });

  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh",
        background: currentTheme.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: currentTheme.textSecondary
      }}>
        Loading...
      </div>
    }>
      <ManiMagicPlayClient />
    </Suspense>
  );
}