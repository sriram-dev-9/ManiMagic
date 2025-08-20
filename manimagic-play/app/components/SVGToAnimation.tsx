"use client";
import React, { useState, useCallback } from "react";
import { FaUpload, FaPlay, FaDownload, FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";

export default function SVGToAnimation() {
  const [dragActive, setDragActive] = useState(false);
  const [svgFile, setSvgFile] = useState<File | null>(null);
  const [tagline, setTagline] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "image/svg+xml" || file.name.endsWith(".svg")) {
        setSvgFile(file);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "image/svg+xml" || file.name.endsWith(".svg")) {
        setSvgFile(file);
      }
    }
  };

  const generateAnimation = async () => {
    if (!svgFile || !tagline.trim()) return;

    setLoading(true);
    setError("");
    setVideoUrl("");

    try {
      const code = `from manim import *
import os

class GitLogoRevealWrite(Scene):
    def construct(self):
        # Load the SVG file
        logo = SVGMobject("${svgFile.name}")
        logo.scale(2)  # Scale the logo to a good size
        logo.move_to(ORIGIN)  # Center it
        
        # Create text${tagline.trim() ? `
        tagline_text = Text("${tagline.trim()}", font_size=36)
        tagline_text.next_to(logo, DOWN, buff=0.5)` : ''}
        
        # Define colors for the GitHub-style effect
        github_colors = [BLUE, GREEN, YELLOW, RED, PURPLE]
        
        # Animation sequence
        # 1. Draw the logo border
        self.play(Create(logo), run_time=2)
        self.wait(0.5)
        
        # 2. Fill with color transition${tagline.trim() ? `
        self.play(
            logo.animate.set_fill(BLUE, opacity=0.8),
            Write(tagline_text),
            run_time=2
        )` : `
        self.play(
            logo.animate.set_fill(BLUE, opacity=0.8),
            run_time=2
        )`}
        self.wait(0.5)
        
        # 3. Color cycling effect
        for color in github_colors:
            self.play(
                logo.animate.set_color(color),${tagline.trim() ? `
                tagline_text.animate.set_color(color),` : ''}
                run_time=0.5
            )
            self.wait(0.2)
        
        # 4. Scale and rotate finale
        self.play(
            logo.animate.scale(1.2).rotate(PI/6),${tagline.trim() ? `
            tagline_text.animate.scale(1.1),` : ''}
            run_time=1.5
        )
        self.wait(1)
        
        # 5. Reset and hold
        self.play(
            logo.animate.scale(1/1.2).rotate(-PI/6).set_color(WHITE),${tagline.trim() ? `
            tagline_text.animate.scale(1/1.1).set_color(WHITE),` : ''}
            run_time=1
        )
        self.wait(2)`;

      const formData = new FormData();
      formData.append("code", code);
      formData.append("file", svgFile);

      const response = await fetch("/api/run-manim", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Check if response is video (direct file) or JSON (error)
        const contentType = response.headers.get("content-type");
        
        if (contentType?.includes("video/mp4")) {
          // Response is the video file directly
          const videoBlob = await response.blob();
          const videoUrl = URL.createObjectURL(videoBlob);
          setVideoUrl(videoUrl);
        } else {
          // Response is JSON (likely an error)
          const result = await response.json();
          setError(result.error || "Failed to generate animation");
        }
      } else {
        // Handle HTTP error status
        try {
          const result = await response.json();
          setError(result.error || `Server error: ${response.status}`);
        } catch {
          setError(`Server error: ${response.status} ${response.statusText}`);
        }
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const runOnPlayground = () => {
    if (!svgFile || !tagline.trim()) return;

    const code = `from manim import *
import os

class GitLogoRevealWrite(Scene):
    def construct(self):
        # Load the SVG file
        logo = SVGMobject("${svgFile.name}")
        logo.scale(2)  # Scale the logo to a good size
        logo.move_to(ORIGIN)  # Center it
        
        # Create text${tagline.trim() ? `
        tagline_text = Text("${tagline.trim()}", font_size=36)
        tagline_text.next_to(logo, DOWN, buff=0.5)` : ''}
        
        # Define colors for the GitHub-style effect
        github_colors = [BLUE, GREEN, YELLOW, RED, PURPLE]
        
        # Animation sequence
        # 1. Draw the logo border
        self.play(Create(logo), run_time=2)
        self.wait(0.5)
        
        # 2. Fill with color transition${tagline.trim() ? `
        self.play(
            logo.animate.set_fill(BLUE, opacity=0.8),
            Write(tagline_text),
            run_time=2
        )` : `
        self.play(
            logo.animate.set_fill(BLUE, opacity=0.8),
            run_time=2
        )`}
        self.wait(0.5)
        
        # 3. Color cycling effect
        for color in github_colors:
            self.play(
                logo.animate.set_color(color),${tagline.trim() ? `
                tagline_text.animate.set_color(color),` : ''}
                run_time=0.5
            )
            self.wait(0.2)
        
        # 4. Scale and rotate finale
        self.play(
            logo.animate.scale(1.2).rotate(PI/6),${tagline.trim() ? `
            tagline_text.animate.scale(1.1),` : ''}
            run_time=1.5
        )
        self.wait(1)
        
        # 5. Reset and hold
        self.play(
            logo.animate.scale(1/1.2).rotate(-PI/6).set_color(WHITE),${tagline.trim() ? `
            tagline_text.animate.scale(1/1.1).set_color(WHITE),` : ''}
            run_time=1
        )
        self.wait(2)`;

    // Store both code and SVG file data in localStorage
    localStorage.setItem("playgroundCode", code);
    localStorage.setItem("playgroundSvgFile", JSON.stringify({
      name: svgFile.name,
      type: svgFile.type,
      size: svgFile.size,
      lastModified: svgFile.lastModified
    }));
    
    // Create a blob URL for the SVG file content
    const reader = new FileReader();
    reader.onload = (e) => {
      const svgContent = e.target?.result as string;
      localStorage.setItem("playgroundSvgContent", svgContent);
      router.push("/play");
    };
    reader.readAsText(svgFile);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#212129" }}>
      <Navbar />
      <div style={{
        minHeight: "calc(100vh - 64px)",
        background: "#212129",
        color: "#f8fafc",
        padding: "2rem",
      }}>
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
          alignItems: "start",
        }}>
          {/* Left Panel - Upload Section */}
          <div style={{
            background: "#323949",
            borderRadius: "12px",
            padding: "2rem",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "#4c5265",
          }}>
            {/* File Drop Zone */}
            <div
              style={{
                borderWidth: "2px",
                borderStyle: "dashed",
                borderColor: dragActive ? "#60a5fa" : "#4c5265",
                borderRadius: "12px",
                padding: "3rem 2rem",
                textAlign: "center" as const,
                marginBottom: "1.5rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                background: dragActive ? "rgba(96, 165, 250, 0.1)" : "#3d3e51",
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('svg-file-input')?.click()}
            >
              <div style={{
                fontSize: "3rem",
                color: "#94a3b8",
                marginBottom: "1rem",
              }}>
                <FaUpload />
              </div>
              <div style={{
                fontSize: "1.125rem",
                color: "#f8fafc",
                marginBottom: "0.5rem",
              }}>
                {svgFile ? `Selected: ${svgFile.name}` : "Drop your SVG file here"}
              </div>
              <div style={{
                fontSize: "0.875rem",
                color: "#94a3b8",
              }}>
                or click to browse
              </div>
              <input
                id="svg-file-input"
                type="file"
                accept=".svg,image/svg+xml"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>

            {/* Tagline Input */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{
                display: "block",
                fontSize: "1rem",
                fontWeight: "500",
                color: "#e2e8f0",
                marginBottom: "0.5rem",
              }} htmlFor="tagline">
                Enter your tagline (optional):
              </label>
              <input
                id="tagline"
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g., Welcome to ManiMagic!"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderWidth: "2px",
                  borderStyle: "solid",
                  borderColor: tagline.trim() ? "#10b981" : "#4c5265",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                  background: "#3d3e51",
                  color: "#f8fafc",
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={generateAnimation}
                disabled={!svgFile || loading}
                style={{
                  flex: 1,
                  padding: "0.75rem 1.5rem",
                  background: (!svgFile || loading) ? "#4c5265" : "linear-gradient(45deg, #3b82f6, #8b5cf6)",
                  color: "white",
                  borderWidth: "0px",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: (!svgFile || loading) ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  transition: "transform 0.2s",
                  opacity: (!svgFile || loading) ? 0.5 : 1,
                }}
              >
                <FaPlay />
                {loading ? "Generating..." : "Generate Animation"}
              </button>

              <button
                onClick={runOnPlayground}
                disabled={!svgFile}
                style={{
                  padding: "0.75rem 1rem",
                  background: !svgFile ? "#4c5265" : "#059669",
                  color: "white",
                  borderWidth: "0px",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  cursor: !svgFile ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "all 0.2s",
                  opacity: !svgFile ? 0.5 : 1,
                }}
              >
                <FaEdit />
                Edit on Playground
              </button>
            </div>
          </div>

          {/* Right Panel - Animation Preview */}
          <div style={{
            background: "#323949",
            borderRadius: "12px",
            padding: "2rem",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "#4c5265",
            minHeight: "600px",
            display: "flex",
            flexDirection: "column",
          }}>
            <h3 style={{ 
              marginBottom: "1.5rem", 
              color: "#e2e8f0",
              fontSize: "1.25rem",
              fontWeight: "600"
            }}>
              Animation Preview
            </h3>
            
            <div style={{
              flex: 1,
              background: "#3d3e51",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: "#4c5265",
              position: "relative" as const,
            }}>
              {loading && (
                <div style={{
                  textAlign: "center",
                  color: "#94a3b8"
                }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderColor: "#4c5265",
                    borderTopColor: "#60a5fa",
                    borderRadius: "50%",
                    margin: "0 auto 12px",
                    animation: "spin 1s linear infinite"
                  }} />
                  <p>Generating animation...</p>
                </div>
              )}

              {error && !loading && (
                <div style={{
                  background: "#4c1d1d",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: "#dc2626",
                  borderRadius: "8px",
                  padding: "16px",
                  color: "#fecaca",
                  textAlign: "center" as const,
                  margin: "20px",
                }}>
                  <p>{error}</p>
                </div>
              )}

              {videoUrl && !loading && !error && (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  loop
                  style={{ 
                    maxWidth: "100%", 
                    maxHeight: "100%",
                    borderRadius: "6px", 
                  }}
                />
              )}

              {!videoUrl && !loading && !error && (
                <div style={{
                  color: "#94a3b8",
                  fontSize: "1.125rem",
                  textAlign: "center" as const,
                }}>
                  Upload an SVG file to generate animation
                </div>
              )}
            </div>

            {videoUrl && (
              <div style={{ marginTop: "1rem", textAlign: "center" as const }}>
                <a
                  href={videoUrl}
                  download="manim_animation.mp4"
                  style={{
                    background: "#10b981",
                    color: "#fff",
                    borderRadius: "6px",
                    padding: "8px 16px",
                    fontSize: "14px",
                    fontWeight: "600",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <FaDownload style={{ fontSize: 12 }} /> Download Video
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
