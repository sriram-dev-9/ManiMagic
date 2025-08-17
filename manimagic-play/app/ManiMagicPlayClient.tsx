"use client";
import React, { useState, useEffect } from "react";
import { FaPlay, FaDownload, FaExclamationCircle, FaExpand, FaCompress, FaCode } from "react-icons/fa";
import CodeEditor from "./components/CodeEditor";
import { validatePythonSyntax } from "./utils/pythonValidator";

const DEFAULT_CODE = `from manim import *

class HelloManim(Scene):
    def construct(self):
        # Create simple text
        text = Text("Hello Manim!", font_size=48)
        text.set_color(BLUE)
        
        # Animate the text
        self.play(Write(text), run_time=2)
        self.wait(1)
        self.play(FadeOut(text), run_time=1)
`;

// Add some example templates for users
const EXAMPLE_TEMPLATES = [
  {
    name: "Basic Shapes",
    description: "Create and transform basic geometric shapes",
    code: `from manim import *

class BasicShapes(Scene):
    def construct(self):
        # Create basic shapes
        circle = Circle(radius=1).set_color(BLUE)
        square = Square(side_length=2).set_color(RED)
        triangle = Triangle().set_color(GREEN)
        
        # Position them
        circle.move_to(LEFT * 3)
        square.move_to(ORIGIN)
        triangle.move_to(RIGHT * 3)
        
        # Animate
        self.play(Create(circle), Create(square), Create(triangle))
        self.wait(1)
        
        # Transform
        self.play(
            Transform(circle, square.copy().move_to(LEFT * 3)),
            Transform(square, triangle.copy().move_to(ORIGIN)),
            Transform(triangle, circle.copy().move_to(RIGHT * 3))
        )
        self.wait(2)`
  },
  {
    name: "Mathematical Function",
    description: "Plot and animate mathematical functions",
    code: `from manim import *
import numpy as np

class FunctionPlot(Scene):
    def construct(self):
        # Create axes
        axes = Axes(
            x_range=[-3, 3, 1],
            y_range=[-2, 2, 1],
            x_length=6,
            y_length=4
        )
        
        # Create function without LaTeX
        func = axes.plot(lambda x: np.sin(x), color=BLUE)
        
        # Use simple Text instead of LaTeX to avoid dependency
        func_label = Text("y = sin(x)", font_size=24).next_to(func, UP)
        
        # Animate
        self.play(Create(axes))
        self.play(Create(func), Write(func_label))
        self.wait(2)
        
        # Transform to cosine
        cos_func = axes.plot(lambda x: np.cos(x), color=RED)
        cos_label = Text("y = cos(x)", font_size=24).next_to(cos_func, UP)
        
        self.play(
            Transform(func, cos_func),
            Transform(func_label, cos_label)
        )
        self.wait(2)`
  },
  {
    name: "Simple Animation",
    description: "Basic circle animations and transformations",
    code: `from manim import *

class SimpleAnimation(Scene):
    def construct(self):
        # Create a circle
        circle = Circle(radius=1)
        circle.set_fill(PINK, opacity=0.5)
        
        # Add it to the scene
        self.add(circle)
        
        # Animate properties
        self.play(circle.animate.set_fill(BLUE))
        self.play(circle.animate.shift(UP))
        self.play(circle.animate.scale(2))
        self.play(circle.animate.rotate(PI))
        
        self.wait(1)`
  }
];

