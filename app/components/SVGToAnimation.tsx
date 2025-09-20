"use client";
import React, { useState, useCallback } from "react";
import { FaUpload, FaPlay, FaDownload, FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";
import { useTheme } from "./ThemeProvider";

export default function SVGToAnimation() {
  const { theme } = useTheme();
  const [dragActive, setDragActive] = useState(false);
  const [svgFile, setSvgFile] = useState<File | null>(null);
  const [tagline, setTagline] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const isDark = theme === 'dark';
  const colors = {
    background: isDark ? '#212129' : '#ece6e2',
    surface: isDark ? '#323949' : '#ffffff',
    surfaceSecondary: isDark ? '#3d3e51' : '#f8f9fa',
    text: isDark ? '#ffffff' : '#343434',
    textSecondary: isDark ? '#94a3b8' : '#6c757d',
    textMuted: isDark ? '#e2e8f0' : '#6c757d',
    primary: isDark ? '#3b82f6' : '#454866',
    border: isDark ? '#4c5265' : '#dee2e6',
    borderHover: isDark ? '#60a5fa' : '#007bff',
    success: isDark ? '#059669' : '#28a745',
    gradient: isDark ? 'linear-gradient(45deg, #3b82f6, #8b5cf6)' : 'linear-gradient(45deg, #454866, #6c5ce7)'
  };

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
    if (!svgFile) return;

    setLoading(true);
    setError("");
    setVideoUrl("");

    try {
      const codeTemplate = `from manim import *
class GitLogoRevealWrite(Scene):
    def construct(self):
        logo = SVGMobject("${svgFile.name}").set_stroke(WHITE, 6).set_fill(opacity=0)
        
        # Scale to fit within reasonable bounds
        if logo.width > 6 or logo.height > 6:
            logo.scale_to_fit_width(5)
            if logo.height > 5:
                logo.scale_to_fit_height(4)
        else:
            logo.scale(1.5)
        
        logo.move_to(ORIGIN)`;

      const taglineCode = tagline.trim() ? `
        
        text = Text("${tagline.trim()}", font_size=54, color=WHITE).next_to(logo, DOWN, buff=0.7)
        text.set_fill(opacity=0).set_stroke(WHITE, 2)
        
        self.play(Create(logo), run_time=2)
        self.play(logo.animate.set_fill(opacity=1), run_time=1.2)
        self.play(Write(text), run_time=1.4)
        self.play(text.animate.set_fill(opacity=1), run_time=0.7)
        self.wait(1.5)` : `
        
        self.play(Create(logo), run_time=2)
        self.play(logo.animate.set_fill(opacity=1), run_time=1.2)
        self.wait(2)`;

      const code = codeTemplate + taglineCode;

      // Read SVG file content as text
      const svgContent = await svgFile.text();
      
      // Send as JSON instead of FormData for better server compatibility
      const requestBody = {
        code: code,
        files: {
          [svgFile.name]: svgContent
        }
      };

      const response = await fetch("/api/run-manim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        
        if (contentType?.includes("video/mp4")) {
          const videoBlob = await response.blob();
          const videoUrl = URL.createObjectURL(videoBlob);
          setVideoUrl(videoUrl);
        } else {
          const result = await response.json();
          setError(result.error || "Failed to generate animation");
        }
      } else {
        try {
          const result = await response.json();
          setError(result.error || `Server error: ${response.status}`);
        } catch {
          setError(`Server error: ${response.status} ${response.statusText}`);
        }
      }
    } catch (err) {
      console.error("Error generating animation:", err);
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const runOnPlayground = () => {
    if (!svgFile) return;

    const codeTemplate = `from manim import *
class GitLogoRevealWrite(Scene):
    def construct(self):
        logo = SVGMobject("${svgFile.name}").set_stroke(WHITE, 6).set_fill(opacity=0)
        
        # Scale to fit within reasonable bounds
        if logo.width > 6 or logo.height > 6:
            logo.scale_to_fit_width(5)
            if logo.height > 5:
                logo.scale_to_fit_height(4)
        else:
            logo.scale(1.5)
        
        logo.move_to(ORIGIN)`;

    const taglineCode = tagline.trim() ? `
        
        text = Text("${tagline.trim()}", font_size=54, color=WHITE).next_to(logo, DOWN, buff=0.7)
        text.set_fill(opacity=0).set_stroke(WHITE, 2)
        
        self.play(Create(logo), run_time=2)
        self.play(logo.animate.set_fill(opacity=1), run_time=1.2)
        self.play(Write(text), run_time=1.4)
        self.play(text.animate.set_fill(opacity=1), run_time=0.7)
        self.wait(1.5)` : `
        
        self.play(Create(logo), run_time=2)
        self.play(logo.animate.set_fill(opacity=1), run_time=1.2)
        self.wait(2)`;

    const code = codeTemplate + taglineCode;

    localStorage.setItem("playgroundCode", code);
    localStorage.setItem("playgroundSvgFile", JSON.stringify({
      name: svgFile.name,
      type: svgFile.type,
      size: svgFile.size,
      lastModified: svgFile.lastModified
    }));
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const svgContent = e.target?.result as string;
      localStorage.setItem("playgroundSvgContent", svgContent);
      router.push("/play");
    };
    reader.readAsText(svgFile);
  };

  return (
    <div style={{ minHeight: "100vh", background: colors.background, paddingTop: "64px", transition: 'background 0.3s ease' }}>
      <Navbar />
      <div style={{
        minHeight: "calc(100vh - 64px)",
        background: colors.background,
        color: colors.text,
        padding: "2rem",
        transition: 'all 0.3s ease',
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
            background: colors.surface,
            borderRadius: "12px",
            padding: "2rem",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: colors.border,
            transition: 'all 0.3s ease',
          }}>
            {/* File Drop Zone */}
            <div
              style={{
                borderWidth: "2px",
                borderStyle: "dashed",
                borderColor: dragActive ? colors.borderHover : colors.border,
                borderRadius: "12px",
                padding: "3rem 2rem",
                textAlign: "center" as const,
                marginBottom: "1.5rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                background: dragActive ? (isDark ? "rgba(96, 165, 250, 0.1)" : "rgba(0, 123, 255, 0.1)") : colors.surfaceSecondary,
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('svg-file-input')?.click()}
            >
              <div style={{
                fontSize: "3rem",
                color: colors.textSecondary,
                marginBottom: "1rem",
              }}>
                <FaUpload />
              </div>
              <div style={{
                fontSize: "1.125rem",
                color: colors.text,
                marginBottom: "0.5rem",
              }}>
                {svgFile ? `Selected: ${svgFile.name}` : "Drop your SVG file here"}
              </div>
              <div style={{
                fontSize: "0.875rem",
                color: colors.textSecondary,
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
                color: colors.textMuted,
                marginBottom: "0.5rem",
              }} htmlFor="tagline">
                Enter your tagline (optional):
              </label>
              <input
                id="tagline"
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g., Logo, Brand Name, etc. (optional)"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderWidth: "2px",
                  borderStyle: "solid",
                  borderColor: tagline.trim() ? colors.success : colors.border,
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                  background: colors.surfaceSecondary,
                  color: colors.text,
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
                  background: (!svgFile || loading) ? colors.border : colors.gradient,
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
                  background: !svgFile ? colors.border : colors.success,
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
            background: colors.surface,
            borderRadius: "12px",
            padding: "2rem",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: colors.border,
            minHeight: "600px",
            display: "flex",
            flexDirection: "column",
            transition: 'all 0.3s ease',
          }}>
            <h3 style={{ 
              marginBottom: "1.5rem", 
              color: colors.textMuted,
              fontSize: "1.25rem",
              fontWeight: "600"
            }}>
              Animation Preview
            </h3>
            
            <div style={{
              flex: 1,
              background: colors.surfaceSecondary,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: colors.border,
              position: "relative" as const,
              transition: 'all 0.3s ease',
            }}>
              {loading && (
                <div style={{
                  textAlign: "center",
                  color: colors.textSecondary
                }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderColor: colors.border,
                    borderTopColor: colors.borderHover,
                    borderRadius: "50%",
                    margin: "0 auto 12px",
                    animation: "spin 1s linear infinite"
                  }} />
                  <div>Generating animation...</div>
                </div>
              )}

              {!loading && !videoUrl && !error && (
                <div style={{
                  textAlign: "center",
                  color: colors.textSecondary,
                  fontSize: "1.1rem"
                }}>
                  Upload an SVG file to see the animation preview
                </div>
              )}

              {error && (
                <div style={{
                  textAlign: "center",
                  color: "#ef4444",
                  fontSize: "1rem",
                  padding: "1rem"
                }}>
                  <div style={{ marginBottom: "0.5rem", fontWeight: "600" }}>Error:</div>
                  <div>{error}</div>
                </div>
              )}

              {videoUrl && (
                <video
                  controls
                  autoPlay
                  loop
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "8px",
                  }}
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            {videoUrl && (
              <div style={{ marginTop: "1rem" }}>
                <a
                  href={videoUrl}
                  download="animation.mp4"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.75rem 1.5rem",
                    background: colors.primary,
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    transition: "all 0.2s",
                  }}
                >
                  <FaDownload />
                  Download Animation
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
