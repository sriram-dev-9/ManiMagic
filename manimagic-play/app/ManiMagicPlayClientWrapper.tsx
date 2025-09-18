"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const ManiMagicPlayClient = dynamic(() => import("./ManiMagicPlayClient"), { 
  ssr: false,
  loading: () => (
    <div style={{
      minHeight: "100vh",
      background: "#212129",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#94a3b8",
      fontSize: "16px"
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 32,
          height: 32,
          border: "2px solid #4c5265",
          borderTop: "2px solid #60a5fa",
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

export default function ManiMagicPlayClientWrapper() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh",
        background: "#212129",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#94a3b8"
      }}>
        Loading...
      </div>
    }>
      <ManiMagicPlayClient />
    </Suspense>
  );
}



















                              
                              
                              
                              
                              
                              
                              


