export default function ManiMagicPlayClient() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<{type: string; line?: string; message: string; details: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [leftWidth, setLeftWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  const loadExample = (example: { name: string; description: string; code: string }) => {
    setCode(example.code);
    setShowExamples(false);
    setError(null);
    setVideoUrl(null);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close examples dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showExamples) {
        const target = event.target as Element;
        if (!target.closest('[data-examples-dropdown]')) {
          setShowExamples(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExamples]);

  // Function to parse and format error messages for better readability
  const parseError = (errorText: string) => {
    try {
      const errorObj = JSON.parse(errorText);
      const fullError = errorObj.error || errorText;
      const errorDetails = errorObj.details || '';
      
      // Font weight error specific handling
      if (fullError.includes('There is no Font Weight Called') || 
          fullError.includes('KeyError: \'bold\'') ||
          fullError.includes('unexpected keyword argument \'font_weight\'')) {
        return {
          type: 'Font Weight Error',
          message: 'Font weight parameters are not supported. Remove weight or font_weight parameters entirely.',
          details: 'In Manim v0.19+, font weight parameters are not supported. Use normal text without weight styling.'
        };
      }
      
      // LaTeX/FileNotFoundError specific handling
      if (fullError.includes('FileNotFoundError') && fullError.includes('tex')) {
        return {
          type: 'LaTeX Error',
          message: 'LaTeX is not installed. Use Text() instead of mathematical expressions to avoid LaTeX dependency.',
          details: 'Install LaTeX (MikTeX/TeX Live) or use simple Text objects instead of mathematical notation.'
        };
      }
      
      // KeyError specific handling (general)
      if (fullError.includes('KeyError')) {
        const keyMatch = fullError.match(/KeyError: ['"](.*?)['"]/)
        const keyName = keyMatch ? keyMatch[1] : 'unknown'
        return {
          type: 'KeyError',
          message: `Key "${keyName}" not found. This might be due to Manim version compatibility or missing configuration.`,
          details: errorDetails || fullError
        };
      }
      
      // AttributeError for missing methods/properties
      if (fullError.includes('AttributeError')) {
        const attrMatch = fullError.match(/AttributeError: .* has no attribute ['"](.*?)['"]/)
        if (attrMatch) {
          return {
            type: 'Attribute Error',
            message: `Property/method "${attrMatch[1]}" not found. This might be due to Manim version differences.`,
            details: 'Check Manim documentation for the correct method name in your version.'
          };
        }
      }
      
      // Import errors
      if (fullError.includes('ImportError') || fullError.includes('ModuleNotFoundError')) {
        return {
          type: 'Import Error',
          message: 'Required module not found. Make sure Manim and all dependencies are properly installed.',
          details: errorDetails || fullError
        };
      }
      
      // Extract syntax errors
      const syntaxErrorMatch = fullError.match(/File ".*?", line (\d+)\s*(.*?)\s*SyntaxError: (.+)/);
      if (syntaxErrorMatch) {
        return {
          type: 'Syntax Error',
          line: syntaxErrorMatch[1],
          message: syntaxErrorMatch[3],
          details: syntaxErrorMatch[2]?.trim() || errorDetails
        };
      }
      
      // Extract runtime errors
      const runtimeErrorMatch = fullError.match(/(\w+Error): (.+?)(?:\r?\n|$)/);
      if (runtimeErrorMatch) {
        return {
          type: runtimeErrorMatch[1],
          message: runtimeErrorMatch[2],
          details: errorDetails
        };
      }
      
      // Extract line information from traceback
      const lineMatch = fullError.match(/line (\d+)/);
      const line = lineMatch ? lineMatch[1] : null;
      
      return {
        type: 'Error',
        line,
        message: fullError.length > 200 ? fullError.substring(0, 200) + '...' : fullError,
        details: errorDetails
      };
    } catch {
      return {
        type: 'Error',
        message: errorText.length > 200 ? errorText.substring(0, 200) + '...' : errorText,
        details: ''
      };
    }
  };

  const handleRun = async () => {
    // First validate Python syntax
    const syntaxValidation = validatePythonSyntax(code);
    if (!syntaxValidation.isValid) {
      setError({
        type: 'Syntax Error',
        line: syntaxValidation.line?.toString(),
        message: syntaxValidation.error || 'Invalid Python syntax',
        details: getSuggestion(syntaxValidation.error || '')
      });
      return;
    }

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
        setError(parseError(err));
        setLoading(false);
        return;
      }
      const blob = await res.blob();
      setVideoUrl(URL.createObjectURL(blob));
    } catch (e: any) {
      setError({
        type: 'Network Error',
        message: 'Failed to connect to server. Please try again.',
        details: ''
      });
    }
    setLoading(false);
  };

  // Function to automatically fix common Manim compatibility issues
  const autoFixCode = (code: string): string => {
    let fixedCode = code;
    
    // Fix weight="bold" and font_weight=BOLD by removing them entirely
    fixedCode = fixedCode.replace(/,?\s*weight=["']bold["']/g, '');
    fixedCode = fixedCode.replace(/,?\s*font_weight=BOLD/g, '');
    
    // Clean up any double commas that might result from removal
    fixedCode = fixedCode.replace(/,\s*,/g, ',');
    fixedCode = fixedCode.replace(/\(\s*,/g, '(');
    
    // Fix common LaTeX graph labels
    fixedCode = fixedCode.replace(
      /axes\.get_graph_label\([^,]+,\s*label=["']([^"']*\\\w+[^"']*)["']\)/g,
      (match, labelText) => {
        // Convert LaTeX to simple text
        const simpleText = labelText.replace(/\\sin/g, 'sin').replace(/\\cos/g, 'cos').replace(/\\/g, '');
        return `Text("${simpleText}", font_size=24).next_to(func, UP)`;
      }
    );
    
    // Fix invalid escape sequences in strings
    fixedCode = fixedCode.replace(/(?<!\\)\\([sc])(?!in|os)/g, '\\\\$1');
    
    return fixedCode;
  };

  // Function to provide suggestions for common issues
  const getSuggestion = (errorMessage: string): string => {
    if (errorMessage.includes('weight') || errorMessage.includes('font_weight')) {
      return 'Remove weight="bold" or font_weight=BOLD parameters entirely. They are not supported in this Manim version.';
    }
    if (errorMessage.includes('LaTeX')) {
      return 'Replace mathematical expressions with simple Text objects. Example: Text("y = sin(x)") instead of LaTeX.';
    }
    if (errorMessage.includes('escape sequence')) {
      return 'Use raw strings like r"\\text" or double backslashes like "\\\\text".';
    }
    return '';
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    const newLeftWidth = (e.clientX / window.innerWidth) * 100;
    if (newLeftWidth >= 20 && newLeftWidth <= 80) {
      setLeftWidth(newLeftWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#212129",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#94a3b8"
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
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{
        height: "100vh",
        background: "#212129",
        color: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        userSelect: isResizing ? 'none' : 'auto'
      }}>
        {/* Header */}
        <header style={{ 
          padding: "16px 24px",
          borderBottom: "1px solid #4c5265",
          background: "#323949",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <h1 style={{ 
              fontWeight: 800, 
              fontSize: 24, 
              margin: 0,
              letterSpacing: 0.5,
              color: "#60a5fa"
            }}>
              ManiMagic Play
            </h1>
            <p style={{ 
              fontSize: 13, 
              color: "#94a3b8", 
              margin: "2px 0 0 0" 
            }}>
              Interactive Manim Animation Playground
            </p>
          </div>
          
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ position: "relative" }} data-examples-dropdown>
              <button
                onClick={() => setShowExamples(!showExamples)}
                style={{
                  background: showExamples ? "#4c5265" : "transparent",
                  border: "1px solid #4c5265",
                  color: "#94a3b8",
                  borderRadius: 6,
                  padding: "8px 12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13
                }}
              >
                <FaCode />
                Examples
              </button>
              
              {showExamples && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: 8,
                  background: "#3d3e51",
                  border: "1px solid #4c5265",
                  borderRadius: 6,
                  padding: 8,
                  minWidth: 200,
                  zIndex: 1000,
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)"
                }}>
                  {EXAMPLE_TEMPLATES.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => loadExample(example)}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "8px 12px",
                        background: "transparent",
                        border: "none",
                        color: "#f8fafc",
                        textAlign: "left",
                        cursor: "pointer",
                        borderRadius: 4,
                        fontSize: 13,
                        marginBottom: index < EXAMPLE_TEMPLATES.length - 1 ? 4 : 0
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#4c5265";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>{example.name}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{example.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              style={{
                background: "transparent",
                border: "1px solid #4c5265",
                color: "#94a3b8",
                borderRadius: 6,
                padding: "8px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13
              }}
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div style={{
          flex: 1,
          display: "flex",
          position: "relative",
          height: "calc(100vh - 120px)",
          overflow: "hidden"
        }}>
          {/* Left Panel - Code Editor */}
          <div style={{
            width: `${leftWidth}%`,
            background: "#323949",
            display: "flex",
            flexDirection: "column",
            minWidth: "300px"
          }}>
            <div style={{
              padding: "12px 20px",
              borderBottom: "1px solid #4c5265",
              background: "#3d3e51",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#fbbf24"
                }} />
                <span style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#e2e8f0"
                }}>
                  scene.py
                </span>
              </div>
              
              <button
                onClick={handleRun}
                disabled={loading}
                style={{
                  background: loading ? "#40445a" : "#3b82f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  opacity: loading ? 0.6 : 1,
                  transition: "all 0.2s ease"
                }}
              >
                <FaPlay style={{ fontSize: 12 }} /> 
                {loading ? "Running..." : "Run"}
              </button>
            </div>
            
            <div style={{ flex: 1 }}>
              <CodeEditor
                value={code}
                onChange={setCode}
                height="calc(100vh - 200px)"
              />
            </div>
          </div>

          {/* Resizer */}
          <div
            onMouseDown={handleMouseDown}
            style={{
              width: 4,
              background: isResizing ? "#60a5fa" : "#4c5265",
              cursor: "col-resize",
              position: "relative",
              transition: isResizing ? "none" : "background 0.2s ease",
              zIndex: 10
            }}
          >
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 16,
              height: 32,
              background: isResizing ? "#60a5fa" : "#4c5265",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <div style={{
                width: 2,
                height: 16,
                background: "#212129",
                borderRadius: 1,
                marginRight: 1
              }} />
              <div style={{
                width: 2,
                height: 16,
                background: "#212129",
                borderRadius: 1
              }} />
            </div>
          </div>

          {/* Right Panel - Animation Preview */}
          <div style={{
            width: `${100 - leftWidth}%`,
            background: "#3d3e51",
            display: "flex",
            flexDirection: "column",
            minWidth: "300px"
          }}>
            <div style={{
              padding: "12px 20px",
              borderBottom: "1px solid #4c5265",
              background: "#40445a",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: videoUrl ? "#10b981" : "#94a3b8"
                }} />
                <span style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#e2e8f0"
                }}>
                  Preview
                </span>
              </div>
              
              {videoUrl && (
                <a
                  href={videoUrl}
                  download="manim_animation.mp4"
                  style={{
                    background: "#10b981",
                    color: "#fff",
                    borderRadius: 6,
                    padding: "6px 12px",
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.2s ease"
                  }}
                >
                  <FaDownload style={{ fontSize: 11 }} /> Download
                </a>
              )}
            </div>

            <div style={{ 
              flex: 1, 
              padding: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              height: "calc(100vh - 200px)",
              overflow: "hidden"
            }}>
              {loading && (
                <div style={{
                  textAlign: "center",
                  color: "#94a3b8"
                }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    border: "2px solid #4c5265",
                    borderTop: "2px solid #60a5fa",
                    borderRadius: "50%",
                    margin: "0 auto 12px",
                    animation: "spin 1s linear infinite"
                  }} />
                  <p style={{ fontSize: 14, margin: 0 }}>
                    Generating animation...
                  </p>
                </div>
              )}

              {error && !loading && (
                <div style={{
                  background: "#4c1d1d",
                  border: "1px solid #dc2626",
                  borderRadius: 8,
                  padding: 16,
                  width: "100%",
                  maxHeight: "70%",
                  overflow: "auto"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10
                  }}>
                    <FaExclamationCircle style={{ 
                      fontSize: 16, 
                      color: "#ef4444", 
                      marginTop: 2,
                      flexShrink: 0 
                    }} />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        margin: "0 0 8px 0", 
                        fontSize: 14, 
                        fontWeight: 600, 
                        color: "#fca5a5" 
                      }}>
                        {error.type} {error.line && `(Line ${error.line})`}
                      </h3>
                      <div style={{ 
                        margin: "0 0 8px 0", 
                        fontSize: 13, 
                        color: "#fecaca",
                        fontFamily: 'JetBrains Mono, monospace',
                        background: "#3f1f1f",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #7f1d1d"
                      }}>
                        {error.message}
                      </div>
                      {error.details && (
                        <div>
                          <pre style={{ 
                            margin: "0 0 12px 0", 
                            fontSize: 11, 
                            color: "#fecaca",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            fontFamily: 'JetBrains Mono, monospace',
                            lineHeight: 1.4,
                            opacity: 0.8
                          }}>
                            {error.details}
                          </pre>
                          {(error.type === 'Font Weight Error' || error.type === 'Syntax Error') && (
                            <button
                              onClick={() => {
                                const fixedCode = autoFixCode(code);
                                if (fixedCode !== code) {
                                  setCode(fixedCode);
                                  setError(null);
                                }
                              }}
                              style={{
                                background: "#166534",
                                border: "1px solid #22c55e",
                                borderRadius: 4,
                                color: "#bbf7d0",
                                padding: "6px 12px",
                                fontSize: 12,
                                cursor: "pointer",
                                fontWeight: 500
                              }}
                            >
                              Auto Fix Code
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
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
                    maxHeight: "calc(100vh - 250px)",
                    borderRadius: 8, 
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                    background: "#212129"
                  }}
                />
              )}

              {!loading && !error && !videoUrl && (
                <div style={{
                  textAlign: "center",
                  color: "#64748b"
                }}>
                  <div style={{
                    fontSize: 40,
                    marginBottom: 12,
                    opacity: 0.4
                  }}>
                    🎬
                  </div>
                  <p style={{ fontSize: 16, margin: "0 0 4px 0", fontWeight: 500 }}>
                    Ready to animate
                  </p>
                  <p style={{ fontSize: 13, margin: 0, opacity: 0.7 }}>
                    Click "Run" to see your Manim code in action
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ 
          padding: "12px 24px",
          fontSize: 12, 
          color: "#64748b",
          borderTop: "1px solid #4c5265",
          background: "#323949",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            Powered by{" "}
            <a 
              href="https://manim.community/" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: "#60a5fa", textDecoration: "none" }}
            >
              Manim Community
            </a>
          </div>
          <div>
            <a 
              href="https://github.com/Jagan-Dev-9/ManiMagic" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: "#a78bfa", textDecoration: "none" }}
            >
              View on GitHub
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
