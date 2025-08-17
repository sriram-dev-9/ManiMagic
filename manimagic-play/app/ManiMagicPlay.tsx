"use client";
import React, { useState } from "react";
import MonacoEditor from "react-monaco-editor";

const DEFAULT_CODE = `from manim import *

class SquareToCircle(Scene):
    def construct(self):
        square = Square()
        circle = Circle()
        self.play(Create(square))
        self.play(Transform(square, circle))
        self.play(FadeOut(square))
`;

export default function ManiMagicPlay() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    setVideoUrl(null);
    try {
      const res = await fetch("/api/run-manim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        const err = await res.text();
        setError(err);
        setLoading(false);
        return;
      }
      const blob = await res.blob();
      setVideoUrl(URL.createObjectURL(blob));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 16 }}>
      <h1 style={{ textAlign: "center", fontWeight: 600, marginBottom: 16 }}>
        ManiMagic Play
      </h1>
      <MonacoEditor
        width="100%"
        height="300"
        language="python"
        theme="vs-dark"
        value={code}
        options={{ fontSize: 16, minimap: { enabled: false } }}
        onChange={setCode}
      />
      <button
        onClick={handleRun}
        disabled={loading}
        style={{ marginTop: 16, padding: "8px 24px", fontSize: 16 }}
      >
        {loading ? "Running..." : "Run"}
      </button>
      {error && (
        <div style={{ color: "#c00", marginTop: 16, whiteSpace: "pre-wrap" }}>
          <b>Error:</b> {error}
        </div>
      )}
      {videoUrl && (
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <video
            src={videoUrl}
            controls
            style={{ maxWidth: "100%", borderRadius: 8 }}
          />
          <a
            href={videoUrl}
            download="manim_output.mp4"
            style={{ display: "block", marginTop: 8 }}
          >
            Download Video
          </a>
        </div>
      )}
    </div>
  );
}
